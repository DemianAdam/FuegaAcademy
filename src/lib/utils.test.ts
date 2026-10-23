import { describe, expect, it } from 'vitest';
import { calculateCourseWeeks } from './utils';

describe('calculateCourseWeeks', () => {
  it('uses two sessions per week when no active schedules exist', () => {
    expect(calculateCourseWeeks(16, [])).toBe(8);
    expect(calculateCourseWeeks(16, [{ sessions: [], isArchived: true }])).toBe(8);
  });

  it('uses the most common cadence and first-seen tie breaking', () => {
    expect(calculateCourseWeeks(18, [
      { sessions: [{}, {}] },
      { sessions: [{}, {}] },
      { sessions: [{}] },
    ])).toBe(9);
    expect(calculateCourseWeeks(18, [{ sessions: [{}] }, { sessions: [{}, {}] }])).toBe(18);
  });

  it('reacts to duration changes', () => {
    const schedules = [{ sessions: [{}, {}] }];
    expect(calculateCourseWeeks(16, schedules)).toBe(8);
    expect(calculateCourseWeeks(17, schedules)).toBe(9);
  });
});
