/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';

const SignOutIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1.75em'
      height='1.75em'
      fill='currentColor'
      className='bi bi-box-arrow-right'
      viewBox='0 0 16 16'
      data-glean-label='Sign out'
    >
      <path
        fillRule='evenodd'
        d='M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z'
        data-glean-label='Sign out'
      />
      <path
        fillRule='evenodd'
        d='M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z'
        data-glean-label='Sign out'
      />
    </svg>
  );
};

export default SignOutIcon;
