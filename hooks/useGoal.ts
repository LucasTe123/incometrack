// Hook: Monthly goal subscription
// hooks/useGoal.ts

'use client';

import { useEffect } from 'react';
import { subscribeToGoal } from '@/lib/firestore';
import { useGoalStore } from '@/store/goalStore';
import { useAuth } from './useAuth';
import { currentMonth } from '@/utils/dateUtils';

/**
 * Subscribes to the current month's goal from Firestore in real-time.
 */
export function useGoal() {
  const { goal, isLoading } = useGoalStore();
  const { user } = useAuth();
  const { setGoal, setLoading } = useGoalStore();

  useEffect(() => {
    if (!user) {
      setGoal(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const month = currentMonth();
    const unsubscribe = subscribeToGoal(user.uid, month, (g) => {
      setGoal(g);
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.uid]);

  return { goal, isLoading };
}
