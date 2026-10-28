import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui";
import { transferFile } from "./files";
export function ClassroomPage() {
  const { enrollmentId } = useParams();
  const runs = useQuery(api.enrollments.queries.listMyEnrollments, {});
  const run = runs?.find((r) => r._id === enrollmentId);
  const data = useQuery(
    api.learning.functions.classroom,
    run?.canAccess ? { enrollmentId: run._id } : "skip",
  );
  const submit = useMutation(api.learning.functions.submit);
  const progress = useMutation(api.learning.functions.progress);
  const begin = useMutation(api.learning.functions.beginUpload);
  const token = useAuthToken();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  if (runs === undefined) return <p>Cargando…</p>;
  if (!run?.canAccess)
    return (
      <main>
        <h1>Esta cursada no tiene acceso activo</h1>
        <Link to="/dashboard">Volver a mis cursos</Link>
      </main>
    );
  if (!data) return <p>Cargando contenido…</p>;
  const send = async () => {
    setBusy(true);
    setMessage("");
    try {
      let uploadId: Id<"privateUploads"> | undefined;
      if (data.exam?.kind === "manual") {
        if (!file) throw new Error("Seleccioná un archivo.");
        uploadId = await begin({ enrollmentId: run._id, fileName: file.name });
        await transferFile(token, uploadId, file);
      }
      await submit({
        enrollmentId: run._id,
        attemptNumber: run.attemptNumber,
        answers:
          data.exam?.kind === "quiz"
            ? data.exam.questions.map((q) => answers[q.id])
            : undefined,
        uploadId,
      });
      setMessage("Examen enviado.");
    } catch {
      setMessage(
        "No se pudo enviar. Revisá las respuestas o el archivo e intentá nuevamente.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <Link to="/dashboard">← Mis cursos</Link>
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p>Tu acceso termina al aprobar el examen.</p>
      {message && <p role="status">{message}</p>}
      {data.modules.map((module) => (
        <section
          key={module._id}
          className="rounded-xl border border-outline-variant p-5"
        >
          <h2 className="text-xl font-bold">{module.title}</h2>
          {module.lessons?.map((lesson) => (
            <label key={lesson.id} className="my-3 flex gap-3">
              <input
                type="checkbox"
                checked={run.completedLessonIds.includes(lesson.id)}
                onChange={(event) =>
                  void progress({
                    enrollmentId: run._id,
                    lessonId: lesson.id,
                    complete: event.target.checked,
                  }).catch(() => setMessage("No se pudo guardar el progreso."))
                }
              />
              <span>
                {lesson.title}
                <small className="block">{lesson.description}</small>
              </span>
            </label>
          ))}
        </section>
      ))}
      <section>
        <h2 className="text-xl font-bold">Materiales y clases</h2>
        {data.resources.map((resource) => (
          <div key={resource._id} className="my-3">
            {resource.url ? (
              <a
                className="text-primary underline"
                target="_blank"
                rel="noreferrer"
                href={resource.url}
              >
                {resource.title}
              </a>
            ) : (
              resource.uploadId && (
                <Button
                  onClick={() =>
                    void transferFile(
                      token,
                      resource.uploadId!,
                      undefined,
                      run._id,
                    ).catch(() =>
                      setMessage("No se pudo descargar el archivo."),
                    )
                  }
                >
                  {resource.title}
                </Button>
              )
            )}
          </div>
        ))}
      </section>
      {data.exam && (
        <section className="space-y-4 rounded-xl border border-outline-variant p-5">
          <h2 className="text-xl font-bold">Examen final</h2>
          <p>{data.exam.instructions}</p>
          {data.attempts.map((attempt) => (
            <p key={attempt._id}>
              Intento {attempt.number}:{" "}
              {attempt.status === "submitted"
                ? "Pendiente de revisión"
                : attempt.status === "failed"
                  ? "No aprobado"
                  : "Aprobado"}{" "}
              {attempt.score !== undefined && `(${Math.round(attempt.score)}%)`}{" "}
              {attempt.feedback}
            </p>
          ))}
          {run.retryOpen ? (
            <>
              {data.exam.kind === "quiz" ? (
                data.exam.questions.map((q) => (
                  <fieldset key={q.id} className="space-y-2">
                    <legend className="font-bold">{q.prompt}</legend>
                    {q.options.map((option, index) => (
                      <label key={index} className="flex gap-2">
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === index}
                          onChange={() =>
                            setAnswers({ ...answers, [q.id]: index })
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </fieldset>
                ))
              ) : (
                <label>
                  PDF, imagen o ZIP, hasta 25 MB
                  <input
                    type="file"
                    accept=".pdf,.zip,.jpg,.jpeg,.png,.webp,.gif"
                    onChange={(event) =>
                      setFile(event.target.files?.[0] ?? null)
                    }
                  />
                </label>
              )}
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                Entiendo que aprobar termina mi acceso a los contenidos.
              </label>
              <Button
                disabled={
                  busy ||
                  !confirmed ||
                  (data.exam.kind === "quiz" &&
                    data.exam.questions.some(
                      (q) => answers[q.id] === undefined,
                    ))
                }
                onClick={() => void send()}
              >
                {busy ? "Enviando…" : "Enviar examen"}
              </Button>
            </>
          ) : (
            <p>
              Esperá la revisión o solicitá al administrador que habilite otro
              intento.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
