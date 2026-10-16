import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/Badge';
import { cn, calculateCourseWeeks } from '../../lib/utils';
import type { CourseWithRelations } from '@shared/validators/courses';

interface CourseCardProps {
  course: CourseWithRelations;
  actions?: React.ReactNode;
  adminDetails?: React.ReactNode;
  className?: string;
}

export function CourseCard({ course, actions, adminDetails, className }: CourseCardProps) {
  const { t } = useTranslation('home');
  const weeks = calculateCourseWeeks(course.duration, course.schedules);

  const formatLabel =
    course.format === 'live'
      ? 'En Vivo'
      : course.format === 'recorded'
      ? 'Grabado'
      : 'Híbrido';

  const content = (
    <>
      <div className="relative h-56 overflow-hidden">
        <img
          alt={t(`courses.items.${course.slug}.title`, { defaultValue: course.title })}
          src={course.imageUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={(course.badge === 'most-chosen' || course.badge === 'new' || course.badge === 'popular') ? course.badge : 'popular'} />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase">
              {formatLabel}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              {weeks} semanas ({course.duration} clases)
            </span>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2 line-clamp-1">
            {t(`courses.items.${course.slug}.title`, { defaultValue: course.title })}
          </h3>
          <p className="text-on-surface-variant text-sm mb-4 leading-relaxed line-clamp-2">
            {t(`courses.items.${course.slug}.description`, { defaultValue: course.description })}
          </p>
          {adminDetails && <div className="mb-4">{adminDetails}</div>}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/40">
          <div className="flex items-center gap-4 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">video_library</span>
              {course.format}
            </span>
          </div>
          {actions ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {actions}
            </div>
          ) : (
            <button className="w-12 h-12 rounded-full border border-surface-dim flex items-center justify-center transition-colors ml-auto arrow-btn" type="button">
              <span className="material-symbols-outlined w-5 h-5" aria-hidden="true">north_east</span>
            </button>
          )}
        </div>
      </div>
    </>
  );

  if (actions) {
    return (
      <div
        className={cn(
          'group course-card bg-white dark:bg-surface-container border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col',
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/course/${course.slug}`}
      className={cn(
        'group course-card bg-white dark:bg-surface-container border border-outline-variant rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col',
        className
      )}
    >
      {content}
    </Link>
  );
}