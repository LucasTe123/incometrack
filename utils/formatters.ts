// Currency and number formatting utilities
// utils/formatters.ts

/**
 * Format a number as Bolivianos (Bs.).
 * Uses compact notation for very large numbers (e.g. Bs. 1.2M).
 */
export function formatCurrency(
  amount: number,
  _currency = 'BOB',
  compact = false
): string {
  try {
    const n = Number(amount) || 0;
    if (compact) {
      if (n >= 1_000_000) return `Bs. ${(n / 1_000_000).toFixed(1)}M`;
      if (n >= 1_000) return `Bs. ${(n / 1_000).toFixed(1)}K`;
      return `Bs. ${n.toFixed(0)}`;
    }
    return `Bs. ${new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n)}`;
  } catch {
    return `Bs. ${amount.toFixed(2)}`;
  }
}

/**
 * Format a large number with dots as thousands separator (es-BO style).
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-BO').format(n);
}

/**
 * Format a month string "YYYY-MM" → "Enero 2026" (Spanish).
 */
export function formatMonthLabel(month: string): string {
  try {
    const [year, m] = month.split('-');
    const date = new Date(parseInt(year), parseInt(m) - 1, 1);
    return date.toLocaleDateString('es-BO', { month: 'long', year: 'numeric' });
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
