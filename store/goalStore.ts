// Goal Zustand store
// store/goalStore.ts

import { create } from 'zustand';
import { MonthlyGoal } from '@/types';

interface GoalState {
  goal: MonthlyGoal | null;
  isLoading: boolean;
  setGoal: (goal: MonthlyGoal | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useGoalStore = create<GoalState>((set) => ({
  goal: null,
  isLoading: true,
  setGoal: (goal) => set({ goal }),
  setLoading: (isLoading) => set({ isLoading }),
}));
