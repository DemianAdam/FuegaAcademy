import { useTranslation } from 'react-i18next';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/Accordion';
import type { CourseData } from '../../data/courses';

interface CourseCurriculumTabProps {
  course: CourseData;
}

export function CourseCurriculumTab({ course }: CourseCurriculumTabProps) {
  const { t } = useTranslation('course');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('curriculumTab.title')}</h2>
        <p className="text-on-surface-variant text-sm mb-6">{t('curriculumTab.description')}</p>
      </div>
      <Accordion type="single" collapsible defaultValue="module-1">
        {course.modules.map((mod) => (
          <AccordionItem key={mod.id} value={mod.id}>
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
