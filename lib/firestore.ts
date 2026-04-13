// Firestore CRUD helpers for entries and goals
// lib/firestore.ts

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
  getDoc,
  getDocs,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import { IncomeEntry, MonthlyGoal, NewEntryInput } from '@/types';

// ─── Collection References ────────────────────────────────────────────────────

export const entriesCollection = () => collection(db, 'entries');
export const goalsCollection = () => collection(db, 'goals');

// ─── Entries ──────────────────────────────────────────────────────────────────

/**
 * Add a new income entry for the given user.
 */
export async function addEntry(userId: string, input: NewEntryInput): Promise<string> {
  const total = input.cash + input.card + input.qr;
  const docRef = await addDoc(entriesCollection(), {
    userId,
    date: input.date,
    cash: input.cash,
    card: input.card,
    qr: input.qr,
    total,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

/**
 * Update an existing entry by document ID.
 */
export async function updateEntry(entryId: string, input: Partial<NewEntryInput>): Promise<void> {
  const ref = doc(db, 'entries', entryId);
  const updates: Record<string, unknown> = { ...input };
  if (input.cash !== undefined || input.card !== undefined || input.qr !== undefined) {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const current = snap.data();
      updates.total =
        (input.cash ?? current.cash) +
        (input.card ?? current.card) +
        (input.qr ?? current.qr);
    }
  }
  await updateDoc(ref, updates);
}

/**
 * Delete an entry by document ID.
 */
export async function deleteEntry(entryId: string): Promise<void> {
  await deleteDoc(doc(db, 'entries', entryId));
}

/**
 * Subscribe to all entries for a user in real-time (ordered by date DESC).
 */
export function subscribeToEntries(
  userId: string,
  callback: (entries: IncomeEntry[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    entriesCollection(),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  ) as Query<DocumentData>;

  return onSnapshot(
    q,
    (snapshot) => {
      const entries: IncomeEntry[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<IncomeEntry, 'id'>),
      }));
      callback(entries);
    },
    onError
  );
}

// ─── Goals ────────────────────────────────────────────────────────────────────

/**
 * Set (upsert) a monthly goal for the user.
 */
export async function setMonthlyGoal(userId: string, month: string, target: number): Promise<void> {
  const goalId = `${userId}_${month}`;
  await setDoc(doc(db, 'goals', goalId), {
    userId,
    month,
    monthlyGoal: target,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Get the monthly goal for a specific month.
 */
export async function getMonthlyGoal(userId: string, month: string): Promise<MonthlyGoal | null> {
  const goalId = `${userId}_${month}`;
  const snap = await getDoc(doc(db, 'goals', goalId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<MonthlyGoal, 'id'>) };
}

/**
 * Subscribe to the monthly goal in real-time.
 */
export function subscribeToGoal(
  userId: string,
  month: string,
  callback: (goal: MonthlyGoal | null) => void
): () => void {
  const goalId = `${userId}_${month}`;
  return onSnapshot(doc(db, 'goals', goalId), (snap) => {
    if (!snap.exists()) {
      callback(null);
    } else {
      callback({ id: snap.id, ...(snap.data() as Omit<MonthlyGoal, 'id'>) });
    }
  });
}
