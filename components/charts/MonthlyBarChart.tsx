// Monthly bar chart for analytics
// components/charts/MonthlyBarChart.tsx

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import { MonthBar } from '@/types';

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip" style={{ minWidth: 140 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '6px', fontWeight: 600 }}>
          {label}
        </p>
        {payload.map((item: any) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-3">
            <span style={{ color: item.fill, fontSize: '0.75rem', textTransform: 'capitalize' }}>
              {item.dataKey}
            </span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.8125rem' }}>
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '6px', paddingTop: '6px' }}>
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Total</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.875rem' }}>
              {formatCurrency(payload.reduce((s: number, p: any) => s + p.value, 0))}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

interface Props {
  data: MonthBar[];
  highlightMonth?: string;
}

export default function MonthlyBarChart({ data, highlightMonth }: Props) {
  return (
    <div style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={14} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="url(#barGradient)" fillOpacity={0.9} />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
