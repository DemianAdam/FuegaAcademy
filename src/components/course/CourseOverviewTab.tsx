import { useTranslation } from 'react-i18next';
import type { CourseData } from '../../data/courses';

interface CourseOverviewTabProps {
  course: CourseData;
}

export function CourseOverviewTab({ course }: CourseOverviewTabProps) {
  const { t } = useTranslation('course');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('overviewTab.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.achievements.map((item, idx) => (
            <div key={idx} className="flex gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
              <span className="material-symbols-outlined text-primary shrink-0">{item.icon}</span>
              <p className={`text-sm ${item.bold ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        {course.stats.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-outline-variant text-center bg-surface-container-low">
            <span className="material-symbols-outlined text-primary text-2xl mb-1">{stat.icon}</span>
            <div className="text-xl font-black text-on-surface">{stat.value}</div>
            <div className="text-xs text-on-surface-variant font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
