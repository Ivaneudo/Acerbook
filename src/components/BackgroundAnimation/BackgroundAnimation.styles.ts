import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const pulseGrid = keyframes`
  0%, 100% {
    opacity: 0.45;
  }
  50% {
    opacity: 0.85;
  }
`;

const floatOrb = keyframes`
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(18px, -22px, 0) scale(1.06);
  }
`;

export const BackdropLayer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

export const DottedGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    ${({ theme }) =>
      theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.07)'
        : 'rgba(20, 20, 23, 0.08)'}
      1px,
    transparent 1px
  );
  background-size: 36px 36px;
  animation: ${pulseGrid} 8s ease-in-out infinite;
`;

interface OrbProps {
  variant: 'top-left' | 'center-right' | 'bottom-left';
}

export const GlowOrb = styled('div', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<OrbProps>`
  position: absolute;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryGlow};
  animation: ${floatOrb} 14s ease-in-out infinite;

  ${({ variant }) => {
    if (variant === 'top-left') {
      return `
        width: 380px;
        height: 380px;
        top: -110px;
        left: -90px;
        filter: blur(55px);
      `;
    }
    if (variant === 'center-right') {
      return `
        width: 340px;
        height: 340px;
        top: 34%;
        right: -110px;
        filter: blur(60px);
        animation-delay: -5s;
      `;
    }
    return `
      width: 300px;
      height: 300px;
      bottom: -90px;
      left: 18%;
      filter: blur(45px);
      animation-delay: -9s;
    `;
  }}
`;