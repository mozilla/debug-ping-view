/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  padding: 8px;
  background: black;
  margin-top: auto;
`;

const Footer = () => {
  return (
    <footer>
      <Box>
        <font color="white">
          <a href="https://www.mozilla.org/en-US/privacy/websites/">Mozilla's Website Privacy Notice</a> <br />
          Turn on <a href='https://support.mozilla.org/en-US/kb/how-do-i-turn-do-not-track-feature'>Do Not Track</a> feature in your browser to disable data collection for this application.
        </font>
      </Box>
    </footer>
  );
};

export default Footer;
