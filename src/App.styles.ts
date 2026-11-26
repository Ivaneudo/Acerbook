import styled from '@emotion/styled';

export const AppShell = styled.div`
  position: relative;
  min-height: 100vh;
  z-index: 1;
`;

export const MainContainer = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 16px;
  }
`;