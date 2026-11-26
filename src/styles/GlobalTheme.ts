import { Theme } from '@emotion/react';

const sharedTokens = {
  fonts: {
    display: "'JetBrains Mono', monospace",
    body: "'Inter', Arial, sans-serif",
  },
  fontSizes: {
    h1: '38px',
    h1Mobile: '28px',
    h2: '26px',
    large: '26px',
    medium: '24px',
    small: '22px',
    smallMobile: '17px',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#C90000',
    primaryHover: '#A00000',
    primaryGlow: 'rgba(201, 0, 0, 0.16)',
    background: '#0B0B0E',
    backgroundSecondary: '#111116',
    surface: 'rgba(22, 22, 28, 0.88)',
    surfaceHover: 'rgba(30, 30, 38, 0.96)',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    navbarBg: 'rgba(11, 11, 14, 0.85)',
    codeBg: '#14141A',
    text: '#F3F4F6',
    textMuted: '#A1A1AA',
    statusSuccessBg: 'rgba(16, 185, 129, 0.14)',
    statusSuccessText: '#34D399',
    statusReadingBg: 'rgba(201, 0, 0, 0.18)',
    statusReadingText: '#FCA5A5',
    statusIdleBg: 'rgba(161, 161, 170, 0.14)',
    statusIdleText: '#A1A1AA',
  },
  shadows: {
    shadow: '0 10px 28px rgba(0, 0, 0, 0.45)',
    shadowSm: '0 4px 12px rgba(0, 0, 0, 0.35)',
    shadowHover: '0 14px 34px rgba(0, 0, 0, 0.55)',
  },
  ...sharedTokens,
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#C90000',
    primaryHover: '#A00000',
    primaryGlow: 'rgba(201, 0, 0, 0.07)',
    background: '#F4F4F6',
    backgroundSecondary: '#EAEAEF',
    surface: '#FFFFFF',
    surfaceHover: '#FAFAFC',
    surfaceBorder: '#E4E4E8',
    navbarBg: 'rgba(244, 244, 246, 0.86)',
    codeBg: '#F1F1F4',
    text: '#141417',
    textMuted: '#52525B',
    statusSuccessBg: 'rgba(5, 150, 105, 0.1)',
    statusSuccessText: '#047857',
    statusReadingBg: 'rgba(201, 0, 0, 0.1)',
    statusReadingText: '#B91C1C',
    statusIdleBg: 'rgba(82, 82, 91, 0.1)',
    statusIdleText: '#52525B',
  },
  shadows: {
    shadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 16px rgba(0, 0, 0, 0.03)',
    shadowSm: '0 1px 2px rgba(0, 0, 0, 0.04)',
    shadowHover: '0 4px 12px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(201, 0, 0, 0.06)',
  },
  ...sharedTokens,
};