import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { History, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { AppData } from '../types';
import { safeParseLocal } from '../lib/utils';

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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteLast = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await apiAction('delete_last', {});
    } finally {
      setIsDeleting(false);
    }
  };

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
                <span className="font-mono text-[10px] uppercase font-bold text-text-secondary">{format(safeParseLocal(p.date), 'dd MMM yyyy')}</span>
                <div className="flex items-center gap-3">
                  <span className="font-black text-xs tracking-widest uppercase" style={{ color: data.members.find(m => m.name === p.payer)?.color }}>{p.payer}</span>
                  {idx === 0 && (
                    <button 
                      disabled={isDeleting}
                      onClick={handleDeleteLast}
                      className="text-red-500 hover:scale-110 p-1.5 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-50"
                      title="Annulla/Elimina questo ultimo pagamento"
                    >
                      {isDeleting ? (
                        <svg className="animate-spin h-3.5 w-3.5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {data?.payments.length === 0 && (
              <p className="text-center text-[10px] text-text-secondary uppercase py-4">Nessun pagamento registrato</p>
            )}
            {data?.payments && data.payments.length > 0 && (
              <div className="pt-4">
                <button 
                  disabled={isDeleting}
                  onClick={handleDeleteLast}
                  className="w-full py-3 border border-red-500/30 hover:border-red-500 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-red-500/5 hover:bg-red-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Annullamento in corso...
                    </>
                  ) : (
                    "Annulla Ultimo Pagamento"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
