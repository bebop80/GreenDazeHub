import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AppData } from '../types';

interface AnalyticsSectionProps {
  data: AppData | null;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ data }) => {
  const chartData = data?.members.map(m => ({
    name: m.name,
    count: data.payments.filter(p => p.payer === m.name).length,
    color: m.color
  })) || [];

  return (
    <section className="glass-card p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-1.5 h-5 bg-brand-green rounded-full shadow-[0_0_10px_#2d9a56]" />
        <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Statistiche Spese</h2>
      </div>
      <div className="h-[220px] w-full font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#555', fontSize: 10, fontWeight: 700 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#555', fontSize: 10 }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '12px' }}
            />
            <Bar dataKey="count" radius={[12, 12, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
