import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import { AppData } from '../types';
import { cn } from '../lib/utils';

interface PaymentRegistrationProps {
  data: AppData | null;
  isPaymentExpanded: boolean;
  setIsPaymentExpanded: (val: boolean) => void;
  paymentDate: string;
  setPaymentDate: (val: string) => void;
  selectedPayer: string;
  setSelectedPayer: (val: string) => void;
  handleSendPayment: () => Promise<void> | void;
  setShowAddMember: (val: boolean) => void;
}

export const PaymentRegistration: React.FC<PaymentRegistrationProps> = ({
  data,
  isPaymentExpanded,
  setIsPaymentExpanded,
  paymentDate,
  setPaymentDate,
  selectedPayer,
  setSelectedPayer,
  handleSendPayment,
  setShowAddMember
}) => {
  const [isPending, setIsPending] = useState(false);

  const onAuthorize = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await handleSendPayment();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section className="glass-card border-brand-green/10">
      <div 
        className={cn(
          "p-6 flex items-center justify-between cursor-pointer group transition-colors",
          isPaymentExpanded ? "bg-brand-green/5" : ""
        )}
        onClick={() => setIsPaymentExpanded(!isPaymentExpanded)}
      >
        <div className="flex items-center gap-3">
          <TrendingUp size={20} className="text-brand-green" />
           <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary group-hover:text-white transition-colors">Registra Pagamento</h2>
        </div>
        {isPaymentExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      
      <AnimatePresence>
        {isPaymentExpanded && (
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: 'auto' }} 
            exit={{ height: 0 }}
            className="px-6 pb-6 space-y-6 overflow-hidden"
          >
            <div className="pt-4 space-y-5">
              <div>
                <label className="text-[10px] font-mono font-bold text-text-secondary uppercase block mb-1.5 tracking-widest">Data Transazione</label>
                <input 
                  type="date" 
                  className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 focus:border-brand-green outline-none"
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold text-text-secondary uppercase block mb-1.5 tracking-widest">Membro Pagante</label>
                <select 
                  className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 appearance-none focus:border-brand-green outline-none"
                  value={selectedPayer}
                  onChange={e => {
                    if (e.target.value === 'ADD_MEMBER') setShowAddMember(true);
                    else setSelectedPayer(e.target.value);
                  }}
                >
                  <option value="">Seleziona Membro...</option>
                  {data?.members.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  <option value="ADD_MEMBER" className="text-brand-green font-bold">➕ AGGIUNGI/MODIFICA MEMBRI...</option>
                </select>
              </div>
              <button 
                disabled={isPending}
                onClick={onAuthorize}
                className={cn(
                  "w-full py-4 rounded-xl font-display font-black uppercase text-xs tracking-[0.2em] shadow-[0_10px_20px_-10px_#2d9a56] flex items-center justify-center gap-2 transition-all",
                  isPending 
                    ? "bg-brand-green/50 text-black/50 cursor-not-allowed opacity-80" 
                    : "bg-brand-green text-black"
                )}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Autorizzazione in corso...
                  </>
                ) : (
                  "Autorizza Pagamento"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
