import styled from '@emotion/styled';

export const HeroSection = styled.section`
  padding: 108px 0 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 94px 0 20px;
    gap: 10px;
  }
`;

export const EyebrowTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 999px;
  padding: 5px 12px;
  box-shadow: ${({ theme }) => theme.shadows.shadowSm};
`;

export const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.h1};
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.h1Mobile};
  }
`;

export const HeroHighlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

export const HeroSubtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 760px;
  line-height: 1.5;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.smallMobile};
  }
`;