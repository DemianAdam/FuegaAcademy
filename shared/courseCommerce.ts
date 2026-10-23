export type CourseFormat = 'live' | 'recorded' | 'hybrid';
export type CourseTier = 'live' | 'recorded';

export interface CourseMoney {
  amountMinor: number;
  currency: 'ARS';
}

export interface CoursePricing {
  live?: CourseMoney;
  recorded?: CourseMoney;
}

export function activeTiersForFormat(format: CourseFormat): CourseTier[] {
  if (format === 'live') return ['live'];
  if (format === 'recorded') return ['recorded'];
  return ['live', 'recorded'];
}

export function tierIsActive(format: CourseFormat, tier: CourseTier): boolean {
  return activeTiersForFormat(format).includes(tier);
}

export function normalizeCoursePricing(format: CourseFormat, pricing: CoursePricing): CoursePricing {
  return {
    ...(tierIsActive(format, 'live') && pricing.live ? { live: pricing.live } : {}),
    ...(tierIsActive(format, 'recorded') && pricing.recorded ? { recorded: pricing.recorded } : {}),
  };
}

export type CourseCommerceValidationError = 'ACTIVE_TIER_PRICE_REQUIRED' | 'LIVE_SCHEDULE_REQUIRED';

export function validatePublishedCourseCommerce(input: {
  format: CourseFormat;
  pricing: CoursePricing;
  activeScheduleCount: number;
}): CourseCommerceValidationError | null {
  if (activeTiersForFormat(input.format).some((tier) => {
    const price = input.pricing[tier];
    return !price || price.currency !== 'ARS' || !Number.isSafeInteger(price.amountMinor) || price.amountMinor <= 0;
  })) return 'ACTIVE_TIER_PRICE_REQUIRED';
  if (input.format !== 'recorded' && input.activeScheduleCount < 1) return 'LIVE_SCHEDULE_REQUIRED';
  return null;
}
