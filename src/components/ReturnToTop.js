/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { recordClick } from '../lib/telemetry';

const ReturnToTop = () => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 500) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };
  window.addEventListener('scroll', toggleVisible);

  return (
    <button
      className='return-to-top btn btn-sm btn-outline-secondary'
      style={{ display: visible ? 'block' : 'none' }}
      data-glean-label='Back to top'
      onClick={() => {
        // record this click event
        recordClick('Back to top');
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }}
    >
      Back to top
    </button>
  );
};

export default ReturnToTop;
