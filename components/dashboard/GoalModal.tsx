// Goal setting modal
// components/dashboard/GoalModal.tsx

'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Target } from 'lucide-react';
import { setMonthlyGoal } from '@/lib/firestore';
import { useAuthStore } from '@/store/authStore';
import { useGoalStore } from '@/store/goalStore';
import { goalSchema, GoalFormValues } from '@/lib/validators';
import { currentMonth } from '@/utils/dateUtils';
import { formatMonthLabel } from '@/utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoalModal({ isOpen, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const { goal } = useGoalStore();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<GoalFormValues, unknown, GoalFormValues>({
    // @ts-expect-error zod v4 + @hookform/resolvers v5 type mismatch
    resolver: zodResolver(goalSchema),
    defaultValues: { target: goal?.monthlyGoal ?? undefined },
  });

  useEffect(() => {
    if (goal?.monthlyGoal) reset({ target: goal.monthlyGoal });
  }, [goal, reset]);

  const onSubmit = async (data: GoalFormValues) => {
    if (!user) return;
    await setMonthlyGoal(user.uid, currentMonth(), data.target);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ zIndex: 60 }}
        >
          <motion.div
            className="modal-panel"
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 400, width: '100%' }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.12)' }}>
                  <Target size={18} style={{ color: '#A78BFA' }} />
                </span>
                <div>
                  <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em' }}>
                    Monthly Goal
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    {formatMonthLabel(currentMonth())}
                  </p>
                </div>
              </div>
              <button className="btn-ghost" onClick={onClose} style={{ padding: '0.5rem' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem' }}>
                  Target Amount ($)
                </label>
                <input
                  {...register('target', { valueAsNumber: true })}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="e.g. 5000"
                  className="income-input"
                  style={{ paddingLeft: '1rem' }}
                  autoFocus
                />
                {errors.target && (
                  <p style={{ color: '#FCA5A5', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.target.message}
                  </p>
                )}
              </div>
              <motion.button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                whileTap={{ scale: 0.97 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  goal ? 'Update Goal' : 'Set Goal'
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
