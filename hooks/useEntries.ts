// Hook: Real-time entries subscription
// hooks/useEntries.ts

'use client';

import { useEffect } from 'react';
import { subscribeToEntries } from '@/lib/firestore';
import { cacheEntries, getCachedEntries } from '@/lib/idb';
import { useEntryStore } from '@/store/entryStore';
import { useAuth } from './useAuth';

/**
 * Subscribes to Firestore entries for the current user in real-time.
 * Falls back to IndexedDB when offline.
 * Caches incoming data to IndexedDB for offline use.
 */
export function useEntries() {
  const { entries, isLoading, error } = useEntryStore();
  const { user } = useAuth();
  const { setEntries, setLoading, setError } = useEntryStore();

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Load cached data first for instant display
    getCachedEntries(user.uid).then((cached) => {
      if (cached.length > 0) {
        setEntries(cached);
        setLoading(false);
      }
    }).catch(() => {});

    // Then subscribe to real-time Firestore updates
    const unsubscribe = subscribeToEntries(
      user.uid,
      (fresh) => {
        setEntries(fresh);
        setLoading(false);
        setError(null);
        // Update cache in background
        cacheEntries(fresh).catch(() => {});
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  return { entries, isLoading, error };
}
