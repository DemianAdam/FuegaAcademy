import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courses } from '../data/courses';
import { PolaroidFrame } from '../components/shared/PolaroidFrame';

export function CoursesPage() {
  const { t } = useTranslation('common');
  const [filter, setFilter] = useState<'all' | 'en-vivo' | 'grabado'>('all');

  const filteredCourses = courses.filter((course) => {
    if (filter === 'all') return true;
    if (filter === 'en-vivo') return course.format.toLowerCase().includes('vivo');
    if (filter === 'grabado') return course.format.toLowerCase().includes('grabado') || !course.format.toLowerCase().includes('vivo');
    return true;
  });

  return (
    <main className="flex-grow pt-12 pb-24 px-6 md:px-margin-desktop max-w-7xl mx-auto w-full">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="relative">
          <span className="font-handwriting text-secondary absolute -top-7 left-0 -rotate-3 text-lg font-medium">
            {t('coursesPage.handwritten')}
          </span>
          <h1 className="font-display-lg text-3xl md:text-5xl font-black tracking-tight text-on-surface">
            {t('coursesPage.title').split(' ')[0]} <span className="bg-primary-container px-2 py-0.5 rounded-sm">{t('coursesPage.title').split(' ').slice(1).join(' ')}</span>
          </h1>
        </div>

        {/* Filters Toggle */}
        <div className="flex bg-surface-container-highest p-1 rounded-xl w-fit border border-outline-variant">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 font-label-md text-sm rounded-lg transition-all ${
              filter === 'all' ? 'bg-black text-white font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface'
            }`}
          >
            {t('coursesPage.all')}
          </button>
          <button
            onClick={() => setFilter('en-vivo')}
            className={`px-6 py-2 font-label-md text-sm rounded-lg transition-all ${
              filter === 'en-vivo' ? 'bg-black text-white font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface'
            }`}
          >
            {t('coursesPage.live')}
          </button>
          <button
            onClick={() => setFilter('grabado')}
            className={`px-6 py-2 font-label-md text-sm rounded-lg transition-all ${
              filter === 'grabado' ? 'bg-black text-white font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface'
            }`}
          >
            {t('coursesPage.recorded')}
          </button>
        </div>
      </div>

      {/* Bento / Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCourses.map((course) => (
          <div key={course.id} className="group">
            <PolaroidFrame
              src={course.polaroidImage}
              alt={course.title}
              rotate={1}
              scale={1}
              className="relative"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-primary-fixed text-on-primary-fixed px-3 py-1 font-label-md text-[11px] uppercase tracking-wider font-bold rounded-full z-20">
                {course.format.includes('Vivo') ? t('coursesPage.live') : t('coursesPage.recorded')}
              </div>
            </PolaroidFrame>

            <div className="mt-4 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-1">{course.title}</h3>
                <p className="text-on-surface-variant text-sm">
                  Por <span className="font-bold text-on-surface">{course.mentor.name}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant">
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-bold text-xs">4.9</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <span className="text-xl font-black text-on-surface">{course.pricing.live.price}</span>
              <Link to={`/course/${course.id}`}>
                <button className="bg-black text-white px-5 py-2 font-label-md text-xs font-bold rounded-lg hover:-translate-y-0.5 transition-all shadow-md">
                  Ver programa
                </button>
              </Link>
            </div>
          </div>
        ))}

        {/* Custom CTA Card / Bento Element */}
        <div className="lg:col-span-2 bg-secondary-container rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative border border-outline-variant shadow-lg">
          <div className="flex-1 z-10">
            <span className="bg-white text-secondary px-3 py-1 font-label-md text-[11px] font-bold rounded-full mb-4 inline-block">
              {t('coursesPage.proBadge')}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-on-secondary-container mb-3 tracking-tight">
              {t('coursesPage.proTitle')}
            </h2>
            <p className="text-on-secondary-container opacity-80 mb-6 text-sm md:text-base leading-relaxed">
              {t('coursesPage.proDesc')}
            </p>
            <button className="bg-white text-on-secondary-fixed font-bold px-8 py-3 rounded-xl hover:translate-x-1 transition-transform inline-flex items-center gap-2 shadow-md text-sm">
              {t('coursesPage.proCta')}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
          <div className="hidden md:block absolute -right-6 -bottom-6 w-60 h-60 opacity-15">
            <span className="material-symbols-outlined text-[180px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
        </div>
      </div>
    </main>
  );
}
