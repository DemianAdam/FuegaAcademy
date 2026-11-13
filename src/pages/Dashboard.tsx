import { useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
export function Dashboard() {
  const runs = useQuery(api.enrollments.queries.listMyEnrollments, {});
  if (!runs) return <p>Cargando cursos…</p>;
  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold">Mis cursos</h1>
      {(["active", "completed", "revoked"] as const).map((status) => (
        <section key={status}>
          <h2 className="mb-4 text-xl font-bold">
            {status === "active"
              ? "En curso"
              : status === "completed"
                ? "Completados"
                : "Acceso revocado"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {runs
              .filter((r) => r.status === status)
              .map((run) => (
                <article
                  key={run._id}
                  className="rounded-xl border border-outline-variant p-5"
                >
                  <h3 className="font-bold">{run.course?.title}</h3>
                  <p>
                    Cursada {run.runNumber} ·{" "}
                    {run.tier === "live" ? "En vivo" : "Grabado"}
                  </p>
                  {run.canAccess ? (
                    <>
                      <p>
                        {run.progressPercent}% de lecciones marcadas ·{" "}
                        {run.retryOpen
                          ? "Examen disponible"
                          : "Examen enviado; aguardá revisión o reapertura"}
                      </p>
                      <Link
                        className="text-primary underline"
                        to={`/dashboard/enrollments/${run._id}`}
                      >
                        Continuar curso
                      </Link>
                    </>
                  ) : (
                    <p>El contenido de esta cursada ya no está disponible.</p>
                  )}
                  {run.examHistory?.map((attempt) => (
                    <p key={attempt._id}>
                      Examen {attempt.number}:{" "}
                      {attempt.status === "passed"
                        ? "Aprobado"
                        : attempt.status === "failed"
                          ? "No aprobado"
                          : "Pendiente"}{" "}
                      {attempt.score !== undefined
                        ? `${Math.round(attempt.score)}%`
                        : ""}{" "}
                      {attempt.feedback}
                    </p>
                  ))}
                  {run.canPurchaseAgain && run.course && (
                    <Link
                      className="text-primary underline"
                      to={`/course/${run.course.slug}`}
                    >
                      Comprar otra cursada
                    </Link>
                  )}
                </article>
              ))}
          </div>
        </section>
      ))}
      <Link to="/courses">Explorar cursos</Link>
    </main>
  );
}
