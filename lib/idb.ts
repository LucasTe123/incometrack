// IndexedDB setup for offline support
// lib/idb.ts

import { openDB, IDBPDatabase } from 'idb';
import { IncomeEntry, NewEntryInput } from '@/types';

const DB_NAME = 'incometrack-offline';
const DB_VERSION = 1;
const ENTRIES_STORE = 'entries';
const QUEUE_STORE = 'sync-queue';

export interface QueuedEntry {
  id: string; // local temp id
  userId: string;
  input: NewEntryInput;
  synced: boolean;
  createdAt: number; // timestamp ms
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Cache of synced entries
        if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
          const store = db.createObjectStore(ENTRIES_STORE, { keyPath: 'id' });
          store.createIndex('date', 'date');
          store.createIndex('userId', 'userId');
        }
        // Queue for offline writes waiting to sync
        if (!db.objectStoreNames.contains(QUEUE_STORE)) {
          db.createObjectStore(QUEUE_STORE, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// ─── Entry Cache ──────────────────────────────────────────────────────────────

export async function cacheEntries(entries: IncomeEntry[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(ENTRIES_STORE, 'readwrite');
  await Promise.all([
    ...entries.map((e) => tx.store.put(e)),
    tx.done,
  ]);
}

export async function getCachedEntries(userId: string): Promise<IncomeEntry[]> {
  const db = await getDB();
  const all = await db.getAll(ENTRIES_STORE);
  return (all as IncomeEntry[]).filter((e) => e.userId === userId);
}

// ─── Sync Queue ───────────────────────────────────────────────────────────────

export async function enqueueOfflineEntry(userId: string, input: NewEntryInput): Promise<QueuedEntry> {
  const db = await getDB();
  const entry: QueuedEntry = {
    id: `offline_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    userId,
    input,
    synced: false,
    createdAt: Date.now(),
  };
  await db.put(QUEUE_STORE, entry);
  return entry;
}

export async function getPendingQueue(userId: string): Promise<QueuedEntry[]> {
  const db = await getDB();
  const all = await db.getAll(QUEUE_STORE);
  return (all as QueuedEntry[]).filter((e) => e.userId === userId && !e.synced);
}

export async function markQueuedAsSynced(id: string): Promise<void> {
  const db = await getDB();
  const entry = await db.get(QUEUE_STORE, id);
  if (entry) {
    await db.put(QUEUE_STORE, { ...entry, synced: true });
  }
}

export async function removeFromQueue(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(QUEUE_STORE, id);
}
