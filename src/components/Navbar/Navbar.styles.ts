import styled from '@emotion/styled';

interface HeaderWrapperProps {
  isVisible: boolean;
  isScrolled: boolean;
}

export const HeaderWrapper = styled('header', {
  shouldForwardProp: (prop) => prop !== 'isVisible' && prop !== 'isScrolled',
})<HeaderWrapperProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 70px;
  display: flex;
  align-items: center;
  background: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.navbarBg : 'transparent'};
  backdrop-filter: ${({ isScrolled }) => (isScrolled ? 'blur(14px)' : 'none')};
  -webkit-backdrop-filter: ${({ isScrolled }) => (isScrolled ? 'blur(14px)' : 'none')};
  border-bottom: 1px solid
    ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.surfaceBorder : 'transparent'};
  box-shadow: ${({ theme, isScrolled }) =>
    isScrolled ? theme.shadows.shadowSm : 'none'};
  transform: ${({ isVisible }) =>
    isVisible ? 'translateY(0)' : 'translateY(-100%)'};
  transition: transform 0.28s ease, background-color 0.25s ease,
    border-color 0.25s ease, box-shadow 0.25s ease;
`;

export const NavInner = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 16px;
  }
`;

export const Brand = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 19px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
  flex-shrink: 0;

  &:hover span {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const BrandAccent = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  transition: color 0.2s ease;
`;

export const DesktopNavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

interface NavTabButtonProps {
  active: boolean;
}

export const NavTabButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<NavTabButtonProps>`
  position: relative;
  background: ${({ theme, active }) =>
    active ? theme.colors.codeBg : 'transparent'};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors.surfaceBorder : 'transparent'};
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 13px;
  font-weight: ${({ active }) => (active ? 600 : 500)};
  color: ${({ theme, active }) =>
    active ? theme.colors.text : theme.colors.textMuted};
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: -1px;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleX(${({ active }) => (active ? 1 : 0)});
    transform-origin: center;
    transition: transform 0.25s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.codeBg};
  }
`;

export const TabBadge = styled('span', {
  shouldForwardProp: (prop) => prop !== 'active',
})<NavTabButtonProps>`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  background: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.surfaceBorder};
  color: ${({ theme, active }) => (active ? '#FFFFFF' : theme.colors.textMuted)};
  transition: background-color 0.2s ease, color 0.2s ease;
`;

export const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

interface ActionButtonProps {
  isLocked?: boolean;
}

export const ActionButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isLocked',
})<ActionButtonProps>`
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme, isLocked }) =>
    isLocked ? theme.colors.textMuted : theme.colors.text};
  opacity: ${({ isLocked }) => (isLocked ? 0.78 : 1)};
  box-shadow: ${({ theme }) => theme.shadows.shadowSm};
  transition: border-color 0.2s ease, transform 0.2s ease, color 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    opacity: 1;
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const IconOnlyButton = styled.button`
  background: ${({ theme }) => theme.colors.codeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 8px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.shadowSm};
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;

export const MobileMenuToggle = styled(IconOnlyButton)`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: inline-flex;
  }
`;

interface MobileDrawerProps {
  isOpen: boolean;
}

export const MobileDrawer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<MobileDrawerProps>`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 45;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  box-shadow: ${({ theme }) => theme.shadows.shadow};
  padding: 16px;
  display: none;
  flex-direction: column;
  gap: 8px;
  transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-16px')});
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transition: transform 0.25s ease, opacity 0.25s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

export const MobileTabButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<NavTabButtonProps>`
  width: 100%;
  background: ${({ theme, active }) =>
    active ? theme.colors.surface : 'transparent'};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.surfaceBorder};
  border-radius: 10px;
  padding: 12px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 14px;
  font-weight: ${({ active }) => (active ? 600 : 500)};
  color: ${({ theme, active }) =>
    active ? theme.colors.text : theme.colors.textMuted};
`;

export const MobileDrawerActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

export const MobileActionButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isLocked',
})<ActionButtonProps>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme, isLocked }) =>
    isLocked ? theme.colors.textMuted : theme.colors.text};
  opacity: ${({ isLocked }) => (isLocked ? 0.8 : 1)};

  &:hover {
    opacity: 1;
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;