import React from 'react';
import { Share2, Trash2, MapPin, Plus } from 'lucide-react';
import { format, parseISO, isFuture, isToday } from 'date-fns';
import { AppData } from '../types';
import { cn } from '../lib/utils';

interface ConcertsBlockProps {
  data: AppData | null;
  setShowAddConcert: (val: boolean) => void;
  apiAction: (type: string, payload: any) => Promise<boolean>;
  shareInfo: (text: string, platform: 'wa' | 'tg') => void;
}

export const ConcertsBlock: React.FC<ConcertsBlockProps> = ({ 
  data, 
  setShowAddConcert, 
  apiAction, 
  shareInfo 
}) => {
  return (
    <section className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-brand-green rounded-full" />
          <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Concerti</h2>
        </div>
        <button onClick={() => setShowAddConcert(true)} className="bg-zinc-800 p-2 rounded-lg hover:text-brand-green transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {data?.concerts.slice().sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(c => {
          const dateObj = parseISO(c.date);
          const isHighlight = isFuture(dateObj) || isToday(dateObj);
          
          return (
            <div 
              key={c.id} 
              className={cn(
                "border rounded-2xl p-5 flex items-center justify-between transition-all",
                isHighlight ? "bg-brand-green/10 border-brand-green/40 shadow-[0_0_15px_-5px_#2d9a56]" : "bg-brand-dark/50 border-brand-border opacity-40 grayscale"
              )}
            >
              <div>
                <div className="text-[13px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1">{format(dateObj, 'dd MMM yyyy')}</div>
                <div className="font-display font-extrabold text-lg text-text-primary group-hover:text-brand-green">{c.name}</div>
                {c.address && <div className="text-[10px] font-medium flex items-center gap-1.5 text-text-secondary mt-1"><MapPin size={10} className="text-brand-green"/> {c.address}</div>}
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => shareInfo(`🎤 Concerto: ${c.name}\n📅 ${format(dateObj, 'd MMMM')}\n📍 ${c.address}`, 'wa')}
                  className="p-3 hover:bg-brand-green hover:text-black rounded-xl transition-all"
                >
                  <Share2 size={18} />
                </button>
                <button onClick={() => { if(confirm('Delete concert?')) apiAction('delete_concert', { id: c.id }) }} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
