// Settings page
// app/(app)/settings/page.tsx

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, LogOut, Target, User, Shield, ChevronRight, Smartphone } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useGoalStore } from '@/store/goalStore';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import GoalModal from '@/components/dashboard/GoalModal';
import { formatCurrency } from '@/utils/formatters';
import { currentMonth } from '@/utils/dateUtils';
import { formatMonthLabel } from '@/utils/formatters';

function SettingRow({
  icon,
  iconColor,
  iconBg,
  label,
  subtitle,
  value,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  label: string;
  subtitle?: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      style={{
        background: 'none',
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: '0.875rem',
        transition: 'background 150ms',
      }}
      onMouseEnter={(e) => onClick && ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'none')}
    >
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg ?? 'rgba(255,255,255,0.06)' }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p style={{
          color: danger ? '#EF4444' : 'var(--text-primary)',
          fontWeight: 500,
          fontSize: '0.9375rem',
        }}>
          {label}
        </p>
        {subtitle && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '1px' }}>{subtitle}</p>
        )}
      </div>
      {value && (
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{value}</span>
      )}
      {onClick && (
        <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      )}
    </button>
  );
}

function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', paddingLeft: '1rem', marginBottom: '0.5rem' }}>
        {title}
      </p>
      <div className="glass-card overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { goal } = useGoalStore();
  const [goalOpen, setGoalOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">

        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-accent">
            <Settings size={18} color="white" />
          </div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Settings
          </h1>
        </motion.div>

        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SettingGroup title="Account">
            <SettingRow
              icon={<User size={16} style={{ color: '#60A5FA' }} />}
              iconBg="rgba(96,165,250,0.1)"
              label={user?.displayName ?? 'User'}
              subtitle={user?.email ?? ''}
            />
          </SettingGroup>
        </motion.div>

        {/* Goals */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SettingGroup title="Goals">
            <SettingRow
              icon={<Target size={16} style={{ color: '#A78BFA' }} />}
              iconBg="rgba(167,139,250,0.1)"
              label="Monthly Goal"
              subtitle={formatMonthLabel(currentMonth())}
              value={goal?.monthlyGoal ? formatCurrency(goal.monthlyGoal, 'USD', true) : 'Not set'}
              onClick={() => setGoalOpen(true)}
            />
          </SettingGroup>
        </motion.div>

        {/* App */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SettingGroup title="App">
            <SettingRow
              icon={<Smartphone size={16} style={{ color: '#10B981' }} />}
              iconBg="rgba(16,185,129,0.1)"
              label="PWA Installed"
              subtitle="Works offline with automatic sync"
            />
            <div className="divider mx-4" />
            <SettingRow
              icon={<Shield size={16} style={{ color: '#F59E0B' }} />}
              iconBg="rgba(245,158,11,0.1)"
              label="Data Security"
              subtitle="End-to-end isolated to your account"
            />
          </SettingGroup>
        </motion.div>

        {/* Sign Out */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SettingGroup title="Session">
            <SettingRow
              icon={<LogOut size={16} style={{ color: '#EF4444' }} />}
              iconBg="rgba(239,68,68,0.1)"
              label="Sign Out"
              onClick={handleSignOut}
              danger
            />
          </SettingGroup>
        </motion.div>

        {/* Version */}
        <p className="text-center mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          IncomeTrack v1.0.0
        </p>
      </div>

      <GoalModal isOpen={goalOpen} onClose={() => setGoalOpen(false)} />
    </>
  );
}
