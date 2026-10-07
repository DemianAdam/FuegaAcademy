  import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { calculateCourseWeeks } from '../../lib/utils';
import type { CourseCreateInput } from '@shared/validators/courses';

interface CoursePreviewProps {
  course: Partial<CourseCreateInput>;
  teacherName?: string;
}

export function CoursePreview({ course, teacherName }: CoursePreviewProps) {
  const title = course.title || 'Título del Programa';
  const description = course.description || 'Descripción detallada del curso que aparecerá para los estudiantes...';
  const imageUrl = course.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
  const duration = course.duration ?? 16;
  const calculatedWeeks = calculateCourseWeeks(duration, course.schedules);
  const format = course.format || 'hybrid';
  const badge = course.badge;
  const achievements = course.achievements || [];
  const pricing = course.pricing || {};
  const schedules = course.schedules || [];

  return (
    <div className="sticky top-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">visibility</span>
          Vista Previa en Vivo
        </h2>
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
          Actualización en tiempo real
        </span>
      </div>

      {/* Course Card Preview */}
      <div className="bg-white dark:bg-surface-container border border-outline-variant rounded-2xl overflow-hidden shadow-xl transition-all">
        <div className="relative h-56 overflow-hidden bg-surface-dim">
          <img
            alt={title}
            src={imageUrl}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {badge && (
            <div className="absolute top-4 left-4">
              <Badge variant={badge === 'most-chosen' || badge === 'new' || badge === 'popular' ? badge : 'popular'} />
            </div>
          )}
        </div>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-on-surface">
            {title}
          </h3>
          <p className="text-on-surface-variant text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center gap-4 text-xs text-on-surface-variant pt-2 border-t border-outline-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">calendar_today</span>
              {calculatedWeeks} semanas ({duration} clases)
            </span>
            <span className="flex items-center gap-1 capitalize">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">video_library</span>
              {format}
            </span>
            {teacherName && (
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">person</span>
                {teacherName}
              </span>
            )}
          </div>

          {schedules.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-outline-variant">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Grupos / Horarios</span>
              {schedules.map((s: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg bg-surface border border-outline-variant text-xs space-y-1">
                  <div className="font-bold text-on-surface flex justify-between">
                    <span>{s.name}</span>
                    <span className="text-primary">Cap: {s.capacity}</span>
                  </div>
                  {s.sessions.map((sess: any, sIdx: number) => (
                    <div key={sIdx} className="text-on-surface-variant">
                      • {sess.day}: {sess.startTime} - {sess.endTime}hs
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Pricing Preview */}
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div>
              <span className="text-xs text-on-surface-variant block">Precio en Vivo</span>
              <span className="text-lg font-bold text-primary">
                {pricing.live ? `$${pricing.live.amount} ${pricing.live.currency}` : 'No definido'}
              </span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block">Grabado</span>
              <span className="text-lg font-bold text-on-surface">
                {pricing.recorded ? `$${pricing.recorded.amount} ${pricing.recorded.currency}` : 'No definido'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Preview */}
      {achievements.length > 0 && (
        <Card className="p-5 space-y-3 bg-white dark:bg-surface-container border-outline-variant">
          <h4 className="font-semibold text-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">verified</span>
            Logros del Estudiante ({achievements.length})
          </h4>
          <ul className="space-y-2">
            {achievements.map((ach: any, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-base shrink-0">
                  {ach.icon || 'check_circle'}
                </span>
                <span className={ach.isHighlighted ? 'font-medium text-on-surface' : ''}>
                  {ach.text || 'Logro sin descripción'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Polaroid Preview */}
      {course.polaroidImage && (
        <div className="bg-white dark:bg-surface-container p-4 rounded-xl border border-outline-variant shadow-md rotate-1 transform max-w-xs mx-auto">
          <img src={course.polaroidImage} alt="Polaroid" className="w-full h-36 object-cover rounded-lg mb-2" />
          <p className="text-center font-handwriting text-xs text-on-surface font-medium">
            {course.polaroidCaption || 'Caption polaroid...'}
          </p>
        </div>
      )}
    </div>
  );
}
