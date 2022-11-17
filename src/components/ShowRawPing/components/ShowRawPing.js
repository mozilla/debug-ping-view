import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import PropTypes from 'prop-types';

import PingSection from './PingSection';
import Loading from '../../Loading';
import { calculateDaysRemainingForPing } from '../../../lib/date';

const ShowRawPing = ({ docId }) => {
  const { hash, key, pathname } = useLocation();

  /// state ///
  const [pingAddedAt, setPingAddedAt] = useState(null);
  const [ping, setPing] = useState(null);
  const [activeLine, setActiveLine] = useState(null);

  /// lifecycle ///
  // Load all ping data once `docId` is available.
  useEffect(() => {
    getDoc(doc(getFirestore(), 'pings', docId)).then((doc) => {
      if (doc.exists()) {
        setPing(JSON.stringify(JSON.parse(doc.data().payload), undefined, 4));
        setPingAddedAt(doc.data().addedAt);
      } else {
        setPing('No such ping!');
      }
    });
  }, [docId]);

  // Parse targeted anchor ID and scroll to it. The `setTimeout` is so
  // the ping can load and render before we try to scroll.
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');

        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }

        setActiveLine(id);
      }, 500);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, key]);

  /// render ///
  if (!ping) {
    return <Loading />;
  }

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

  return (
    <div className='container-fluid m-2'>
      <div>
        {renderDaysLeftForPing()}
        <h4>You can</h4>
        <ul className='mzp-u-list-styled'>
          <li>
            <strong>Share</strong> with others by copying and sending them the URL.
          </li>
          <li>
            <strong>Click</strong> on a ping header to see more data.
          </li>
          <li>
            <strong>See, copy, and link</strong> directly to the beautified version of the raw ping.
          </li>
        </ul>
      </div>
      <PingSection pingSection={JSON.parse(ping)} header={'Ping Data'} />
      <br />
      <a href='#rawPing'>
        <h3 id='rawPing'>Raw ping</h3>
      </a>
      <p>
        <strong>You can</strong>
      </p>
      <ul className='mzp-u-list-styled'>
        <li>Copy this JSON (line numbers are ignored).</li>
        <li>
          Click on a line number and share the URL. That link will open the page, highlight that
          line, and scroll directly to that line.
        </li>
      </ul>
      <div className='card'>
        <div className='card-body'>
          <pre className='text-monospace'>
            {ping.split('\n').map((line, i) => {
              const lineNumber = i + 1;
              const anchorId = `L${lineNumber}`;
              const isActiveLine = anchorId === activeLine;

              return (
                <div
                  key={`${line}${lineNumber}`}
                  className={isActiveLine ? 'active-ping-line' : ''}
                >
                  <a
                    href={'#' + anchorId}
                    id={anchorId}
                    className='no-select'
                    style={{ paddingRight: '8px' }}
                  >
                    {lineNumber}
                  </a>
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
