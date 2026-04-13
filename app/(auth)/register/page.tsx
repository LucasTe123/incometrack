// Register page
// app/(auth)/register/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signUp } from '@/lib/auth';
import { registerSchema, RegisterFormValues } from '@/lib/validators';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormValues) => {
    setFirebaseError('');
    try {
      await signUp(data.email, data.password, data.displayName);
      router.replace('/dashboard');
    } catch (err: any) {
      const msg = err?.code === 'auth/email-already-in-use'
        ? 'This email is already registered.'
        : 'Something went wrong. Please try again.';
      setFirebaseError(msg);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 py-12"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0A0A0F 60%)' }}>

      {/* Logo */}
      <motion.div
        className="mb-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center"
          style={{ boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}>
          <TrendingUp size={32} color="white" strokeWidth={2.5} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            IncomeTrack
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Create your free account
          </p>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div
        className="glass-card w-full max-w-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {firebaseError && (
            <motion.div
              className="flex items-center gap-2 rounded-xl px-4 py-3"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', fontSize: '0.875rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertCircle size={16} />
              {firebaseError}
            </motion.div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }}>
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                <User size={18} />
              </span>
              <input
                {...register('displayName')}
                type="text"
                placeholder="Jane Smith"
                className="income-input"
                autoComplete="name"
              />
            </div>
            {errors.displayName && (
              <span style={{ color: '#FCA5A5', fontSize: '0.75rem' }}>{errors.displayName.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }}>
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                <Mail size={18} />
              </span>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="income-input"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span style={{ color: '#FCA5A5', fontSize: '0.75rem' }}>{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }}>
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                <Lock size={18} />
              </span>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                className="income-input"
                style={{ paddingRight: '3rem' }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span style={{ color: '#FCA5A5', fontSize: '0.75rem' }}>{errors.password.message}</span>
            )}
          </div>

          <motion.button
            type="submit"
            className="btn-primary mt-2"
            disabled={isSubmitting}
            whileTap={{ scale: 0.97 }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : 'Get Started'}
          </motion.button>
        </form>

        <div className="mt-5 text-center" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#A78BFA', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
