import { CourseProgressCard } from './CourseProgressCard';
import { AppLink } from '../shared/AppLink';
import type { InProgressCourse } from '@/features/dashboard/types';


interface InProgressCoursesSectionProps {
  courses: InProgressCourse[];
}

export function InProgressCoursesSection({ courses }: InProgressCoursesSectionProps) {

  return (
    <section>
      <div className="flex items-center justify-between mb-stack-md">
        <h2 className="font-headline-lg text-[24px]">Mis cursos en progreso</h2>
        <AppLink to="/dashboard/courses" className="text-primary font-bold flex items-center gap-1 hover:underline">
          Ver todos
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </AppLink>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
        {courses.length === 0 ? (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-outline-variant p-8 text-center text-on-surface-variant">
            Todavía no tienes ninguna inscripción activa.
          </div>
        ) : (
          courses.map((course) => <CourseProgressCard key={course._id} course={course} />)
        )}
      </div>
    </section>
  );
}
