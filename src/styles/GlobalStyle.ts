import { css, Theme } from '@emotion/react';

export const getGlobalStyles = (theme: Theme) => css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  body {
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    font-family: ${theme.fonts.body};
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
    transition: background-color 0.25s ease, color 0.25s ease;
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: ${theme.fonts.display};
    color: ${theme.colors.text};
    line-height: 1.25;
  }

  button,
  input,
  select {
    font-family: inherit;
    color: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ::selection {
    background-color: ${theme.colors.primary};
    color: #ffffff;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary};
    border-radius: 999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primaryHover};
  }
`;