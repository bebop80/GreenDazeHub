import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AppData } from '../types';

interface AnalyticsSectionProps {
  data: AppData | null;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ data }) => {
  const totalPayments = data?.payments.length || 0;
  const chartData = data?.members.map(m => ({
    name: m.name,
    count: data.payments.filter(p => p.payer === m.name).length,
    color: m.color
  })) || [];

  const maxCount = Math.max(...chartData.map(d => d.count), 0);
  const dynamicHeight = Math.max(90, chartData.length * 26 + 15);

  return (
    <section className="glass-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-brand-green rounded-full shadow-[0_0_10px_#2d9a56]" />
          <h2 className="font-display font-bold uppercase tracking-widest text-xs text-text-secondary">Statistiche Spese</h2>
        </div>
        <span className="text-[11px] font-mono text-text-secondary/70">
          {totalPayments} {totalPayments === 1 ? 'totale' : 'totali'}
        </span>
      </div>
      <div className="w-full font-mono" style={{ height: `${dynamicHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical" 
            data={chartData} 
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-brand-border)" strokeOpacity={0.5} />
            <XAxis 
              type="number"
              allowDecimals={false}
              domain={[0, maxCount > 0 ? maxCount + 1 : 5]}
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} 
            />
            <YAxis 
              type="category"
              dataKey="name"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-primary)', fontSize: 11, fontWeight: 700 }} 
              width={75}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.06)' }}
              contentStyle={{ backgroundColor: 'var(--color-brand-card)', border: '1px solid var(--color-brand-border)', borderRadius: '12px', color: 'var(--text-primary)' }}
              formatter={(value: any) => [`${value} ${value === 1 ? 'pagamento' : 'pagamenti'}`, 'Totale']}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={10}>
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
