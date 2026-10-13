import { useQuery } from "convex/react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { mockDashboardData } from '../data/mockDashboardData';
import { useAuth } from '../lib/useAuth';
import {
  WelcomeHeader,
  InProgressCoursesSection,
  CommunitySection,
  LiveClassWidget,
  RecommendationWidget,
  ActivityStatsWidget,
} from '../components/dashboard';

export function Dashboard() {
  const { user: authUser } = useAuth();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  const enrollments = useQuery(api.enrollments.queries.listMyEnrollments);
  const fallback = mockDashboardData;

  const userName = authUser?.name || fallback.user.name;

  const courses = enrollments && enrollments.length > 0 
    ? enrollments.map((e: any) => ({
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
    <>
      {paymentStatus === "success" && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-between">
          <span>¡Pago realizado con éxito! Tu inscripción ha sido procesada correctamente.</span>
        </div>
      )}
      {paymentStatus === "failure" && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 font-medium flex items-center justify-between">
          <span>El pago no pudo completarse. Por favor, inténtalo de nuevo.</span>
        </div>
      )}
      {paymentStatus === "pending" && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500 text-amber-600 dark:text-amber-400 font-medium flex items-center justify-between">
          <span>Tu pago está pendiente de acreditación. Te notificaremos cuando se apruebe.</span>
        </div>
      )}

      {/* Welcome Header */}
      <WelcomeHeader userName={userName} />

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
    </>
  );
}
