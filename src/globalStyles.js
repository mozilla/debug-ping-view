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

  summary::before {
    filter: invert(${({ theme }) => theme.invert});
  }

  .btn {
    color: ${({ theme }) => theme.text};
  }

  html {
    background-color: ${({ theme }) => theme.body};
  }
  `;
