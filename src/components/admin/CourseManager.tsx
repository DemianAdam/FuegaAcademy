import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Doc } from '../../../convex/_generated/dataModel';
import { Button, Card, Badge } from '@/components/ui';
import { AppLink } from '@/components/shared';
import { calculateCourseWeeks } from '@/lib/utils';

export const CourseManager: React.FC = () => {
  const courses = useQuery(api.courses.queries.list);
  const removeCourse = useMutation(api.courses.mutations.remove);
  const restoreCourse = useMutation(api.courses.mutations.restore);
  const [pendingCourseId, setPendingCourseId] = useState<Doc<'courses'>['_id'] | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStatusChange = async (course: Doc<'courses'>) => {
    const isArchived = course.status === 'archived';
    const confirmation = isArchived
      ? '¿Poner este curso online y reactivar sus horarios?'
      : '¿Archivar este curso y sus horarios?';
    if (!window.confirm(confirmation)) return;
    setPendingCourseId(course._id);
    setActionError(null);
    try {
      if (isArchived) await restoreCourse({ id: course._id });
      else await removeCourse({ id: course._id });
    } catch (err) {
      console.error(isArchived ? 'No se pudo poner online el curso:' : 'No se pudo archivar el curso:', err);
      setActionError(isArchived
        ? 'No se pudo poner online el curso. Verificá que tenga precios válidos y horarios activos antes de restaurarlo.'
        : 'No se pudo archivar el curso.');
    } finally {
      setPendingCourseId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-surface-container/60 p-6 rounded-2xl border border-outline-variant">
        <div>
          <h3 className="text-xl font-bold">Gestión de cursos</h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Creá y administrá masterclasses en vivo, grabadas e híbridas.
          </p>
        </div>
        <AppLink to="/admin/courses/new">
          <Button>+ Crear curso</Button>
        </AppLink>
      </div>

      {actionError && <p role="alert" className="rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error">{actionError}</p>}

      {!courses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-surface-container rounded-2xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card className="p-8 text-center bg-surface-container text-on-surface-variant">
          No se encontraron cursos.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const weeks = calculateCourseWeeks(course.duration, course.schedules);
            const formatLabel =
              course.format === 'live'
                ? 'En Vivo'
                : course.format === 'recorded'
                ? 'Grabado'
                : 'Híbrido';
            const priceLive = course.pricing?.live
              ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(course.pricing.live.amountMinor / 100)
              : null;
            const priceRecorded = course.pricing?.recorded
              ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(course.pricing.recorded.amountMinor / 100)
              : null;

            return (
              <Card
                key={course._id}
                className="bg-surface-container/60 border border-outline-variant p-5 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 rounded-xl overflow-hidden mb-4 border border-outline-variant">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {course.badge && (
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            course.badge === 'most-chosen' ||
                            course.badge === 'new' ||
                            course.badge === 'popular'
                              ? course.badge
                              : 'popular'
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase">
                      {formatLabel}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {weeks} semanas ({course.duration} clases)
                    </span>
                  </div>
                  {course.status === 'archived' && <span className="mb-2 inline-flex rounded-full bg-error/10 px-2.5 py-1 text-xs font-semibold uppercase text-error">Archivado</span>}
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  {course.teacher && (
                    <p className="text-xs text-on-surface font-medium mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">person</span>
                      Profesor: {course.teacher.name}
                    </p>
                  )}
                  <div className="text-xs font-bold text-primary mb-4 flex gap-3">
                    {priceLive && <span>En vivo: {priceLive}</span>}
                    {priceRecorded && <span>Grabado: {priceRecorded}</span>}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-outline-variant/40">
                  <AppLink to={`/admin/courses/${course._id}/edit`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </AppLink>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pendingCourseId === course._id}
                    className={course.status === 'archived' ? 'text-primary hover:bg-primary/10' : 'text-error hover:bg-error/10'}
                    onClick={() => handleStatusChange(course)}
                  >
                    {pendingCourseId === course._id ? 'Guardando…' : course.status === 'archived' ? 'Poner online' : 'Archivar'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
