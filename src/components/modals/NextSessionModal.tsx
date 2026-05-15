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
          </div>

          <div className="space-y-3">
            <button 
              onClick={async () => {
               const success = await apiAction('next_rehearsal', { next: rehearsalForm });
               if(success) setEditingNext(false);
              }}
              className="w-full bg-brand-green text-black py-5 rounded-2xl font-display font-black text-lg tracking-[0.4em] shadow-2xl shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              PUBBLICA
            </button>
            <div className="flex gap-3">
              <button onClick={() => { apiAction('clear_next_rehearsal', {}); setEditingNext(false); }} className="flex-1 bg-red-950/30 border border-red-500/50 text-red-500 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest">Cancella Dati</button>
              <button onClick={() => setEditingNext(false)} className="flex-1 bg-zinc-800 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest text-text-secondary">Annulla</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
