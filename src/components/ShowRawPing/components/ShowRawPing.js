import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import PropTypes from 'prop-types';

import PingSection from './PingSection';
import Loading from '../../Loading';

const ShowRawPing = ({ docId }) => {
  const { hash, key, pathname } = useLocation();

  /// state ///
  const [ping, setPing] = useState(null);
  const [activeLine, setActiveLine] = useState(null);

  /// lifecycle ///
  // Load all ping data once `docId` is available.
  useEffect(() => {
    getDoc(doc(getFirestore(), 'pings', docId)).then((doc) => {
      if (doc.exists()) {
        setPing(JSON.stringify(JSON.parse(doc.data().payload), undefined, 4));
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

  return (
    <div className='container-fluid m-2'>
      <div>
        <h6>Using this page</h6>
        <ul className='mzp-u-list-styled'>
          <li>The link for this page is sharable.</li>
          <li>
            Clicking on a header and sharing that link will take someone specifically to that
            section when they open the link. I.E. clicking on <i>metadata</i>.
          </li>
          <li>
            Pings are available for up to <strong>21 days</strong> after they are first received.
            After that you will not be able to access this link. Even if the ping is not in the most
            recent 100 for the debug tag, you still have 21 days that the URL will work.
          </li>
        </ul>
        <a href='#rawPing' className='mzp-c-cta-link'>
          Jump to Raw Ping
        </a>
      </div>
      <br />
      <PingSection pingSection={JSON.parse(ping)} header={'Ping Data'} />
      <br />
      <a href='#rawPing'>
        <h3 id='rawPing'>Raw ping</h3>
      </a>
      <p>
        If you click on a line number, you can send someone a link that opens this page already
        scrolled to that line.
      </p>
      <div className='card'>
        <div className='card-body'>
          <pre className='text-monospace'>
            {ping.split('\n').map((line, i) => {
              const lineNumber = i + 1;
              const anchorId = `L${lineNumber}`;
              const lineStyle = anchorId === activeLine ? { backgroundColor: '#fff8c5' } : {};

              return (
                <div key={`${line}${lineNumber}`} style={lineStyle}>
                  <a href={'#' + anchorId} id={anchorId}>
                    {lineNumber}
                  </a>
                  {'  '}
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
