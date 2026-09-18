import { mockDashboardData } from '../data/mockDashboardData';
import {
  DashboardLayout,
  WelcomeHeader,
  InProgressCoursesSection,
  CommunitySection,
  LiveClassWidget,
  RecommendationWidget,
  ActivityStatsWidget,
} from '../components/dashboard';

export function Dashboard() {
  const { user, courses, communityPost, liveClass, activity } = mockDashboardData;

  return (
    <DashboardLayout user={user}>
      {/* Welcome Header */}
      <WelcomeHeader userName={user.name} />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        {/* Left Column: Courses & Community (8 cols) */}
        <div className="lg:col-span-8 space-y-stack-lg">
          <InProgressCoursesSection courses={courses} />
          <CommunitySection post={communityPost} />
        </div>

        {/* Right Column: Sidebar Widgets (4 cols) */}
        <div className="lg:col-span-4 space-y-stack-lg">
          <LiveClassWidget liveClass={liveClass} />
          <RecommendationWidget />
          <ActivityStatsWidget activity={activity} />
        </div>
      </div>
    </DashboardLayout>
  );
}