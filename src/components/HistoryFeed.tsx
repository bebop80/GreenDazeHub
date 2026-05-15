import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { History, ChevronUp, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { AppData } from '../types';

interface HistoryFeedProps {
  data: AppData | null;
  isHistoryExpanded: boolean;
  setIsHistoryExpanded: (val: boolean) => void;
  apiAction: (type: string, payload: any) => Promise<boolean>;
}

export const HistoryFeed: React.FC<HistoryFeedProps> = ({
  data,
  isHistoryExpanded,
  setIsHistoryExpanded,
  apiAction
}) => {
  return (
    <section className="glass-card">
      <div 
        className="p-6 flex items-center justify-between cursor-pointer group"
        onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
      >
        <div className="flex items-center gap-3">
           <History size={20} className="text-brand-green" />
           <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Storico Pagamenti</h2>
        </div>
        {isHistoryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      
      <AnimatePresence>
        {isHistoryExpanded && (
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: 'auto' }} 
            exit={{ height: 0 }}
            className="px-6 pb-6 space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide"
          >
            {data?.payments.slice().reverse().map((p, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-brand-border/50 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-lg">
                <span className="font-mono text-[10px] uppercase font-bold text-text-secondary">{format(parseISO(p.date), 'dd MMM yyyy')}</span>
                <span className="font-black text-xs tracking-widest uppercase" style={{ color: data.members.find(m => m.name === p.payer)?.color }}>{p.payer}</span>
              </div>
            ))}
            <div className="pt-4">
              <button 
                onClick={() => {
                  if (confirm('Annullare ultimo pagamento?')) apiAction('delete_last', {});
                }}
                className="w-full py-3 border border-red-500/30 hover:border-red-500 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-red-500/5 hover:bg-red-500/10"
              >
                Rollback Last Transmission
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
