/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import PropTypes from 'prop-types';

import Events from '../../Events';
import Loading from '../../Loading';
import Metrics from '../../Metrics';
import PingSection from './PingSection';
import ReturnToTop from '../../ReturnToTop';

import { padStringLeft } from '../lib';
import { calculateDaysRemainingForPing } from '../../../lib/date';
import { recordClick } from '../../../lib/telemetry';

const ShowRawPing = ({ docId }) => {
  const { hash, key, pathname } = useLocation();

  /// refs ///
  const loaded = useRef(false);

  /// state ///
  const [pingAddedAt, setPingAddedAt] = useState(null);
  const [ping, setPing] = useState(null);
  const [activeStartLine, setActiveStartLine] = useState(null);
  const [activeEndLine, setActiveEndLine] = useState(null);

  // Store the raw ping data in case of JSON parsing error.
  const [rawPing, setRawPing] = useState(null);

  /// helpers ///
  // Converts a string like `L25` to just 25 as a number type.
  const getNumberFromLineNumber = (lineNumber) => {
    return Number(lineNumber.split('L')[1]);
  };

  // Helper function to parse and scroll directly to a line number
  // in the raw ping.
  const scrollToLine = () => {
    if (hash) {
      const [startLine, endLine] = hash.replace('#', '').split('-');

      // We always scroll the first line to the top.
      const id = startLine;

      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }

      // If there is no line, these are both set to undefined, which is fine.
      setActiveStartLine(startLine);
      setActiveEndLine(endLine);
    }
  };

  /// lifecycle ///
  // Load all ping data once `docId` is available.
  useEffect(() => {
    getDoc(doc(getFirestore(), 'pings', docId)).then((doc) => {
      if (doc.exists()) {
        let json;
        try {
          json = JSON.stringify(JSON.parse(doc.data().payload), undefined, 2);
        } catch (e) {
          console.log(e);

          // If we have an error parsing the JSON, we set this so the UI knows
          // that we aren't going to render the ping data sections.
          json = {};
        }

        setPing(json);
        setRawPing(doc.data().payload);
        setPingAddedAt(doc.data().addedAt);
      } else {
        setPing('No such ping!');
      }

      // The ping is now loaded, meaning we can scroll to it. This also
      // means for the rest of the time spent on this screen, the ping is
      // there and we can highlight and scroll directly to a line without
      // any timeout.
      loaded.current = true;
      scrollToLine();
    });
  }, [docId]);

  useEffect(() => {
    if (loaded) {
      scrollToLine();
    }
  }, [pathname, hash, key]);

  /// render ///
  if (!ping) {
    return <Loading />;
  }

  // Check if our ping is empty because of an error. If so,
  // short-circuit and show an error message since we can't
  // display the ping.
  if (Object.entries(ping).length === 0) {
    return (
      <div className='container-fluid m-2'>
        <div>Unable to display ping data because of an error parsing the JSON.</div>
        <br />
        <h4>Raw Ping</h4>
        <code>{rawPing}</code>
      </div>
    );
  }

  // Prints how many days until the current ping expires.
  const renderDaysLeftForPing = () => {
    const daysRemaining = calculateDaysRemainingForPing(pingAddedAt);

    // Change message if today is the final day.
    if (daysRemaining === 0) {
      return (
        <span>
          <strong>Today is the last day you will be able to access this ping.</strong>
        </span>
      );
    }

    return (
      <span>
        <strong>{daysRemaining} day(s)</strong> until this ping is no longer accessible.
      </span>
    );
  };

  // Prints the ping type in a more obvious place than `metadata.document_type`.
  const renderPingType = () => {
    if (!parsedPing || !parsedPing.metadata || !parsedPing.metadata['document_type']) {
      return null;
    }

    return (
      <>
        <span>
          <strong>Ping Type: </strong>{parsedPing.metadata['document_type']}
        </span>
        <br />
      </>
    )
  }

  // Called after determining what the user is trying to link to. This
  // handles both single and multi line selections.
  const handleLineChange = (startLine, endLine) => {
    let hash;

    // If both are populated, then we have a multi-select.
    if (startLine && endLine) {
      hash = `#${startLine}-${endLine}`;
    } else {
      hash = `#${startLine}`;
    }

    window.location.assign(hash);
    scrollToLine();
  };

  const handleLineNumberClick = (lineNumber) => (e) => {
    recordClick('Line number');
    lineNumber = `L${lineNumber}`;

    let startLine;
    let endLine;

    if (activeStartLine && e.shiftKey) {
      // User already has a start line and is trying to multi-line select.
      if (lineNumber === activeStartLine) {
        // Same line again, do nothing.
        startLine = activeStartLine;
      } else if (getNumberFromLineNumber(lineNumber) < getNumberFromLineNumber(activeStartLine)) {
        // Current line selected is our new start line, update both.
        startLine = lineNumber;
        endLine = activeStartLine;
      } else {
        // The new line is the end line.
        startLine = activeStartLine;
        endLine = lineNumber;
      }
    } else {
      // Only one line is being selected, unset the end line.
      startLine = lineNumber;
      endLine = null;
    }

    handleLineChange(startLine, endLine);
  };

  let parsedPing;
  let events;
  let metrics;
  try {
    parsedPing = JSON.parse(ping);
    events = parsedPing.events;

    // We only want to show the visualizations section if the ping contains
    // metrics that we have custom visualizations for.
    metrics = parsedPing.metrics;
  } catch (e) {
    console.log(e);

    parsedPing = {};
  }

  // To properly pad the line number strings, we need to get the number
  // of digits from the last line number.
  const maxNumberOfDigits = ping.split('\n').length.toString().length;
  return (
    <div className='container-fluid m-2'>
      <ReturnToTop />
      <div>
        <p className='mb-2'>
          {renderPingType()}
          {renderDaysLeftForPing()}
        </p>
        <p className='mb-2'>
          <strong>You can</strong>
        </p>
        <ul className='mzp-u-list-styled'>
          <li>
            <strong>Share</strong> this link with others to directly access this ping.
          </li>
        </ul>
      </div>
      <PingSection pingSection={parsedPing} header={'Ping Data'} />
      {!!events && <Events events={events} />}
      {!!metrics && <Metrics metrics={metrics} />}
      <br />
      <h3>Raw ping</h3>
      <p className='mb-2'>
        <strong>You can</strong>
      </p>
      <ul className='mzp-u-list-styled'>
        <li>
          <strong>Copy</strong> this JSON (line numbers are ignored).
        </li>
        <li>
          <strong>Click on a line number</strong> and share the URL. That link will open the page,
          highlight that line, and scroll the line into view.
        </li>
        <li>
          You can <strong>select multiple lines</strong> by clicking a line, then hold <i>SHIFT</i>{' '}
          while clicking on a second line. This works similar to GitHub's UI.
        </li>
      </ul>
      <div className='card'>
        <div className='card-body'>
          <pre className='text-monospace'>
            {ping.split('\n').map((line, i) => {
              const lineNumber = i + 1;
              const anchorId = `L${lineNumber}`;

              let isActiveLine;
              if (activeEndLine) {
                // Is a multi-select.
                isActiveLine =
                  getNumberFromLineNumber(activeStartLine) <= lineNumber &&
                  lineNumber <= getNumberFromLineNumber(activeEndLine);
              } else {
                // Is a single-select.
                isActiveLine = anchorId === activeStartLine;
              }

              return (
                <div
                  key={`${line}${lineNumber}`}
                  className={isActiveLine ? 'active-ping-line' : ''}
                >
                  <span
                    id={anchorId}
                    className='no-select cursor-pointer line-link'
                    style={{ paddingRight: '8px' }}
                    data-glean-label='Line number'
                    onClick={handleLineNumberClick(lineNumber)}
                  >
                    {padStringLeft(lineNumber.toString(), maxNumberOfDigits, " ")}
                  </span>
                  {line}
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
};

ShowRawPing.propTypes = {
  docId: PropTypes.string.isRequired
};

export default ShowRawPing;
