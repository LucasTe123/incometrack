// Animated stat card component
// components/dashboard/StatCard.tsx

'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface StatCardProps {
  label: string;
  amount: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  isLoading?: boolean;
  delay?: number;
  compact?: boolean;
}

export default function StatCard({
  label,
  amount,
  icon: Icon,
  iconColor,
  iconBg,
  isLoading = false,
  delay = 0,
  compact = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-4" style={{ minHeight: compact ? 80 : 100 }}>
        <div className="skeleton h-3 w-16 mb-3" />
        <div className="skeleton h-7 w-28" />
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card p-4 flex flex-col gap-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-center justify-between">
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }}>
          {label}
        </span>
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Icon size={15} style={{ color: iconColor }} />
        </span>
      </div>
      <motion.p
        className={compact ? 'money-display-sm' : ''}
        style={!compact ? {
          fontSize: '1.75rem',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: 'var(--text-primary)',
          lineHeight: 1,
        } : { color: 'var(--text-primary)' }}
        key={amount}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {formatCurrency(amount)}
      </motion.p>
    </motion.div>
  );
}
