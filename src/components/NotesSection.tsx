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
    <section className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-brand-green rounded-full" />
          <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Note 📝</h2>
        </div>
        <button 
          onClick={() => setEditingNotes(!editingNotes)} 
          className="text-brand-green hover:bg-brand-green/10 p-1.5 rounded-lg transition-colors"
        >
          <MessageSquare size={18} />
        </button>
      </div>
      
      {editingNotes ? (
        <div className="space-y-4">
          <textarea 
            className="w-full bg-brand-dark border border-brand-border rounded-xl p-4 font-mono text-sm focus:border-brand-green outline-none text-text-primary"
            rows={4}
            defaultValue={data?.next?.notes || ''}
            id="notes-textarea"
            placeholder="System intelligence notes..."
          />
          <div className="flex gap-2">
            <button 
              onClick={async () => {
                const val = (document.getElementById('notes-textarea') as HTMLTextAreaElement).value;
                const success = await apiAction('next_rehearsal', { next: { ...data?.next, notes: val } });
                if (success) setEditingNotes(false);
              }}
              className="flex-1 bg-brand-green py-2 rounded-lg font-bold uppercase text-[10px] tracking-widest text-black"
            >
              Sync Notes
            </button>
            <button onClick={() => setEditingNotes(false)} className="flex-1 bg-zinc-800 py-2 rounded-lg font-bold uppercase text-[10px] tracking-widest">Abort</button>
          </div>
        </div>
      ) : (
        <div className="bg-brand-dark border border-brand-border rounded-2xl p-6 italic relative">
          <div className="absolute top-0 right-0 p-3 opacity-5 italic font-mono text-9xl pointer-events-none">"</div>
          {data?.next?.notes ? (
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap relative z-10">{data.next.notes}</p>
          ) : (
            <p className="text-zinc-600 text-xs uppercase tracking-widest text-center py-4">Nessuna nota attiva</p>
          )}
        </div>
      )}
    </section>
  );
};
