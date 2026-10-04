import { useTranslation } from 'react-i18next';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/Accordion';
import type { CourseWithRelations } from '@shared/validators/courses';

interface CourseCurriculumTabProps {
  course: CourseWithRelations;
}

export function CourseCurriculumTab({ course }: CourseCurriculumTabProps) {
  const { t } = useTranslation('course');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('curriculumTab.title')}</h2>
        <p className="text-on-surface-variant text-sm mb-6">{t('curriculumTab.description')}</p>
      </div>
      <Accordion type="single" collapsible defaultValue={course.modules[0]?._id}>
        {course.modules.map((mod) => (
          <AccordionItem key={mod._id} value={mod._id}>
            <AccordionTrigger>{mod.title}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {mod.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                    <span>{it}</span>
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
