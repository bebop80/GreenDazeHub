import React from 'react';
import { Calendar, Music, Clock, MapPin, Send, Settings, TrendingUp, AlertCircle, Share2 } from 'lucide-react';
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
    <section className="glass-card p-5 sm:p-7 relative overflow-hidden glow-border">
      {/* Calendar Watermark in background */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Calendar size={60} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 bg-brand-green rounded-full shadow-[0_0_10px_2px_#2d9a56]" />
        <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Prossima Sessione</h2>
      </div>

      {data?.next?.date ? (
        <div className="space-y-5">
          {/* Main Focus: Big Date & Time */}
          <div className="text-center py-2">
            <div className="text-2xl sm:text-3xl font-display font-black uppercase leading-tight tracking-tight glow-green text-brand-green">
              {format(safeParseLocal(data.next.date), 'EEEE d MMMM', { locale: it })}
            </div>
            {(data.next.from || data.next.to) && (
              <div className="inline-flex items-center justify-center gap-2 mt-2 px-3 py-1 bg-brand-dark/90 border border-brand-border rounded-full font-mono text-sm font-bold text-text-primary shadow-inner">
                <Clock size={15} className="text-brand-green" />
                <span>{data.next.from} {data.next.to && `— ${data.next.to}`}</span>
              </div>
            )}
          </div>

          {/* Location Card */}
          {(() => {
            const roomObj = data.customRooms.find(r => r.id === data.next.room);
            return (
              <div className="bg-brand-dark/90 border border-brand-border rounded-2xl p-4 sm:p-5 space-y-1.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <Music size={15} className="text-brand-green" />
                  <span className="text-[10px] uppercase font-black text-brand-green tracking-widest">
                    SALA PROVE
                  </span>
                </div>

                <div className="font-display font-bold text-lg sm:text-xl text-text-primary leading-snug break-words">
                  {roomObj?.name || 'Da definire'}
                </div>

                {roomObj?.address && (
                  <div className="text-xs font-medium flex items-start gap-1.5 text-text-secondary pt-0.5 break-words">
                    <MapPin size={14} className="mt-0.5 text-brand-green shrink-0" />
                    <span>{roomObj.address}</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Who Pays Card */}
          {(isSharedExpense || calcolaTurno) && (
            <div className="bg-brand-green/10 border border-brand-green/30 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green/20 border border-brand-green/40 flex items-center justify-center shrink-0">
                  <TrendingUp size={20} className="text-brand-green" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black text-text-secondary tracking-widest">Tocca Pagare A:</div>
                  {isSharedExpense ? (
                    <div className="font-display font-black text-lg leading-tight text-brand-green uppercase">
                      🤝 Spesa condivisa
                    </div>
                  ) : calcolaTurno ? (
                    <div className="font-display font-black text-xl leading-tight uppercase" style={{ color: calcolaTurno.color }}>
                      {calcolaTurno.name}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons: Min 44px touch targets with clear icons & labels */}
          {(() => {
            const roomObj = data.customRooms.find(r => r.id === data.next.room);
            return (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {roomObj?.address ? (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(roomObj.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] flex items-center justify-center gap-1.5 px-2 py-2.5 bg-brand-dark hover:bg-white/5 border border-brand-border hover:border-brand-green/40 text-text-primary rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <MapPin size={16} className="text-brand-green shrink-0" />
                    <span className="truncate">Mappa</span>
                  </a>
                ) : (
                  <div className="min-h-[44px] flex items-center justify-center gap-1.5 px-2 py-2.5 bg-brand-dark/40 border border-brand-border/40 text-zinc-500 rounded-xl text-xs font-bold">
                    <MapPin size={16} className="shrink-0" />
                    <span className="truncate">Mappa</span>
                  </div>
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
                  className="min-h-[44px] flex items-center justify-center gap-1.5 px-2 py-2.5 bg-brand-dark hover:bg-white/5 border border-brand-border hover:border-brand-green/40 text-text-primary rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Calendar size={16} className="text-brand-green shrink-0" />
                  <span className="truncate">Calendario</span>
                </button>

                <button 
                  onClick={() => shareInfo(formatRehearsalForShare(data.next), 'wa')}
                  className="min-h-[44px] flex items-center justify-center gap-1.5 px-2 py-2.5 bg-brand-dark hover:bg-white/5 border border-brand-border hover:border-brand-green/40 text-text-primary rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Share2 size={16} className="text-brand-green shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </button>
              </div>
            );
          })()}

          {/* Edit schedule trigger */}
          <button 
            onClick={() => setEditingNext(true)}
            className="w-full min-h-[44px] bg-brand-card hover:bg-white/5 border border-brand-border hover:border-brand-green/50 py-3 px-4 rounded-xl font-bold uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 group text-text-secondary hover:text-text-primary cursor-pointer shadow-sm"
          >
            <Settings size={15} className="group-hover:rotate-45 transition-transform text-zinc-400 group-hover:text-brand-green" /> 
            <span>Modifica Programmazione</span>
          </button>
        </div>
      ) : (
        <div className="text-center py-4 sm:py-5 space-y-3">
          <div className="w-11 h-11 mx-auto rounded-full border-2 border-dashed border-zinc-700/80 flex items-center justify-center text-text-secondary/70">
            <AlertCircle size={22} />
          </div>
          <p className="font-display uppercase text-xs font-bold tracking-[0.15em] text-text-secondary">Nessuna prova in programma</p>
          <div className="pt-1">
            <button 
              onClick={() => setEditingNext(true)}
              className="min-h-[44px] bg-brand-green hover:bg-brand-green/90 text-black px-6 py-2 rounded-xl font-bold uppercase text-xs tracking-widest cursor-pointer shadow-md shadow-brand-green/10 transition-all hover:scale-[1.02]"
            >
              Imposta Prossima Prova
            </button>
          </div>
        </div>
      )}
      <CalendarExportModal item={calendarItem} onClose={() => setCalendarItem(null)} />
    </section>
  );
};
