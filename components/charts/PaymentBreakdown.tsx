// Payment breakdown donut chart
// components/charts/PaymentBreakdown.tsx

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import { IncomeEntry } from '@/types';
import { useMemo } from 'react';

interface Props {
  entries: IncomeEntry[];
}

const COLORS = ['#10B981', '#60A5FA', '#A78BFA'];
const LABELS = ['Cash', 'Card', 'QR'];

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p style={{ color: payload[0].payload.fill, fontWeight: 600, fontSize: '0.875rem' }}>
          {payload[0].name}
        </p>
        <p style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

export default function PaymentBreakdown({ entries }: Props) {
  const data = useMemo(() => {
    const cash = entries.reduce((s, e) => s + e.cash, 0);
    const card = entries.reduce((s, e) => s + e.card, 0);
    const qr = entries.reduce((s, e) => s + e.qr, 0);
    return [
      { name: 'Cash', value: cash },
      { name: 'Card', value: card },
      { name: 'QR', value: qr },
    ].filter((d) => d.value > 0);
  }, [entries]);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) return null;

  return (
    <div className="flex items-center gap-4">
      <div style={{ width: 120, height: 120, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={54}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                {formatCurrency(item.value, 'USD', true)}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
