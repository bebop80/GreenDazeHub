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
  const [isPending, setIsPending] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  return (
    <AnimatePresence>
      {(showAddFuture || showAddConcert || showAddRoom || showAddMember) && (
         <div className="fixed inset-0 z-[120] bg-brand-dark/95 backdrop-blur-2xl p-4 flex items-center justify-center">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card w-full max-w-sm p-8 border-brand-green/20 relative">
              {showAddFuture && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-brand-green border-b border-brand-green/20 pb-4 flex items-center gap-3">
                    <Calendar size={24}/> {futureForm.id ? "Modifica Sessione" : "Aggiungi Sessione"}
                  </h3>
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

                    <div>
                      <label className="flex items-center gap-3 cursor-pointer bg-brand-dark border border-brand-border p-4 rounded-xl hover:border-brand-green/40 transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 accent-brand-green rounded cursor-pointer"
                          checked={!!futureForm.sharedExpense} 
                          onChange={e => setFutureForm({...futureForm, sharedExpense: e.target.checked})} 
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-text-primary">Spesa condivisa</span>
                          <span className="text-[10px] text-text-secondary">Segnala che la spesa della sessione sarà condivisa</span>
                        </div>
                      </label>
                    </div>

                    <button 
                      disabled={isPending}
                      onClick={async () => {
                        if (isPending) return;
                        setIsPending(true);
                        try {
                          let success = false;
                          const isShared = !!futureForm.sharedExpense;
                          const cleanNotes = (futureForm.notes || '').replace(/\[SPESA_CONDIVISA\]/g, '').trim();
                          const finalNotes = isShared ? `${cleanNotes} [SPESA_CONDIVISA]`.trim() : cleanNotes;
                          const payloadFuture = {
                            ...futureForm,
                            notes: finalNotes,
                            sharedExpense: isShared
                          };

                          if (futureForm.id) {
                            const delSuccess = await apiAction('delete_future_rehearsal', { id: futureForm.id });
                            if (delSuccess) {
                              success = await apiAction('add_future_rehearsal', { rehearsal: payloadFuture });
                            }
                          } else {
                            success = await apiAction('add_future_rehearsal', { rehearsal: { id: 'fut_' + Date.now(), ...payloadFuture } });
                          }
                          if (success) setShowAddFuture(false);
                        } finally {
                          setIsPending(false);
                        }
                      }} 
                      className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all ${
                        isPending ? 'bg-brand-green/30 border border-brand-green/50 text-white cursor-not-allowed' : 'bg-brand-green text-black'
                      }`}
                    >
                      {isPending ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Conferma in corso...
                        </>
                      ) : (
                        futureForm.id ? "SALVA MODIFICHE" : "CONFERMA SESSIONE"
                      )}
                    </button>
                  </div>
                </div>
              )}
              {showAddConcert && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-brand-green border-b border-brand-green/20 pb-4 flex items-center gap-3">
                    <Music size={24}/> {concertForm.id ? "Modifica Concerto" : "Nuovo Concerto"}
                  </h3>
                  <div className="space-y-4">
                    <input type="date" className="w-full bg-brand-dark border border-brand-border p-4 rounded-xl font-bold" value={concertForm.date} onChange={e => setConcertForm({...concertForm, date: e.target.value})} />
                    <input type="text" className="w-full bg-brand-dark border border-brand-border p-4 rounded-xl font-bold" placeholder="NOME LOCALE (E.g. ALCATRAZ)" value={concertForm.name} onChange={e => setConcertForm({...concertForm, name: e.target.value})} />
                    <input type="text" className="w-full bg-brand-dark border border-brand-border p-4 rounded-xl font-bold" placeholder="INDIRIZZO COMPLETO" value={concertForm.address} onChange={e => setConcertForm({...concertForm, address: e.target.value})} />
                    <button 
                      disabled={isPending}
                      onClick={async () => {
                        if (isPending) return;
                        setIsPending(true);
                        try {
                          let success = false;
                          if (concertForm.id) {
                            // Delete existing and re-add updated
                            const deleteSuccess = await apiAction('delete_concert', { id: concertForm.id });
                            if (deleteSuccess) {
                              success = await apiAction('add_concert', { concert: concertForm });
                            }
                          } else {
                            success = await apiAction('add_concert', { concert: { id: 'conc_' + Date.now(), ...concertForm } });
                          }
                          if (success) setShowAddConcert(false);
                        } finally {
                          setIsPending(false);
                        }
                      }} 
                      className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all ${
                        isPending ? 'bg-brand-green/30 border border-brand-green/50 text-white cursor-not-allowed' : 'bg-brand-green text-black'
                      }`}
                    >
                      {isPending ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvataggio...
                        </>
                      ) : (
                        concertForm.id ? "SALVA MODIFICHE" : "AGGIUNGI CONCERTO"
                      )}
                    </button>
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
                        <button 
                          disabled={deletingId === m.name}
                          onClick={async () => {
                            setDeletingId(m.name);
                            try {
                              await apiAction('delete_member', { name: m.name });
                            } finally {
                              setDeletingId(null);
                            }
                          }} 
                          className="text-red-500 hover:scale-110 p-1.5 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-50"
                          title="Elimina membro"
                        >
                          {deletingId === m.name ? (
                            <svg className="animate-spin h-3.5 w-3.5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <Trash2 size={14}/>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 pt-4 border-t border-brand-green/10">
                    <div className="flex gap-3">
                      <input type="text" id="mem-name" className="flex-1 bg-brand-dark border border-brand-border p-3 rounded-xl text-sm font-bold" placeholder="NOME MEMBRO" />
                      <input type="color" id="mem-color" className="w-12 h-12 rounded-xl bg-transparent border-brand-border p-0 overflow-hidden cursor-pointer" defaultValue="#2d9a56" />
                    </div>
                    <button 
                      disabled={isPending}
                      onClick={async () => {
                        if (isPending) return;
                        const nameEl = document.getElementById('mem-name') as HTMLInputElement;
                        const colorEl = document.getElementById('mem-color') as HTMLInputElement;
                        const name = nameEl?.value;
                        const color = colorEl?.value;
                        if (name) {
                          setIsPending(true);
                          try {
                            await apiAction('add_member', { member: { name, color } });
                            if (nameEl) nameEl.value = '';
                          } finally {
                            setIsPending(false);
                          }
                        }
                      }} 
                      className={`w-full text-black py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all ${
                        isPending ? 'bg-white/50 cursor-not-allowed opacity-80' : 'bg-white'
                      }`}
                    >
                      {isPending ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Aggiunta...
                        </>
                      ) : (
                        "AGGIUNGI MEMBRO"
                      )}
                    </button>
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
                        <button 
                          disabled={deletingId === r.id}
                          onClick={async () => {
                            setDeletingId(r.id);
                            try {
                              await apiAction('delete_room', { id: r.id });
                            } finally {
                              setDeletingId(null);
                            }
                          }} 
                          className="text-red-500 hover:scale-110 p-1.5 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-50"
                          title="Elimina sede"
                        >
                          {deletingId === r.id ? (
                            <svg className="animate-spin h-3.5 w-3.5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <Trash2 size={14}/>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 pt-4 border-t border-brand-green/10">
                    <input type="text" id="room-name" className="w-full bg-brand-dark border border-brand-border p-3 rounded-xl text-sm font-bold" placeholder="NOME SEDE" />
                    <input type="text" id="room-addr" className="w-full bg-brand-dark border border-brand-border p-3 rounded-xl text-sm font-bold" placeholder="INDIRIZZO (GOOGLE MAPS)" />
                    <button 
                      disabled={isPending}
                      onClick={async () => {
                        if (isPending) return;
                        const nameEl = document.getElementById('room-name') as HTMLInputElement;
                        const addrEl = document.getElementById('room-addr') as HTMLInputElement;
                        const name = nameEl?.value;
                        const add = addrEl?.value;
                        if (name) {
                          setIsPending(true);
                          try {
                            await apiAction('add_room', { room: { id: 'room_'+Date.now(), name, address: add } });
                            if (nameEl) nameEl.value = '';
                            if (addrEl) addrEl.value = '';
                          } finally {
                            setIsPending(false);
                          }
                        }
                      }} 
                      className={`w-full text-black py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all ${
                        isPending ? 'bg-white/50 cursor-not-allowed opacity-80' : 'bg-white'
                      }`}
                    >
                      {isPending ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvataggio...
                        </>
                      ) : (
                        "SALVA SEDE"
                      )}
                    </button>
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
