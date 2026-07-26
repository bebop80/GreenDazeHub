import React from 'react';
import { RefreshCcw, Sun, Eye } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lastSync: string;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, lastSync }) => {
  return (
    <header className="text-center relative pt-4 pb-2">
      <div className="flex justify-center items-center mb-6 px-2">
        <div className="flex-1 flex justify-center">
          <svg 
            viewBox="0 0 400 260" 
            className="h-24 md:h-32 w-auto"
            aria-label="Green Daze Logo"
          >
            <defs>
              <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');
                .logo-text { 
                  font-family: 'Inter', sans-serif; 
                  font-weight: 900; 
                  letter-spacing: -0.05em;
                }
              `}</style>
            </defs>
            <text 
              x="50%" 
              y="85" 
              textAnchor="middle" 
              className="logo-text fill-brand-green" 
              style={{ fontSize: '110px' }}
            >
              GREEN
            </text>
            <text 
              x="50%" 
              y="185" 
              textAnchor="middle" 
              className="logo-text fill-brand-green" 
              style={{ fontSize: '110px' }}
            >
              DAZE
            </text>
            <circle cx="140" cy="225" r="18" className="fill-brand-green" />
            <circle cx="200" cy="225" r="18" className="fill-brand-green" />
            <circle cx="260" cy="225" r="18" className="fill-brand-green" />
          </svg>
        </div>
      </div>
      <div className="flex justify-center mb-4">
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-card border border-brand-border hover:border-brand-green transition-colors text-brand-green text-[10px] font-black uppercase tracking-widest"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Eye size={16} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>
      <p className="text-[10px] font-mono text-text-secondary flex items-center justify-center gap-2">
        <RefreshCcw size={10} className="animate-spin" />
        SISTEMA ONLINE • ULTIMO SYNC {lastSync}
      </p>
    </header>
  );
};
