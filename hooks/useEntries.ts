// Hook: Real-time entries subscription
// hooks/useEntries.ts

'use client';

import { useEffect, useRef } from 'react';
import { subscribeToEntries } from '@/lib/firestore';
import { cacheEntries, getCachedEntries } from '@/lib/idb';
import { useEntryStore } from '@/store/entryStore';
import { useAuth } from './useAuth';

export function useEntries() {
  const { entries, isLoading, error } = useEntryStore();
  const { user } = useAuth();
  const { setEntries, setLoading, setError } = useEntryStore();
  const subscribedUid = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setEntries([]);
      setLoading(false);
      return;
    }

    // Evitar re-suscribirse si ya estamos escuchando para este uid
    if (subscribedUid.current === user.uid) return;
    subscribedUid.current = user.uid;

    setLoading(true);

    // Cargar cache primero (respuesta instantánea)
    getCachedEntries(user.uid)
      .then((cached) => {
        if (cached.length > 0) {
          setEntries(cached);
          setLoading(false);
        }
      })
      .catch(() => { });

    // Suscripción en tiempo real a Firestore
    const unsubscribe = subscribeToEntries(
      user.uid,
      (fresh) => {
        setEntries(fresh);
        setLoading(false);
        setError(null);
        cacheEntries(fresh).catch(() => { });
      },
      (err) => {
        console.error('Firestore subscription error:', err.message);
        // Si el error menciona "index", hay un índice faltante en Firestore
        if (err.message.includes('index')) {
          console.warn('⚠️ Falta un índice en Firestore. Buscá el link en este error para crearlo.');
        }
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      subscribedUid.current = null;
      unsubscribe();
    };
  }, [user?.uid]);

  return { entries, isLoading, error };
}