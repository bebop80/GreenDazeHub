import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Settings } from 'lucide-react';
import { AppData, Rehearsal } from '../../types';

interface NextSessionModalProps {
  editingNext: boolean;
  setEditingNext: (val: boolean) => void;
  rehearsalForm: Rehearsal;
  setRehearsalForm: (val: any) => void;
  data: AppData | null;
  setShowAddRoom: (val: boolean) => void;
  apiAction: (type: string, payload: any) => Promise<boolean>;
}

export const NextSessionModal: React.FC<NextSessionModalProps> = ({
  editingNext,
  setEditingNext,
  rehearsalForm,
  setRehearsalForm,
  data,
  setShowAddRoom,
  apiAction
}) => {
  const [isPending, setIsPending] = React.useState(false);

  if (!editingNext) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-brand-dark/95 backdrop-blur-xl p-4 overflow-y-auto">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-md mx-auto space-y-8 pt-16">
        <h3 className="text-4xl font-display font-black uppercase tracking-tighter glow-green italic border-l-4 border-brand-green pl-6">Dettagli Sessione</h3>
        
        <div className="space-y-6">
          <div className="glass-card p-6 border-zinc-800 space-y-6">
            <div>
              <label className="text-[10px] font-mono font-black text-text-secondary uppercase mb-2 flex items-center gap-2"><Calendar size={14} className="text-brand-green"/> Data Inizio</label>
              <input type="date" className="w-full bg-brand-dark border border-zinc-700 rounded-xl p-4 text-lg font-bold" value={rehearsalForm.date} onChange={e => setRehearsalForm({...rehearsalForm, date: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono font-black text-text-secondary uppercase mb-2 block">Inizio</label>
                <input type="time" className="w-full bg-brand-dark border border-zinc-700 rounded-xl p-4 font-bold" value={rehearsalForm.from} onChange={e => setRehearsalForm({...rehearsalForm, from: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-mono font-black text-text-secondary uppercase mb-2 block">Fine</label>
                <input type="time" className="w-full bg-brand-dark border border-zinc-700 rounded-xl p-4 font-bold" value={rehearsalForm.to} onChange={e => setRehearsalForm({...rehearsalForm, to: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono font-black text-text-secondary uppercase mb-2 flex items-center gap-2"><MapPin size={14} className="text-brand-green"/> Sede</label>
              <select 
                className="w-full bg-brand-dark border border-zinc-700 rounded-xl p-4 font-bold appearance-none"
                value={rehearsalForm.room}
                onChange={e => {
                  if (e.target.value === 'NEW_ROOM') setShowAddRoom(true);
                  else setRehearsalForm({...rehearsalForm, room: e.target.value});
                }}
              >
                <option value="">Seleziona Sede...</option>
                {data?.customRooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                <option value="NEW_ROOM" className="text-brand-green">+ INIZIALIZZA NUOVA SEDE...</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer bg-brand-dark border border-zinc-700 rounded-xl p-4 hover:border-brand-green/40 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-brand-green rounded cursor-pointer"
                  checked={!!rehearsalForm.sharedExpense} 
                  onChange={e => setRehearsalForm({...rehearsalForm, sharedExpense: e.target.checked})} 
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-primary">Spesa condivisa</span>
                  <span className="text-[10px] text-text-secondary">Se selezionato, appare "Spesa condivisa" nel turno di pagamento</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              disabled={isPending}
              onClick={async () => {
                if (isPending) return;
                setIsPending(true);
                try {
                  const cleanNotes = (rehearsalForm.notes || '').replace(/\[SPESA_CONDIVISA\]/g, '').trim();
                  const finalNotes = rehearsalForm.sharedExpense ? `${cleanNotes} [SPESA_CONDIVISA]`.trim() : cleanNotes;
                  const payload = {
                    ...rehearsalForm,
                    notes: finalNotes,
                    sharedExpense: !!rehearsalForm.sharedExpense
                  };
                  const success = await apiAction('next_rehearsal', { next: payload });
                  if(success) setEditingNext(false);
                } finally {
                  setIsPending(false);
                }
              }}
              className={`w-full py-5 rounded-2xl font-display font-black text-lg tracking-[0.4em] shadow-2xl transition-all flex items-center justify-center gap-2 ${
                isPending 
                  ? 'bg-brand-green/30 border border-brand-green/50 text-white cursor-not-allowed shadow-none' 
                  : 'bg-brand-green text-black shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  PUBBLICAZIONE...
                </>
              ) : (
                "PUBBLICA"
              )}
            </button>
            <div className="flex gap-3">
              <button 
                disabled={isPending}
                onClick={async () => {
                  if (isPending) return;
                  setIsPending(true);
                  try {
                    await apiAction('clear_next_rehearsal', {});
                    setEditingNext(false);
                  } finally {
                    setIsPending(false);
                  }
                }} 
                className="flex-1 bg-red-950/30 border border-red-500/50 text-red-500 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancella Dati
              </button>
              <button disabled={isPending} onClick={() => setEditingNext(false)} className="flex-1 bg-zinc-800 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed">Annulla</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
