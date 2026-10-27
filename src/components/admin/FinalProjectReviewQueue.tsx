import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui';

export function FinalProjectReviewQueue() {
  const submissions = useQuery(api.finalProjects.queries.pendingReview, {}) ?? [];
  const review = useMutation(api.finalProjects.mutations.review);
  const reopen = useMutation(api.finalProjects.mutations.reopen);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  if (!submissions.length) return <p className="text-sm text-on-surface-variant">No hay proyectos pendientes de revisión.</p>;
  return <div className="space-y-3">{submissions.map((submission) => <article key={submission._id} className="rounded-xl border border-outline-variant p-4"><p className="font-bold">{submission.courseTitle}</p><p className="text-sm text-on-surface-variant">{submission.studentEmail} · {submission.fileName}</p>{submission.status === 'submitted' && <textarea className="mt-3 w-full rounded-lg border border-outline-variant bg-surface p-2 text-sm" placeholder="Comentarios opcionales para el estudiante" value={feedback[submission._id] ?? ''} onChange={(event) => setFeedback((current) => ({ ...current, [submission._id]: event.target.value }))} />}<div className="mt-3 flex gap-2">{submission.url && <a className="text-sm text-primary underline" href={submission.url} target="_blank" rel="noreferrer">Descargar archivo</a>}{submission.status === 'submitted' ? <><Button size="sm" onClick={() => void review({ submissionId: submission._id, decision: 'approved', feedback: feedback[submission._id] || undefined })}>Aprobar</Button><Button size="sm" variant="outline" onClick={() => void review({ submissionId: submission._id, decision: 'rejected', feedback: feedback[submission._id] || undefined })}>Rechazar</Button></> : <Button size="sm" onClick={() => void reopen({ enrollmentId: submission.enrollmentId })}>Reabrir entrega</Button>}</div></article>)}</div>;
}
