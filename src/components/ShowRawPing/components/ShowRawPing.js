/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import PropTypes from 'prop-types';

import Events from '../../Events';
import Loading from '../../Loading';
import Metrics from '../../Metrics';
import PingSection from './PingSection';

import { calculateDaysRemainingForPing } from '../../../lib/date';

const ShowRawPing = ({ docId }) => {
  const { hash, key, pathname } = useLocation();

  /// refs ///
  const loaded = useRef(false);

  /// state ///
  const [pingAddedAt, setPingAddedAt] = useState(null);
  const [ping, setPing] = useState(null);
  const [activeStartLine, setActiveStartLine] = useState(null);
  const [activeEndLine, setActiveEndLine] = useState(null);

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
        setPing(JSON.stringify(JSON.parse(doc.data().payload), undefined, 2));
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

  // Prints how many days until the current ping expires.
  const renderDaysLeftForPing = () => {
    const daysRemaining = calculateDaysRemainingForPing(pingAddedAt);

    // Change message if today is the final day.
    if (daysRemaining === 0) {
      return (
        <p>
          <strong>Today is the last day you will be able to access this ping.</strong>
        </p>
      );
    }

    return (
      <p>
        <strong>{daysRemaining} day(s)</strong> until this ping is no longer accessible.
      </p>
    );
  };

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

  const parsedPing = JSON.parse(ping);
  const events = parsedPing.events;

  // We only want to show the visualizations section if the ping contains
  // metrics that we have custom visualizations for.
  const metrics = parsedPing.metrics;
  return (
    <div className='container-fluid m-2'>
      <div>
        {renderDaysLeftForPing()}
        <p className='mb-2'>
          <strong>You can</strong>
        </p>
        <ul className='mzp-u-list-styled'>
          <li>
            <strong>Share</strong> this link with others to directly access this ping.
          </li>
          <li>
            <strong>Click</strong> on a ping header to see the nested ping data.
          </li>
        </ul>
      </div>
      <PingSection pingSection={JSON.parse(ping)} header={'Ping Data'} />
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
                    style={{ paddingRight: '8px', textDecoration: 'underline' }}
                    onClick={handleLineNumberClick(lineNumber)}
                  >
                    {lineNumber}
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
