export interface CheckoutSchedule {
  id: string;
  courseId: string;
  isArchived?: boolean;
  enrolledCount: number;
  capacity: number;
}

export interface CheckoutRuleInput {
  courseId: string;
  courseStatus?: 'draft' | 'published' | 'archived';
  tier: 'live' | 'recorded';
  amountMinor: number;
  currency: string;
  scheduleId?: string;
  schedule?: CheckoutSchedule | null;
}

export type CheckoutRuleError =
  | 'COURSE_UNAVAILABLE'
  | 'INVALID_PRICE'
  | 'SCHEDULE_REQUIRED'
  | 'SCHEDULE_UNAVAILABLE'
  | 'INVALID_SCHEDULE';

export function validateCheckoutRules(input: CheckoutRuleInput): CheckoutRuleError | null {
  if (input.courseStatus === 'draft' || input.courseStatus === 'archived') {
    return 'COURSE_UNAVAILABLE';
  }
  if (input.currency !== 'ARS' || !Number.isSafeInteger(input.amountMinor) || input.amountMinor <= 0) {
    return 'INVALID_PRICE';
  }
  if (input.tier === 'recorded') return input.scheduleId ? 'INVALID_SCHEDULE' : null;
  if (!input.scheduleId || !input.schedule) return 'SCHEDULE_REQUIRED';
  if (
    input.schedule.id !== input.scheduleId ||
    input.schedule.courseId !== input.courseId ||
    input.schedule.isArchived ||
    input.schedule.enrolledCount >= input.schedule.capacity
  ) {
    return 'SCHEDULE_UNAVAILABLE';
  }
  return null;
}

export interface PaymentReconciliationInput {
  expectedAmountMinor: number;
  expectedCurrency: string;
  expectedPreferenceId?: string;
  expectedPayerEmail?: string;
  amountMinor: number;
  currency: string;
  preferenceId?: string;
  payerEmail?: string;
}

export type PaymentMismatch = 'PAYMENT_MISMATCH' | 'PREFERENCE_MISMATCH' | 'PAYER_MISMATCH';

export function getPaymentMismatch(input: PaymentReconciliationInput): PaymentMismatch | null {
  if (input.amountMinor !== input.expectedAmountMinor || input.currency !== input.expectedCurrency) {
    return 'PAYMENT_MISMATCH';
  }
  if (input.expectedPreferenceId && input.preferenceId !== input.expectedPreferenceId) {
    return 'PREFERENCE_MISMATCH';
  }
  if (
    input.expectedPayerEmail &&
    input.payerEmail?.toLowerCase() !== input.expectedPayerEmail.toLowerCase()
  ) {
    return 'PAYER_MISMATCH';
  }
  return null;
}
