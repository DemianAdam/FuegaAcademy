import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import type { CourseWithRelations } from '@shared/validators/courses';
import { TeacherCard } from '@/features/teachers/components/TeacherCard';
import { CourseCurriculumTab } from './CourseCurriculumTab';
import { CourseHero } from './CourseHero';
import { CourseOverviewTab } from './CourseOverviewTab';
import { CourseSidebar } from './CourseSidebar';

interface CourseDetailLayoutProps {
  course: CourseWithRelations;
  preview?: boolean;
  presentation?: 'public' | 'preview';
}

export function CourseDetailLayout({ course, preview = false, presentation = 'public' }: CourseDetailLayoutProps) {
  return (
    <div className={`course-detail-layout course-detail-layout--${presentation} min-h-screen bg-surface pb-24 text-on-surface`}>
      <CourseHero course={course} presentation={presentation} />
      <main className="course-detail-main mx-auto mt-12 max-w-7xl px-4">
        <div className="course-detail-content">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="curriculum">Programa</TabsTrigger>
              <TabsTrigger value="teacher">Profesor</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-8"><CourseOverviewTab course={course} /></TabsContent>
            <TabsContent value="curriculum" className="space-y-6"><CourseCurriculumTab course={course} /></TabsContent>
            <TabsContent value="teacher">
              <div className="mx-auto max-w-3xl">
                {course.teacher && <TeacherCard teacher={course.teacher} showQuote showStats />}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="course-detail-sidebar"><CourseSidebar course={course} preview={preview} /></div>
      </main>
    </div>
  );
}
