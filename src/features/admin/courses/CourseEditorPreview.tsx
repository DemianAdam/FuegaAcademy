import { useEffect, useRef, useState } from 'react';
import type { GenericId } from 'convex/values';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { CourseDetailLayout } from '@/components/course';
import { CourseCard } from '@/features/courses/components/CourseCard';
import type { CourseWithRelations, PublicTeacher } from '@shared/validators/courses';
import type { CourseEditorState } from './useCourseEditor';

type PreviewViewport = 'desktop' | 'tablet' | 'mobile';

interface CourseEditorPreviewProps {
  course: CourseEditorState;
  teacher?: PublicTeacher;
  isFocused: boolean;
  onFocusChange: (focused: boolean) => void;
}

const viewportClasses: Record<PreviewViewport, string> = {
  desktop: 'w-full',
  tablet: 'w-full max-w-[768px]',
  mobile: 'w-full max-w-[390px]',
};

export function CourseEditorPreview({ course, teacher, isFocused, onFocusChange }: CourseEditorPreviewProps) {
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');
  const focusTriggerRef = useRef<HTMLButtonElement>(null);
  const wasFocused = useRef(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFocused) onFocusChange(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFocused, onFocusChange]);

  useEffect(() => {
    if (wasFocused.current && !isFocused) focusTriggerRef.current?.focus();
    wasFocused.current = isFocused;
  }, [isFocused]);

  const previewCourse: CourseWithRelations = {
    _id: 'preview-course' as GenericId<'courses'>,
    _creationTime: 0,
    slug: 'vista-previa',
    title: course.title || 'Título del programa',
    description: course.description || 'La descripción del curso aparecerá aquí.',
    imageUrl: course.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    polaroidImage: course.polaroidImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    polaroidCaption: course.polaroidCaption,
    badge: course.badge,
    duration: course.duration,
    format: course.format,
    achievements: course.achievements.filter((achievement) => achievement.text.trim()),
    pricing: course.pricing,
    teacher: teacher ?? null,
    mentor: teacher ?? null,
    modules: (course.modules ?? []).map((module, index) => ({
      _id: (module.id ?? `preview-module-${index}`) as GenericId<'modules'>,
      title: module.title || `Módulo ${index + 1}`,
      order: index,
      lessons: module.lessons.filter((lesson) => lesson.title.trim()),
    })),
    schedules: (course.schedules ?? []).map((schedule, index) => ({
      _id: (schedule.id ?? `preview-schedule-${index}`) as GenericId<'schedules'>,
      name: schedule.name,
      sessions: schedule.sessions,
      capacity: schedule.capacity,
      enrolledCount: 0,
    })),
  };

  const pageCanvas = (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Tamaño de la vista previa">
          {(['desktop', 'tablet', 'mobile'] as const).map((option) => (
            <Button key={option} type="button" size="sm" variant={viewport === option ? 'primary' : 'ghost'} onClick={() => setViewport(option)}>
              {option === 'desktop' ? 'Escritorio' : option === 'tablet' ? 'Tablet' : 'Móvil'}
            </Button>
          ))}
        </div>
        {isFocused ? (
          <Button type="button" variant="outline" size="sm" onClick={() => onFocusChange(false)}>Volver al editor</Button>
        ) : (
          <Button ref={focusTriggerRef} type="button" variant="outline" size="sm" onClick={() => onFocusChange(true)}>Vista ampliada</Button>
        )}
      </div>
      <div className="rounded-2xl border border-outline-variant bg-surface-container p-2">
        <div className={`course-preview-canvas mx-auto overflow-auto rounded-xl border border-outline-variant bg-surface shadow-inner ${viewportClasses[viewport]} ${isFocused ? 'h-[calc(100vh-13rem)] min-h-[36rem]' : 'h-[calc(100vh-18rem)] min-h-[34rem]'}`}>
          <CourseDetailLayout course={previewCourse} preview presentation="preview" />
        </div>
      </div>
    </>
  );

  if (isFocused) {
    return <aside className="w-full" aria-label="Vista ampliada del curso">{pageCanvas}</aside>;
  }

  return (
    <aside className="min-w-0 lg:sticky lg:top-5">
      <Tabs defaultValue="page" className="space-y-3">
        <TabsList className="gap-4"><TabsTrigger value="page">Página</TabsTrigger><TabsTrigger value="card">Tarjeta</TabsTrigger></TabsList>
        <TabsContent value="page" className="py-0">{pageCanvas}</TabsContent>
        <TabsContent value="card" className="py-3"><div className="mx-auto max-w-md"><CourseCard course={previewCourse} preview /></div></TabsContent>
      </Tabs>
    </aside>
  );
}
