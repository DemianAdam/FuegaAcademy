import { describe, expect, it } from 'vitest';
import { activeTiersForFormat, normalizeCoursePricing, validatePublishedCourseCommerce } from './courseCommerce';

const live = { amountMinor: 10_000, currency: 'ARS' as const };
const recorded = { amountMinor: 8_000, currency: 'ARS' as const };

describe('course commerce rules', () => {
  it('selects only tiers allowed by the course format', () => {
    expect(activeTiersForFormat('live')).toEqual(['live']);
    expect(activeTiersForFormat('recorded')).toEqual(['recorded']);
    expect(activeTiersForFormat('hybrid')).toEqual(['live', 'recorded']);
  });

  it('removes prices that do not belong to the selected format', () => {
    expect(normalizeCoursePricing('live', { live, recorded })).toEqual({ live });
    expect(normalizeCoursePricing('recorded', { live, recorded })).toEqual({ recorded });
  });

  it('rejects incomplete commerce before a course can be published', () => {
    expect(validatePublishedCourseCommerce({ format: 'recorded', pricing: {}, activeScheduleCount: 0 })).toBe('ACTIVE_TIER_PRICE_REQUIRED');
    expect(validatePublishedCourseCommerce({ format: 'live', pricing: { live }, activeScheduleCount: 0 })).toBe('LIVE_SCHEDULE_REQUIRED');
    expect(validatePublishedCourseCommerce({ format: 'hybrid', pricing: { live, recorded }, activeScheduleCount: 1 })).toBeNull();
  });
});
