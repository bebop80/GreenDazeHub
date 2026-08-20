import React from 'react';
import punkBgImage from '../assets/images/punk_background_1787240548458.jpg';

interface PunkBackgroundProps {
  theme?: 'dark' | 'light';
}

export const PunkBackground: React.FC<PunkBackgroundProps> = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{
        transform: 'translate3d(0,0,0)',
        WebkitTransform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* Background Punk Rock Collage Image with GPU acceleration and overscan to prevent mobile address bar jump */}
      <img
        src={punkBgImage}
        alt="Green Daze Punk Atmosphere"
        referrerPolicy="no-referrer"
        className="absolute -top-[10%] -left-[5%] w-[110%] h-[120%] object-cover object-center opacity-[0.32] sm:opacity-[0.40] dark:opacity-[0.45] dark:sm:opacity-[0.58] filter contrast-125 brightness-95 dark:brightness-105 grayscale-[10%] dark:grayscale-0 mix-blend-multiply dark:mix-blend-lighten"
        style={{
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      />

      {/* Radial vignette gradient overlay to keep content in foreground readable while showcasing the art */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,244,245,0.1)_0%,_rgba(244,244,245,0.5)_65%,_rgba(244,244,245,0.85)_100%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(8,8,8,0.15)_0%,_rgba(8,8,8,0.5)_65%,_rgba(8,8,8,0.8)_100%)] pointer-events-none" 
      />

      {/* Subtle green ambient light glow in corners */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

