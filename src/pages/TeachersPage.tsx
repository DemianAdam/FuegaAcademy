import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { PromoBanner } from '../components/shared';
import { TeacherCard } from '@/features/teachers/components/TeacherCard';

export function TeachersPage() {
  const teachers = useQuery(api.teachers.queries.listPublished, {});

  return (
    <main className="flex-grow pt-12 pb-24 px-6 md:px-margin-desktop max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="relative">
          <span className="font-handwriting text-secondary absolute -top-7 left-0 -rotate-3 text-lg font-medium">
            Aprendé de los mejores
          </span>
          <h1 className="font-display-lg text-3xl md:text-5xl font-black tracking-tight text-on-surface">
            Conocé a{' '}
            <span className="bg-primary-container px-2 py-0.5 rounded-sm">
              nuestros profesores
            </span>
          </h1>
        </div>
      </div>

      {/* Teachers Grid & Bento CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {teachers === undefined ? (
          <div className="md:col-span-2 lg:col-span-3 py-12 text-center text-on-surface-variant">Cargando profesores…</div>
        ) : teachers.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 py-12 text-center text-on-surface-variant">Todavía no hay profesores publicados.</div>
        ) : (
          teachers.map((teacher) => <TeacherCard key={teacher._id} teacher={teacher} />)
        )}

        {/* Custom CTA Card / Bento Element */}
        <PromoBanner
          badge="Expertos de la industria"
          title="¿Listo para aprender de profesionales?"
          description="Explorá cursos en vivo y grabados dictados por profesionales."
          ctaLabel="Explorar cursos"
          to="/courses"
        />
      </div>
    </main>
  );
}
