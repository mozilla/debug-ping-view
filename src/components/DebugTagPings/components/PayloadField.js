import React from 'react';
import PropTypes from 'prop-types';

import ReadMore from '../../ReadMore';

const PayloadField = ({ pingPayload }) => {
  // hack to force overflow of compacted json strings
  pingPayload = pingPayload.replace(/":"/g, '": "');
  pingPayload = pingPayload.replace(/","/g, '", "');

  return <ReadMore numberOfLines={3} text={pingPayload} />;
};

PayloadField.propTypes = {
  string: PropTypes.string
};

export default PayloadField;
