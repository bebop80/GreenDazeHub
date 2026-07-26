import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="pt-12 pb-8 text-center space-y-3 opacity-60 border-t border-brand-border/30">
      <p className="text-[10px] font-mono tracking-widest uppercase">
        © 2026 Sala Prove Tracker. Tutti i diritti riservati.
      </p>
      <p className="text-[9px] font-medium tracking-tight">
        È vietata la riproduzione del codice e della grafica.
      </p>
      <p className="text-[10px] font-display font-bold italic text-brand-green">
        Fatto con 🤘🏼 da Alessandro Cortinovis per i veri musicisti.
      </p>
    </footer>
  );
};
