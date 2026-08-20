import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Pencil, Calendar, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { AppData, FutureRehearsal } from '../types';
import { safeParseLocal } from '../lib/utils';
import { CalendarExportModal, CalendarEventItem } from './modals/CalendarExportModal';

interface UpcomingSessionsProps {
  data: AppData | null;
  setShowAddFuture: (val: boolean) => void;
  setFutureForm: (val: Partial<FutureRehearsal>) => void;
  apiAction: (type: string, payload: any) => Promise<boolean>;
}

export const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ 
  data, 
  setShowAddFuture, 
  setFutureForm,
  apiAction 
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [calendarItem, setCalendarItem] = useState<CalendarEventItem | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await apiAction('delete_future_rehearsal', { id });
      setConfirmDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="glass-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-brand-green rounded-full shadow-[0_0_10px_#2d9a56]" />
          <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Prossime Prove</h2>
        </div>
        <button 
          onClick={() => {
            setFutureForm({ date: '', from: '', to: '', room: '', sharedExpense: false });
            setShowAddFuture(true);
          }} 
          className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-brand-green hover:bg-brand-green/90 p-2.5 rounded-xl text-black transition-all shadow-md shadow-brand-green/20 cursor-pointer"
          title="Aggiungi nuova sessione di prova"
          aria-label="Aggiungi nuova sessione di prova"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-3">
        {data?.futureRehearsals.map(fr => {
          const roomObj = data.customRooms.find(r => r.id === data.next.room || r.id === fr.room);
          const dateObj = safeParseLocal(fr.date);
          const dayName = format(dateObj, 'EEE', { locale: it }).toUpperCase();
          const dayNum = format(dateObj, 'dd');
          const monthName = format(dateObj, 'MMM', { locale: it }).toUpperCase();

          return (
            <motion.div 
               layout
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               key={fr.id} 
               className="bg-brand-dark/80 border border-brand-border rounded-2xl p-4 sm:p-5 flex flex-col gap-3 group hover:border-brand-green/30 transition-all shadow-sm"
            >
              <div className="flex items-start gap-3">
                {/* Visual Calendar Date Box */}
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-brand-card border border-slate-400/80 dark:border-brand-border flex flex-col items-center justify-center shrink-0 shadow-inner">
                  <span className="text-[10px] font-mono font-black text-brand-green leading-none">{dayName}</span>
                  <span className="text-xl sm:text-2xl font-display font-black text-text-primary leading-none my-0.5">{dayNum}</span>
                  <span className="text-[9px] font-mono font-bold text-text-secondary leading-none">{monthName}</span>
                </div>

                {/* Content Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(fr.from || fr.to) && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-text-primary bg-white/5 border border-brand-border/40 px-2 py-0.5 rounded-md">
                        <Clock size={11} className="text-brand-green" />
                        <span>{fr.from}{fr.to ? ` — ${fr.to}` : ''}</span>
                      </span>
                    )}
                    {fr.sharedExpense && (
                      <span className="text-[10px] font-mono font-bold text-brand-green bg-brand-green/10 border border-brand-green/30 px-2 py-0.5 rounded-full uppercase">
                        🤝 Spesa condivisa
                      </span>
                    )}
                  </div>

                  <div className="font-display font-bold text-base sm:text-lg text-text-primary leading-tight break-words pt-0.5">
                    {roomObj?.name || 'Sede da definire'}
                  </div>
                </div>
              </div>

              {/* Address aligned with left margin */}
              {roomObj?.address && (
                <div className="text-xs text-text-secondary flex items-start gap-1.5 pt-0.5 break-words">
                  <MapPin size={13} className="mt-0.5 text-zinc-500 shrink-0" />
                  <span>{roomObj.address}</span>
                </div>
              )}

              {/* Inline Delete Confirmation or Action Bar */}
              <AnimatePresence mode="wait">
                {confirmDeleteId === fr.id ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2 border-t border-red-500/20 flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                      <AlertTriangle size={14} className="shrink-0" />
                      Eliminare questa prova?
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1.5 min-h-[36px] bg-brand-card hover:bg-white/5 border border-brand-border rounded-lg text-xs font-bold text-text-secondary cursor-pointer"
                      >
                        Annulla
                      </button>
                      <button
                        disabled={deletingId === fr.id}
                        onClick={() => handleDelete(fr.id)}
                        className="px-3 py-1.5 min-h-[36px] bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {deletingId === fr.id ? 'Eliminazione...' : 'Elimina'}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setCalendarItem({
                          title: `🎵 Prova Band${roomObj?.name ? `: ${roomObj.name}` : ''}`,
                          date: fr.date,
                          timeFrom: fr.from,
                          timeTo: fr.to,
                          location: roomObj?.address || roomObj?.name || '',
                          description: `Prova della band in ${roomObj?.name || 'sala prove'}`
                        });
                      }}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-zinc-400 hover:text-brand-green hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                      title="Aggiungi al calendario"
                      aria-label="Aggiungi al calendario"
                    >
                      <Calendar size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        setFutureForm({
                          id: fr.id,
                          date: fr.date,
                          from: fr.from || '',
                          to: fr.to || '',
                          room: fr.room || '',
                          sharedExpense: !!fr.sharedExpense
                        });
                        setShowAddFuture(true);
                      }}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-zinc-400 hover:text-brand-green hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                      title="Modifica prova"
                      aria-label="Modifica prova"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => setConfirmDeleteId(fr.id)} 
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                      title="Elimina prova"
                      aria-label="Elimina prova"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        {data?.futureRehearsals.length === 0 && (
          <div className="border border-dashed border-brand-border rounded-2xl py-6 px-4 text-center">
            <p className="text-[11px] font-mono text-text-secondary uppercase tracking-normal sm:tracking-wider max-w-[260px] sm:max-w-none mx-auto leading-relaxed">
              Nessuna prova futura in programma
            </p>
          </div>
        )}
      </div>
      <CalendarExportModal item={calendarItem} onClose={() => setCalendarItem(null)} />
    </section>
  );
};
