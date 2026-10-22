import { PolaroidFrame } from '../shared/PolaroidFrame';
import { calculateCourseWeeks } from '../../lib/utils';
import type { CourseWithRelations } from '@shared/validators/courses';

interface CourseHeroProps {
  course: CourseWithRelations;
  presentation?: 'public' | 'preview';
}

export function CourseHero({ course, presentation = 'public' }: CourseHeroProps) {
  const weeks = calculateCourseWeeks(course.duration, course.schedules);

  return (
    <section className={`course-hero course-hero--${presentation} bg-surface-container-low border-b border-outline-variant py-16 px-4`}>
      <div className="course-hero-grid max-w-7xl mx-auto items-center">
        <div className="course-hero-content space-y-6">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            {course.badge === 'most-chosen' ? 'Más elegido' : course.badge === 'new' ? 'Nuevo' : 'Popular'}
          </span>
          <h1 className="course-hero-title font-display-lg text-4xl font-black tracking-tight text-on-surface">
            {course.title}
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            {course.description}
          </p>
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              <span className="text-sm font-medium">{weeks} semanas ({course.duration} clases)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">videocam</span>
              <span className="text-sm font-medium">{course.format}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified</span>
              <span className="text-sm font-medium">Acceso de por vida</span>
            </div>
          </div>
        </div>
        <div className="course-hero-media flex justify-center">
          <PolaroidFrame
            src={course.polaroidImage}
            alt={course.title}
            caption={course.polaroidCaption}
            rotate={2}
            scale={1.05}
          />
        </div>
      </div>
    </section>
  );
}
