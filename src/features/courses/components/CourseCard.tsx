import { Badge } from '@/components/ui/Badge';
import { AppLink } from '@/components/shared/AppLink';
import { cn, calculateCourseWeeks } from '@/lib/utils';
import type { CourseWithRelations } from '@shared/validators/courses';

interface CourseCardProps {
  course: CourseWithRelations;
  actions?: React.ReactNode;
  adminDetails?: React.ReactNode;
  className?: string;
  preview?: boolean;
}

export function CourseCard({ course, actions, adminDetails, className, preview = false }: CourseCardProps) {
  const weeks = calculateCourseWeeks(course.duration, course.schedules);
  const formatLabel =
    course.format === 'live' ? 'Live' : course.format === 'recorded' ? 'Recorded' : 'Hybrid';

  const content = (
    <>
      <div className="relative h-56 overflow-hidden">
        <img
          alt={course.title}
          src={course.imageUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {course.badge && (
          <div className="absolute top-2 right-2">
            <Badge
              variant={
                course.badge === 'most-chosen' || course.badge === 'new' || course.badge === 'popular'
                  ? course.badge
                  : 'popular'
              }
            />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase">
              {formatLabel}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              {weeks} weeks ({course.duration} classes)
            </span>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2 line-clamp-1">{course.title}</h3>
          <p className="text-on-surface-variant text-sm mb-4 leading-relaxed line-clamp-2">
            {course.description}
          </p>
          {adminDetails && <div className="mb-4">{adminDetails}</div>}
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/40">
          <span className="text-xs text-on-surface-variant capitalize">{course.format}</span>
          {actions ? (
            <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
              {actions}
            </div>
          ) : (
            <span className="w-12 h-12 rounded-full border border-surface-dim flex items-center justify-center ml-auto arrow-btn">
              <span className="material-symbols-outlined w-5 h-5" aria-hidden="true">
                north_east
              </span>
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (actions || preview) {
    return (
      <div
        className={cn(
          'group course-card bg-white dark:bg-surface-container border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col',
          className,
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <AppLink
      to={`/course/${course.slug}`}
      aria-label={`Ver ${course.title}`}
      className={cn(
        'group course-card bg-white dark:bg-surface-container border border-outline-variant rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col',
        className,
      )}
    >
      {content}
    </AppLink>
  );
}

