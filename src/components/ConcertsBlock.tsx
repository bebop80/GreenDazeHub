import React from 'react';
import { Share2, Trash2, MapPin, Plus, Pencil, ChevronDown, ChevronUp, Calendar, X } from 'lucide-react';
import { format, isFuture, isToday } from 'date-fns';
import { AppData } from '../types';
import { cn, safeParseLocal, toLocalYYYYMMDD } from '../lib/utils';

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
  const [showPast, setShowPast] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [selectedCalendarConcert, setSelectedCalendarConcert] = React.useState<any | null>(null);

  const createGoogleCalendarUrl = (c: any) => {
    if (!c) return '#';
    const dateObj = safeParseLocal(c.date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    const startStr = `${year}${month}${day}T210000`;
    const endStr = `${year}${month}${day}T230000`;

    const title = encodeURIComponent(`🎤 Concerto: ${c.name}`);
    const details = encodeURIComponent(`Live della band`);
    const location = encodeURIComponent(c.address || '');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startStr}/${endStr}`;
  };

  const createIcsDataUrl = (c: any) => {
    if (!c) return '';
    const dateObj = safeParseLocal(c.date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    const startStr = `${year}${month}${day}T210000`;
    const endStr = `${year}${month}${day}T230000`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BandApp//ConcertCalendar//IT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:🎤 Concerto: ${c.name}`,
      `LOCATION:${c.address || ''}`,
      'DESCRIPTION:Concerto live',
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
  };

  return (
    <section className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-brand-green rounded-full" />
          <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Concerti</h2>
        </div>
        <button 
          onClick={() => {
            setConcertForm({ id: '', date: '', name: '', address: '' });
            setShowAddConcert(true);
          }} 
          className="bg-zinc-800 p-2 rounded-lg hover:text-brand-green transition-colors"
        >
          <Plus size={16} />
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
            
            return (
              <div 
                key={c.id} 
                className={cn(
                  "border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all relative",
                  isNext && "bg-brand-green/20 border-brand-green shadow-[0_0_35px_-5px_#2d9a56] ring-2 ring-brand-green/30 border-l-8 border-l-brand-green scale-[1.01] sm:scale-[1.02]",
                  !isPast && !isNext && "bg-brand-green/10 border-brand-green/40 shadow-[0_0_15px_-5px_#2d9a56]",
                  isPast && "bg-brand-dark/30 border-brand-border opacity-70 grayscale-[0.3]"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between sm:justify-start gap-2 mb-1.5 flex-wrap">
                    <span className={cn(
                      "text-[12px] font-mono font-bold uppercase tracking-widest",
                      isPast ? "text-zinc-500" : "text-brand-green"
                    )}>
                      {format(dateObj, 'dd MMM yyyy')}
                    </span>
                    {isNext && (
                      <span className="px-2.5 py-0.5 bg-brand-green text-black font-mono font-bold text-[10px] uppercase tracking-wider rounded-full shadow-sm">
                        Prossimo Live
                      </span>
                    )}
                  </div>

                  <div className={cn(
                    "font-display font-extrabold text-lg text-text-primary break-words",
                    isNext && "text-xl text-white font-black"
                  )}>
                    {c.name}
                  </div>

                  {c.address && (
                    <div className="text-xs font-medium flex items-start sm:items-center gap-1.5 text-text-secondary mt-1.5 break-words">
                      <MapPin size={13} className={cn("mt-0.5 sm:mt-0 shrink-0", isPast ? "text-zinc-500" : "text-brand-green")}/> 
                      <span>{c.address}</span>
                    </div>
                  )}
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center justify-end gap-1 pt-2.5 sm:pt-0 border-t border-brand-border/30 sm:border-0 shrink-0 relative">
                  {/* Calendar Export Button */}
                  <button
                    onClick={() => setSelectedCalendarConcert(c)}
                    className="p-2.5 sm:p-3 text-zinc-400 hover:text-brand-green hover:bg-brand-green/10 rounded-xl transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                    title="Aggiungi al calendario"
                  >
                    <Calendar size={18} />
                  </button>

                  {!isPast && (
                    <button 
                      onClick={() => shareInfo(`🎤 Concerto: ${c.name}\n📅 ${format(dateObj, 'd MMMM yyyy')}\n📍 ${c.address}`, 'wa')}
                      className="p-2.5 sm:p-3 text-zinc-400 hover:bg-brand-green hover:text-black rounded-xl transition-all"
                      title="Condividi su WhatsApp"
                    >
                      <Share2 size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setConcertForm({ id: c.id, date: toLocalYYYYMMDD(c.date), name: c.name, address: c.address || '' });
                      setShowAddConcert(true);
                    }}
                    className="p-2.5 sm:p-3 text-zinc-400 hover:text-brand-green hover:bg-brand-green/10 rounded-xl transition-all"
                    title="Modifica concerto"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    disabled={deletingId === c.id}
                    onClick={async () => {
                      setDeletingId(c.id);
                      try {
                        await apiAction('delete_concert', { id: c.id });
                      } finally {
                        setDeletingId(null);
                      }
                    }} 
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50"
                    title="Elimina concerto"
                  >
                    {deletingId === c.id ? (
                      <svg className="animate-spin h-4.5 w-4.5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            );
          };

          return (
            <div className="space-y-4">
              {/* Upcoming Concerts */}
              {upcoming.length > 0 ? (
                upcoming.map(c => renderConcertCard(c, false))
              ) : (
                <div className="text-center py-6 text-text-secondary text-sm border border-dashed border-brand-border rounded-2xl font-medium">
                  Nessun concerto in programma
                </div>
              )}

              {/* Past Concerts Collapsible Dropdown */}
              {past.length > 0 && (
                <div className="mt-6 border-t border-brand-border/30 pt-6">
                  <button
                    onClick={() => setShowPast(!showPast)}
                    className="w-full bg-zinc-800/40 hover:bg-zinc-800/80 border border-brand-border/30 rounded-2xl px-5 py-4 flex items-center justify-between transition-all group"
                  >
                    <span className="font-display font-extrabold uppercase tracking-widest text-xs text-text-secondary group-hover:text-brand-green flex items-center gap-2">
                      🎸 Concerti Passati ({past.length})
                    </span>
                    {showPast ? (
                      <ChevronUp size={16} className="text-zinc-400 group-hover:text-brand-green" />
                    ) : (
                      <ChevronDown size={16} className="text-zinc-400 group-hover:text-brand-green" />
                    )}
                  </button>

                  {showPast && (
                    <div className="space-y-4 mt-4 transition-all">
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
      {selectedCalendarConcert && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedCalendarConcert(null)}
        >
          <div 
            style={{ backgroundColor: '#18181b', color: '#ffffff' }}
            className="border border-brand-green/50 rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4 text-left relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-700/60">
              <div className="flex items-center gap-2 text-brand-green font-bold text-base">
                <Calendar size={20} />
                <span>Aggiungi al Calendario</span>
              </div>
              <button 
                onClick={() => setSelectedCalendarConcert(null)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Chiudi"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-zinc-300 bg-[#111113] p-3 rounded-xl border border-zinc-800">
              <div className="font-bold text-white text-sm">{selectedCalendarConcert.name}</div>
              <div className="text-brand-green font-mono text-xs mt-0.5 font-bold">
                {format(safeParseLocal(selectedCalendarConcert.date), 'dd MMMM yyyy')}
              </div>
              {selectedCalendarConcert.address && (
                <div className="text-zinc-400 text-xs mt-1 flex items-center gap-1.5 break-words">
                  <MapPin size={12} className="shrink-0 text-brand-green" />
                  <span>{selectedCalendarConcert.address}</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5 pt-1">
              <a
                href={createGoogleCalendarUrl(selectedCalendarConcert)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedCalendarConcert(null)}
                className="flex items-center gap-3 p-3.5 bg-[#222226] hover:bg-brand-green/20 border border-zinc-700 hover:border-brand-green/60 rounded-xl text-white font-medium text-sm transition-all group cursor-pointer"
              >
                <span className="text-2xl">📅</span>
                <div className="flex flex-col">
                  <span className="font-semibold text-white group-hover:text-brand-green transition-colors">Google Calendar</span>
                  <span className="text-[11px] text-zinc-400">Apri web o app Google Calendar</span>
                </div>
              </a>

              <a
                href={createIcsDataUrl(selectedCalendarConcert)}
                download={`${(selectedCalendarConcert.name || 'concerto').replace(/[^a-zA-Z0-9]/g, '_')}.ics`}
                onClick={() => setSelectedCalendarConcert(null)}
                className="w-full flex items-center gap-3 p-3.5 bg-[#222226] hover:bg-brand-green/20 border border-zinc-700 hover:border-brand-green/60 rounded-xl text-white font-medium text-sm transition-all group text-left cursor-pointer"
              >
                <span className="text-2xl">🍏</span>
                <div className="flex flex-col">
                  <span className="font-semibold text-white group-hover:text-brand-green transition-colors">Apple / Calendario Nativo (.ics)</span>
                  <span className="text-[11px] text-zinc-400">Scarica ed apri nell'app calendario</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
