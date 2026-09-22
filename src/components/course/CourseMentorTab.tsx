import type { CourseData } from '../../data/courses';

interface CourseMentorTabProps {
  course: CourseData;
}

export function CourseMentorTab({ course }: CourseMentorTabProps) {
  return (
    <div className="p-8 rounded-2xl border border-outline-variant bg-surface-container-low flex flex-col md:flex-row gap-6 items-center">
      <img
        src={course.mentor.image}
        alt={course.mentor.name}
        className="w-32 h-32 rounded-full object-cover border-2 border-primary shrink-0"
      />
      <div className="space-y-3 text-center md:text-left">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">{course.mentor.title}</span>
        <h3 className="text-2xl font-bold text-on-surface">{course.mentor.name}</h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">{course.mentor.bio}</p>
        <blockquote className="italic text-xs text-on-surface-variant border-l-2 border-primary pl-3">
          "{course.mentor.quote}"
        </blockquote>
      </div>
    </div>
  );
}
