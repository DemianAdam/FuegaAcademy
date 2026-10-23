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

export function calculateCourseWeeks(duration: number, schedules?: Array<{ sessions: Array<unknown>; isArchived?: boolean }>): number {
  const totalSessions = duration || 16;
  const activeSchedules = (schedules ?? []).filter((schedule) => !schedule.isArchived);
  const cadenceCounts = new Map<number, number>();
  let sessionsPerWeek = 2;
  let highestCount = 0;
  for (const schedule of activeSchedules) {
    const cadence = schedule.sessions.length;
    if (cadence <= 0) continue;
    const count = (cadenceCounts.get(cadence) ?? 0) + 1;
    cadenceCounts.set(cadence, count);
    if (count > highestCount) {
      highestCount = count;
      sessionsPerWeek = cadence;
    }
  }
  return Math.max(1, Math.ceil(totalSessions / sessionsPerWeek));
}
