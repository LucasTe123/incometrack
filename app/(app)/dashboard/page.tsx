// Dashboard page — main screen
// app/(app)/dashboard/page.tsx

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, DollarSign, Calendar, Zap } from 'lucide-react';
import { useEntryStore } from '@/store/entryStore';
import { useGoalStore } from '@/store/goalStore';
import { useAuthStore } from '@/store/authStore';
import { calculateTotals } from '@/utils/dateUtils';
import StatCard from '@/components/dashboard/StatCard';
import GoalProgress from '@/components/dashboard/GoalProgress';
import MiniWeekChart from '@/components/dashboard/MiniWeekChart';
import QuickEntryModal from '@/components/entry/QuickEntryModal';
import GoalModal from '@/components/dashboard/GoalModal';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [entryOpen, setEntryOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { entries, isLoading } = useEntryStore();
  const { goal, isLoading: goalLoading } = useGoalStore();

  const { todayTotal, weekTotal, monthTotal, yearTotal } = useMemo(
    () => calculateTotals(entries),
    [entries]
  );

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">

        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
            {greeting()}{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
          </p>
          <h1
            style={{
              color: 'var(--text-primary)',
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginTop: '2px',
            }}
          >
            {format(new Date(), 'MMMM d')}
          </h1>
        </motion.div>

        {/* Today's Hero Card */}
        <motion.div
          className="rounded-3xl p-6 mb-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #3D1A78 0%, #1E1065 50%, #0F0A3C 100%)',
            border: '1px solid rgba(124,58,237,0.3)',
            boxShadow: '0 12px 48px rgba(124,58,237,0.25)',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background decoration */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 160, height: 160,
            borderRadius: '50%',
            background: 'rgba(124,58,237,0.15)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -20, left: 60,
            width: 100, height: 100,
            borderRadius: '50%',
            background: 'rgba(79,70,229,0.1)',
            pointerEvents: 'none',
          }} />

          <div className="relative">
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8125rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Today's Income
            </p>
            <motion.p
              className="money-display"
              style={{ color: '#fff', marginTop: '0.25rem' }}
              key={todayTotal}
              initial={{ opacity: 0.7, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? '—' : formatCurrency(todayTotal)}
            </motion.p>

            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5">
                <Zap size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                  Week: {formatCurrency(weekTotal, 'USD', true)}
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                Year: {formatCurrency(yearTotal, 'USD', true)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard
            label="This Month"
            amount={monthTotal}
            icon={Calendar}
            iconColor="#A78BFA"
            iconBg="rgba(167,139,250,0.1)"
            isLoading={isLoading}
            delay={0.1}
          />
          <StatCard
            label="This Year"
            amount={yearTotal}
            icon={TrendingUp}
            iconColor="#60A5FA"
            iconBg="rgba(96,165,250,0.1)"
            isLoading={isLoading}
            delay={0.15}
          />
        </div>

        {/* Goal Progress */}
        <div className="mb-4">
          <GoalProgress
            monthTotal={monthTotal}
            goalAmount={goal?.monthlyGoal ?? null}
            isLoading={goalLoading}
            onSetGoal={() => setGoalOpen(true)}
          />
        </div>

        {/* Mini Week Chart */}
        <div className="mb-4">
          <MiniWeekChart />
        </div>

      </div>

      {/* FAB — Add Entry */}
      <motion.button
        className="fab fixed"
        style={{ bottom: '5.5rem', right: '1.25rem', zIndex: 30 }}
        onClick={() => setEntryOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 260, delay: 0.4 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Add income entry"
      >
        <Plus size={26} strokeWidth={2.5} />
      </motion.button>

      <QuickEntryModal isOpen={entryOpen} onClose={() => setEntryOpen(false)} />
      <GoalModal isOpen={goalOpen} onClose={() => setGoalOpen(false)} />
    </>
  );
}
