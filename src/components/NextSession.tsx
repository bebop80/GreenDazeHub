import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Music, Clock, MapPin, Send, Settings, TrendingUp, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { AppData, Member } from '../types';

interface NextSessionProps {
  data: AppData | null;
  calcolaTurno: Member | null;
  setEditingNext: (val: boolean) => void;
  shareInfo: (text: string, platform: 'wa' | 'tg') => void;
  formatRehearsalForShare: (r: any) => string;
}

export const NextSession: React.FC<NextSessionProps> = ({ 
  data, 
  calcolaTurno, 
  setEditingNext, 
  shareInfo,
  formatRehearsalForShare 
}) => {
  return (
    <section className="glass-card p-6 relative overflow-hidden glow-border">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Calendar size={60} />
      </div>
      
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-5 bg-brand-green rounded-full shadow-[0_0_10px_2px_#2d9a56]" />
        <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Prossima Sessione</h2>
      </div>

      {data?.next?.date ? (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-display font-extrabold uppercase leading-none mb-3 glow-green text-brand-green">
              {format(parseISO(data.next.date), 'EEEE d MMMM', { locale: it })}
            </div>
            <div className="flex items-center justify-center gap-4 text-text-primary font-mono text-sm font-bold opacity-80">
              <span className="flex items-center gap-2 text-lg"><Clock size={18} className="text-brand-green"/> {data.next.from} {data.next.to && `— ${data.next.to}`}</span>
            </div>
          </div>

          <div className="bg-brand-dark/80 border border-brand-border rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                 <div className="bg-brand-green/20 p-2.5 rounded-lg">
                  <Music size={20} className="text-brand-green" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black text-brand-green/70 tracking-widest mb-1">SALA PROVE</div>
                  <div className="font-bold text-base leading-tight text-text-primary">{data.customRooms.find(r => r.id === data.next.room)?.name || 'DA DEFINIRE'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                {data.customRooms.find(r => r.id === data.next.room)?.address && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.customRooms.find(r => r.id === data.next.room)!.address!)}`}
                    target="_blank"
                    className="p-3 bg-brand-green/10 border border-brand-green/30 rounded-xl hover:bg-brand-green/20 transition-all text-brand-green"
                  >
                    <MapPin size={18} />
                  </a>
                )}
                <button 
                  onClick={() => shareInfo(formatRehearsalForShare(data.next), 'wa')}
                  className="p-3 bg-brand-green/10 border border-brand-green/30 rounded-xl hover:bg-brand-green/20 transition-all text-brand-green"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {calcolaTurno && (
            <div className="bg-brand-green/5 border border-brand-green/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrendingUp size={24} className="text-brand-green" />
                <div>
                  <div className="text-[10px] uppercase font-black text-brand-green/70 tracking-widest mb-1">Turno Pagamento</div>
                  <div className="font-display font-bold text-xl leading-none" style={{ color: calcolaTurno.color }}>
                    {calcolaTurno.name}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={() => setEditingNext(true)}
            className="w-full bg-brand-card border border-brand-border hover:border-brand-green/50 py-3 rounded-xl font-bold uppercase text-[10px] tracking-[0.3em] transition-all flex items-center justify-center gap-2 group text-text-primary"
          >
            <Settings size={14} className="group-hover:rotate-45 transition-transform" /> Modifica Programmazione
          </button>
        </div>
      ) : (
        <div className="text-center py-12 opacity-50 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <p className="font-display uppercase text-sm font-bold tracking-[0.2em]">Riff In Production...</p>
          <button 
            onClick={() => setEditingNext(true)}
            className="bg-brand-green text-black px-8 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest"
          >
            Broadcast Date
          </button>
        </div>
      )}
    </section>
  );
};
