import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { teachers } from '../data/teachers';
import { TeacherCard } from '../components/shared/TeacherCard';
import { Button } from '../components/ui/Button';

export function TeachersPage() {
  const { t } = useTranslation('common');

  return (
    <main className="flex-grow pt-12 pb-24 px-6 md:px-margin-desktop max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="relative">
          <span className="font-handwriting text-secondary absolute -top-7 left-0 -rotate-3 text-lg font-medium">
            {t('teachersPage.handwritten')}
          </span>
          <h1 className="font-display-lg text-3xl md:text-5xl font-black tracking-tight text-on-surface">
            {t('teachersPage.title').split(' ')[0]}{' '}
            <span className="bg-primary-container px-2 py-0.5 rounded-sm">
              {t('teachersPage.title').split(' ').slice(1).join(' ')}
            </span>
          </h1>
        </div>
      </div>

      {/* Teachers Grid & Bento CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}

        {/* Custom CTA Card / Bento Element */}
        <div className="lg:col-span-2 bg-secondary-container rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative border border-outline-variant shadow-lg">
          <div className="flex-1 z-10">
            <span className="bg-white dark:bg-surface-container text-secondary px-3 py-1 font-label-md text-[11px] font-bold rounded-full mb-4 inline-block">
              {t('teachersPage.ctaBadge')}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-on-secondary-container mb-3 tracking-tight">
              {t('teachersPage.ctaTitle')}
            </h2>
            <p className="text-on-secondary-container opacity-80 mb-6 text-sm md:text-base leading-relaxed">
              {t('teachersPage.ctaDesc')}
            </p>
            <Link to="/courses">
              <Button variant="secondary" className="bg-white dark:bg-surface-container text-on-secondary-fixed dark:text-on-surface shadow-md">
                {t('teachersPage.ctaButton')}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Button>
            </Link>
          </div>
          <div className="hidden md:block absolute -right-6 -bottom-6 w-60 h-60 opacity-15">
            <span className="material-symbols-outlined text-[180px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
