import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/Accordion';
import type { CourseWithRelations } from '@shared/validators/courses';

interface CourseCurriculumTabProps {
  course: CourseWithRelations;
}

export function CourseCurriculumTab({ course }: CourseCurriculumTabProps) {

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Módulos del curso</h2>
        <p className="text-on-surface-variant text-sm mb-6">Expandí cada sección para ver el contenido detallado.</p>
      </div>
      <Accordion type="single" collapsible defaultValue={course.modules[0]?._id}>
        {course.modules.map((mod) => (
          <AccordionItem key={mod._id} value={mod._id}>
            <AccordionTrigger>{mod.title}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-4">
                {mod.lessons.map((lesson, i) => (
                  <li key={`${lesson.title}-${i}`} className="flex items-start gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                    <div>
                      <p className="font-medium text-on-surface">{lesson.title}</p>
                      {lesson.durationMinutes > 0 && <p className="text-xs">{lesson.durationMinutes} min</p>}
                      {lesson.description && <p className="mt-1 text-sm">{lesson.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
