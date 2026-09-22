import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courses } from '../data/courses';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  CourseNotFound,
  CourseHero,
  CourseOverviewTab,
  CourseCurriculumTab,
  CourseMentorTab,
  CourseSidebar,
} from '../components/course';

export function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('course');
  const [formatType, setFormatType] = useState<'live' | 'recorded'>('live');
  
  const course = courses.find((c) => c.id === slug);

  // Default to first available schedule that is not full, or first schedule
  const defaultScheduleId = course?.schedules.find(s => s.enrolledCount < s.capacity)?.id || course?.schedules[0]?.id || '';
  const [selectedScheduleId, setSelectedScheduleId] = useState(defaultScheduleId);

  if (!course) {
    return <CourseNotFound />;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-24">
      {/* Hero Section */}
      <CourseHero course={course} />

      {/* Main Content & Sidebar */}
      <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Tabs (Overview, Curriculum, Mentor) */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="curriculum">{t('tabs.curriculum')}</TabsTrigger>
              <TabsTrigger value="mentor">{t('tabs.mentor')}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <CourseOverviewTab course={course} />
            </TabsContent>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="space-y-6">
              <CourseCurriculumTab course={course} />
            </TabsContent>

            {/* Mentor Tab */}
            <TabsContent value="mentor">
              <CourseMentorTab course={course} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Pricing & Schedule Selection Sidebar */}
        <div className="lg:col-span-4">
          <CourseSidebar
            course={course}
            formatType={formatType}
            setFormatType={setFormatType}
            selectedScheduleId={selectedScheduleId}
            setSelectedScheduleId={setSelectedScheduleId}
          />
        </div>
      </main>
    </div>
  );
}
