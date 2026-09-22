import { useTranslation } from 'react-i18next';
import { PolaroidFrame } from '../shared/PolaroidFrame';
import type { CourseData } from '../../data/courses';

interface CourseHeroProps {
  course: CourseData;
}

export function CourseHero({ course }: CourseHeroProps) {
  const { t } = useTranslation('course');

  return (
    <section className="bg-surface-container-low border-b border-outline-variant py-16 px-4 md:px-margin-desktop">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            {course.badge === 'most-chosen' ? t('badges.mostChosen') : course.badge === 'new' ? t('badges.new') : t('badges.popular')}
          </span>
          <h1 className="font-display-lg text-4xl md:text-5xl font-black tracking-tight text-on-surface">
            {course.title}
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            {course.description}
          </p>
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              <span className="text-sm font-medium">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">videocam</span>
              <span className="text-sm font-medium">{course.format}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified</span>
              <span className="text-sm font-medium">{t('details.lifetimeAccess')}</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 flex justify-center">
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
