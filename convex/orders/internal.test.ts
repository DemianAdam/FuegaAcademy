import { beforeEach, describe, expect, it } from 'vitest';
import { convexTest, type TestConvex } from 'convex-test';
import schema from '../schema';
import { internal } from '../_generated/api';
import { modules } from '../test.setup';

type TestBackend = TestConvex<typeof schema>;

async function createCheckoutFixture(t: TestBackend, capacity = 2) {
  return await t.run(async (ctx) => {
    const teacherId = await ctx.db.insert('teachers', {
      imageUrl: 'https://example.com/teacher.jpg',
      status: 'published',
      slug: 'teacher', name: 'Teacher', title: 'Instructor', skills: [], bio: 'Bio',
    });
    const courseId = await ctx.db.insert('courses', {
      imageUrl: 'https://example.com/course.jpg',
      polaroidImage: 'https://example.com/polaroid.jpg',
      duration: 10,
      format: 'live',
      teacherId,
      pricing: { live: { amountMinor: 100_000, currency: 'ARS' } },
      status: 'published',
      slug: 'course', title: 'Course', description: 'Description', polaroidCaption: 'Caption', achievements: [],
    });
    const scheduleId = await ctx.db.insert('schedules', {
      courseId,
      name: 'Cohort A',
      sessions: [{ day: 1, startTime: '18:00', endTime: '20:00' }],
      capacity,
      enrolledCount: 0,
      isArchived: false,
    });
    const userIds = await Promise.all([
      ctx.db.insert('users', { email: 'one@example.com', role: 'student' }),
      ctx.db.insert('users', { email: 'two@example.com', role: 'student' }),
    ]);
    const orderIds = await Promise.all(userIds.map((userId, index) => ctx.db.insert('orders', {
      userId,
      courseId,
      scheduleId,
      tier: 'live',
      amountMinor: 100_000,
      currency: 'ARS',
      status: 'pending',
      provider: 'mercadopago',
      payerEmail: index === 0 ? 'one@example.com' : 'two@example.com',
      externalPreferenceId: `preference-${index + 1}`,
    })));
    return { courseId, scheduleId, userIds, orderIds };
  });
}

function approvedPayment(orderId: string, index = 0) {
  return {
    orderId,
    externalPaymentId: `payment-${index + 1}`,
    externalPreferenceId: `preference-${index + 1}`,
    status: 'approved',
    amountMinor: 100_000,
    currency: 'ARS',
    payerEmail: index === 0 ? 'one@example.com' : 'two@example.com',
  };
}

describe('payment reconciliation', () => {
  let t: TestBackend;

  beforeEach(() => {
    t = convexTest(schema, modules);
  });

  it('creates one enrollment and increments capacity only once across retries', async () => {
    const fixture = await createCheckoutFixture(t);
    const payment = approvedPayment(fixture.orderIds[0]);

    await t.mutation(internal.orders.internal.reconcilePayment, payment);
    await t.mutation(internal.orders.internal.reconcilePayment, payment);

    const result = await t.run(async (ctx) => ({
      enrollments: await ctx.db.query('enrollments').collect(),
      schedule: await ctx.db.get(fixture.scheduleId),
      order: await ctx.db.get(fixture.orderIds[0]),
    }));
    expect(result.enrollments).toHaveLength(1);
    expect(result.schedule?.enrolledCount).toBe(1);
    expect(result.order?.status).toBe('approved');
  });

  it('enrolls the Academy student when the Mercado Pago payer has another email', async () => {
    const fixture = await createCheckoutFixture(t);
    const result = await t.mutation(internal.orders.internal.reconcilePayment, {
      ...approvedPayment(fixture.orderIds[0]),
      payerEmail: 'buyer-test-account@example.com',
    });
    expect(result.status).toBe('approved');
    const enrollments = await t.run((ctx) => ctx.db.query('enrollments').collect());
    expect(enrollments).toHaveLength(1);
    expect(enrollments[0].userId).toBe(fixture.userIds[0]);
  });

  it('routes altered authoritative amounts to review without creating enrollment', async () => {
    const fixture = await createCheckoutFixture(t);
    const result = await t.mutation(internal.orders.internal.reconcilePayment, {
      ...approvedPayment(fixture.orderIds[0]),
      amountMinor: 99_999,
    });

    const enrollments = await t.run((ctx) => ctx.db.query('enrollments').collect());
    expect(enrollments).toHaveLength(0);
    expect(result.status).toBe('review');
  });

  it('repairs a reviewed payment only when an administrator replays matching authoritative evidence', async () => {
    const fixture = await createCheckoutFixture(t);
    const payment = approvedPayment(fixture.orderIds[0]);
    await t.mutation(internal.orders.internal.reconcilePayment, {
      ...payment,
      externalPreferenceId: 'foreign-preference',
    });

    const repaired = await t.mutation(internal.orders.internal.reconcilePayment, {
      ...payment,
      allowReviewReplay: true,
    });
    const enrollments = await t.run((ctx) => ctx.db.query('enrollments').collect());

    expect(repaired).toMatchObject({ status: 'approved', enrolled: true });
    expect(enrollments).toHaveLength(1);
  });

  it('serializes competing approvals and prevents over-capacity enrollment', async () => {
    const fixture = await createCheckoutFixture(t, 1);
    await t.mutation(
      internal.orders.internal.reconcilePayment,
      approvedPayment(fixture.orderIds[0], 0),
    );
    await expect(t.mutation(
      internal.orders.internal.reconcilePayment,
      approvedPayment(fixture.orderIds[1], 1),
    )).rejects.toThrow('Schedule is full');

    const result = await t.run(async (ctx) => ({
      enrollments: await ctx.db.query('enrollments').collect(),
      schedule: await ctx.db.get(fixture.scheduleId),
    }));
    expect(result.enrollments).toHaveLength(1);
    expect(result.schedule?.enrolledCount).toBe(1);
  });

  it('flags a second approved payment for the same student and course without a second enrollment', async () => {
    const fixture = await createCheckoutFixture(t);
    const secondOrderId = await t.run(async (ctx) => await ctx.db.insert('orders', {
      userId: fixture.userIds[0], courseId: fixture.courseId, scheduleId: fixture.scheduleId,
      tier: 'live', amountMinor: 100_000, currency: 'ARS', status: 'pending', provider: 'mercadopago',
      externalPreferenceId: 'preference-duplicate',
    }));
    await t.mutation(internal.orders.internal.reconcilePayment, approvedPayment(fixture.orderIds[0]));
    const result = await t.mutation(internal.orders.internal.reconcilePayment, {
      ...approvedPayment(secondOrderId, 9), externalPreferenceId: 'preference-duplicate', payerEmail: 'another-payer@example.com',
    });
    expect(result.status).toBe('review');
    const state = await t.run(async (ctx) => ({
      enrollments: await ctx.db.query('enrollments').collect(),
      order: await ctx.db.get(secondOrderId),
    }));
    expect(state.enrollments).toHaveLength(1);
    expect(state.order?.status).toBe('review');
  });

  it('revokes the linked enrollment and releases its seat once after a refund', async () => {
    const fixture = await createCheckoutFixture(t, 1);
    const payment = approvedPayment(fixture.orderIds[0]);
    await t.mutation(internal.orders.internal.reconcilePayment, payment);
    await t.mutation(internal.orders.internal.reconcilePayment, { ...payment, status: 'refunded' });
    await t.mutation(internal.orders.internal.reconcilePayment, { ...payment, status: 'refunded' });
    const result = await t.run(async (ctx) => ({
      enrollments: await ctx.db.query('enrollments').collect(), schedule: await ctx.db.get(fixture.scheduleId),
      order: await ctx.db.get(fixture.orderIds[0]),
    }));
    expect(result.enrollments).toHaveLength(0);
    expect(result.schedule?.enrolledCount).toBe(0);
    expect(result.order?.status).toBe('refunded');
  });
});

describe('checkout preference persistence', () => {
  let t: TestBackend;

  beforeEach(() => {
    t = convexTest(schema, modules);
  });

  it('keeps the trusted checkout URL when a concurrent provider response differs', async () => {
    const orderId = await t.run(async (ctx) => {
      const userId = await ctx.db.insert('users', { email: 'student@example.com', role: 'student' });
      const teacherId = await ctx.db.insert('teachers', {
        imageUrl: 'https://example.com/teacher.jpg', status: 'published', slug: 'teacher',
        name: 'Teacher', title: 'Instructor', skills: [], bio: 'Bio',
      });
      const courseId = await ctx.db.insert('courses', {
        imageUrl: 'https://example.com/course.jpg',
        polaroidImage: 'https://example.com/polaroid.jpg',
        duration: 10,
        format: 'recorded',
        teacherId,
        pricing: { recorded: { amountMinor: 100_000, currency: 'ARS' } },
        status: 'published',
        slug: 'course', title: 'Course', description: 'Description', polaroidCaption: 'Caption', achievements: [],
      });
      return await ctx.db.insert('orders', {
        userId, courseId, tier: 'recorded', amountMinor: 100_000, currency: 'ARS', status: 'pending',
        provider: 'mercadopago', externalPreferenceId: 'preference-1',
        checkoutUrl: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=preference-1',
      });
    });

    const checkoutUrl = await t.mutation(internal.orders.internal.updateOrderPreference, {
      orderId,
      externalPreferenceId: 'preference-2',
      checkoutUrl: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=preference-2',
    });

    expect(checkoutUrl).toContain('preference-1');
  });

  it('rejects a preference mismatch when no trusted URL exists', async () => {
    const orderId = await t.run(async (ctx) => {
      const userId = await ctx.db.insert('users', { email: 'student@example.com', role: 'student' });
      const teacherId = await ctx.db.insert('teachers', {
        imageUrl: 'https://example.com/teacher.jpg', status: 'published', slug: 'teacher',
        name: 'Teacher', title: 'Instructor', skills: [], bio: 'Bio',
      });
      const courseId = await ctx.db.insert('courses', {
        imageUrl: 'https://example.com/course.jpg',
        polaroidImage: 'https://example.com/polaroid.jpg',
        duration: 10,
        format: 'recorded',
        teacherId,
        pricing: { recorded: { amountMinor: 100_000, currency: 'ARS' } },
        status: 'published',
        slug: 'course', title: 'Course', description: 'Description', polaroidCaption: 'Caption', achievements: [],
      });
      return await ctx.db.insert('orders', {
        userId, courseId, tier: 'recorded', amountMinor: 100_000, currency: 'ARS', status: 'pending',
        provider: 'mercadopago', externalPreferenceId: 'preference-1',
      });
    });

    await expect(t.mutation(internal.orders.internal.updateOrderPreference, {
      orderId,
      externalPreferenceId: 'preference-2',
      checkoutUrl: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=preference-2',
    })).rejects.toThrow('Checkout preference changed unexpectedly');
  });
});
