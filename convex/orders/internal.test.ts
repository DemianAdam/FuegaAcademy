import { afterEach, describe, expect, it, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "../schema";
import { api, internal } from "../_generated/api";
import { modules } from "../test.setup";
async function fixture(capacity = 2) {
  const t = convexTest(schema, modules);
  const f = await t.run(async (ctx) => {
    const user = await ctx.db.insert("users", {
      email: "student@example.com",
      role: "student",
    });
    const other = await ctx.db.insert("users", {
      email: "other@example.com",
      role: "student",
    });
    const admin = await ctx.db.insert("users", {
      email: "admin@example.com",
      role: "admin",
    });
    const teacher = await ctx.db.insert("teachers", {
      imageUrl: "https://example.com/a",
      status: "published",
      slug: "teacher",
      name: "Teacher",
      title: "Teacher",
      skills: [],
      bio: "Bio",
    });
    const course = await ctx.db.insert("courses", {
      imageUrl: "https://example.com/a",
      polaroidImage: "https://example.com/a",
      duration: 1,
      format: "hybrid",
      teacherId: teacher,
      pricing: {
        live: { amountMinor: 10000, currency: "ARS" },
        recorded: { amountMinor: 10000, currency: "ARS" },
      },
      status: "published",
      slug: "course",
      title: "Course",
      description: "Description",
      polaroidCaption: "Caption",
      achievements: [],
    });
    const exam = await ctx.db.insert("exams", {
      courseId: course,
      kind: "quiz",
      instructions: "Exam",
      passingPercent: 70,
      questions: [
        { id: "q", prompt: "Question", options: ["yes", "no"], correct: 0 },
      ],
      version: 1,
      published: true,
    });
    const schedule = await ctx.db.insert("schedules", {
      courseId: course,
      name: "Cohort",
      sessions: [],
      capacity,
      enrolledCount: 0,
      startsAt: Date.now() + 86400000,
      isArchived: false,
    });
    await ctx.db.insert("modules", {
      courseId: course,
      title: "Module",
      lessons: [
        {
          id: "lesson",
          title: "Lesson",
          description: "Description",
          durationMinutes: 10,
        },
      ],
    });
    return { user, other, admin, course, exam, schedule };
  });
  const order = await t.mutation(internal.orders.internal.reserveCheckout, {
    userId: f.user,
    courseId: f.course,
    tier: "live",
    scheduleId: f.schedule,
  });
  await t.mutation(internal.orders.internal.updateOrderPreference, {
    orderId: order.order._id,
    externalPreferenceId: "pref",
    checkoutUrl: "https://example.com/checkout",
  });
  // Seed durable, signature-verified inbox evidence without scheduling network work.
  await t.run((ctx) =>
    ctx.db.insert("paymentInbox", {
      paymentId: "pay",
      attempts: 0,
      state: "pending",
    }),
  );
  const payment = {
    orderId: String(order.order._id),
    externalPaymentId: "pay",
    externalPreferenceId: "pref",
    status: "approved",
    amountMinor: 10000,
    currency: "ARS",
    payerEmail: "payer@example.com",
    updatedAt: 100,
    approvedAt: Date.now(),
    refundedMinor: 0,
  };
  const student = t.withIdentity({ subject: f.user });
  const administrator = t.withIdentity({ subject: f.admin });
  return { t, ...f, orderId: order.order._id, payment, student, administrator };
}
async function enrolled(f: Awaited<ReturnType<typeof fixture>>) {
  await f.t.mutation(internal.orders.internal.reconcilePayment, f.payment);
  return await f.t.run(
    async (ctx) => (await ctx.db.query("enrollments").collect())[0],
  );
}
describe("payment ownership and signed fulfillment", () => {
  it("requires signed evidence and never enrolls from an admin lookup alone", async () => {
    const f = await fixture();
    const r = await f.t.mutation(internal.orders.internal.reconcilePayment, {
      ...f.payment,
      externalPaymentId: "unsigned",
    });
    expect(r.status).toBe("review");
    expect(
      await f.t.run((ctx) => ctx.db.query("enrollments").collect()),
    ).toHaveLength(0);
  });
  it("fulfills once across repeated notifications, with independent payer email", async () => {
    const f = await fixture();
    await enrolled(f);
    await f.t.mutation(internal.orders.internal.reconcilePayment, f.payment);
    expect(
      await f.t.run((ctx) => ctx.db.query("enrollments").collect()),
    ).toHaveLength(1);
    expect(
      (await f.t.run((ctx) => ctx.db.get(f.schedule)))?.enrolledCount,
    ).toBe(1);
  });
  it("does not poison an order when a payment is rejected first", async () => {
    const f = await fixture();
    await f.t.mutation(internal.orders.internal.reconcilePayment, {
      ...f.payment,
      status: "rejected",
      updatedAt: 50,
    });
    expect(
      (await f.t.mutation(internal.orders.internal.reconcilePayment, f.payment))
        .enrolled,
    ).toBe(true);
  });
  it("ignores rejection and stale evidence after approval", async () => {
    const f = await fixture();
    await enrolled(f);
    await f.t.mutation(internal.orders.internal.reconcilePayment, {
      ...f.payment,
      status: "rejected",
      updatedAt: 200,
    });
    expect((await f.t.run((ctx) => ctx.db.get(f.orderId)))?.status).toBe(
      "approved",
    );
  });
  it("records a second charge, and refunding it leaves the funded enrollment active", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    await f.t.run((ctx) =>
      ctx.db.insert("paymentInbox", {
        paymentId: "extra",
        attempts: 0,
        state: "pending",
      }),
    );
    const extra = { ...f.payment, externalPaymentId: "extra" };
    expect(
      (await f.t.mutation(internal.orders.internal.reconcilePayment, extra))
        .status,
    ).toBe("review");
    await f.t.mutation(internal.orders.internal.reconcilePayment, {
      ...extra,
      status: "refunded",
      refundedMinor: 10000,
      updatedAt: 200,
    });
    expect((await f.t.run((ctx) => ctx.db.get(run._id)))?.status).toBe(
      "active",
    );
  });
  it("retains revoked history and releases a future seat exactly once", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    const refund = {
      ...f.payment,
      status: "refunded",
      refundedMinor: 10000,
      updatedAt: 200,
    };
    await f.t.mutation(internal.orders.internal.reconcilePayment, refund);
    await f.t.mutation(internal.orders.internal.reconcilePayment, refund);
    expect((await f.t.run((ctx) => ctx.db.get(run._id)))?.status).toBe(
      "revoked",
    );
    expect(
      (await f.t.run((ctx) => ctx.db.get(f.schedule)))?.enrolledCount,
    ).toBe(0);
  });
  it("does not revoke for partial refund", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    expect(
      (
        await f.t.mutation(internal.orders.internal.reconcilePayment, {
          ...f.payment,
          refundedMinor: 100,
          updatedAt: 200,
        })
      ).status,
    ).toBe("review");
    expect((await f.t.run((ctx) => ctx.db.get(run._id)))?.status).toBe(
      "active",
    );
  });
  it("routes mismatched amount and preference to exceptions", async () => {
    const f = await fixture();
    expect(
      (
        await f.t.mutation(internal.orders.internal.reconcilePayment, {
          ...f.payment,
          amountMinor: 1,
        })
      ).status,
    ).toBe("review");
    expect(
      await f.t.run((ctx) => ctx.db.query("enrollments").collect()),
    ).toHaveLength(0);
  });
  it("does not turn an old duplicate into a new course run", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    await f.student.mutation(api.learning.functions.submit, {
      enrollmentId: run._id,
      attemptNumber: 1,
      answers: [0],
    });
    await f.t.run((ctx) =>
      ctx.db.insert("paymentInbox", {
        paymentId: "extra",
        attempts: 0,
        state: "pending",
      }),
    );
    expect(
      (
        await f.t.mutation(internal.orders.internal.reconcilePayment, {
          ...f.payment,
          externalPaymentId: "extra",
        })
      ).status,
    ).toBe("review");
    expect(
      await f.t.run((ctx) => ctx.db.query("enrollments").collect()),
    ).toHaveLength(1);
  });
});
describe("transactional checkout and capacity", () => {
  it("blocks an active enrollment across tiers", async () => {
    const f = await fixture();
    await enrolled(f);
    await expect(
      f.t.mutation(internal.orders.internal.reserveCheckout, {
        userId: f.user,
        courseId: f.course,
        tier: "recorded",
      }),
    ).rejects.toThrow("ALREADY_ENROLLED");
  });
  it("requires closure rather than silently resuming", async () => {
    const f = await fixture();
    expect(
      (
        await f.t.mutation(internal.orders.internal.reserveCheckout, {
          userId: f.user,
          courseId: f.course,
          tier: "recorded",
        })
      ).kind,
    ).toBe("close");
  });
  it("does not replace a known processing payment", async () => {
    const f = await fixture();
    await f.t.mutation(internal.orders.internal.reconcilePayment, {
      ...f.payment,
      status: "in_process",
    });
    expect(
      (
        await f.t.mutation(internal.orders.internal.reserveCheckout, {
          userId: f.user,
          courseId: f.course,
          tier: "recorded",
        })
      ).kind,
    ).toBe("processing");
  });
  it("counts holds for the last seat", async () => {
    const f = await fixture(1);
    await expect(
      f.t.mutation(internal.orders.internal.reserveCheckout, {
        userId: f.other,
        courseId: f.course,
        tier: "live",
        scheduleId: f.schedule,
      }),
    ).rejects.toThrow("SCHEDULE_FULL");
  });
  it("blocks started cohorts but permits recorded checkout", async () => {
    const f = await fixture();
    await f.t.run((ctx) =>
      ctx.db.patch(f.schedule, { startsAt: Date.now() - 1000 }),
    );
    await expect(
      f.t.mutation(internal.orders.internal.reserveCheckout, {
        userId: f.other,
        courseId: f.course,
        tier: "live",
        scheduleId: f.schedule,
      }),
    ).rejects.toThrow("SCHEDULE_UNAVAILABLE");
    expect(
      (
        await f.t.mutation(internal.orders.internal.reserveCheckout, {
          userId: f.other,
          courseId: f.course,
          tier: "recorded",
        })
      ).kind,
    ).toBe("create");
  });
  it("accepts delayed pre-start approvals when a seat remains", async () => {
    const f = await fixture();
    await f.t.run((ctx) =>
      ctx.db.patch(f.schedule, { startsAt: Date.now() - 1000 }),
    );
    expect(
      (
        await f.t.mutation(internal.orders.internal.reconcilePayment, {
          ...f.payment,
          approvedAt: Date.now() - 2000,
        })
      ).enrolled,
    ).toBe(true);
  });
  it("records paid capacity exceptions rather than rolling back the payment", async () => {
    const f = await fixture(1);
    await f.t.run((ctx) => ctx.db.patch(f.schedule, { enrolledCount: 1 }));
    expect(
      (await f.t.mutation(internal.orders.internal.reconcilePayment, f.payment))
        .status,
    ).toBe("review");
    expect(
      await f.t.run((ctx) => ctx.db.query("paymentAttempts").collect()),
    ).toHaveLength(1);
  });
  it("routes post-start approvals to review", async () => {
    const f = await fixture();
    await f.t.run((ctx) =>
      ctx.db.patch(f.schedule, { startsAt: f.payment.approvedAt - 1 }),
    );
    expect(
      (await f.t.mutation(internal.orders.internal.reconcilePayment, f.payment))
        .status,
    ).toBe("review");
  });
  it("rejects administrator purchases", async () => {
    const f = await fixture();
    await expect(
      f.t.mutation(internal.orders.internal.reserveCheckout, {
        userId: f.admin,
        courseId: f.course,
        tier: "recorded",
      }),
    ).rejects.toThrow("FORBIDDEN");
  });
});
describe("classroom and exam lifecycle", () => {
  it("never exposes correct answers and enforces ownership", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    const page = await f.student.query(api.learning.functions.classroom, {
      enrollmentId: run._id,
    });
    expect(page.exam?.questions[0]).not.toHaveProperty("correct");
    await expect(
      f.t
        .withIdentity({ subject: f.other })
        .query(api.learning.functions.classroom, { enrollmentId: run._id }),
    ).rejects.toThrow("FORBIDDEN");
  });
  it("requires administrator reopening after failure", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    await f.student.mutation(api.learning.functions.submit, {
      enrollmentId: run._id,
      attemptNumber: 1,
      answers: [1],
    });
    await expect(
      f.student.mutation(api.learning.functions.submit, {
        enrollmentId: run._id,
        attemptNumber: 2,
        answers: [0],
      }),
    ).rejects.toThrow();
    await f.administrator.mutation(api.learning.functions.reopen, {
      enrollmentId: run._id,
    });
    await f.student.mutation(api.learning.functions.submit, {
      enrollmentId: run._id,
      attemptNumber: 2,
      answers: [0],
    });
    expect((await f.t.run((ctx) => ctx.db.get(run._id)))?.status).toBe(
      "completed",
    );
  });
  it("passing ends access, is idempotent, and retains cohort occupancy", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    const args = { enrollmentId: run._id, attemptNumber: 1, answers: [0] };
    const id = await f.student.mutation(api.learning.functions.submit, args);
    expect(await f.student.mutation(api.learning.functions.submit, args)).toBe(
      id,
    );
    await expect(
      f.student.query(api.learning.functions.classroom, {
        enrollmentId: run._id,
      }),
    ).rejects.toThrow();
    expect(
      (await f.t.run((ctx) => ctx.db.get(f.schedule)))?.enrolledCount,
    ).toBe(1);
    await f.t.mutation(internal.orders.internal.markPreferenceClosed, {
      orderId: f.orderId,
      success: true,
    });
    const next = await f.t.mutation(internal.orders.internal.reserveCheckout, {
      userId: f.user,
      courseId: f.course,
      tier: "recorded",
    });
    expect(next.order.runNumber).toBe(2);
  });
  it("keeps the assigned exam version after a new publication", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    await f.administrator.mutation(api.learning.functions.publishExam, {
      courseId: f.course,
      kind: "manual",
      instructions: "New",
      passingPercent: 70,
      questions: [],
    });
    expect(
      (
        await f.student.query(api.learning.functions.classroom, {
          enrollmentId: run._id,
        })
      ).exam?.kind,
    ).toBe("quiz");
  });
  it("supports audited external manual results and rejects grading revoked runs", async () => {
    const f = await fixture();
    await f.t.run((ctx) =>
      ctx.db.patch(f.exam, { kind: "manual", questions: [] }),
    );
    const run = await enrolled(f);
    await f.administrator.mutation(api.learning.functions.review, {
      enrollmentId: run._id,
      passed: false,
      note: "Evaluación oral no aprobada",
    });
    await f.administrator.mutation(api.learning.functions.reopen, {
      enrollmentId: run._id,
    });
    await f.t.mutation(internal.orders.internal.reconcilePayment, {
      ...f.payment,
      status: "refunded",
      refundedMinor: 10000,
      updatedAt: 200,
    });
    await expect(
      f.administrator.mutation(api.learning.functions.review, {
        enrollmentId: run._id,
        passed: true,
        note: "Resultado",
      }),
    ).rejects.toThrow();
  });
});

describe("private resources and boundary authorization", () => {
  it("rejects anonymous classroom and payment status queries", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    await expect(
      f.t.query(api.learning.functions.classroom, { enrollmentId: run._id }),
    ).rejects.toThrow("UNAUTHENTICATED");
    await expect(
      f.t.query(api.orders.queries.getMyStatus, { orderId: f.orderId }),
    ).rejects.toThrow("UNAUTHENTICATED");
    expect(
      await f.t
        .withIdentity({ subject: f.other })
        .query(api.orders.queries.getMyStatus, { orderId: f.orderId }),
    ).toBeNull();
  });
  it("isolates live links by cohort and tier and never includes private data in the catalog", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    await f.administrator.mutation(api.learning.functions.saveResource, {
      courseId: f.course,
      title: "Secret session",
      kind: "live",
      scheduleId: f.schedule,
      url: "https://example.com/secret-meeting",
    });
    expect(
      (
        await f.student.query(api.learning.functions.classroom, {
          enrollmentId: run._id,
        })
      ).resources,
    ).toHaveLength(1);
    await f.t.run((ctx) => ctx.db.patch(run._id, { tier: "recorded" }));
    expect(
      (
        await f.student.query(api.learning.functions.classroom, {
          enrollmentId: run._id,
        })
      ).resources,
    ).toHaveLength(0);
    expect(
      JSON.stringify(
        await f.t.query(api.courses.queries.getPublishedBySlug, {
          slug: "course",
        }),
      ),
    ).not.toContain("secret-meeting");
  });
  it("checks hosted file authorization again after completion", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    const uploadId = await f.administrator.mutation(
      api.learning.functions.beginMaterialUpload,
      { fileName: "notes.pdf" },
    );
    const storageId = await f.t.run((ctx) =>
      ctx.storage.store(new Blob(["notes"], { type: "application/pdf" })),
    );
    await f.t.mutation(internal.learning.functions.finishUpload, {
      uploadId,
      storageId,
      userId: f.admin,
    });
    await f.administrator.mutation(api.learning.functions.saveResource, {
      courseId: f.course,
      title: "Notes",
      kind: "material",
      uploadId,
    });
    expect(
      await f.t.query(internal.learning.functions.downloadPermission, {
        userId: f.user,
        uploadId,
        enrollmentId: run._id,
      }),
    ).not.toBeNull();
    expect(
      await f.t.query(internal.learning.functions.downloadPermission, {
        userId: f.other,
        uploadId,
        enrollmentId: run._id,
      }),
    ).toBeNull();
    await f.student.mutation(api.learning.functions.submit, {
      enrollmentId: run._id,
      attemptNumber: 1,
      answers: [0],
    });
    expect(
      await f.t.query(internal.learning.functions.downloadPermission, {
        userId: f.user,
        uploadId,
        enrollmentId: run._id,
      }),
    ).toBeNull();
  });
  it("does not allow students to attach another owner's upload", async () => {
    const f = await fixture();
    await f.t.run((ctx) =>
      ctx.db.patch(f.exam, { kind: "manual", questions: [] }),
    );
    const run = await enrolled(f);
    const uploadId = await f.administrator.mutation(
      api.learning.functions.beginMaterialUpload,
      { fileName: "notes.pdf" },
    );
    await expect(
      f.student.mutation(api.learning.functions.submit, {
        enrollmentId: run._id,
        attemptNumber: 1,
        uploadId,
      }),
    ).rejects.toThrow("FORBIDDEN");
    expect(
      await f.t.query(internal.learning.functions.uploadPermission, {
        userId: f.other,
        uploadId,
      }),
    ).toBeNull();
  });
  it("rejects invalid file types", async () => {
    const f = await fixture();
    const uploadId = await f.administrator.mutation(
      api.learning.functions.beginMaterialUpload,
      { fileName: "script.html" },
    );
    const storageId = await f.t.run((ctx) =>
      ctx.storage.store(new Blob(["script"], { type: "text/html" })),
    );
    await expect(
      f.t.mutation(internal.learning.functions.finishUpload, {
        uploadId,
        storageId,
        userId: f.admin,
      }),
    ).rejects.toThrow("FORBIDDEN");
  });
  it("rejects progress for nonexistent lessons", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    await expect(
      f.student.mutation(api.learning.functions.progress, {
        enrollmentId: run._id,
        lessonId: "forged",
        complete: true,
      }),
    ).rejects.toThrow();
  });
  it("refuses sales until an exam exists", async () => {
    const f = await fixture();
    await f.t.run((ctx) => ctx.db.delete(f.exam));
    await expect(
      f.t.mutation(internal.orders.internal.reserveCheckout, {
        userId: f.other,
        courseId: f.course,
        tier: "recorded",
      }),
    ).rejects.toThrow("EXAM_NOT_READY");
  });
  it("expires holds without requiring a cleanup job", async () => {
    const f = await fixture(1);
    await f.t.run((ctx) =>
      ctx.db.patch(f.orderId, { expiresAt: Date.now() - 1 }),
    );
    expect(
      (
        await f.t.mutation(internal.orders.internal.reserveCheckout, {
          userId: f.other,
          courseId: f.course,
          tier: "live",
          scheduleId: f.schedule,
        })
      ).kind,
    ).toBe("create");
  });
  it("serializes concurrent requests into one creation lease", async () => {
    const f = await fixture();
    const args = {
      userId: f.other,
      courseId: f.course,
      tier: "recorded" as const,
    };
    const results = await Promise.all([
      f.t.mutation(internal.orders.internal.reserveCheckout, args),
      f.t.mutation(internal.orders.internal.reserveCheckout, args),
    ]);
    expect(results.map((r) => r.kind).sort()).toEqual(["create", "preparing"]);
  });
  it("rejects missing answers and respects exact passing threshold", async () => {
    const f = await fixture();
    await f.t.run((ctx) =>
      ctx.db.patch(f.exam, {
        passingPercent: 50,
        questions: [
          { id: "a", prompt: "A", options: ["yes", "no"], correct: 0 },
          { id: "b", prompt: "B", options: ["yes", "no"], correct: 0 },
        ],
      }),
    );
    const run = await enrolled(f);
    await expect(
      f.student.mutation(api.learning.functions.submit, {
        enrollmentId: run._id,
        attemptNumber: 1,
        answers: [0],
      }),
    ).rejects.toThrow();
    await f.student.mutation(api.learning.functions.submit, {
      enrollmentId: run._id,
      attemptNumber: 1,
      answers: [0, 1],
    });
    expect((await f.t.run((ctx) => ctx.db.get(run._id)))?.status).toBe(
      "completed",
    );
  });
});
describe("provider calls use mocked network only", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });
  function providerEnv() {
    vi.stubEnv("MP_ACCESS_TOKEN", "test-only");
    vi.stubEnv("SITE_URL", "https://academy.example");
    vi.stubEnv("CONVEX_SITE_URL", "https://backend.example");
  }
  it("blocks anonymous checkout before contacting the provider", async () => {
    const f = await fixture();
    const fetchMock = vi.spyOn(globalThis, "fetch");
    await expect(
      f.t.action(api.checkout.actions.createPreference, {
        courseId: f.course,
        tier: "recorded",
      }),
    ).rejects.toThrow("UNAUTHENTICATED");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("does not create another preference when closure fails", async () => {
    const f = await fixture();
    providerEnv();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 503 }));
    const result = await f.student.action(
      api.checkout.actions.createPreference,
      { courseId: f.course, tier: "recorded" },
    );
    expect(result.kind).toBe("preparing");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]?.method).toBe("PUT");
  });
  it("marks ambiguous creation uncertain instead of allowing another POST", async () => {
    const f = await fixture();
    providerEnv();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("timeout"));
    const other = f.t.withIdentity({ subject: f.other });
    const result = await other.action(api.checkout.actions.createPreference, {
      courseId: f.course,
      tier: "recorded",
    });
    expect(result.kind).toBe("preparing");
    expect(
      (
        await f.t.run((ctx) =>
          ctx.db
            .query("orders")
            .filter((q) => q.eq(q.field("userId"), f.other))
            .first(),
        )
      )?.checkoutState,
    ).toBe("uncertain");
    await other.action(api.checkout.actions.createPreference, {
      courseId: f.course,
      tier: "recorded",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("exception settlement and HTTP boundaries", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });
  it("does not require payer email for a declined attempt", async () => {
    const f = await fixture();
    await f.t.mutation(internal.orders.internal.reconcilePayment, {
      ...f.payment,
      status: "rejected",
      payerEmail: undefined,
    });
    expect(
      (await f.t.run((ctx) => ctx.db.query("paymentAttempts").first()))
        ?.exception,
    ).toBeUndefined();
    expect(
      (
        await f.t.mutation(internal.orders.internal.reserveCheckout, {
          userId: f.user,
          courseId: f.course,
          tier: "recorded",
        })
      ).kind,
    ).toBe("close");
  });
  it("settles a mismatched amount exception when that actual charge is fully refunded", async () => {
    const f = await fixture();
    await f.t.mutation(internal.orders.internal.reconcilePayment, {
      ...f.payment,
      amountMinor: 9000,
    });
    await f.t.mutation(internal.orders.internal.reconcilePayment, {
      ...f.payment,
      amountMinor: 9000,
      status: "refunded",
      refundedMinor: 9000,
      updatedAt: 200,
    });
    expect(
      (await f.t.run((ctx) => ctx.db.query("paymentAttempts").first()))
        ?.exception,
    ).toBeUndefined();
  });
  it("rejects unsigned webhooks without scheduling or calling the provider", async () => {
    const f = await fixture();
    vi.stubEnv("MP_WEBHOOK_SECRET", "test-only");
    const response = await f.t.fetch("/mercadopago-webhook?data.id=123", {
      method: "POST",
      body: JSON.stringify({ type: "payment", data: { id: "123" } }),
    });
    expect(response.status).toBe(401);
    expect(
      await f.t.run((ctx) =>
        ctx.db
          .query("paymentInbox")
          .withIndex("by_payment", (q) => q.eq("paymentId", "123"))
          .collect(),
      ),
    ).toHaveLength(0);
  });
  it("serves files only through authenticated requests, with authorization checked after revocation", async () => {
    const f = await fixture();
    const run = await enrolled(f);
    const uploadId = await f.administrator.mutation(
      api.learning.functions.beginMaterialUpload,
      { fileName: "notes.pdf" },
    );
    const put = await f.administrator.fetch(
      `/private-file?uploadId=${uploadId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/pdf" },
        body: "notes",
      },
    );
    expect(put.status).toBe(200);
    await f.administrator.mutation(api.learning.functions.saveResource, {
      courseId: f.course,
      title: "Notes",
      kind: "material",
      uploadId,
    });
    const path = `/private-file?uploadId=${uploadId}&enrollmentId=${run._id}`;
    expect((await f.t.fetch(path)).status).toBe(401);
    expect((await f.student.fetch(path)).status).toBe(200);
    await f.student.mutation(api.learning.functions.submit, {
      enrollmentId: run._id,
      attemptNumber: 1,
      answers: [0],
    });
    expect((await f.student.fetch(path)).status).toBe(403);
  });
});
