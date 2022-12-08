import React from 'react';
import PropTypes from 'prop-types';

import ReadMore from '../../ReadMore';

const PayloadField = ({ pingPayload }) => {
  // hack to force overflow of compacted json strings
  pingPayload = pingPayload.replace(/":"/g, '": "');
  pingPayload = pingPayload.replace(/","/g, '", "');

  return (
    <ReadMore lines={3}>
      <p className='cell-overflow'>{pingPayload}</p>
    </ReadMore>
  );
};

PayloadField.propTypes = {
  string: PropTypes.string
};

export default PayloadField;
