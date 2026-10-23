import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import { Button } from '@/components/ui';
import {
  CourseAchievementsSection,
  CourseBasicsSection,
  CourseCurriculumSection,
  CourseEditorSections,
  CourseMediaSection,
  CoursePricingSection,
} from '@/features/admin/courses/CourseEditorSections';
import { ScheduleEditor } from '@/features/admin/courses/ScheduleEditor';
import { useCourseEditor } from '@/features/admin/courses/useCourseEditor';
import { CourseEditorPreview } from '@/features/admin/courses/CourseEditorPreview';
import { normalizeModuleLessons } from '@shared/validators/modules';

function normalizeTier(tier: { amountMinor?: number; amount?: number } | undefined) {
  if (!tier) return undefined;
  return {
    amountMinor: tier.amountMinor ?? Math.round((tier.amount ?? 0) * 100),
    currency: 'ARS' as const,
  };
}

export function AdminCourseCreatePage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId?: string }>();
  const isEditing = Boolean(courseId);
  const teachers = useQuery(api.teachers.queries.list) ?? [];
  const existing = useQuery(
    api.courses.queries.getAdminById,
    courseId ? { id: courseId } : 'skip',
  );
  const createCourse = useMutation(api.courses.mutations.create);
  const updateCourse = useMutation(api.courses.mutations.update);
  const { course, setCourse, update, updateFormat, achievementIds, setAchievementIds } = useCourseEditor();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPreviewFocused, setIsPreviewFocused] = useState(false);
  const loadedKey = useRef<string | null>(null);

  useEffect(() => {
    if (!existing) return;
    const key = `${existing.course._id}`;
    if (loadedKey.current === key) return;
    const stored = existing.course;
    setCourse({
      title: stored.title,
      description: stored.description,
      image: stored.image ?? { kind: 'external', url: stored.imageUrl },
      polaroid: stored.polaroid ?? { kind: 'external', url: stored.polaroidImage },
      polaroidCaption: stored.polaroidCaption,
      badge: stored.badge,
      duration: stored.duration,
      format: stored.format,
      teacherId: stored.teacherId,
      achievements: stored.achievements,
      pricing: {
        live: normalizeTier(stored.pricing.live),
        recorded: normalizeTier(stored.pricing.recorded),
      },
      schedules: existing.schedules
        .filter((schedule) => !schedule.isArchived)
        .map((schedule) => ({
          id: schedule._id,
          name: schedule.name,
          capacity: schedule.capacity,
          sessions: schedule.sessions,
        })),
      modules: existing.modules.map((module) => ({
        id: module._id,
        title: module.title,
        lessons: normalizeModuleLessons(module),
      })),
    });
    setAchievementIds(stored.achievements.map(() => crypto.randomUUID()));
    loadedKey.current = key;
  }, [existing, setAchievementIds, setCourse]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      if (isEditing && existing) {
        await updateCourse({ id: existing.course._id, patch: course });
      } else {
        await createCourse(course);
      }
      navigate('/admin');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo guardar el curso.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && existing === undefined) {
    return <div className="p-12 text-center text-on-surface-variant">Cargando editor del curso…</div>;
  }
  if (isEditing && existing === null) {
    return <div className="p-12 text-center text-error">Curso no encontrado.</div>;
  }

  const selectedTeacher = teachers.find((teacher) => teacher._id === course.teacherId);

  return (
    <main className="min-h-screen bg-surface px-4 py-10 text-on-surface md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-outline-variant pb-4">
          <div>
            <h1 className="text-3xl font-extrabold">{isEditing ? 'Editar curso' : 'Crear curso'}</h1>
            <p className="mt-1 text-sm text-on-surface-variant">Administrá la información, horarios y precios en ARS del curso.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>Volver al panel</Button>
        </div>

        {errorMessage && <p role="alert" className="mb-6 rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error">{errorMessage}</p>}

        <div className={isPreviewFocused ? 'block' : 'grid gap-8 xl:grid-cols-[minmax(26rem,0.9fr)_minmax(38rem,1.1fr)]'}>
          <form className={`space-y-5 ${isPreviewFocused ? 'hidden' : ''}`} onSubmit={handleSubmit}>
            <CourseEditorSections>
            <CourseBasicsSection
              course={course}
              teachers={teachers}
              onChange={update}
              onFormatChange={updateFormat}
            />
            <CourseMediaSection course={course} onChange={update} />
            <CourseAchievementsSection course={course} onChange={update} achievementIds={achievementIds} onAchievementIdsChange={setAchievementIds} />
            <CourseCurriculumSection course={course} onChange={update} />
            {course.format !== 'recorded' && <ScheduleEditor schedules={course.schedules} onChange={(schedules) => update('schedules', schedules)} />}
            <CoursePricingSection course={course} onChange={update} />
            </CourseEditorSections>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/admin')}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando…' : 'Guardar curso'}</Button>
            </div>
          </form>
          <CourseEditorPreview
            course={course}
            teacher={selectedTeacher ?? undefined}
            isFocused={isPreviewFocused}
            onFocusChange={setIsPreviewFocused}
          />
        </div>
      </div>
    </main>
  );
}
