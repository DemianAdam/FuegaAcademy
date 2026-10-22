import type { InProgressCourse } from '@/features/dashboard/types';

interface CourseProgressCardProps {
  course: InProgressCourse;
}

export function CourseProgressCard({ course }: CourseProgressCardProps) {
  const badgeBg = course.category === 'MARKETING' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-fixed text-on-primary-fixed';
  const progressBg = course.category === 'MARKETING' ? 'bg-secondary-container' : 'bg-primary-fixed';
  const categoryLabel = course.category === 'MARKETING' ? 'MARKETING' : 'ECONOMÍA CREATIVA';

  return (
    <div className="bg-surface-container-lowest p-stack-md rounded-xl polaroid-frame transition-transform hover:-translate-y-1">
      <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden bg-surface-dim">
        <img
          className="w-full h-full object-cover"
          alt={course.title}
          src={course.imageUrl}
        />
        <div className={`absolute top-2 left-2 px-2 py-1 ${badgeBg} font-bold text-[10px] rounded uppercase tracking-wider`}>
          {categoryLabel}
        </div>
      </div>
      <h3 className="font-bold text-lg mb-2">{course.title}</h3>
      <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
        <span>Progreso: {course.progressPercent}%</span>
        <span>{course.completedClasses}/{course.totalClasses} clases</span>
      </div>
      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
        <div className={`h-full ${progressBg}`} style={{ width: `${course.progressPercent}%` }}></div>
      </div>
    </div>
  );
}
