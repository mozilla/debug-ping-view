/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

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
