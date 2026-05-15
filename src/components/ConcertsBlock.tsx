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
        {(() => {
          const sorted = [...(data?.concerts || [])].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const upcoming = sorted.filter(c => isFuture(parseISO(c.date)) || isToday(parseISO(c.date)));
          const past = sorted.filter(c => !isFuture(parseISO(c.date)) && !isToday(parseISO(c.date))).reverse(); // Newest past first? Or oldest past last? User said "bottom of the list"
          
          // Re-merge: upcoming first, then past
          const displayList = [...upcoming, ...past];
          const nextConcertId = upcoming[0]?.id;

          return displayList.map(c => {
            const dateObj = parseISO(c.date);
            const isPast = !isFuture(dateObj) && !isToday(dateObj);
            const isNext = c.id === nextConcertId;
            
            return (
              <div 
                key={c.id} 
                className={cn(
                  "border rounded-2xl p-5 flex items-center justify-between transition-all relative overflow-hidden",
                  isNext && "bg-brand-green/20 border-brand-green shadow-[0_0_25px_-5px_#2d9a56] ring-2 ring-brand-green/20",
                  !isPast && !isNext && "bg-brand-green/10 border-brand-green/40 shadow-[0_0_15px_-5px_#2d9a56]",
                  isPast && "bg-brand-dark/30 border-brand-border opacity-60 grayscale-[0.5]"
                )}
              >
                {isNext && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-brand-green text-black font-mono font-bold text-[10px] uppercase tracking-tighter rounded-bl-xl">
                    Next Gig
                  </div>
                )}
                <div>
                  <div className={cn(
                    "text-[12px] font-mono font-bold uppercase tracking-widest mb-1",
                    isPast ? "text-zinc-600" : "text-brand-green/80"
                  )}>
                    {format(dateObj, 'dd MMM yyyy')}
                  </div>
                  <div className={cn(
                    "font-display font-extrabold text-lg text-text-primary group-hover:text-brand-green",
                    isNext && "text-xl text-white"
                  )}>
                    {c.name}
                  </div>
                  {c.address && (
                    <div className="text-[10px] font-medium flex items-center gap-1.5 text-text-secondary mt-1">
                      <MapPin size={10} className={cn(isPast ? "text-zinc-600" : "text-brand-green")}/> 
                      {c.address}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  {!isPast && (
                    <button 
                      onClick={() => shareInfo(`🎤 Concerto: ${c.name}\n📅 ${format(dateObj, 'd MMMM yyyy')}\n📍 ${c.address}`, 'wa')}
                      className="p-3 hover:bg-brand-green hover:text-black rounded-xl transition-all"
                    >
                      <Share2 size={18} />
                    </button>
                  )}
                  <button onClick={() => { if(confirm('Delete concert?')) apiAction('delete_concert', { id: c.id }) }} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          });
        })()}
      </div>
    </section>
  );
};
