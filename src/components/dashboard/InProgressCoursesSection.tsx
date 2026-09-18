import { useTranslation } from 'react-i18next';
import { CourseProgressCard } from './CourseProgressCard';
import type { InProgressCourse } from '../../data/mockDashboardData';


interface InProgressCoursesSectionProps {
  courses: InProgressCourse[];
}

export function InProgressCoursesSection({ courses }: InProgressCoursesSectionProps) {
  const { t } = useTranslation('dashboard');

  return (
    <section>
      <div className="flex items-center justify-between mb-stack-md">
        <h2 className="font-headline-lg text-[24px]">{t('coursesSection.title')}</h2>
        <a className="text-primary font-bold flex items-center gap-1 hover:underline" href="#">
          {t('coursesSection.viewAll')}
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
        {courses.map((course) => (
          <CourseProgressCard key={course._id} course={course} />
        ))}
      </div>
    </section>
  );
}
