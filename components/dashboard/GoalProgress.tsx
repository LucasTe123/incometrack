// Animated goal progress bar
// components/dashboard/GoalProgress.tsx

'use client';

import { motion } from 'framer-motion';
import { Target, ChevronRight } from 'lucide-react';
import { formatCurrency, calcProgress, progressColor } from '@/utils/formatters';
import { formatMonthLabel } from '@/utils/formatters';
import { currentMonth } from '@/utils/dateUtils';

interface GoalProgressProps {
  monthTotal: number;
  goalAmount: number | null;
  isLoading?: boolean;
  onSetGoal?: () => void;
}

export default function GoalProgress({
  monthTotal,
  goalAmount,
  isLoading = false,
  onSetGoal,
}: GoalProgressProps) {
  const month = currentMonth();
  const percent = goalAmount ? calcProgress(monthTotal, goalAmount) : 0;
  const remaining = goalAmount ? Math.max(0, goalAmount - monthTotal) : 0;

  if (isLoading) {
    return (
      <div className="glass-card p-5">
        <div className="skeleton h-3 w-28 mb-4" />
        <div className="skeleton h-2 w-full rounded-full mb-3" />
        <div className="skeleton h-3 w-20" />
      </div>
    );
  }

  if (!goalAmount) {
    return (
      <button
        className="glass-card p-4 w-full flex items-center justify-between text-left"
        onClick={onSetGoal}
        style={{ cursor: 'pointer' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(124,58,237,0.1)' }}
          >
            <Target size={18} style={{ color: 'var(--accent-from)' }} />
          </span>
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>
              Set a monthly goal
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              Track your progress toward a target
            </p>
          </div>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
      </button>
    );
  }

  return (
    <motion.div
      className="glass-card p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={16} style={{ color: 'var(--accent-from)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }}>
            {formatMonthLabel(month)} Goal
          </span>
        </div>
        <button
          onClick={onSetGoal}
          style={{ color: '#A78BFA', fontSize: '0.8125rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Edit
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-track mb-3">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: percent >= 100
              ? 'linear-gradient(90deg, #10B981, #059669)'
              : 'linear-gradient(90deg, #7C3AED, #4F46E5)',
          }}
        />
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem' }}>
            {formatCurrency(monthTotal, 'USD', true)}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            of {formatCurrency(goalAmount, 'USD', true)}
          </span>
        </div>
        <span
          className="stat-badge"
          style={{
            color: percent >= 100 ? '#34D399' : '#A78BFA',
            background: percent >= 100 ? 'rgba(16,185,129,0.08)' : 'rgba(124,58,237,0.08)',
            border: `1px solid ${percent >= 100 ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)'}`,
          }}
        >
          {percent}%
        </span>
      </div>

      {percent < 100 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.5rem' }}>
          {formatCurrency(remaining, 'USD', true)} remaining
        </p>
      )}

      {percent >= 100 && (
        <motion.p
          className="mt-2 font-semibold"
          style={{ color: '#34D399', fontSize: '0.875rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🎯 Goal achieved!
        </motion.p>
      )}
    </motion.div>
  );
}
