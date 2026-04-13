// Date utility functions
// utils/dateUtils.ts

import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  isWithinInterval,
  parseISO,
  isSameDay,
} from 'date-fns';
import { IncomeEntry, WeekDay, MonthBar } from '@/types';

export const today = () => format(new Date(), 'yyyy-MM-dd');
export const currentMonth = () => format(new Date(), 'yyyy-MM');
export const currentYear = () => format(new Date(), 'yyyy');

/**
 * Get the current week's dates (Mon–Sun)
 */
export function getCurrentWeekDays(): Date[] {
  const now = new Date();
  return eachDayOfInterval({
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  });
}

/**
 * Build weekly bar chart data for Mon–Sun of the current week.
 */
export function buildWeeklyData(entries: IncomeEntry[]): WeekDay[] {
  const days = getCurrentWeekDays();
  return days.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayEntries = entries.filter((e) => e.date === dateStr);
    const cash = dayEntries.reduce((s, e) => s + e.cash, 0);
    const card = dayEntries.reduce((s, e) => s + e.card, 0);
    const qr = dayEntries.reduce((s, e) => s + e.qr, 0);
    return {
      day: format(day, 'EEE'),
      date: dateStr,
      total: cash + card + qr,
      cash,
      card,
      qr,
    };
  });
}

/**
 * Build monthly bar chart data for each month Jan–Dec of the current year.
 */
export function buildMonthlyData(entries: IncomeEntry[]): MonthBar[] {
  const now = new Date();
  const months = eachMonthOfInterval({ start: startOfYear(now), end: endOfYear(now) });
  return months.map((month) => {
    const monthStr = format(month, 'yyyy-MM');
    const monthEntries = entries.filter((e) => e.date.startsWith(monthStr));
    const cash = monthEntries.reduce((s, e) => s + e.cash, 0);
    const card = monthEntries.reduce((s, e) => s + e.card, 0);
    const qr = monthEntries.reduce((s, e) => s + e.qr, 0);
    return {
      month: format(month, 'MMM'),
      total: cash + card + qr,
      cash,
      card,
      qr,
    };
  });
}

/**
 * Calculate totals for today, week, month, year from a list of entries.
 */
export function calculateTotals(entries: IncomeEntry[]) {
  const now = new Date();
  const todayStr = format(now, 'yyyy-MM-dd');
  const monthStr = format(now, 'yyyy-MM');
  const yearStr = format(now, 'yyyy');

  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  let todayTotal = 0;
  let weekTotal = 0;
  let monthTotal = 0;
  let yearTotal = 0;

  for (const entry of entries) {
    if (entry.date === todayStr) todayTotal += entry.total;
    if (entry.date.startsWith(monthStr)) monthTotal += entry.total;
    if (entry.date.startsWith(yearStr)) yearTotal += entry.total;
    try {
      const entryDate = parseISO(entry.date);
      if (isWithinInterval(entryDate, { start: weekStart, end: weekEnd })) {
        weekTotal += entry.total;
      }
    } catch {}
  }

  return { todayTotal, weekTotal, monthTotal, yearTotal };
}

/**
 * Find the best performing day and month.
 */
export function findBestDayAndMonth(entries: IncomeEntry[]) {
  // Group by day
  const dayMap: Record<string, number> = {};
  for (const entry of entries) {
    dayMap[entry.date] = (dayMap[entry.date] ?? 0) + entry.total;
  }
  let bestDay: { date: string; total: number } | null = null;
  for (const [date, total] of Object.entries(dayMap)) {
    if (!bestDay || total > bestDay.total) bestDay = { date, total };
  }

  // Group by month
  const monthMap: Record<string, number> = {};
  for (const entry of entries) {
    const month = entry.date.slice(0, 7);
    monthMap[month] = (monthMap[month] ?? 0) + entry.total;
  }
  let bestMonth: { month: string; total: number } | null = null;
  for (const [month, total] of Object.entries(monthMap)) {
    if (!bestMonth || total > bestMonth.total) bestMonth = { month, total };
  }

  return { bestDay, bestMonth };
}

/**
 * Filter entries by a time range.
 */
export function filterByRange(
  entries: IncomeEntry[],
  range: 'week' | 'month' | 'year'
): IncomeEntry[] {
  const now = new Date();
  let start: Date, end: Date;

  switch (range) {
    case 'week':
      start = startOfWeek(now, { weekStartsOn: 1 });
      end = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case 'month':
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case 'year':
      start = startOfYear(now);
      end = endOfYear(now);
      break;
  }

  return entries.filter((e) => {
    try {
      return isWithinInterval(parseISO(e.date), { start, end });
    } catch {
      return false;
    }
  });
}

/**
 * Format a date string nicely.
 */
export function formatDisplayDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'EEEE, MMMM d, yyyy');
  } catch {
    return dateStr;
  }
}

/**
 * Group entries by date for History view.
 */
export function groupEntriesByDate(entries: IncomeEntry[]): Record<string, IncomeEntry[]> {
  const groups: Record<string, IncomeEntry[]> = {};
  for (const entry of entries) {
    if (!groups[entry.date]) groups[entry.date] = [];
    groups[entry.date].push(entry);
  }
  return groups;
}
