import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import type { CourseData } from '../../data/courses';

interface CourseCardProps {
  course: CourseData;
}

export function CourseCard({ course }: CourseCardProps) {
  const { t } = useTranslation('home');

  return (
    <Link
      to={`/course/${course.id}`}
      className={cn(
        'group course-card bg-white border border-outline-variant rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500',
        'block'
      )}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          alt={t(`courses.items.${course.id}.title`, { defaultValue: course.title })}
          src={course.imageUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge variant={course.badge} />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-on-surface mb-2">
          {t(`courses.items.${course.id}.title`, { defaultValue: course.title })}
        </h3>
        <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
          {t(`courses.items.${course.id}.description`, { defaultValue: course.description })}
        </p>
        <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-6">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm" aria-hidden="true">calendar_today</span>
            {t(`courses.items.${course.id}.duration`, { defaultValue: course.duration })}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm" aria-hidden="true">video_library</span>
            {t(`courses.items.${course.id}.format`, { defaultValue: course.format })}
          </span>
        </div>
        <button className="w-12 h-12 rounded-full border border-surface-dim flex items-center justify-center transition-colors ml-auto arrow-btn" type="button">
          <span className="material-symbols-outlined w-5 h-5" aria-hidden="true">north_east</span>
        </button>
      </div>
    </Link>
  );
}