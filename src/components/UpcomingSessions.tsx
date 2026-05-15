import React from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { AppData } from '../types';

interface UpcomingSessionsProps {
  data: AppData | null;
  setShowAddFuture: (val: boolean) => void;
  apiAction: (type: string, payload: any) => Promise<boolean>;
}

export const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ 
  data, 
  setShowAddFuture, 
  apiAction 
}) => {
  return (
    <section className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-brand-green rounded-full" />
          <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Prossime Prove</h2>
        </div>
        <button onClick={() => setShowAddFuture(true)} className="bg-brand-green p-2 rounded-lg text-black hover:scale-105 transition-transform shadow-lg shadow-brand-green/20">
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {data?.futureRehearsals.map(fr => (
          <motion.div 
             layout
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             key={fr.id} 
             className="bg-brand-dark border border-brand-border rounded-xl p-4 flex items-center justify-between group hover:border-brand-green/30 transition-colors"
          >
            <div>
              <div className="text-[10px] font-mono font-bold text-brand-green uppercase tracking-tighter mb-1">
                {format(parseISO(fr.date), 'dd MMMM yyyy', { locale: it })}
              </div>
              <div className="font-display font-bold text-sm tracking-wide">
                {data.customRooms.find(r => r.id === fr.room)?.name || 'UNSPECIFIED HUB'}
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => { if(confirm('Eliminare prova futura?')) apiAction('delete_future_rehearsal', { id: fr.id }) }} 
                className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
        {data?.futureRehearsals.length === 0 && (
          <div className="border-2 border-dashed border-zinc-800 rounded-2xl py-8 text-center">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">Nessuna prova futura</p>
          </div>
        )}
      </div>
    </section>
  );
};
