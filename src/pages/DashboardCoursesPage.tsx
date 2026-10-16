import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { PolaroidFrame } from '../components/shared';
import { Button } from '../components/ui/Button';

export function DashboardCoursesPage() {
  const { t } = useTranslation('common');
  const [filter, setFilter] = useState<'all' | 'en-vivo' | 'grabado'>('all');

  const courses = useQuery(api.courses.queries.list);

  const filteredCourses = courses ? courses.filter((course) => {
    if (filter === 'all') return true;
    if (filter === 'en-vivo') return course.format.toLowerCase().includes('live') || course.format.toLowerCase().includes('vivo');
    if (filter === 'grabado') return course.format.toLowerCase().includes('recorded') || course.format.toLowerCase().includes('grabado');
    return true;
  }) : [];

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="font-handwriting text-secondary text-lg font-medium block mb-1">
            Explora y aprende más
          </span>
          <h1 className="font-display-lg text-3xl md:text-4xl font-black tracking-tight text-on-surface">
            Catálogo de <span className="bg-primary-container px-2 py-0.5 rounded-sm">Cursos Disponibles</span>
          </h1>
        </div>

        {/* Filters Toggle */}
        <div className="flex bg-surface-container-highest p-1 rounded-xl w-fit border border-outline-variant gap-1">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'shadow-sm' : 'text-on-surface-variant'}
          >
            {t('coursesPage.all')}
          </Button>
          <Button
            variant={filter === 'en-vivo' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('en-vivo')}
            className={filter === 'en-vivo' ? 'shadow-sm' : 'text-on-surface-variant'}
          >
            {t('coursesPage.live')}
          </Button>
          <Button
            variant={filter === 'grabado' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('grabado')}
            className={filter === 'grabado' ? 'shadow-sm' : 'text-on-surface-variant'}
          >
            {t('coursesPage.recorded')}
          </Button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses === undefined ? (
          <div className="col-span-3 text-center py-12 text-on-surface-variant">Cargando cursos...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-on-surface-variant">No hay cursos disponibles con este filtro.</div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course._id} className="group bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <PolaroidFrame
                  src={course.polaroidImage}
                  alt={course.title}
                  rotate={1}
                  scale={1}
                  className="relative mb-4"
                >
                  <div className="absolute top-4 right-4 bg-primary-fixed text-on-primary-fixed px-3 py-1 font-label-md text-[11px] uppercase tracking-wider font-bold rounded-full z-20">
                    {course.format === 'live' ? t('coursesPage.live') : t('coursesPage.recorded')}
                  </div>
                </PolaroidFrame>

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface mb-1">{course.title}</h3>
                    <p className="text-on-surface-variant text-sm">
                      Por <span className="font-bold text-on-surface">{course.teacher?.name || 'Instructor'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-bold text-xs">4.9</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                <span className="text-xl font-black text-on-surface">${course.pricing.live?.amount || 99}</span>
                <Link to={`/course/${course.slug}`}>
                  <Button variant="secondary" size="sm" className="shadow-md">
                    Ver programa
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
