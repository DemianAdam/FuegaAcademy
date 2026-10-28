import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui";
import { transferFile } from "./files";
export function ExamReviewQueue() {
  const rows = useQuery(api.learning.functions.reviewQueue, {}) ?? [];
  const review = useMutation(api.learning.functions.review);
  const reopen = useMutation(api.learning.functions.reopen);
  const token = useAuthToken();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const perform = async (action: () => Promise<unknown>) => {
    try {
      await action();
      setMessage("Guardado.");
    } catch {
      setMessage("No se pudo guardar. Revisá el estado y la explicación.");
    }
  };
  return (
    <section className="space-y-4">
      <p role="status">{message}</p>
      {rows.map(({ run, student, course, exam, attempts }) => (
        <article
          key={run._id}
          className="space-y-3 rounded-xl border border-outline-variant p-4"
        >
          <h3>
            {course} · {student} · Intento {run.attemptNumber}
          </h3>
          {attempts.map((a) => (
            <div key={a._id}>
              {a.status} {a.feedback}
              {a.uploadId && (
                <Button
                  onClick={() =>
                    void perform(() => transferFile(token, a.uploadId!))
                  }
                >
                  Descargar entrega
                </Button>
              )}
            </div>
          ))}
          {exam?.kind === "manual" &&
            (run.retryOpen ||
              attempts.some(
                (a) =>
                  a.number === run.attemptNumber && a.status === "submitted",
              )) && (
              <>
                <label>
                  Comentario / evidencia del examen
                  <input
                    className="block w-full border p-2"
                    value={notes[run._id] ?? ""}
                    onChange={(e) =>
                      setNotes({ ...notes, [run._id]: e.target.value })
                    }
                  />
                </label>
                <Button
                  disabled={!notes[run._id]?.trim()}
                  onClick={() =>
                    void perform(() =>
                      review({
                        enrollmentId: run._id,
                        passed: true,
                        note: notes[run._id],
                      }),
                    )
                  }
                >
                  Aprobar y finalizar acceso
                </Button>
                <Button
                  disabled={!notes[run._id]?.trim()}
                  onClick={() =>
                    void perform(() =>
                      review({
                        enrollmentId: run._id,
                        passed: false,
                        note: notes[run._id],
                      }),
                    )
                  }
                >
                  No aprobar
                </Button>
              </>
            )}
          {!run.retryOpen &&
            attempts.some(
              (a) => a.number === run.attemptNumber && a.status === "failed",
            ) && (
              <Button
                onClick={() =>
                  void perform(() => reopen({ enrollmentId: run._id }))
                }
              >
                Habilitar nuevo intento
              </Button>
            )}
        </article>
      ))}
    </section>
  );
}
