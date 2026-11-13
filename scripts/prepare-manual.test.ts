import { describe, expect, it, vi } from "vitest";
import { assertLocalTarget, expectedCloud, expectedDeployment, expectedSite, prepareManual } from "./prepare-manual.mjs";

const local = { CONVEX_DEPLOYMENT: expectedDeployment, VITE_CONVEX_URL: expectedCloud };
const remote = { cloudUrl: expectedCloud, siteUrl: expectedSite };

describe("manual preparation targeting", () => {
  it.each([
    ["production selector", { ...local, CONVEX_DEPLOYMENT: "prod:canny-raven-235" }, {}],
    ["other dev URL", { ...local, VITE_CONVEX_URL: "https://another.convex.cloud" }, {}],
    ["shell selector override", local, { CONVEX_DEPLOYMENT: "prod:other" }],
    ["shell URL override", local, { VITE_CONVEX_URL: "https://other.convex.cloud" }],
    ["deployment key", local, { CONVEX_DEPLOY_KEY: "secret-test-value" }],
    ["deployment token", { ...local, CONVEX_DEPLOYMENT_TOKEN: "secret-test-value" }, {}],
    ["self hosted override", local, { CONVEX_SELF_HOSTED_URL: "https://other.example" }],
    ["missing configuration", {}, {}],
  ])("rejects %s before contacting Convex", (_label, env, shell) => {
    const run = vi.fn();
    expect(() => prepareManual(["--session", "round-one"], env, shell, run)).toThrow();
    expect(run).not.toHaveBeenCalled();
  });

  it.each([[], ["--session", "--prod"], ["--session", "a"], ["--session", "one", "--prod"], ["--session", "one", "--deployment", "dev"], ["--session", "ONE"], ["--session", "one--two"], ["--session", "one", "--session", "two"]])("rejects invalid arguments %j", (...args) => {
    const run = vi.fn();
    expect(() => prepareManual(args, local, {}, run)).toThrow();
    expect(run).not.toHaveBeenCalled();
  });

  it("rejects an unexpected resolved backend without mutating", () => {
    const run = vi.fn(() => ({ ...remote, cloudUrl: "https://other.convex.cloud" }));
    expect(() => prepareManual(["--session", "round-one"], local, {}, run)).toThrow("different deployment");
    expect(run.mock.calls).toEqual([["manualTesting/seed:target", {}]]);
  });

  it("dry-run checks the resolved backend without mutating", () => {
    const run = vi.fn(() => remote);
    expect(prepareManual(["--session", "round-one", "--dry-run"], local, {}, run)).toMatchObject({ dryRun: true });
    expect(run.mock.calls).toEqual([["manualTesting/seed:target", {}]]);
    expect(() => assertLocalTarget(local, {})).not.toThrow();
  });

  it("only prepares after checking the resolved backend and returns fixture links", () => {
    const run = vi.fn().mockReturnValueOnce(remote).mockReturnValueOnce({
      hybrid: { id: "hybrid-id", slug: "manual-round-one-hibrido" },
      quiz: { id: "quiz-id", slug: "manual-round-one-quiz" },
    });
    const out = prepareManual(["--session", "round-one"], local, {}, run);
    expect(run.mock.calls).toEqual([
      ["manualTesting/seed:target", {}], ["manualTesting/seed:prepare", { session: "round-one" }],
    ]);
    expect(out.links.hybrid).toContain("/course/manual-round-one-hibrido");
    expect(out.links.quizAdmin).toContain("/admin/courses/quiz-id/edit");
  });
});
