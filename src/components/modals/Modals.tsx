import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Music, MapPin, Trash2 } from 'lucide-react';
import { AppData, FutureRehearsal, Concert } from '../../types';

interface ModalsProps {
  data: AppData | null;
  showAddFuture: boolean;
  setShowAddFuture: (val: boolean) => void;
  showAddConcert: boolean;
  setShowAddConcert: (val: boolean) => void;
  showAddRoom: boolean;
  setShowAddRoom: (val: boolean) => void;
  showAddMember: boolean;
  setShowAddMember: (val: boolean) => void;
  futureForm: Partial<FutureRehearsal>;
  setFutureForm: (val: any) => void;
  concertForm: Partial<Concert>;
  setConcertForm: (val: any) => void;
  apiAction: (type: string, payload: any) => Promise<boolean>;
}

export const Modals: React.FC<ModalsProps> = ({
  data,
  showAddFuture,
  setShowAddFuture,
  showAddConcert,
  setShowAddConcert,
  showAddRoom,
  setShowAddRoom,
  showAddMember,
  setShowAddMember,
  futureForm,
  setFutureForm,
  concertForm,
  setConcertForm,
  apiAction
}) => {
  return (
    <AnimatePresence>
      {(showAddFuture || showAddConcert || showAddRoom || showAddMember) && (
         <div className="fixed inset-0 z-[120] bg-brand-dark/95 backdrop-blur-2xl p-4 flex items-center justify-center">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card w-full max-w-sm p-8 border-brand-green/20 relative">
              {showAddFuture && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-brand-green border-b border-brand-green/20 pb-4 flex items-center gap-3"><Calendar size={24}/> Aggiungi Sessione</h3>
                  <div className="space-y-4">
                    <input type="date" className="w-full bg-brand-dark border border-brand-border p-4 rounded-xl font-bold" value={futureForm.date} onChange={e => setFutureForm({...futureForm, date: e.target.value})} />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="time" className="w-full bg-brand-dark border border-brand-border p-4 rounded-xl font-bold" value={futureForm.from} onChange={e => setFutureForm({...futureForm, from: e.target.value})} />
                      <input type="time" className="w-full bg-brand-dark border border-brand-border p-4 rounded-xl font-bold" value={futureForm.to} onChange={e => setFutureForm({...futureForm, to: e.target.value})} />
                    </div>
                    <select className="w-full bg-brand-dark border border-brand-border p-4 rounded-xl font-bold" value={futureForm.room} onChange={e => setFutureForm({...futureForm, room: e.target.value})}>
                       <option value="">Seleziona Sede...</option>
                       {data?.customRooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <button onClick={async () => {
                      const success = await apiAction('add_future_rehearsal', { rehearsal: { id: 'fut_' + Date.now(), ...futureForm } });
                      if(success) setShowAddFuture(false);
                    }} className="w-full bg-brand-green text-black py-4 rounded-xl font-black uppercase tracking-[0.3em]">CONFERMA SESSIONE</button>
                  </div>
                </div>
              )}
              {showAddConcert && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-brand-green border-b border-brand-green/20 pb-4 flex items-center gap-3"><Music size={24}/> Nuovo Concerto</h3>
                  <div className="space-y-4">
                    <input type="date" className="w-full bg-brand-dark border border-brand-border p-4 rounded-xl font-bold" value={concertForm.date} onChange={e => setConcertForm({...concertForm, date: e.target.value})} />
                    <input type="text" className="w-full bg-brand-dark border border-brand-border p-4 rounded-xl font-bold" placeholder="NOME LOCALE (E.g. ALCATRAZ)" value={concertForm.name} onChange={e => setConcertForm({...concertForm, name: e.target.value})} />
                    <input type="text" className="w-full bg-brand-dark border border-brand-border p-4 rounded-xl font-bold" placeholder="INDIRIZZO COMPLETO" value={concertForm.address} onChange={e => setConcertForm({...concertForm, address: e.target.value})} />
                    <button onClick={async () => {
                      const success = await apiAction('add_concert', { concert: { id: 'conc_' + Date.now(), ...concertForm } });
                      if(success) setShowAddConcert(false);
                    }} className="w-full bg-brand-green text-black py-4 rounded-xl font-black uppercase tracking-[0.3em]">AGGIUNGI CONCERTO</button>
                  </div>
                </div>
              )}
              {showAddMember && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-brand-green border-b border-brand-green/20 pb-4">Membri Band</h3>
                  <div className="max-h-[160px] overflow-y-auto space-y-2 mb-4 scrollbar-hide">
                    {data?.members.map(m => (
                      <div key={m.name} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="font-bold flex items-center gap-3">
                           <div className="w-4 h-4 rounded-full ring-2 ring-white/10" style={{ backgroundColor: m.color }} />
                           {m.name}
                        </span>
                        <button onClick={() => { if(confirm('Eject member?')) apiAction('delete_member', { name: m.name }) }} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 pt-4 border-t border-brand-green/10">
                    <div className="flex gap-3">
                      <input type="text" id="mem-name" className="flex-1 bg-brand-dark border border-brand-border p-3 rounded-xl text-sm font-bold" placeholder="NOME MEMBRO" />
                      <input type="color" id="mem-color" className="w-12 h-12 rounded-xl bg-transparent border-brand-border p-0 overflow-hidden cursor-pointer" defaultValue="#2d9a56" />
                    </div>
                    <button onClick={async () => {
                      const name = (document.getElementById('mem-name') as HTMLInputElement).value;
                      const color = (document.getElementById('mem-color') as HTMLInputElement).value;
                      if (name) { await apiAction('add_member', { member: { name, color } }); (document.getElementById('mem-name') as HTMLInputElement).value = ''; }
                    }} className="w-full bg-white text-black py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px]">AGGIUNGI MEMBRO</button>
                  </div>
                </div>
              )}
              {showAddRoom && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-brand-green border-b border-brand-green/20 pb-4 flex items-center gap-3"><MapPin size={24}/> Gestione Sedi</h3>
                  <div className="max-h-[160px] overflow-y-auto space-y-2 mb-4 scrollbar-hide">
                    {data?.customRooms.map(r => (
                      <div key={r.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl text-xs font-bold border border-white/5">
                        {r.name}
                        <button onClick={() => { if(confirm('Elimina sede?')) apiAction('delete_room', { id: r.id }) }} className="text-red-500"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 pt-4 border-t border-brand-green/10">
                    <input type="text" id="room-name" className="w-full bg-brand-dark border border-brand-border p-3 rounded-xl text-sm font-bold" placeholder="NOME SEDE" />
                    <input type="text" id="room-addr" className="w-full bg-brand-dark border border-brand-border p-3 rounded-xl text-sm font-bold" placeholder="INDIRIZZO (GOOGLE MAPS)" />
                    <button onClick={async () => {
                      const name = (document.getElementById('room-name') as HTMLInputElement).value;
                      const add = (document.getElementById('room-addr') as HTMLInputElement).value;
                      if (name) { await apiAction('add_room', { room: { id: 'room_'+Date.now(), name, address: add } }); (document.getElementById('room-name') as HTMLInputElement).value = ''; (document.getElementById('room-addr') as HTMLInputElement).value = ''; }
                    }} className="w-full bg-white text-black py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px]">SALVA SEDE</button>
                  </div>
                </div>
              )}
              <button 
                onClick={() => { setShowAddFuture(false); setShowAddConcert(false); setShowAddRoom(false); setShowAddMember(false); }}
                className="w-full mt-6 py-3 rounded-xl text-[10px] font-black uppercase text-zinc-600 hover:text-white transition-colors"
              >
                CHIUDI
              </button>
            </motion.div>
         </div>
      )}
    </AnimatePresence>
  );
};
