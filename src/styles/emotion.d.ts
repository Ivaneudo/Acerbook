import '@emotion/react';

export type ThemeMode = 'dark' | 'light';

declare module '@emotion/react' {
  export interface Theme {
    mode: ThemeMode;
    colors: {
      primary: string;
      primaryHover: string;
      primaryGlow: string;
      background: string;
      backgroundSecondary: string;
      surface: string;
      surfaceHover: string;
      surfaceBorder: string;
      navbarBg: string;
      codeBg: string;
      text: string;
      textMuted: string;
      statusSuccessBg: string;
      statusSuccessText: string;
      statusReadingBg: string;
      statusReadingText: string;
      statusIdleBg: string;
      statusIdleText: string;
    };
    shadows: {
      shadow: string;
      shadowSm: string;
      shadowHover: string;
    };
    fonts: {
      display: string;
      body: string;
    };
    fontSizes: {
      h1: string;
      h1Mobile: string;
      h2: string;
      large: string;
      medium: string;
      small: string;
      smallMobile: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
    };
  }
}