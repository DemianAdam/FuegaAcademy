/* oxlint-disable react/only-export-components -- test-only module replaces the Convex transport */
/* Test-only transport. Never included by the production Vite configuration. */
import { useSyncExternalStore } from "react";
import { getFunctionName } from "convex/server";
import type { FunctionReference } from "convex/server";
import type { ReactNode } from "react";
const deadline = Date.now() + 1800000;
let version = 0;
const listeners = new Set<() => void>();
const state = {
  authenticated: false,
  status: "pending",
  runs: [] as Record<string, unknown>[],
  attempts: [] as Record<string, unknown>[],
  sequence: 0,
};
const emit = () => {
  version++;
  for (const listener of listeners) listener();
};
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function useVersion() {
  useSyncExternalStore(subscribe, () => version);
}
export const course = {
  _id: "course",
  _creationTime: 0,
  slug: "demo",
  title: "Curso de prueba",
  description: "Aprendé con material y examen.",
  format: "hybrid",
  duration: 1,
  achievements: [],
  pricing: {
    recorded: { amountMinor: 10000, currency: "ARS" },
    live: { amountMinor: 15000, currency: "ARS" },
  },
  imageUrl:
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  polaroidImage:
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  polaroidCaption: "",
  teacher: null,
  mentor: null,
  modules: [
    {
      _id: "module",
      title: "Introducción",
      lessons: [
        {
          id: "lesson",
          title: "Lección inicial",
          description: "Contenido",
          durationMinutes: 10,
        },
      ],
    },
  ],
  schedules: [
    {
      _id: "schedule",
      name: "Cohorte futura",
      startsAt: Date.now() + 86400000,
      capacity: 10,
      enrolledCount: 0,
      sessions: [{ day: 1, startTime: "18:00", endTime: "20:00" }],
    },
  ],
};
let selectedTier = "recorded";
function approve() {
  state.status = "approved";
  state.sequence++;
  state.runs.push({
    _id: `run${state.sequence}`,
    _creationTime: 0,
    courseId: "course",
    course,
    tier: selectedTier,
    status: "active",
    canAccess: true,
    canPurchaseAgain: false,
    runNumber: state.sequence,
    retryOpen: true,
    attemptNumber: 1,
    completedLessonIds: [],
    progressPercent: 0,
  });
  emit();
}
export const controls = {
  startCohort() {
    course.schedules[0].startsAt = Date.now() - 1000;
    emit();
  },
  approve,
  reopen() {
    const run = state.runs.at(-1)!;
    run.retryOpen = true;
    run.attemptNumber = Number(run.attemptNumber) + 1;
    emit();
  },
  refund() {
    state.status = "refunded";
    const run = state.runs.at(-1)!;
    run.status = "revoked";
    run.canAccess = false;
    run.canPurchaseAgain = true;
    emit();
  },
  review() {
    state.status = "review";
    emit();
  },
  expired() {
    state.status = "expired";
    emit();
  },
  logout() {
    state.authenticated = false;
    emit();
  },
};
Object.assign(window, { purchaseTest: controls });
export function useQuery(
  reference: FunctionReference<"query">,
  args?: Record<string, unknown> | "skip",
): unknown {
  useVersion();
  if (args === "skip") return undefined;
  const name = getFunctionName(reference);
  if (name === "users/queries:getCurrentUser")
    return state.authenticated
      ? {
          _id: "student",
          _creationTime: 0,
          email: "student@example.com",
          role: "student",
        }
      : null;
  if (name === "courses/queries:getPublishedBySlug") return course;
  if (name === "courses/queries:listPublished") return [course];
  if (name === "enrollments/queries:listMyEnrollments") return state.runs;
  if (name === "orders/queries:getMyStatus")
    return args?.orderId === "foreign"
      ? null
      : {
          id: "order",
          status: state.status,
          courseTitle: course.title,
          courseSlug: "demo",
          tier: selectedTier,
          checkoutState: "ready",
          expiresAt: deadline,
          amountMinor: 10000,
          currency: "ARS",
        };
  if (name === "learning/functions:classroom") {
    const run = state.runs.find((r) => r._id === args?.enrollmentId);
    return {
      run,
      title: course.title,
      modules: course.modules,
      resources: [
        {
          _id: "resource",
          title: "Grabación de la clase",
          kind: "recording",
          url: "https://example.test/recording",
        },
      ],
      exam: {
        id: "exam",
        kind: "quiz",
        instructions: "Elegí la respuesta correcta",
        passingPercent: 70,
        questions: [
          {
            id: "q",
            prompt: "¿Cuál es la respuesta?",
            options: ["Correcta", "Incorrecta"],
          },
        ],
      },
      attempts: state.attempts.filter(
        (a) => a.enrollmentId === args?.enrollmentId,
      ),
    };
  }
  return [];
}
export function useAction(reference: FunctionReference<"action">) {
  return async (args: Record<string, unknown>) => {
    if (getFunctionName(reference) === "checkout/actions:createPreference") {
      selectedTier = String(args.tier);
      state.status = "pending";
      emit();
      return { kind: "processing", orderId: "order" };
    }
    throw new Error("Unexpected action");
  };
}
export function useMutation(reference: FunctionReference<"mutation">) {
  return async (args: Record<string, unknown>) => {
    const run = state.runs.find((r) => r._id === args.enrollmentId)!;
    if (getFunctionName(reference) === "learning/functions:submit") {
      const pass = (args.answers as number[])[0] === 0;
      state.attempts.push({
        _id: `attempt${state.attempts.length}`,
        enrollmentId: run._id,
        number: run.attemptNumber,
        status: pass ? "passed" : "failed",
        score: pass ? 100 : 0,
      });
      run.retryOpen = false;
      if (pass) {
        run.status = "completed";
        run.canAccess = false;
        run.canPurchaseAgain = true;
      }
      emit();
      return "attempt";
    }
    if (getFunctionName(reference) === "learning/functions:progress") {
      run.completedLessonIds = args.complete ? [args.lessonId] : [];
      emit();
      return;
    }
    throw new Error("Unexpected mutation");
  };
}
export function useConvexAuth() {
  useVersion();
  return { isAuthenticated: state.authenticated, isLoading: false };
}
export function useAuthActions() {
  return {
    signIn: async () => {
      state.authenticated = true;
      emit();
    },
    signOut: async () => {
      state.authenticated = false;
      emit();
    },
  };
}
export function useAuthToken() {
  return state.authenticated ? "test-token" : null;
}
export function ConvexAuthProvider({ children }: { children: ReactNode }) {
  return children;
}
export class ConvexReactClient {}
