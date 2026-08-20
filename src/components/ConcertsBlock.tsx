import React, { useState } from 'react';
import { Share2, Trash2, MapPin, Plus, Pencil, ChevronDown, ChevronUp, Calendar, AlertTriangle } from 'lucide-react';
import { format, isFuture, isToday } from 'date-fns';
import { it } from 'date-fns/locale';
import { AppData } from '../types';
import { cn, safeParseLocal, toLocalYYYYMMDD } from '../lib/utils';
import { CalendarExportModal, CalendarEventItem } from './modals/CalendarExportModal';
import { AnimatePresence, motion } from 'motion/react';

interface ConcertsBlockProps {
  data: AppData | null;
  setShowAddConcert: (val: boolean) => void;
  setConcertForm: (val: any) => void;
  apiAction: (type: string, payload: any) => Promise<boolean>;
  shareInfo: (text: string, platform: 'wa' | 'tg') => void;
}

export const ConcertsBlock: React.FC<ConcertsBlockProps> = ({ 
  data, 
  setShowAddConcert, 
  setConcertForm,
  apiAction, 
  shareInfo 
 }) => {
  const [showPast, setShowPast] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [calendarItem, setCalendarItem] = useState<CalendarEventItem | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await apiAction('delete_concert', { id });
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
          <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Concerti</h2>
        </div>
        <button 
          onClick={() => {
            setConcertForm({ id: '', date: '', name: '', address: '' });
            setShowAddConcert(true);
          }} 
          className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-brand-card hover:bg-white/10 border border-brand-border hover:border-brand-green p-2.5 rounded-xl text-text-primary hover:text-brand-green transition-all cursor-pointer shadow-sm"
          title="Aggiungi nuovo concerto"
          aria-label="Aggiungi nuovo concerto"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {(() => {
          const sorted = [...(data?.concerts || [])].sort((a,b) => safeParseLocal(a.date).getTime() - safeParseLocal(b.date).getTime());
          const upcoming = sorted.filter(c => isFuture(safeParseLocal(c.date)) || isToday(safeParseLocal(c.date)));
          const past = sorted.filter(c => !isFuture(safeParseLocal(c.date)) && !isToday(safeParseLocal(c.date)));
          
          const nextConcertId = upcoming[0]?.id;

          const renderConcertCard = (c: any, isPast: boolean) => {
            const dateObj = safeParseLocal(c.date);
            const isNext = c.id === nextConcertId;
            const dayName = format(dateObj, 'EEE', { locale: it }).toUpperCase();
            const dayNum = format(dateObj, 'dd');
            const monthName = format(dateObj, 'MMM', { locale: it }).toUpperCase();
            
            return (
              <div 
                key={c.id} 
                className={cn(
                  "rounded-2xl p-4 sm:p-5 flex flex-col gap-3 transition-all relative border",
                  isNext && "bg-brand-green/15 border-brand-green shadow-[0_0_25px_-5px_#2d9a56] ring-1 ring-brand-green/30",
                  !isPast && !isNext && "bg-brand-dark/80 border-brand-border hover:border-brand-border/80 shadow-sm",
                  isPast && "bg-brand-dark/30 border-brand-border/40 opacity-70"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Calendar Date Box */}
                  <div className={cn(
                    "w-14 sm:w-16 h-14 sm:h-16 rounded-xl border flex flex-col items-center justify-center shrink-0 shadow-inner",
                    isNext ? "bg-brand-green/20 border-brand-green/50 text-brand-green" : "bg-brand-card border-slate-400/80 dark:border-brand-border"
                  )}>
                    <span className={cn("text-[10px] font-mono font-black leading-none", isNext ? "text-brand-green" : "text-text-secondary")}>{dayName}</span>
                    <span className="text-xl sm:text-2xl font-display font-black leading-none my-0.5 text-text-primary">{dayNum}</span>
                    <span className="text-[9px] font-mono font-bold text-text-secondary leading-none">{monthName}</span>
                  </div>

                  {/* Concert Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={cn(
                        "text-xs font-mono font-bold uppercase tracking-wider",
                        isNext ? "text-brand-green" : isPast ? "text-zinc-500" : "text-text-secondary"
                      )}>
                        {format(dateObj, 'd MMMM yyyy', { locale: it })}
                      </span>
                      {isNext && (
                        <span className="px-2.5 py-0.5 bg-brand-green text-black font-mono font-black text-[10px] uppercase tracking-wider rounded-full shadow-sm">
                          Prossimo Live
                        </span>
                      )}
                    </div>

                    <div className={cn(
                      "font-display font-bold text-base sm:text-lg text-text-primary break-words leading-tight",
                      isNext && "text-lg sm:text-xl font-extrabold"
                    )}>
                      {c.name}
                    </div>
                  </div>
                </div>

                {/* Address aligned with left margin */}
                {c.address && (
                  <div className="text-xs font-medium flex items-start gap-1.5 text-text-secondary pt-0.5 break-words">
                    <MapPin size={14} className={cn("mt-0.5 shrink-0", isNext ? "text-brand-green" : "text-zinc-500")}/> 
                    <span>{c.address}</span>
                  </div>
                )}

                {/* Inline Delete Confirmation or Footer Toolbar */}
                <AnimatePresence mode="wait">
                  {confirmDeleteId === c.id ? (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-2 border-t border-red-500/20 flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                        <AlertTriangle size={14} className="shrink-0" />
                        Eliminare questo concerto?
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1.5 min-h-[36px] bg-brand-card hover:bg-white/5 border border-brand-border rounded-lg text-xs font-bold text-text-secondary cursor-pointer"
                        >
                          Annulla
                        </button>
                        <button
                          disabled={deletingId === c.id}
                          onClick={() => handleDelete(c.id)}
                          className="px-3 py-1.5 min-h-[36px] bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          {deletingId === c.id ? 'Eliminazione...' : 'Elimina'}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setCalendarItem({
                          title: `🎤 Concerto: ${c.name}`,
                          date: c.date,
                          location: c.address || '',
                          description: 'Live della band'
                        })}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-zinc-400 hover:text-brand-green hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                        title="Aggiungi al calendario"
                        aria-label="Aggiungi al calendario"
                      >
                        <Calendar size={18} />
                      </button>

                      {!isPast && (
                        <button 
                          onClick={() => shareInfo(`🎤 Concerto: ${c.name}\n📅 ${format(dateObj, 'd MMMM yyyy', { locale: it })}\n📍 ${c.address || ''}`, 'wa')}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-zinc-400 hover:text-brand-green hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                          title="Condividi su WhatsApp"
                          aria-label="Condividi su WhatsApp"
                        >
                          <Share2 size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setConcertForm({ id: c.id, date: toLocalYYYYMMDD(c.date), name: c.name, address: c.address || '' });
                          setShowAddConcert(true);
                        }}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-zinc-400 hover:text-brand-green hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                        title="Modifica concerto"
                        aria-label="Modifica concerto"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(c.id)} 
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                        title="Elimina concerto"
                        aria-label="Elimina concerto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          };

          return (
            <div className="space-y-3">
              {/* Upcoming Concerts */}
              {upcoming.length > 0 ? (
                upcoming.map(c => renderConcertCard(c, false))
              ) : (
                <div className="text-center py-6 px-4 text-text-secondary text-[11px] border border-dashed border-brand-border rounded-2xl font-mono uppercase tracking-wider">
                  Nessun concerto in programma
                </div>
              )}

              {/* Past Concerts Collapsible Dropdown */}
              {past.length > 0 && (
                <div className="mt-5 border-t border-brand-border/40 pt-4">
                  <button
                    onClick={() => setShowPast(!showPast)}
                    className="w-full min-h-[44px] bg-brand-dark/40 hover:bg-brand-dark border border-brand-border/50 rounded-xl px-4 py-3 flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <span className="font-display font-extrabold uppercase tracking-widest text-xs text-text-secondary group-hover:text-text-primary flex items-center gap-2">
                      🎸 Concerti Passati ({past.length})
                    </span>
                    {showPast ? (
                      <ChevronUp size={16} className="text-text-secondary group-hover:text-text-primary" />
                    ) : (
                      <ChevronDown size={16} className="text-text-secondary group-hover:text-text-primary" />
                    )}
                  </button>

                  {showPast && (
                    <div className="space-y-3 mt-3 transition-all">
                      {past.map(c => renderConcertCard(c, true))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>
      {/* Calendar Export Modal */}
      <CalendarExportModal item={calendarItem} onClose={() => setCalendarItem(null)} />
    </section>
  );
};
