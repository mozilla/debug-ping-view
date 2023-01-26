/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';

import ReadMore from '../../ReadMore';
import { commonErrors, commonErrorTypes } from '../lib/commonErrors';

const ErrorField = ({ ping }) => {
  if (!ping.error) {
    return <td className='error'></td>;
  }

  let errorTooltip = undefined;
  let errorText = ping.errorType + ' ' + ping.errorMessage;

  const matchingCommonError = commonErrors.find((e) => {
    return ping.errorMessage.startsWith(e[0]);
  });

  if (matchingCommonError) {
    errorText = matchingCommonError[1] + ': ' + errorText;
    errorTooltip = matchingCommonError[2];
  }

  const matchingCommonErrorType = commonErrorTypes.find((et) => {
    return ping.errorType === et[0];
  });

  if (matchingCommonErrorType) {
    errorTooltip = matchingCommonErrorType[1] + '\n\n' + ping.errorMessage;
  }

  return (
    <td className='text-danger text-monospace error'>
      <ReadMore numberOfLines={3} text={errorText} />
      {errorTooltip && (
        <i
          className='fa fa-info-circle'
          data-toggle='tooltip'
          data-placement='top'
          title={errorTooltip}
        />
      )}
    </td>
  );
};

ErrorField.propTypes = {
  ping: PropTypes.object.isRequired
};

export default ErrorField;
