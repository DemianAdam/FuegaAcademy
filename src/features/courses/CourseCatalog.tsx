import { useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { PromoBanner } from '@/components/shared/PromoBanner';
import { CourseCard } from './components/CourseCard';

type CourseFilter = 'all' | 'live' | 'recorded';

export function CourseCatalog({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<CourseFilter>('all');
  const courses = useQuery(api.courses.queries.listPublished, {});
  const filteredCourses = useMemo(
    () =>
      (courses ?? []).filter((course) => {
        if (filter === 'all') return true;
        if (filter === 'live') return course.format === 'live' || course.format === 'hybrid';
        return course.format === 'recorded' || course.format === 'hybrid';
      }),
    [courses, filter],
  );

  return (
    <div className={compact ? 'space-y-8' : 'flex-grow pt-12 pb-24 px-6 md:px-margin-desktop max-w-7xl mx-auto w-full'}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="relative">
          <span className="font-handwriting text-secondary block mb-1 text-lg font-medium">
            Encontrá tu próximo paso
          </span>
          <h1 className={`font-display-lg font-black tracking-tight text-on-surface ${compact ? 'text-3xl md:text-4xl' : 'text-3xl md:text-5xl'}`}>
            Explorá nuestros cursos
          </h1>
        </div>
        <div className="flex bg-surface-container-highest p-1 rounded-xl w-fit border border-outline-variant gap-1">
          {(['all', 'live', 'recorded'] as const).map((value) => (
            <Button
              key={value}
              variant={filter === value ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(value)}
              className={filter === value ? 'shadow-sm' : 'text-on-surface-variant'}
            >
              {value === 'all' ? 'Todos' : value === 'live' ? 'En vivo' : 'Grabados'}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses === undefined ? (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-on-surface-variant">Cargando cursos…</div>
        ) : filteredCourses.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-on-surface-variant">No hay cursos disponibles para este filtro.</div>
        ) : (
          filteredCourses.map((course) => <CourseCard key={course._id} course={course} />)
        )}
        {!compact && (
          <PromoBanner
            badge="Membresía PRO"
            title="Acceso total a todos los cursos grabados."
            description="Suscribite y aprendé a tu ritmo."
            ctaLabel="Ver planes"
          />
        )}
      </div>
    </div>
  );
}
