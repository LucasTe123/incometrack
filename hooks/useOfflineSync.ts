// Hook: Offline sync queue processor
// hooks/useOfflineSync.ts

'use client';

import { useEffect, useCallback, useState } from 'react';
import { addEntry } from '@/lib/firestore';
import { getPendingQueue, removeFromQueue } from '@/lib/idb';
import { useAuth } from './useAuth';

/**
 * Watches network status and flushes the offline IndexedDB queue
 * to Firestore when the connection is restored.
 */
export function useOfflineSync() {
  const { user } = useAuth();

  const flushQueue = useCallback(async () => {
    if (!user) return;
    try {
      const pending = await getPendingQueue(user.uid);
      for (const item of pending) {
        try {
          await addEntry(user.uid, item.input);
          await removeFromQueue(item.id);
        } catch (err) {
          console.warn('Failed to sync offline entry', item.id, err);
        }
      }
    } catch (err) {
      console.warn('Offline sync error', err);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (navigator.onLine) flushQueue();

    const handleOnline = () => {
      console.log('[IncomeTrack] Online — flushing offline queue...');
      flushQueue();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [flushQueue]);
}

/**
 * Returns current online status, reactive to changes.
 */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState<boolean>(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  return online;
}
