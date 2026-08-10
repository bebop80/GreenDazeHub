import React from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Pencil, Calendar, MapPin } from 'lucide-react';
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
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [calendarItem, setCalendarItem] = React.useState<CalendarEventItem | null>(null);

  return (
    <section className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-brand-green rounded-full" />
          <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Prossime Prove</h2>
        </div>
        <button 
          onClick={() => {
            setFutureForm({ date: '', from: '', to: '', room: '', sharedExpense: false });
            setShowAddFuture(true);
          }} 
          className="bg-brand-green p-2 rounded-lg text-black hover:scale-105 transition-transform shadow-lg shadow-brand-green/20"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {data?.futureRehearsals.map(fr => {
          const roomObj = data.customRooms.find(r => r.id === fr.room);
          return (
            <motion.div 
               layout
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               key={fr.id} 
               className="bg-brand-dark border border-brand-border rounded-xl p-4 sm:p-5 flex flex-col gap-3 group hover:border-brand-green/30 transition-colors"
            >
              {/* Header Info: Date & Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-xs font-mono font-bold text-brand-green uppercase tracking-widest">
                  {format(safeParseLocal(fr.date), 'dd MMMM yyyy', { locale: it })}
                </div>
                {fr.from && (
                  <div className="text-[10px] font-mono font-bold text-text-secondary bg-white/5 px-2 py-0.5 rounded">
                    {fr.from}{fr.to ? ` — ${fr.to}` : ''}
                  </div>
                )}
                {fr.sharedExpense && (
                  <div className="text-[10px] font-mono font-bold text-brand-green bg-brand-green/10 border border-brand-green/30 px-2 py-0.5 rounded-full uppercase">
                    Spesa condivisa
                  </div>
                )}
              </div>

              {/* Room Name & Address */}
              <div className="space-y-0.5">
                <div className="font-display font-bold text-base text-text-primary leading-tight break-words">
                  {roomObj?.name || 'SALA PROVE NON SPECIFICATA'}
                </div>
                {roomObj?.address && (
                  <div className="text-xs text-text-secondary flex items-start gap-1.5 pt-0.5 break-words">
                    <MapPin size={13} className="mt-0.5 text-brand-green shrink-0" />
                    <span>{roomObj.address}</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-2.5 border-t border-white/10 flex items-center justify-end gap-1">
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
                  className="p-2 text-zinc-400 hover:text-brand-green hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  title="Aggiungi al calendario"
                >
                  <Calendar size={17} />
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
                  className="p-2 text-zinc-400 hover:text-brand-green hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  title="Modifica prova"
                >
                  <Pencil size={17} />
                </button>
                <button 
                  disabled={deletingId === fr.id}
                  onClick={async () => {
                    setDeletingId(fr.id);
                    try {
                      await apiAction('delete_future_rehearsal', { id: fr.id });
                    } finally {
                      setDeletingId(null);
                    }
                  }} 
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  title="Elimina prova"
                >
                  {deletingId === fr.id ? (
                    <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Trash2 size={17} />
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
        {data?.futureRehearsals.length === 0 && (
          <div className="border-2 border-dashed border-zinc-800 rounded-2xl py-8 text-center">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">Nessuna prova futura</p>
          </div>
        )}
      </div>
      <CalendarExportModal item={calendarItem} onClose={() => setCalendarItem(null)} />
    </section>
  );
};
