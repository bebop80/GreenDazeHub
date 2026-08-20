import React from 'react';
import { MessageSquare } from 'lucide-react';
import { AppData } from '../types';

interface NotesSectionProps {
  data: AppData | null;
  editingNotes: boolean;
  setEditingNotes: (val: boolean) => void;
  apiAction: (type: string, payload: any) => Promise<boolean>;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ 
  data, 
  editingNotes, 
  setEditingNotes, 
  apiAction 
}) => {
  return (
    <section className="glass-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-brand-green rounded-full shadow-[0_0_10px_#2d9a56]" />
          <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Note della Band 📝</h2>
        </div>
        <button 
          onClick={() => setEditingNotes(!editingNotes)} 
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-brand-green hover:bg-brand-green/10 p-2 rounded-xl transition-colors cursor-pointer"
          title="Modifica note"
          aria-label="Modifica note della band"
        >
          <MessageSquare size={18} />
        </button>
      </div>
      
      {editingNotes ? (
        <div className="space-y-4">
          <textarea 
            className="w-full bg-brand-dark border border-brand-border rounded-xl p-4 font-sans text-sm focus:border-brand-green outline-none text-text-primary resize-y min-h-[100px]"
            rows={4}
            defaultValue={data?.next?.notes || ''}
            id="notes-textarea"
            placeholder="Scrivi qui note importanti, scaletta o promemoria per la band..."
          />
          <div className="flex gap-2">
            <button 
              onClick={async () => {
                const val = (document.getElementById('notes-textarea') as HTMLTextAreaElement).value;
                const success = await apiAction('next_rehearsal', { next: { ...data?.next, notes: val } });
                if (success) setEditingNotes(false);
              }}
              className="flex-1 min-h-[44px] bg-brand-green hover:bg-brand-green/90 py-3 rounded-xl font-bold uppercase text-xs tracking-wider text-black transition-colors cursor-pointer shadow-sm"
            >
              Salva Note
            </button>
            <button 
              onClick={() => setEditingNotes(false)} 
              className="flex-1 min-h-[44px] bg-brand-dark hover:bg-white/5 border border-brand-border py-3 rounded-xl font-bold uppercase text-xs tracking-wider text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              Annulla
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-brand-dark/80 border border-brand-border rounded-2xl p-5 italic relative">
          <div className="absolute top-0 right-0 p-3 opacity-5 italic font-mono text-9xl pointer-events-none">"</div>
          {data?.next?.notes ? (
            <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap relative z-10 font-medium not-italic">{data.next.notes}</p>
          ) : (
            <p className="text-text-secondary opacity-70 text-xs uppercase tracking-widest text-center py-3 font-mono">Nessuna nota attiva</p>
          )}
        </div>
      )}
    </section>
  );
};
