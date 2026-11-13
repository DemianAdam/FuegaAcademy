import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "../schema";
import { internal } from "../_generated/api";
import { modules } from "../test.setup";

beforeEach(() => {
  vi.stubEnv("CONVEX_CLOUD_URL", "https://canny-raven-235.convex.cloud");
  vi.stubEnv("CONVEX_SITE_URL", "https://canny-raven-235.convex.site");
  vi.stubEnv("SITE_URL", "https://academy.example");
});
afterEach(() => vi.unstubAllEnvs());

describe("additive manual fixtures", () => {
  it("creates complete Spanish fixtures with stable lessons, resources, prices and exams", async () => {
    const t = convexTest(schema, modules);
    const start = Date.now();
    const f = await t.mutation(internal.manualTesting.seed.prepare, { session: "round-one" });
    expect(f.created).toBe(true);
    await t.run(async (ctx) => {
      const hybrid = await ctx.db.get(f.hybrid.id);
      const quiz = await ctx.db.get(f.quiz.id);
      expect(hybrid?.pricing.live).toEqual({ amountMinor: 150000, currency: "ARS" });
      expect(quiz?.format).toBe("recorded");
      const allModules = await ctx.db.query("modules").collect();
      expect(allModules).toHaveLength(4);
      expect(new Set(allModules.flatMap((m) => m.lessons.map((l) => l.id))).size).toBe(8);
      const exams = await ctx.db.query("exams").collect();
      expect(exams.find((e) => e.courseId === f.hybrid.id)?.kind).toBe("manual");
      const quizExam = exams.find((e) => e.courseId === f.quiz.id);
      expect(quizExam).toMatchObject({ kind: "quiz", passingPercent: 70, published: true });
      expect(quizExam?.questions).toHaveLength(10);
      expect(f.schedules.filter((s) => s.startsAt > start)).toHaveLength(2);
      expect(f.schedules.find((s) => s.capacity === 1)?.startsAt).toBeGreaterThan(start);
      expect(f.schedules.filter((s) => s.startsAt < start)).toHaveLength(1);
      const resources = await ctx.db.query("courseResources").collect();
      expect(resources.filter((r) => r.kind === "live")).toHaveLength(3);
      expect(resources.filter((r) => r.kind === "recording")).toHaveLength(2);
      expect(await ctx.db.query("users").collect()).toEqual([]);
      expect(await ctx.db.query("orders").collect()).toEqual([]);
      expect(await ctx.db.query("enrollments").collect()).toEqual([]);
    });
  });

  it("does not write on retry, including after admin edits, checkout and deletion of a resource", async () => {
    const t = convexTest(schema, modules);
    const f = await t.mutation(internal.manualTesting.seed.prepare, { session: "round-one" });
    await t.run(async (ctx) => {
      await ctx.db.patch(f.hybrid.id, { title: "Título editado", status: "archived" });
      await ctx.db.patch(f.schedules[0].id, { enrolledCount: 1 });
      const resource = await ctx.db.query("courseResources").first();
      if (resource) await ctx.db.delete(resource._id);
      const userId = await ctx.db.insert("users", { role: "student", email: "manual@example.com" });
      const exam = await ctx.db.query("exams").withIndex("by_course", (q) => q.eq("courseId", f.quiz.id)).first();
      if (!exam) throw new Error("Missing quiz");
      await ctx.db.insert("orders", {
        userId, courseId: f.quiz.id, tier: "recorded", amountMinor: 100000, currency: "ARS",
        runNumber: 1, examId: exam._id, checkoutState: "closed", leaseUntil: 0,
        superseded: false, closureAttempts: 0, recoveryAttempts: 0, status: "expired", provider: "mercadopago",
      });
    });
    const snapshot = () => t.run(async (ctx) => ({
      courses: await ctx.db.query("courses").collect(), teachers: await ctx.db.query("teachers").collect(),
      modules: await ctx.db.query("modules").collect(), schedules: await ctx.db.query("schedules").collect(),
      exams: await ctx.db.query("exams").collect(), resources: await ctx.db.query("courseResources").collect(),
      users: await ctx.db.query("users").collect(), orders: await ctx.db.query("orders").collect(),
    }));
    const before = await snapshot();
    const retry = await t.mutation(internal.manualTesting.seed.prepare, { session: "round-one" });
    expect(retry.created).toBe(false);
    expect(retry.hybrid).toEqual(f.hybrid);
    expect(retry.quiz).toEqual(f.quiz);
    expect(await snapshot()).toEqual(before);
  });

  it("creates a separate session without changing existing catalog or accounts", async () => {
    const t = convexTest(schema, modules);
    const a = await t.mutation(internal.manualTesting.seed.prepare, { session: "round-one" });
    const before = await t.run(async (ctx) => ({ course: await ctx.db.get(a.hybrid.id), teacher: await ctx.db.get(a.teacherId) }));
    const b = await t.mutation(internal.manualTesting.seed.prepare, { session: "round-two" });
    expect(a.teacherId).not.toBe(b.teacherId);
    expect(a.hybrid.id).not.toBe(b.hybrid.id);
    expect(await t.run(async (ctx) => ({ course: await ctx.db.get(a.hybrid.id), teacher: await ctx.db.get(a.teacherId) }))).toEqual(before);
    expect(await t.run((ctx) => ctx.db.query("courses").collect())).toHaveLength(4);
  });

  it("rejects a partial namespace without changing it", async () => {
    const t = convexTest(schema, modules);
    const f = await t.mutation(internal.manualTesting.seed.prepare, { session: "round-one" });
    await t.run((ctx) => ctx.db.delete(f.quiz.id));
    await expect(t.mutation(internal.manualTesting.seed.prepare, { session: "round-one" })).rejects.toThrow("Incomplete or colliding");
    expect(await t.run((ctx) => ctx.db.query("courses").collect())).toHaveLength(1);
    expect(await t.run((ctx) => ctx.db.query("teachers").collect())).toHaveLength(1);
  });

  it("rejects malformed session names before creating data", async () => {
    const t = convexTest(schema, modules);
    await expect(t.mutation(internal.manualTesting.seed.prepare, { session: "../prod" })).rejects.toThrow("Session must");
    expect(await t.run((ctx) => ctx.db.query("teachers").collect())).toEqual([]);
  });

  it("refuses any other deployment at the server boundary", async () => {
    vi.stubEnv("CONVEX_CLOUD_URL", "https://production.convex.cloud");
    const t = convexTest(schema, modules);
    await expect(t.query(internal.manualTesting.seed.target, {})).rejects.toThrow("restricted");
    await expect(t.mutation(internal.manualTesting.seed.prepare, { session: "round-one" })).rejects.toThrow("restricted");
    expect(await t.run((ctx) => ctx.db.query("teachers").collect())).toEqual([]);
  });

  it("requires a public application origin before writing a new namespace", async () => {
    vi.stubEnv("SITE_URL", "http://localhost:3000");
    const t = convexTest(schema, modules);
    await expect(t.mutation(internal.manualTesting.seed.prepare, { session: "round-one" })).rejects.toThrow("SITE_URL");
    expect(await t.run((ctx) => ctx.db.query("teachers").collect())).toEqual([]);
  });
});
