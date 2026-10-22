import { useState } from 'react';
import { useAction, useQuery, useConvexAuth } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Button } from '../ui/Button';
import { AppLink } from '../shared/AppLink';
import type { CourseWithRelations } from '@shared/validators/courses';

interface CourseSidebarProps {
  course: CourseWithRelations;
  preview?: boolean;
}

export function CourseSidebar({ course, preview = false }: CourseSidebarProps) {
  const { isAuthenticated } = useConvexAuth();
  const [formatType, setFormatType] = useState<'live' | 'recorded'>('live');

  const enrollments = useQuery(
    api.enrollments.queries.listMyEnrollments,
    isAuthenticated && !preview ? {} : 'skip',
  );

  const isEnrolled = !preview && enrollments !== undefined && enrollments.some(e => e.courseId === course._id);

  const defaultScheduleId = course.schedules?.find(s => s.enrolledCount < s.capacity)?._id || course.schedules?.[0]?._id || '';
  const [selectedScheduleId, setSelectedScheduleId] = useState(defaultScheduleId);

  const createPreference = useAction(api.checkout.actions.createPreference);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (preview) return;
    try {
      setIsEnrolling(true);
      const res = await createPreference({
        courseId: course._id,
        tier: formatType,
        scheduleId: formatType === 'live' && (selectedScheduleId || defaultScheduleId) ? (selectedScheduleId || defaultScheduleId) as Id<"schedules"> : undefined,
      });

      if (res.initPoint) {
        window.location.href = res.initPoint;
      }
    } catch (error: unknown) {
      console.error('Error creating checkout preference:', error);
      alert(error instanceof Error ? error.message : 'No se pudo iniciar el pago con Mercado Pago.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ARS' });
  const livePrice = course.pricing.live
    ? priceFormatter.format(course.pricing.live.amountMinor / 100)
    : 'No disponible';
  const recordedPrice = course.pricing.recorded
    ? priceFormatter.format(course.pricing.recorded.amountMinor / 100)
    : 'No disponible';

  if (isEnrolled) {
    return (
      <div className={`course-sidebar sticky top-24 p-6 rounded-2xl border border-outline-variant bg-surface-container-low space-y-6 shadow-xl ${preview ? 'course-sidebar--preview' : ''}`}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-on-surface">Inscripción</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Ya estás inscripto
          </span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-outline-variant space-y-2">
          <p className="text-sm font-medium text-on-surface">
            {course.title}
          </p>
          <p className="text-xs text-on-surface-variant">
            Tenés acceso a todos los materiales y clases en vivo.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <AppLink to="/dashboard" className="block w-full">
            <Button 
              variant="primary" 
              className="w-full py-4 font-bold text-base shadow-md flex items-center justify-center gap-2"
            >
              Ir al panel
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Button>
          </AppLink>
          <p className="text-center text-xs text-on-surface-variant">
            Acceso de por vida
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`course-sidebar sticky top-24 p-6 rounded-2xl border border-outline-variant bg-surface-container-low space-y-6 shadow-xl ${preview ? 'course-sidebar--preview' : ''}`}>
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg text-on-surface">Inscripción</span>
        <div className="flex gap-1 bg-surface p-1 rounded-lg border border-outline-variant">
          <Button
            variant={formatType === 'live' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFormatType('live')}
            className={formatType === 'live' ? 'shadow-sm' : 'text-on-surface-variant'}
          >
            En vivo
          </Button>
          <Button
            variant={formatType === 'recorded' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFormatType('recorded')}
            className={formatType === 'recorded' ? 'shadow-sm' : 'text-on-surface-variant'}
          >
            Grabado
          </Button>
        </div>
      </div>

      <div className="text-3xl font-black text-on-surface">
        {formatType === 'live' ? livePrice : recordedPrice}
        <span className="text-xs font-normal text-on-surface-variant ml-2">ARS pago único</span>
      </div>

      {formatType === 'live' && course.schedules && course.schedules.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Elegí tu grupo y horario:
            </label>
            <span className="text-xs text-primary font-medium">Cupos limitados</span>
          </div>
          <div className="space-y-2.5">
            {course.schedules.map((sched) => {
              const isFull = sched.enrolledCount >= sched.capacity;
              const activeScheduleId = selectedScheduleId || defaultScheduleId;
              const isSelected = activeScheduleId === sched._id;

              return (
                <button
                  key={sched._id}
                  disabled={isFull}
                  onClick={() => setSelectedScheduleId(sched._id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all relative ${
                    isFull
                      ? 'border-outline-variant bg-surface opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-sm'
                      : 'border-outline-variant hover:bg-surface text-on-surface-variant'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                      {sched.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isFull ? 'bg-error/10 text-error' : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {isFull ? 'Completo' : `${sched.capacity - sched.enrolledCount} cupos disponibles`}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {sched.sessions.map((session, index) => (
                      <div key={`${session.day}-${session.startTime}-${index}`} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-xs text-primary">event</span>
                        <span className="font-medium text-on-surface">{session.day}:</span>
                        <span>{session.startTime} - {session.endTime}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3 pt-2">
        <Button 
          variant="primary" 
          className="w-full py-4 font-bold text-base shadow-md"
          onClick={handleEnroll}
          disabled={
            preview ||
            isEnrolling ||
            !course.pricing[formatType] ||
            (formatType === 'live' && !selectedScheduleId && !defaultScheduleId)
          }
        >
          {preview ? 'Vista previa: pago desactivado' : isEnrolling ? 'Conectando con Mercado Pago...' : 'Pagar con Mercado Pago'}
        </Button>
        <p className="text-center text-xs text-on-surface-variant">
          🔒 Pago seguro con Mercado Pago. Tu lugar se confirma tras verificar el pago.
        </p>
      </div>
    </div>
  );
}
