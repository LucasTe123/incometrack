// Entry Zustand store
// store/entryStore.ts

import { create } from 'zustand';
import { IncomeEntry } from '@/types';

interface EntryState {
  entries: IncomeEntry[];
  isLoading: boolean;
  error: string | null;
  setEntries: (entries: IncomeEntry[]) => void;
  addOptimistic: (entry: IncomeEntry) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  removeEntry: (id: string) => void;
}

export const useEntryStore = create<EntryState>((set) => ({
  entries: [],
  isLoading: true,
  error: null,
  setEntries: (entries) => set({ entries }),
  addOptimistic: (entry) =>
    set((state) => ({ entries: [entry, ...state.entries] })),
  removeEntry: (id) =>
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
