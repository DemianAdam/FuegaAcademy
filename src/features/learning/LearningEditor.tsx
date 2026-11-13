import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useAuthToken } from "@convex-dev/auth/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { Button, Input } from "@/components/ui";
import { transferFile } from "./files";
type Question = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
};
export function LearningEditor({
  courseId,
  schedules,
}: {
  courseId: Id<"courses">;
  schedules: { _id: Id<"schedules">; name: string }[];
}) {
  const data = useQuery(api.learning.functions.adminCourse, { courseId });
  const publish = useMutation(api.learning.functions.publishExam);
  const save = useMutation(api.learning.functions.saveResource);
  const remove = useMutation(api.learning.functions.removeResource);
  const begin = useMutation(api.learning.functions.beginMaterialUpload);
  const token = useAuthToken();
  const [kind, setKind] = useState<"quiz" | "manual">("manual");
  const [instructions, setInstructions] = useState("");
  const [passing, setPassing] = useState(70);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [resourceKind, setResourceKind] = useState<
    "material" | "recording" | "live"
  >("material");
  const [scheduleId, setScheduleId] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const perform = async (action: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await action();
      setMessage("Guardado.");
    } catch {
      setMessage("No se pudo guardar. Revisá los campos, permisos y archivo.");
    } finally {
      setBusy(false);
    }
  };
  const addResource = () =>
    perform(async () => {
      let uploadId: Id<"privateUploads"> | undefined;
      if (file) {
        uploadId = await begin({ fileName: file.name });
        await transferFile(token, uploadId, file);
      }
      await save({
        courseId,
        title,
        kind: resourceKind,
        url: file ? undefined : url,
        uploadId,
        scheduleId:
          resourceKind === "live" ? (scheduleId as Id<"schedules">) : undefined,
      });
      setTitle("");
      setUrl("");
      setFile(null);
    });
  return (
    <section className="mb-8 space-y-5 rounded-xl border border-outline-variant p-5">
      <h2 className="text-2xl font-bold">Contenido privado y examen</h2>
      <p>
        Guardá un examen para habilitar compras. Cada publicación crea una
        versión; las cursadas existentes mantienen su examen.
      </p>
      <p role="status">{message}</p>
      <p>{data?.exams.length ?? 0} versiones publicadas</p>
      {data?.exams.map((exam) => (
        <Button
          key={exam._id}
          onClick={() => {
            setKind(exam.kind);
            setInstructions(exam.instructions);
            setPassing(exam.passingPercent);
            setQuestions(exam.questions);
          }}
        >
          Editar desde versión {exam.version}
        </Button>
      ))}
      <select
        value={kind}
        onChange={(e) => setKind(e.target.value as typeof kind)}
      >
        <option value="manual">Evaluación manual</option>
        <option value="quiz">Cuestionario automático</option>
      </select>
      <Input
        aria-label="Instrucciones del examen"
        placeholder="Instrucciones del examen"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />
      {kind === "quiz" && (
        <>
          <label>
            Porcentaje para aprobar
            <Input
              type="number"
              min={1}
              max={100}
              value={passing}
              onChange={(e) => setPassing(Number(e.target.value))}
            />
          </label>
          {questions.map((q, index) => (
            <fieldset key={q.id} className="space-y-2 rounded border p-3">
              <Input
                placeholder="Pregunta"
                value={q.prompt}
                onChange={(e) =>
                  setQuestions(
                    questions.map((item, i) =>
                      i === index ? { ...item, prompt: e.target.value } : item,
                    ),
                  )
                }
              />
              {q.options.map((option, j) => (
                <label key={j} className="flex gap-2">
                  <input
                    type="radio"
                    name={q.id}
                    checked={q.correct === j}
                    onChange={() =>
                      setQuestions(
                        questions.map((item, i) =>
                          i === index ? { ...item, correct: j } : item,
                        ),
                      )
                    }
                  />
                  <Input
                    aria-label={`Opción ${j + 1}`}
                    value={option}
                    onChange={(e) =>
                      setQuestions(
                        questions.map((item, i) =>
                          i === index
                            ? {
                                ...item,
                                options: item.options.map((o, k) =>
                                  k === j ? e.target.value : o,
                                ),
                              }
                            : item,
                        ),
                      )
                    }
                  />
                </label>
              ))}
              <Button
                onClick={() =>
                  setQuestions(questions.filter((_, i) => i !== index))
                }
              >
                Quitar pregunta
              </Button>
            </fieldset>
          ))}
          <Button
            onClick={() =>
              setQuestions([
                ...questions,
                {
                  id: crypto.randomUUID(),
                  prompt: "",
                  options: ["", "", "", ""],
                  correct: 0,
                },
              ])
            }
          >
            Agregar pregunta
          </Button>
        </>
      )}
      <Button
        disabled={busy || !instructions.trim()}
        onClick={() =>
          void perform(() =>
            publish({
              courseId,
              kind,
              instructions,
              passingPercent: passing,
              questions: kind === "quiz" ? questions : [],
            }),
          )
        }
      >
        Publicar examen
      </Button>
      <h3 className="text-xl font-bold">Materiales, grabaciones y sesiones</h3>
      {data?.resources.map((r) => (
        <div key={r._id} className="flex gap-3">
          <span>{r.title}</span>
          <Button
            disabled={busy}
            onClick={() => void perform(() => remove({ id: r._id }))}
          >
            Quitar
          </Button>
        </div>
      ))}
      <Input
        placeholder="Título del recurso"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        value={resourceKind}
        onChange={(e) => setResourceKind(e.target.value as typeof resourceKind)}
      >
        <option value="material">Material</option>
        <option value="recording">Grabación</option>
        <option value="live">Sesión en vivo</option>
      </select>
      {resourceKind === "live" && (
        <select
          value={scheduleId}
          onChange={(e) => setScheduleId(e.target.value)}
        >
          <option value="">Elegir cohorte</option>
          {schedules.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      )}
      <Input
        placeholder="Enlace HTTPS"
        disabled={!!file}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <label>
        O archivo (hasta 25 MB)
        <input
          type="file"
          accept=".pdf,.zip,.jpg,.jpeg,.png,.webp,.gif"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <Button
        disabled={busy || !title || (!url && !file)}
        onClick={() => void addResource()}
      >
        Agregar recurso
      </Button>
    </section>
  );
}
