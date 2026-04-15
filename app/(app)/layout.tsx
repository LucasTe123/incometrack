// Protected app layout — bottom nav + offline banner
// app/(app)/layout.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEntries } from '@/hooks/useEntries';
import { useGoal } from '@/hooks/useGoal';
import BottomNav from '@/components/layout/BottomNav';
import OfflineBanner from '@/components/shared/OfflineBanner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Start real-time subscriptions
  useEntries();
  useGoal();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center animate-pulse" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: 'var(--bg-base)' }}>
      <OfflineBanner />
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
