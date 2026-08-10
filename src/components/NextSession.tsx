import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Music, Clock, MapPin, Send, Settings, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { AppData, Member } from '../types';
import { safeParseLocal } from '../lib/utils';
import { CalendarExportModal, CalendarEventItem } from './modals/CalendarExportModal';

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
  const [calendarItem, setCalendarItem] = React.useState<CalendarEventItem | null>(null);

  const isSharedExpense = !!data?.next?.sharedExpense || 
    (data?.next?.sharedExpense as any) === 'true' || 
    (data?.next?.sharedExpense as any) === 'TRUE' || 
    (!!data?.next?.notes && data.next.notes.includes('[SPESA_CONDIVISA]'));

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
              {format(safeParseLocal(data.next.date), 'EEEE d MMMM', { locale: it })}
            </div>
            <div className="flex items-center justify-center gap-4 text-text-primary font-mono text-sm font-bold opacity-80">
              <span className="flex items-center gap-2 text-lg"><Clock size={18} className="text-brand-green"/> {data.next.from} {data.next.to && `— ${data.next.to}`}</span>
            </div>
          </div>

          <div className="bg-brand-dark/80 border border-brand-border rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
            {/* Header / Room Name & Address */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-brand-green/20 p-2 rounded-lg text-brand-green">
                  <Music size={18} />
                </div>
                <div className="text-[10px] uppercase font-black text-brand-green/80 tracking-widest">
                  SALA PROVE
                </div>
              </div>

              {(() => {
                const roomObj = data.customRooms.find(r => r.id === data.next.room);
                return (
                  <>
                    <div className="font-display font-bold text-lg text-text-primary leading-tight break-words">
                      {roomObj?.name || 'DA DEFINIRE'}
                    </div>

                    {roomObj?.address && (
                      <div className="text-xs font-medium flex items-start gap-1.5 text-text-secondary break-words pt-0.5">
                        <MapPin size={14} className="mt-0.5 text-brand-green shrink-0" />
                        <span>{roomObj.address}</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Actions Footer */}
            <div className="pt-2.5 border-t border-white/10 flex items-center justify-end gap-1.5">
              {(() => {
                const roomObj = data.customRooms.find(r => r.id === data.next.room);
                return (
                  <>
                    {roomObj?.address && (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(roomObj.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm:p-2.5 text-zinc-400 hover:text-brand-green hover:bg-brand-green/10 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                        title="Mappa"
                      >
                        <MapPin size={18} />
                        <span className="hidden sm:inline text-xs">Mappa</span>
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setCalendarItem({
                          title: `🎵 Prova Band${roomObj?.name ? `: ${roomObj.name}` : ''}`,
                          date: data.next.date,
                          timeFrom: data.next.from,
                          timeTo: data.next.to,
                          location: roomObj?.address || roomObj?.name || '',
                          description: `Prova della band in ${roomObj?.name || 'sala prove'}`
                        });
                      }}
                      className="p-2 sm:p-2.5 text-zinc-400 hover:text-brand-green hover:bg-brand-green/10 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                      title="Aggiungi al calendario"
                    >
                      <Calendar size={18} />
                      <span className="hidden sm:inline text-xs">Calendario</span>
                    </button>
                    <button 
                      onClick={() => shareInfo(formatRehearsalForShare(data.next), 'wa')}
                      className="p-2 sm:p-2.5 text-zinc-400 hover:text-brand-green hover:bg-brand-green/10 rounded-xl transition-all cursor-pointer"
                      title="Condividi su WhatsApp"
                    >
                      <Send size={18} />
                    </button>
                  </>
                );
              })()}
            </div>
          </div>

          {(isSharedExpense || calcolaTurno) && (
            <div className="bg-brand-green/5 border border-brand-green/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrendingUp size={24} className="text-brand-green" />
                <div>
                  <div className="text-[10px] uppercase font-black text-brand-green/70 tracking-widest mb-1">Turno Pagamento</div>
                  {isSharedExpense ? (
                    <div className="font-display font-bold text-xl leading-none text-brand-green">
                      Spesa condivisa
                    </div>
                  ) : calcolaTurno ? (
                    <div className="font-display font-bold text-xl leading-none" style={{ color: calcolaTurno.color }}>
                      {calcolaTurno.name}
                    </div>
                  ) : null}
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
      <CalendarExportModal item={calendarItem} onClose={() => setCalendarItem(null)} />
    </section>
  );
};
