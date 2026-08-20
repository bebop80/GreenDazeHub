import React from 'react';
import punkBgImage from '../assets/images/punk_background_1787240548458.jpg';

interface PunkBackgroundProps {
  theme?: 'dark' | 'light';
}

export const PunkBackground: React.FC<PunkBackgroundProps> = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Background Punk Rock Collage Image with tailored graphic filters */}
      <img
        src={punkBgImage}
        alt="Green Daze Punk Atmosphere"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.28] sm:opacity-[0.35] dark:opacity-[0.18] dark:sm:opacity-[0.24] filter contrast-125 brightness-95 dark:brightness-90 grayscale-[10%] dark:grayscale-[25%] mix-blend-multiply dark:mix-blend-normal transition-opacity duration-700"
      />

      {/* Radial vignette gradient overlay to keep content in foreground ultra-readable while showcasing the texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,244,245,0.15)_0%,_rgba(244,244,245,0.6)_65%,_rgba(244,244,245,0.9)_100%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(10,12,14,0.45)_0%,_rgba(10,12,14,0.85)_70%,_rgba(10,12,14,0.98)_100%)] pointer-events-none" />

      {/* Subtle green ambient light glow in corners */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

