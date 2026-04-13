// Hook: Auth state listener
// hooks/useAuth.ts

'use client';

import { useEffect } from 'react';
import { onAuthChange } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';

/**
 * Listens to Firebase auth state changes and syncs to Zustand.
 * Must be called once at the top of the component tree (AppProviders).
 */
export function useAuthListener() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);
}

/**
 * Returns the current Firebase user and loading state.
 * Uses individual primitive selectors to avoid re-render loops.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  return { user, loading };
}
