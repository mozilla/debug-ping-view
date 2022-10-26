import React, { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import PropTypes from 'prop-types';

const ShowRawPing = ({ docId }) => {
  /// state ///
  const [ping, setPing] = useState('Loading...');

  /// lifecycle ///
  useEffect(() => {
    getDoc(doc(getFirestore(), 'pings', docId)).then((doc) => {
      if (!doc.exists) {
        setPing('No such ping!');
      } else {
        setPing(JSON.stringify(JSON.parse(doc.data().payload), undefined, 4));
      }
    });
  }, [docId]);

  /// render ///
  return (
    <div className='container-fluid m-2'>
      <div className='card'>
        <div className='card-body'>
          <h3 className='card-title'>Raw ping:</h3>
          <pre id='json' class='text-monospace'>
            {ping}
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
