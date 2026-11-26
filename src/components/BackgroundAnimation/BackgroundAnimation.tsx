import React from 'react';
import { BackdropLayer, DottedGrid, GlowOrb } from './BackgroundAnimation.styles';

export const BackgroundAnimation: React.FC = () => {
  return (
    <BackdropLayer aria-hidden="true">
      <DottedGrid />
      <GlowOrb variant="top-left" />
      <GlowOrb variant="center-right" />
      <GlowOrb variant="bottom-left" />
    </BackdropLayer>
  );
};