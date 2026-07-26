import React from 'react';

interface PunkBackgroundProps {
  theme?: 'dark' | 'light';
}

export const PunkBackground: React.FC<PunkBackgroundProps> = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Subtle radial vignette gradient to focus attention on center app content */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(0,0,0,0.6)_100%)] dark:bg-[radial-gradient(ellipse_at_center,_transparent_25%,_rgba(0,0,0,0.85)_100%)] pointer-events-none z-10" />

      {/* Repeating Doodle Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.11] transition-opacity duration-500"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'%3E%3Cg fill='none' stroke='%232d9a56' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3C!-- Electric Guitar --%3E%3Cpath d='M30 70 L55 45 M55 45 L62 38 L67 43 L60 50 Z M25 75 C15 70 10 85 20 95 C15 105 30 115 40 100 C45 90 35 80 25 75 Z'/%3E%3Ccircle cx='29' cy='88' r='4'/%3E%3C!-- Lightning Bolt --%3E%3Cpath d='M120 15 L108 32 H116 L110 48 L126 28 H118 L124 15 Z' fill='%232d9a56' fill-opacity='0.2'/%3E%3C!-- Punk Skull --%3E%3Cpath d='M176 18 L204 46 M204 18 L176 46'/%3E%3Ccircle cx='190' cy='32' r='10' fill='%23000'/%3E%3Cpath d='M184 37 L184 44 H196 L196 37'/%3E%3Ccircle cx='186' cy='31' r='2.5' fill='%232d9a56'/%3E%3Ccircle cx='194' cy='31' r='2.5' fill='%232d9a56'/%3E%3C!-- Vinyl Record --%3E%3Ccircle cx='40' cy='155' r='16'/%3E%3Ccircle cx='40' cy='155' r='11'/%3E%3Ccircle cx='40' cy='155' r='6'/%3E%3Ccircle cx='40' cy='155' r='2' fill='%232d9a56'/%3E%3C!-- Safety Pin --%3E%3Cpath d='M110 85 L110 110 C108 113 105 113 103 110 L103 88 C103 83 110 83 110 85 M108 83 L114 83 L114 88 L108 88 Z'/%3E%3C!-- Cassette Tape --%3E%3Crect x='165' y='90' width='38' height='24' rx='3'/%3E%3Crect x='171' y='96' width='26' height='12' rx='1'/%3E%3Ccircle cx='177' cy='102' r='3'/%3E%3Ccircle cx='191' cy='102' r='3'/%3E%3C!-- Rock Hand Sign 🤘 --%3E%3Cpath d='M25 210 L25 198 M21 198 L21 183 C21 180 25 180 25 183 L25 198 M37 198 L37 185 C37 182 41 182 41 185 L41 198 M25 192 C28 196 34 196 37 192 M21 210 L37 210'/%3E%3C!-- Drumsticks X --%3E%3Cpath d='M95 165 L125 195 M125 165 L95 195'/%3E%3Ccircle cx='126' cy='196' r='1.5' fill='%232d9a56'/%3E%3Ccircle cx='94' cy='196' r='1.5' fill='%232d9a56'/%3E%3C!-- Amplifier Cabinet --%3E%3Crect x='175' y='165' width='32' height='32' rx='3'/%3E%3Ccircle cx='191' cy='183' r='9'/%3E%3Ccircle cx='191' cy='183' r='4'/%3E%3Ccircle cx='182' cy='171' r='1' fill='%232d9a56'/%3E%3Ccircle cx='191' cy='171' r='1' fill='%232d9a56'/%3E%3Ccircle cx='200' cy='171' r='1' fill='%232d9a56'/%3E%3C!-- Anarchy Symbol --%3E%3Ccircle cx='110' cy='230' r='11'/%3E%3Cpath d='M102 238 L110 220 L118 238 M99 231 H121'/%3E%3C!-- Peace Sign --%3E%3Ccircle cx='210' cy='65' r='10'/%3E%3Cpath d='M210 55 V75 M210 65 L203 72 M210 65 L217 72'/%3E%3C!-- Stars & Sparks --%3E%3Cpath d='M70 38 L72 42 L76 43 L72 44 L70 48 L68 44 L64 43 L68 42 Z' fill='%232d9a56'/%3E%3Cpath d='M145 138 L147 142 L151 143 L147 144 L145 148 L143 144 L139 143 L143 142 Z' fill='%232d9a56'/%3E%3C!-- Music Notes --%3E%3Cpath d='M75 125 L82 122 L82 136 M75 125 V138'/%3E%3Ccircle cx='73' cy='138' r='2.5' fill='%232d9a56'/%3E%3Ccircle cx='80' cy='136' r='2.5' fill='%232d9a56'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '260px 260px',
        }}
      />
    </div>
  );
};
