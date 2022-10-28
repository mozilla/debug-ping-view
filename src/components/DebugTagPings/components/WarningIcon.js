import React from 'react';
import PropTypes from 'prop-types';

import { commonWarnings } from '../lib/commonWarnings';

const WarningIcon = ({ ping }) => {
  if (ping.warning) {
    const matchingCommonWarning = commonWarnings.find((e) => {
      return ping.warning === e[0];
    });

    const tooltip = matchingCommonWarning ? matchingCommonWarning[1] : ping.warning;
    return (
      <i className='fa fa-info-circle' data-toggle='tooltip' data-placement='top' title={tooltip} />
    );
  }

  return null;
};

WarningIcon.propTypes = {
  ping: PropTypes.object.isRequired
};

export default WarningIcon;
