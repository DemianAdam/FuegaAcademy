export function formatCurrency(amount: number, currency: string = 'ARS'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

export function formatDate(date: string | number | Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function calculateCourseWeeks(duration: number, schedules?: Array<{ sessions: Array<unknown> }>): number {
  const totalSessions = duration || 16;
  const sessionsPerWeek = schedules && schedules.length > 0 && schedules[0]?.sessions?.length > 0
    ? schedules[0].sessions.length
    : 2; // default 2 sessions per week
  return Math.max(1, Math.ceil(totalSessions / sessionsPerWeek));
}
