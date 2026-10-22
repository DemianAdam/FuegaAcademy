/*import { beforeEach, describe, expect, it } from 'vitest';
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
    });
    const courseId = await ctx.db.insert('courses', {
      imageUrl: 'https://example.com/course.jpg',
      polaroidImage: 'https://example.com/polaroid.jpg',
      duration: 10,
      format: 'live',
      teacherId,
      pricing: { live: { amountMinor: 100_000, currency: 'ARS' } },
      status: 'published',
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

  it('rejects altered authoritative amounts without creating enrollment', async () => {
    const fixture = await createCheckoutFixture(t);
    await expect(t.mutation(internal.orders.internal.reconcilePayment, {
      ...approvedPayment(fixture.orderIds[0]),
      amountMinor: 99_999,
    })).rejects.toThrow('Payment amount or currency mismatch');

    const enrollments = await t.run((ctx) => ctx.db.query('enrollments').collect());
    expect(enrollments).toHaveLength(0);
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
});
*/