// History entry row
// components/history/EntryRow.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, CreditCard, QrCode, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { IncomeEntry } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { deleteEntry } from '@/lib/firestore';

interface Props {
  entry: IncomeEntry;
}

export default function EntryRow({ entry }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this entry?')) return;
    setDeleting(true);
    try {
      await deleteEntry(entry.id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: deleting ? 0 : 1, scaleX: deleting ? 0.98 : 1 }}
      transition={{ duration: 0.25 }}
      layout
    >
      {/* Main Row */}
      <button
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
        onClick={() => setExpanded((v) => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>
            {formatCurrency(entry.total)}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1px' }}>
            {entry.date}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Method badges */}
          <div className="flex items-center gap-1.5">
            {entry.cash > 0 && (
              <span className="stat-badge" style={{ color: '#34D399', background: 'rgba(16,185,129,0.08)' }}>
                ${entry.cash.toFixed(0)}
              </span>
            )}
            {entry.card > 0 && (
              <span className="stat-badge" style={{ color: '#60A5FA', background: 'rgba(96,165,250,0.08)' }}>
                ${entry.card.toFixed(0)}
              </span>
            )}
            {entry.qr > 0 && (
              <span className="stat-badge" style={{ color: '#A78BFA', background: 'rgba(167,139,250,0.08)' }}>
                ${entry.qr.toFixed(0)}
              </span>
            )}
          </div>
          <span style={{ color: 'var(--text-muted)' }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <Banknote size={14} style={{ color: '#34D399' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Cash</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                      {formatCurrency(entry.cash)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard size={14} style={{ color: '#60A5FA' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Card</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                      {formatCurrency(entry.card)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <QrCode size={14} style={{ color: '#A78BFA' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>QR</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                      {formatCurrency(entry.qr)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleDelete}
                  className="btn-ghost"
                  disabled={deleting}
                  style={{ color: '#EF4444', padding: '0.375rem' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
