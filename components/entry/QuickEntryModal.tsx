// components/entry/QuickEntryModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Banknote, CreditCard, QrCode, Check, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { addEntry } from '@/lib/firestore';
import { enqueueOfflineEntry } from '@/lib/idb';
import { useAuthStore } from '@/store/authStore';
import { entrySchema, EntryFormValues } from '@/lib/validators';
import { formatCurrency } from '@/utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PAYMENT_FIELDS = [
  { name: 'cash' as const, label: 'Efectivo', icon: Banknote, color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
  { name: 'card' as const, label: 'Tarjeta', icon: CreditCard, color: '#60A5FA', bg: 'rgba(96,165,250,0.08)' },
  { name: 'qr' as const, label: 'QR / Digital', icon: QrCode, color: '#A78BFA', bg: 'rgba(167,139,250,0.08)' },
];

export default function QuickEntryModal({ isOpen, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema) as Resolver<EntryFormValues>,
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      cash: 0,
      card: 0,
      qr: 0,
    },
  });

  const cash = Number(watch('cash')) || 0;
  const card = Number(watch('card')) || 0;
  const qr = Number(watch('qr')) || 0;
  const liveTotal = cash + card + qr;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const closeAndReset = () => {
    setSaved(false);
    setIsSubmitting(false);
    reset({ date: format(new Date(), 'yyyy-MM-dd'), cash: 0, card: 0, qr: 0 });
    onClose();
  };

  const onSubmit = async (data: EntryFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const input = {
      date: data.date,
      cash: Number(data.cash) || 0,
      card: Number(data.card) || 0,
      qr: Number(data.qr) || 0,
    };

    try {
      if (navigator.onLine) {
        await addEntry(user.uid, input);
      } else {
        await enqueueOfflineEntry(user.uid, input);
      }

      setSaved(true);
      setTimeout(() => closeAndReset(), 1000);
    } catch (err) {
      console.error('Failed to save entry:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ zIndex: 50 }}
          >
            <motion.div
              className="modal-panel"
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 48, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 480, width: '100%', position: 'relative' }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-5"
                style={{ background: 'rgba(255,255,255,0.12)' }} />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    Agregar Ingreso
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      {format(new Date(), 'EEEE, MMMM d')}
                    </span>
                  </div>
                </div>
                <button className="btn-ghost" onClick={onClose} style={{ padding: '0.5rem' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Live Total */}
              <motion.div
                className="rounded-2xl p-4 mb-6 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(79,70,229,0.08) 100%)',
                  border: '1px solid rgba(124,58,237,0.18)',
                }}
              >
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Total
                </p>
                <motion.p
                  key={liveTotal}
                  className="money-display-sm gradient-text mt-1"
                  initial={{ scale: 0.95, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {formatCurrency(liveTotal)}
                </motion.p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem' }}>
                    Fecha
                  </label>
                  <input
                    {...register('date')}
                    type="date"
                    className="income-input"
                    style={{ paddingLeft: '1rem', colorScheme: 'dark' }}
                  />
                </div>

                {PAYMENT_FIELDS.map((field, i) => {
                  const Icon = field.icon;
                  const { ref, ...rest } = register(field.name);

                  return (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem' }}>
                        {field.label}
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: field.bg }}
                        >
                          <Icon size={15} style={{ color: field.color }} />
                        </span>
                        <input
                          {...rest}
                          ref={(e) => {
                            ref(e);
                            if (i === 0) firstInputRef.current = e;
                          }}
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="income-input"
                        />
                      </div>
                      {errors[field.name] && (
                        <p style={{ color: '#FCA5A5', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                          {errors[field.name]?.message}
                        </p>
                      )}
                    </motion.div>
                  );
                })}

                <motion.button
                  type="submit"
                  className="btn-primary mt-2"
                  disabled={isSubmitting || saved}
                  whileTap={{ scale: 0.97 }}
                  style={{ fontSize: '1.0625rem' }}
                >
                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.span
                        key="saved"
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Check size={18} strokeWidth={2.5} />
                        ¡Guardado!
                      </motion.span>
                    ) : isSubmitting ? (
                      <motion.span
                        key="saving"
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Guardando...
                      </motion.span>
                    ) : (
                      <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Guardar Registro
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}