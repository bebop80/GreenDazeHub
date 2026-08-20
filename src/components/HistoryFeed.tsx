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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteLast = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await apiAction('delete_last', {});
      setShowConfirmDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="glass-card">
      <div 
        className="p-5 sm:p-6 min-h-[56px] flex items-center justify-between cursor-pointer group select-none"
        onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
      >
        <div className="flex items-center gap-3">
           <History size={18} className="text-brand-green" />
           <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Storico Pagamenti</h2>
        </div>
        <div className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary group-hover:text-text-primary">
          {isHistoryExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      
      <AnimatePresence>
        {isHistoryExpanded && (
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: 'auto' }} 
            exit={{ height: 0 }}
            className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-2 max-h-[340px] overflow-y-auto scrollbar-hide"
          >
            {data?.payments.slice().reverse().map((p, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5 border-b border-brand-border/40 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-lg">
                <span className="font-mono text-xs uppercase font-bold text-text-secondary">{format(safeParseLocal(p.date), 'dd MMM yyyy')}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs tracking-wider uppercase" style={{ color: p.payer === 'Spesa condivisa' ? '#2d9a56' : (data.members.find(m => m.name === p.payer)?.color || '#2d9a56') }}>{p.payer}</span>
                </div>
              </div>
            ))}
            {data?.payments.length === 0 && (
              <p className="text-center text-xs text-text-secondary uppercase py-4 font-mono">Nessun pagamento registrato</p>
            )}
            {data?.payments && data.payments.length > 0 && (
              <div className="pt-3">
                {showConfirmDelete ? (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-red-400 text-center">Confermi l'annullamento dell'ultimo pagamento registrato?</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowConfirmDelete(false)}
                        className="flex-1 min-h-[44px] bg-brand-dark border border-brand-border rounded-lg text-xs font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                      >
                        Annulla
                      </button>
                      <button 
                        disabled={isDeleting}
                        onClick={handleDeleteLast}
                        className="flex-1 min-h-[44px] bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {isDeleting ? 'Eliminazione...' : 'Sì, Elimina'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowConfirmDelete(true)}
                    className="w-full min-h-[44px] py-3 border border-red-500/20 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-red-500/5 hover:bg-red-500/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={15} />
                    Annulla Ultimo Pagamento
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
