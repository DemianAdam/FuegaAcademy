import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
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
  const enrollments = useQuery(api.enrollments.queries.listMyEnrollments);
  const fallback = mockDashboardData;

  const user = fallback.user;

  const courses = enrollments && enrollments.length > 0 
    ? enrollments.map(e => ({
        _id: e._id,
        _creationTime: e._creationTime,
        title: e.course?.title || "Curso Fuega",
        category: e.course?.badge || "CREATOR ECONOMY",
        progressPercent: e.progressPercent,
        completedClasses: e.completedClasses,
        totalClasses: e.totalClasses,
        imageUrl: e.course?.imageUrl || fallback.courses[0].imageUrl,
      }))
    : fallback.courses;

  const communityPost = fallback.communityPost;
  const liveClass = fallback.liveClass;
  const activity = fallback.activity;

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