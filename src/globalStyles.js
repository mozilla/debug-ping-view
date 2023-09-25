/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { createGlobalStyle } from 'styled-components';

// These styles are globally applied to each html element, class, or ID.
//
// This allows us to dynamically read the current theme and update
// elements styles without having to conditionally add/remove styles
// in each component.
export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.text};
  }

  th, td {
    border-bottom-color: ${({ theme }) => theme.toggleBorder};
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }

  pre {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }

  a:link {
    color: ${({ theme }) => theme.links};
  }

  a:visited {
    color: ${({ theme }) => theme.links};
  }

  .line-link {
    color: ${({ theme }) => theme.links};
  }

  .card {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }

  .active-ping-line {
    background-color: ${({ theme }) => theme.rawPingActiveLineBackground};
  }

  .btn {
    color: ${({ theme }) => theme.text};
  }

  html {
    background-color: ${({ theme }) => theme.body};
  }

  .return-to-top {
    background-color: ${({ theme }) => theme.body};
  }
  `;
