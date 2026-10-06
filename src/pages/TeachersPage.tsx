import { useTranslation } from 'react-i18next';
import { teachers } from '../data/teachers';
import { TeacherCard, PromoBanner } from '../components/shared';

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
        <PromoBanner
          badge={t('teachersPage.ctaBadge')}
          title={t('teachersPage.ctaTitle')}
          description={t('teachersPage.ctaDesc')}
          ctaLabel={t('teachersPage.ctaButton')}
          to="/courses"
        />
      </div>
    </main>
  );
}
