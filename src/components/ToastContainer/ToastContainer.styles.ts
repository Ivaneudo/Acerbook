import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { ToastVariant } from '../../contexts/ToastContext';

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 16px, 0) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

export const ToastViewport = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 150;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 360px;
  max-width: calc(100vw - 32px);
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    bottom: 16px;
    right: 16px;
    left: 16px;
    width: auto;
    max-width: none;
  }
`;

interface ToastCardProps {
  variant: ToastVariant;
}

export const ToastCard = styled('div', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<ToastCardProps>`
  pointer-events: auto;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid
    ${({ theme, variant }) =>
      variant === 'error'
        ? theme.colors.primary
        : theme.colors.statusSuccessText};
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: ${({ theme }) => theme.shadows.shadow};
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ${slideInUp} 0.25s ease forwards;
`;

export const ToastIconWrap = styled('span', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<ToastCardProps>`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ theme, variant }) =>
    variant === 'error'
      ? theme.colors.statusReadingBg
      : theme.colors.statusSuccessBg};
  color: ${({ theme, variant }) =>
    variant === 'error'
      ? theme.colors.statusReadingText
      : theme.colors.statusSuccessText};
`;

export const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const ToastTitle = styled.strong`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const ToastMessage = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.45;
  word-break: break-word;
`;

export const ToastCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;