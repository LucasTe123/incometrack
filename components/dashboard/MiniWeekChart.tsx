// Mini weekly chart for dashboard
// components/dashboard/MiniWeekChart.tsx

'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useEntryStore } from '@/store/entryStore';
import { buildWeeklyData } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '2px' }}>
          {payload[0]?.payload?.day}
        </p>
        <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9375rem' }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

export default function MiniWeekChart() {
  const { entries, isLoading } = useEntryStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const weekData = useMemo(() => buildWeeklyData(entries), [entries]);

  if (isLoading) {
    return (
      <div className="glass-card p-4">
        <div className="skeleton h-3 w-24 mb-4" />
        <div className="h-20 flex items-end gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 skeleton rounded" style={{ height: `${30 + Math.random() * 40}px` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.875rem' }}>
        Esta Semana
      </p>
      <div style={{ height: 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekData} barSize={20} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }} />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {weekData.map((entry) => (
                <Cell
                  key={entry.date}
                  fill={entry.date === today ? '#7C3AED' : 'rgba(124,58,237,0.25)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
