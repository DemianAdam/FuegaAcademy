import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import type { QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

const expectedCloud = "https://canny-raven-235.convex.cloud";
const expectedSite = "https://canny-raven-235.convex.site";

function assertDevelopment() {
  if (
    process.env.CONVEX_CLOUD_URL !== expectedCloud ||
    process.env.CONVEX_SITE_URL !== expectedSite
  ) {
    throw new ConvexError("Manual fixtures are restricted to canny-raven-235 development.");
  }
}

export const target = internalQuery({
  args: {},
  handler: () => {
    assertDevelopment();
    return { cloudUrl: expectedCloud, siteUrl: expectedSite };
  },
});

async function result(
  ctx: Pick<QueryCtx, "db">,
  session: string,
  teacher: Doc<"teachers">,
  hybrid: Doc<"courses">,
  quiz: Doc<"courses">,
  created: boolean,
) {
  const schedules = await ctx.db.query("schedules")
    .withIndex("by_course", (q) => q.eq("courseId", hybrid._id)).collect();
  return {
    session,
    created,
    teacherId: teacher._id,
    hybrid: { id: hybrid._id, slug: hybrid.slug },
    quiz: { id: quiz._id, slug: quiz.slug },
    schedules: schedules.map(({ _id, name, startsAt, capacity }) => ({ id: _id, name, startsAt, capacity })),
  };
}

/** Internal and additive: never reseed or reset an existing testing session. */
export const prepare = internalMutation({
  args: { session: v.string() },
  handler: async (ctx, { session }) => {
    assertDevelopment();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(session) || session.length < 3 || session.length > 40) {
      throw new ConvexError("Session must be 3–40 lowercase letters/digits separated by single hyphens.");
    }
    const prefix = `manual-${session}`;
    const teacher = await ctx.db.query("teachers")
      .withIndex("by_slug", (q) => q.eq("slug", `${prefix}-docente`)).unique();
    const hybrid = await ctx.db.query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", `${prefix}-hibrido`)).unique();
    const quiz = await ctx.db.query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", `${prefix}-quiz`)).unique();

    if (teacher || hybrid || quiz) {
      if (!teacher || !hybrid || !quiz || hybrid.teacherId !== teacher._id || quiz.teacherId !== teacher._id) {
        throw new ConvexError("Incomplete or colliding manual session; use a new session name. No records changed.");
      }
      return result(ctx, session, teacher, hybrid, quiz, false);
    }

    // Read canonical frontend configuration; keep the user's tunnel out of backend code.
    const origin = process.env.SITE_URL?.replace(/\/$/, "");
    if (!origin || !/^https:\/\/[^/]+$/.test(origin)) {
      throw new ConvexError("Set SITE_URL to the public HTTPS application origin before creating fixtures.");
    }
    const image = { kind: "external" as const, url: `${origin}/images/hero-background.jpg` };
    const teacherId = await ctx.db.insert("teachers", {
      slug: `${prefix}-docente`, name: `Docente de prueba (${session})`,
      title: "Especialista en aprendizaje", image, status: "published",
      skills: ["Creatividad", "Comunicación"],
      bio: "Perfil ficticio para pruebas manuales de Fuega Academy.",
      quote: "Aprendemos practicando.",
    });
    const common = {
      teacherId, image, polaroid: image, polaroidCaption: "Material de prueba",
      duration: 2, status: "published" as const, badge: "Prueba manual",
      achievements: [{ icon: "school", text: "Completar una cursada de prueba", isHighlighted: false }],
    };
    const hybridId = await ctx.db.insert("courses", {
      ...common, slug: `${prefix}-hibrido`, title: `Prueba manual: curso híbrido (${session})`,
      description: "Curso ficticio con cohortes en vivo, grabaciones y proyecto final manual.",
      format: "hybrid", pricing: {
        live: { amountMinor: 150000, currency: "ARS" },
        recorded: { amountMinor: 100000, currency: "ARS" },
      },
    });
    const quizId = await ctx.db.insert("courses", {
      ...common, slug: `${prefix}-quiz`, title: `Prueba manual: curso con examen (${session})`,
      description: "Curso grabado ficticio con diez preguntas y aprobación desde el 70%.",
      format: "recorded", pricing: { recorded: { amountMinor: 100000, currency: "ARS" } },
    });
    for (const [courseId, suffix] of [[hybridId, "hibrido"], [quizId, "quiz"]] as const) {
      for (const order of [0, 1]) {
        await ctx.db.insert("modules", {
          courseId, order, title: order === 0 ? "Introducción" : "Práctica",
          lessons: [0, 1].map((index) => ({
            id: `${prefix}-${suffix}-${order}-${index}`,
            title: `Clase ${order * 2 + index + 1}: ${order === 0 ? "conceptos" : "ejercicios"}`,
            description: "Lección de prueba para verificar contenido y progreso.", durationMinutes: 30,
          })),
        });
      }
      await ctx.db.insert("courseResources", {
        courseId, lessonId: `${prefix}-${suffix}-0-0`, kind: "recording",
        title: "Grabación de ejemplo (enlace de prueba, sin video)",
        url: "https://example.com/#grabacion-de-prueba",
      });
    }
    await ctx.db.insert("exams", {
      courseId: hybridId, kind: "manual", version: 1, published: true,
      instructions: "Subí una imagen JPEG o PNG de prueba como proyecto final. Aprobar termina el acceso a esta cursada.",
      passingPercent: 70, questions: [],
    });
    await ctx.db.insert("exams", {
      courseId: quizId, kind: "quiz", version: 1, published: true,
      instructions: "Respondé las diez preguntas. Se aprueba con 7 respuestas correctas. Aprobar termina el acceso.",
      passingPercent: 70,
      questions: Array.from({ length: 10 }, (_, i) => ({
        id: `${prefix}-pregunta-${i + 1}`, prompt: `Pregunta ${i + 1}: ¿practicar ayuda a aprender?`,
        options: ["Sí", "No"], correct: 0,
      })),
    });
    const now = Date.now();
    for (const [name, days, capacity] of [
      ["Cohorte futura — 10 cupos", 30, 10],
      ["Cohorte futura — último cupo", 31, 1],
      ["Cohorte ya iniciada — no comprar", -1, 10],
    ] as const) {
      const scheduleId = await ctx.db.insert("schedules", {
        courseId: hybridId, name, startsAt: now + days * 86400000,
        capacity, enrolledCount: 0, isArchived: false,
        sessions: [{ day: 2, startTime: "18:00", endTime: "19:00" }],
      });
      await ctx.db.insert("courseResources", {
        courseId: hybridId, scheduleId, kind: "live",
        title: `Encuentro de ejemplo: ${name} (enlace de prueba)`,
        url: `https://example.com/#encuentro-${days}`,
      });
    }
    const newTeacher = await ctx.db.get(teacherId);
    const newHybrid = await ctx.db.get(hybridId);
    const newQuiz = await ctx.db.get(quizId);
    if (!newTeacher || !newHybrid || !newQuiz) throw new Error("Fixture creation failed.");
    return result(ctx, session, newTeacher, newHybrid, newQuiz, true);
  },
});
