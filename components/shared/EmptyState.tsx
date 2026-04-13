// Empty state component
// components/shared/EmptyState.tsx

'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center py-16 px-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        <Icon size={28} style={{ color: 'var(--accent-from)' }} />
      </div>
      <h3
        className="text-lg font-semibold mb-1"
        style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
      >
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '22rem' }}>
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
