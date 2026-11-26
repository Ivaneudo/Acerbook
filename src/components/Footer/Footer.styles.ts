import styled from '@emotion/styled';

export const FooterContainer = styled.footer`
  margin-top: 64px;
  padding: 28px 0 38px;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FooterBrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FooterBrandTitle = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const FooterAccent = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

export const SocialLinksGroup = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

export const SocialLink = styled.a`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 10px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  box-shadow: ${({ theme }) => theme.shadows.shadowSm};
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.shadowHover};
  }
`;