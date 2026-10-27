import { useRef, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Button } from '@/components/ui';

const acceptedTypes = new Set(['application/pdf', 'application/zip', 'application/x-zip-compressed', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const maxBytes = 25 * 1024 * 1024;

type Enrollment = { _id: Id<'enrollments'>; status?: 'active' | 'completed'; finalProjectResubmissionOpen?: boolean; course: { title: string; requiresFinalProject?: boolean } | null };

export function FinalProjectPanel({ enrollments }: { enrollments: Enrollment[] }) {
  const submissions = useQuery(api.finalProjects.queries.mine, {}) ?? [];
  const generateUploadUrl = useMutation(api.finalProjects.mutations.generateUploadUrl);
  const submit = useMutation(api.finalProjects.mutations.submit);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Id<'enrollments'> | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const eligible = enrollments.filter((enrollment) => enrollment.status !== 'completed' && enrollment.course?.requiresFinalProject);

  const latestFor = (enrollmentId: Id<'enrollments'>) => submissions.filter((submission) => submission.enrollmentId === enrollmentId).sort((a, b) => b._creationTime - a._creationTime)[0];
  const upload = async (file: File) => {
    const enrollmentId = selectedEnrollment;
    if (!enrollmentId) return;
    if (!acceptedTypes.has(file.type) || file.size > maxBytes) { setMessage('Subí un PDF, imagen o ZIP de hasta 25 MB.'); return; }
    setUploading(true); setMessage(null);
    try {
      const uploadUrl = await generateUploadUrl({ enrollmentId });
      const response = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
      if (!response.ok) throw new Error('No se pudo subir el archivo.');
      const { storageId } = await response.json() as { storageId: Id<'_storage'> };
      await submit({ enrollmentId, storageId, fileName: file.name });
      setMessage('Proyecto enviado para revisión.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudo enviar el proyecto.'); }
    finally { setUploading(false); setSelectedEnrollment(null); if (inputRef.current) inputRef.current.value = ''; }
  };

  if (!eligible.length) return null;
  return <section className="rounded-2xl border border-outline-variant bg-surface-container-low p-6"><h2 className="text-lg font-bold">Proyecto final</h2><p className="mt-1 text-sm text-on-surface-variant">Aprobalo para completar esta cursada y habilitar una nueva inscripción.</p><div className="mt-4 space-y-3">{eligible.map((enrollment) => {
    const latest = latestFor(enrollment._id);
    const blocked = latest?.status === 'submitted' || (latest?.status === 'rejected' && !enrollment.finalProjectResubmissionOpen);
    return <div key={enrollment._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-outline-variant bg-surface p-4"><div><p className="font-medium">{enrollment.course?.title}</p><p className="text-xs text-on-surface-variant">{latest?.status === 'submitted' ? 'Enviado; pendiente de revisión.' : latest?.status === 'rejected' ? latest.feedback || 'Proyecto rechazado. Esperá que un administrador reabra la entrega.' : 'Todavía no enviaste el proyecto.'}</p></div><Button size="sm" disabled={blocked || uploading} onClick={() => { setSelectedEnrollment(enrollment._id); inputRef.current?.click(); }}>{uploading && selectedEnrollment === enrollment._id ? 'Subiendo…' : 'Subir proyecto'}</Button></div>;
  })}</div>{message && <p role="status" className="mt-3 text-sm text-on-surface-variant">{message}</p>}<input ref={inputRef} className="sr-only" type="file" accept="application/pdf,application/zip,.zip,image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /></section>;
}
