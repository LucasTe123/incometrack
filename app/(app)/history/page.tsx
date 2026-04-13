// History page
// app/(app)/history/page.tsx

'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Receipt } from 'lucide-react';
import { useEntryStore } from '@/store/entryStore';
import { filterByRange, groupEntriesByDate, formatDisplayDate } from '@/utils/dateUtils';
import EntryRow from '@/components/history/EntryRow';
import EmptyState from '@/components/shared/EmptyState';
import { IncomeEntry } from '@/types';

type Range = 'week' | 'month' | 'year';

const TABS: { id: Range; label: string }[] = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
];

export default function HistoryPage() {
  const { entries, isLoading } = useEntryStore();
  const [range, setRange] = useState<Range>('month');

  const filtered = useMemo(() => filterByRange(entries, range), [entries, range]);
  const grouped = useMemo(() => groupEntriesByDate(filtered), [filtered]);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">

      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-accent">
          <Clock size={18} color="white" />
        </div>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            History
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex gap-1 p-1 mb-6 rounded-2xl"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setRange(id)}
            className="tab-pill flex-1"
            style={{
              background: range === id ? 'rgba(124,58,237,0.18)' : 'transparent',
              color: range === id ? '#A78BFA' : 'var(--text-secondary)',
              fontWeight: range === id ? 600 : 500,
            }}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {/* Skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton h-3 w-32 mb-2 rounded" />
              <div className="skeleton h-16 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filtered.length === 0 && (
        <EmptyState
          icon={Receipt}
          title="No entries yet"
          description={`No income recorded for this ${range}. Tap + to add your first entry.`}
        />
      )}

      {/* Entry Groups */}
      {!isLoading && (
        <AnimatePresence>
          <div className="flex flex-col gap-5">
            {sortedDates.map((date, di) => {
              const dayEntries = grouped[date];
              const dayTotal = dayEntries.reduce((s: number, e: IncomeEntry) => s + e.total, 0);

              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: di * 0.04 }}
                >
                  {/* Date Header */}
                  <div className="flex items-baseline justify-between mb-2 px-1">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600 }}>
                      {formatDisplayDate(date)}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 700 }}>
                      ${dayTotal.toFixed(2)}
                    </p>
                  </div>

                  {/* Entries */}
                  <div className="flex flex-col gap-2">
                    {dayEntries.map((entry: IncomeEntry) => (
                      <EntryRow key={entry.id} entry={entry} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
