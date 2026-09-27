import type { CourseData } from '../../data/courses';
import { TeacherCard } from '../shared/TeacherCard';

interface CourseTeacherTabProps {
  course: CourseData;
}

export function CourseTeacherTab({ course }: CourseTeacherTabProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <TeacherCard teacher={course.mentor} showQuote={true} showStats={true} />
    </div>
  );
}
