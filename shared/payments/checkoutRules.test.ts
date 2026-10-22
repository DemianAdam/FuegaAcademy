import { describe, expect, it } from 'vitest';
import { getPaymentMismatch, validateCheckoutRules } from './checkoutRules';

const liveCheckout = {
  courseId: 'course-1',
  courseStatus: 'published' as const,
  tier: 'live' as const,
  amountMinor: 100_000,
  currency: 'ARS',
  scheduleId: 'schedule-1',
  schedule: {
    id: 'schedule-1',
    courseId: 'course-1',
    enrolledCount: 2,
    capacity: 10,
  },
};

describe('checkout rules', () => {
  it('rejects altered prices and currencies', () => {
    expect(validateCheckoutRules({ ...liveCheckout, amountMinor: 10.5 })).toBe('INVALID_PRICE');
    expect(validateCheckoutRules({ ...liveCheckout, currency: 'USD' })).toBe('INVALID_PRICE');
  });

  it('rejects foreign, archived, and full schedules', () => {
    expect(validateCheckoutRules({
      ...liveCheckout,
      schedule: { ...liveCheckout.schedule, courseId: 'course-2' },
    })).toBe('SCHEDULE_UNAVAILABLE');
    expect(validateCheckoutRules({
      ...liveCheckout,
      schedule: { ...liveCheckout.schedule, isArchived: true },
    })).toBe('SCHEDULE_UNAVAILABLE');
    expect(validateCheckoutRules({
      ...liveCheckout,
      schedule: { ...liveCheckout.schedule, enrolledCount: 10 },
    })).toBe('SCHEDULE_UNAVAILABLE');
  });

  it('does not allow a schedule for recorded access', () => {
    expect(validateCheckoutRules({ ...liveCheckout, tier: 'recorded' })).toBe('INVALID_SCHEDULE');
  });
});

describe('payment reconciliation comparisons', () => {
  const expected = {
    expectedAmountMinor: 100_000,
    expectedCurrency: 'ARS',
    expectedPreferenceId: 'preference-1',
    expectedPayerEmail: 'student@example.com',
    amountMinor: 100_000,
    currency: 'ARS',
    preferenceId: 'preference-1',
    payerEmail: 'Student@example.com',
  };

  it('accepts authoritative values that match the immutable order snapshot', () => {
    expect(getPaymentMismatch(expected)).toBeNull();
  });

  it('rejects amount, currency, preference, and payer mismatches', () => {
    expect(getPaymentMismatch({ ...expected, amountMinor: 99_999 })).toBe('PAYMENT_MISMATCH');
    expect(getPaymentMismatch({ ...expected, currency: 'USD' })).toBe('PAYMENT_MISMATCH');
    expect(getPaymentMismatch({ ...expected, preferenceId: undefined })).toBe('PREFERENCE_MISMATCH');
    expect(getPaymentMismatch({ ...expected, payerEmail: undefined })).toBe('PAYER_MISMATCH');
  });
});
