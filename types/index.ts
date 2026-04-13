// Shared TypeScript types
// types/index.ts

import { Timestamp } from 'firebase/firestore';

export interface IncomeEntry {
  id: string;
  userId: string;
  date: string; // ISO: "YYYY-MM-DD"
  cash: number;
  card: number;
  qr: number;
  total: number;
  createdAt?: Timestamp;
}

export interface MonthlyGoal {
  id: string;
  userId: string;
  month: string; // "YYYY-MM"
  monthlyGoal: number;
}

export interface NewEntryInput {
  date: string;
  cash: number;
  card: number;
  qr: number;
}

export interface AnalyticsSummary {
  todayTotal: number;
  weekTotal: number;
  monthTotal: number;
  yearTotal: number;
  bestDay: { date: string; total: number } | null;
  bestMonth: { month: string; total: number } | null;
  weeklyData: WeekDay[];
  monthlyData: MonthBar[];
}

export interface WeekDay {
  day: string;   // "Mon", "Tue", ...
  date: string;  // "YYYY-MM-DD"
  total: number;
  cash: number;
  card: number;
  qr: number;
}

export interface MonthBar {
  month: string; // "Jan", "Feb", ...
  total: number;
  cash: number;
  card: number;
  qr: number;
}
