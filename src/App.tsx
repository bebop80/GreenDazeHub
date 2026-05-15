import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Eye } from 'lucide-react';

import { useAppData } from './hooks/useAppData';
import { Rehearsal, FutureRehearsal, Concert } from './types';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NextSession } from './components/NextSession';
import { NotesSection } from './components/NotesSection';
import { UpcomingSessions } from './components/UpcomingSessions';
import { PaymentRegistration } from './components/PaymentRegistration';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ConcertsBlock } from './components/ConcertsBlock';
import { HistoryFeed } from './components/HistoryFeed';
import { Toast } from './components/Toast';

// Modals
import { SettingsModal } from './components/modals/SettingsModal';
import { NextSessionModal } from './components/modals/NextSessionModal';
import { Modals } from './components/modals/Modals';

const App = () => {
  const {
    data,
    loading,
    lastSync,
    toast,
    calcolaTurno,
    apiAction
  } = useAppData();

  const [showSettings, setShowSettings] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false);
  const [editingNext, setEditingNext] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [showAddFuture, setShowAddFuture] = useState(false);
  const [showAddConcert, setShowAddConcert] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  // Form States
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPayer, setSelectedPayer] = useState('');
  const [rehearsalForm, setRehearsalForm] = useState<Rehearsal>({ date: '', from: '', to: '', room: '', notes: '' });
  const [futureForm, setFutureForm] = useState<Partial<FutureRehearsal>>({ date: '', from: '', to: '', room: '' });
  const [concertForm, setConcertForm] = useState<Partial<Concert>>({ date: '', name: '', address: '' });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (data?.next) {
      setRehearsalForm({
        date: data.next.date?.substring(0, 10) || '',
        from: data.next.from || '',
        to: data.next.to || '',
        room: data.next.room || '',
        notes: data.next.notes || ''
      });
    }
  }, [data]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleSendPayment = async () => {
    if (!paymentDate || !selectedPayer) {
      // toast is handled inside apiAction or via useAppData if I expose showToast
      return;
    }

    let nextStep = Promise.resolve(true);
    
    if (data?.next?.date) {
      const payD = new Date(paymentDate); payD.setHours(0,0,0,0);
      const nextD = new Date(data.next.date); nextD.setHours(0,0,0,0);
      
      if (payD.getTime() === nextD.getTime()) {
        if (data.futureRehearsals.length > 0) {
          const sorted = [...data.futureRehearsals].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const toPromote = sorted[0];
          const newNext = {
            date: toPromote.date,
            from: toPromote.from || '',
            to: toPromote.to || '',
            room: toPromote.room || '',
            notes: ''
          };
          nextStep = apiAction('next_rehearsal', { next: newNext }).then(() => 
            apiAction('delete_future_rehearsal', { id: toPromote.id })
          );
        } else {
          nextStep = apiAction('clear_next_rehearsal', {});
        }
      }
    }

    await nextStep;
    const success = await apiAction('payment', { payment: { date: paymentDate, payer: selectedPayer } });
    if (success) {
      setIsPaymentExpanded(false);
    }
  };

  const shareInfo = (text: string, platform: 'wa' | 'tg') => {
    const url = platform === 'wa' 
      ? `https://wa.me/?text=${encodeURIComponent(text)}`
      : `https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const formatRehearsalForShare = (r: Rehearsal | FutureRehearsal) => {
    const sala = data?.customRooms.find(s => s.id === r.room);
    const dateStr = format(parseISO(r.date), 'EEEE d MMMM', { locale: it });
    let text = `🎸 PROSSIMA PROVA GREEN DAZE!\n\n📅 ${dateStr}\n`;
    if (r.from && r.to) text += `🕒 Dalle ${r.from} alle ${r.to}\n`;
    text += `📍 ${sala?.name || 'Da definire'}\n`;
    if (sala?.address) text += `🗺️ https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sala.address)}\n`;
    if (calcolaTurno) text += `💰 Tocca pagare a: ${calcolaTurno.name}`;
    return text;
  };

  if (loading && !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Eye size={64} className="text-brand-green" />
      </motion.div>
      <p className="font-display font-semibold text-lg tracking-wider animate-pulse uppercase">
        Sincronizzazione Dati...
      </p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8 pb-24 font-sans text-text-primary">
      <Header theme={theme} toggleTheme={toggleTheme} lastSync={lastSync} />

      <SettingsModal 
        showSettings={showSettings} 
        setShowSettings={setShowSettings} 
        data={data} 
        apiAction={apiAction} 
      />

      <NextSession 
        data={data} 
        calcolaTurno={calcolaTurno} 
        setEditingNext={setEditingNext} 
        shareInfo={shareInfo} 
        formatRehearsalForShare={formatRehearsalForShare} 
      />

      <NotesSection 
        data={data} 
        editingNotes={editingNotes} 
        setEditingNotes={setEditingNotes} 
        apiAction={apiAction} 
      />

      <UpcomingSessions 
        data={data} 
        setShowAddFuture={setShowAddFuture} 
        apiAction={apiAction} 
      />

      <PaymentRegistration 
        data={data}
        isPaymentExpanded={isPaymentExpanded}
        setIsPaymentExpanded={setIsPaymentExpanded}
        paymentDate={paymentDate}
        setPaymentDate={setPaymentDate}
        selectedPayer={selectedPayer}
        setSelectedPayer={setSelectedPayer}
        handleSendPayment={handleSendPayment}
        setShowAddMember={setShowAddMember}
      />

      <AnalyticsSection data={data} />

      <ConcertsBlock 
        data={data} 
        setShowAddConcert={setShowAddConcert} 
        apiAction={apiAction} 
        shareInfo={shareInfo} 
      />

      <HistoryFeed 
        data={data} 
        isHistoryExpanded={isHistoryExpanded} 
        setIsHistoryExpanded={setIsHistoryExpanded} 
        apiAction={apiAction} 
      />

      <Footer />

      <NextSessionModal 
        editingNext={editingNext} 
        setEditingNext={setEditingNext} 
        rehearsalForm={rehearsalForm} 
        setRehearsalForm={setRehearsalForm} 
        data={data} 
        setShowAddRoom={setShowAddRoom} 
        apiAction={apiAction} 
      />

      <Modals 
        data={data}
        showAddFuture={showAddFuture}
        setShowAddFuture={setShowAddFuture}
        showAddConcert={showAddConcert}
        setShowAddConcert={setShowAddConcert}
        showAddRoom={showAddRoom}
        setShowAddRoom={setShowAddRoom}
        showAddMember={showAddMember}
        setShowAddMember={setShowAddMember}
        futureForm={futureForm}
        setFutureForm={setFutureForm}
        concertForm={concertForm}
        setConcertForm={setConcertForm}
        apiAction={apiAction}
      />

      <Toast toast={toast} />
    </div>
  );
};

export default App;
