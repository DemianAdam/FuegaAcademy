import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  CourseNotFound,
  CourseHero,
  CourseOverviewTab,
  CourseCurriculumTab,
  CourseSidebar,
} from '../components/course';
import { TeacherCard } from '../components/shared/TeacherCard';

export function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('course');
  const [formatType, setFormatType] = useState<'live' | 'recorded'>('live');
  
  const course = useQuery(api.courses.queries.getBySlug, slug ? { slug } : "skip");

  const defaultScheduleId = course?.schedules?.find(s => s.enrolledCount < s.capacity)?._id || course?.schedules?.[0]?._id || '';
  const [selectedScheduleId, setSelectedScheduleId] = useState('');

  const activeScheduleId = selectedScheduleId || defaultScheduleId;

  if (course === undefined) {
    return <div className="min-h-screen bg-surface flex items-center justify-center">Cargando programa...</div>;
  }

  if (course === null) {
    return <CourseNotFound />;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-24">
      {/* Hero Section */}
      <CourseHero course={course} />

      {/* Main Content & Sidebar */}
      <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Tabs (Overview, Curriculum, Teacher) */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="curriculum">{t('tabs.curriculum')}</TabsTrigger>
              <TabsTrigger value="teacher">{t('tabs.teacher')}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <CourseOverviewTab course={course} />
            </TabsContent>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="space-y-6">
              <CourseCurriculumTab course={course} />
            </TabsContent>

            {/* Teacher Tab */}
            <TabsContent value="teacher">
              <div className="max-w-3xl mx-auto">
                {course.teacher && (
                  <TeacherCard
                    teacher={{
                      id: course.teacher.slug,
                      name: course.teacher.name,
                      title: course.teacher.title,
                      imageUrl: course.teacher.imageUrl,
                      skills: course.teacher.skills,
                      bio: course.teacher.bio,
                      quote: course.teacher.quote,
                      stats: course.teacher.stats,
                    }}
                    showQuote={true}
                    showStats={true}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Pricing & Schedule Selection Sidebar */}
        <div className="lg:col-span-4">
          <CourseSidebar
            course={course}
            formatType={formatType}
            setFormatType={setFormatType}
            selectedScheduleId={activeScheduleId}
            setSelectedScheduleId={setSelectedScheduleId}
          />
        </div>
      </main>
    </div>
  );
}
