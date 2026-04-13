// Analytics page
// app/(app)/analytics/page.tsx

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { TrendingUp, Star, Award } from 'lucide-react';
import { useEntryStore } from '@/store/entryStore';
import {
  buildWeeklyData,
  buildMonthlyData,
  findBestDayAndMonth,
  calculateTotals,
} from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/formatters';
import { format, parseISO } from 'date-fns';

// Lazy load charts
const WeeklyBarChart = dynamic(() => import('@/components/charts/WeeklyBarChart'), {
  loading: () => <div className="skeleton h-56 w-full rounded-2xl" />,
  ssr: false,
});

const MonthlyBarChart = dynamic(() => import('@/components/charts/MonthlyBarChart'), {
  loading: () => <div className="skeleton h-48 w-full rounded-2xl" />,
  ssr: false,
});

const PaymentBreakdown = dynamic(() => import('@/components/charts/PaymentBreakdown'), {
  ssr: false,
});

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.0625rem', letterSpacing: '-0.01em' }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '2px' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const { entries, isLoading } = useEntryStore();

  const weeklyData = useMemo(() => buildWeeklyData(entries), [entries]);
  const monthlyData = useMemo(() => buildMonthlyData(entries), [entries]);
  const { bestDay, bestMonth } = useMemo(() => findBestDayAndMonth(entries), [entries]);
  const { monthTotal, yearTotal, weekTotal } = useMemo(() => calculateTotals(entries), [entries]);

  const formatBestDay = (date: string) => {
    try { return format(parseISO(date), 'MMMM d, yyyy'); }
    catch { return date; }
  };

  const formatBestMonth = (month: string) => {
    try {
      const [y, m] = month.split('-');
      return format(new Date(+y, +m - 1, 1), 'MMMM yyyy');
    } catch { return month; }
  };

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">

      {/* Header */}
      <motion.div
        className="mb-6 flex items-center gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-accent">
          <TrendingUp size={18} color="white" />
        </div>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Your income insights</p>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-3 gap-2 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        {[
          { label: 'This Week', value: weekTotal },
          { label: 'This Month', value: monthTotal },
          { label: 'This Year', value: yearTotal },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card p-3 text-center">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', fontWeight: 500 }}>{label}</p>
            <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, marginTop: '2px', letterSpacing: '-0.01em' }}>
              {isLoading ? '—' : formatCurrency(value, 'USD', true)}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Best Day / Best Month */}
      {(bestDay || bestMonth) && (
        <motion.div
          className="flex gap-3 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {bestDay && (
            <div className="glass-card flex-1 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Star size={13} style={{ color: '#F59E0B' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Best Day
                </span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem' }}>
                {formatCurrency(bestDay.total, 'USD', true)}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                {formatBestDay(bestDay.date)}
              </p>
            </div>
          )}
          {bestMonth && (
            <div className="glass-card flex-1 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Award size={13} style={{ color: '#A78BFA' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Best Month
                </span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem' }}>
                {formatCurrency(bestMonth.total, 'USD', true)}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                {formatBestMonth(bestMonth.month)}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Weekly Chart */}
      <motion.div
        className="glass-card p-4 mb-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <SectionHeader title="Weekly Breakdown" subtitle="Cash · Card · QR" />
        <WeeklyBarChart data={weeklyData} />
      </motion.div>

      {/* Monthly Chart */}
      <motion.div
        className="glass-card p-4 mb-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <SectionHeader title="Monthly Overview" subtitle={`${new Date().getFullYear()}`} />
        <MonthlyBarChart data={monthlyData} />
      </motion.div>

      {/* Payment Breakdown */}
      {entries.length > 0 && (
        <motion.div
          className="glass-card p-4 mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <SectionHeader title="Payment Methods" />
          <PaymentBreakdown entries={entries} />
        </motion.div>
      )}
    </div>
  );
}
