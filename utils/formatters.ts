// Currency and number formatting utilities
// utils/formatters.ts

/**
 * Format a number as currency (default: USD).
 * Uses compact notation for very large numbers (e.g. $1.2M).
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  compact = false
): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Format a large number with commas.
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

/**
 * Format a month string "YYYY-MM" → "January 2026".
 */
export function formatMonthLabel(month: string): string {
  try {
    const [year, m] = month.split('-');
    const date = new Date(parseInt(year), parseInt(m) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return month;
  }
}

/**
 * Calculate progress percentage (0–100), capped at 100.
 */
export function calcProgress(current: number, target: number): number {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

/**
 * Get a color class based on progress percentage.
 */
export function progressColor(percent: number): string {
  if (percent >= 100) return 'text-emerald-400';
  if (percent >= 75) return 'text-violet-400';
  if (percent >= 50) return 'text-blue-400';
  return 'text-amber-400';
}
