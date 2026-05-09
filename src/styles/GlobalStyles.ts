import { createGlobalStyle } from 'styled-components';

// App-wide reset + base typography. Keeps `index.css` minimal so all
// styling lives within styled-components.
export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
  }

  body {
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
  }
  a:hover { color: ${({ theme }) => theme.colors.accentHover}; }

  button { font: inherit; }

  img { max-width: 100%; display: block; }

  /* Visually-hidden helper for accessibility */
  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
