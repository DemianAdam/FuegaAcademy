import { useQuery } from "convex/react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { useAuth } from '../lib/useAuth';
import {
  WelcomeHeader,
  InProgressCoursesSection,
} from '../components/dashboard';
import type { InProgressCourse } from '@/features/dashboard/types';
import { FinalProjectPanel } from '@/components/dashboard/FinalProjectPanel';

export function Dashboard() {
  const { user: authUser } = useAuth();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  const enrollments = useQuery(api.enrollments.queries.listMyEnrollments, {});
  const userName = authUser?.name ?? authUser?.email ?? 'Fuega student';

  const courses: InProgressCourse[] = (enrollments ?? []).flatMap((enrollment) =>
    enrollment.course
      ? [{
          _id: enrollment._id,
          _creationTime: enrollment._creationTime,
          title: enrollment.course.title ?? 'Fuega course',
          category: enrollment.course.badge ?? 'CREATOR ECONOMY',
          progressPercent: enrollment.progressPercent,
          completedClasses: enrollment.completedClasses,
          totalClasses: enrollment.totalClasses,
          imageUrl: enrollment.course.imageUrl,
        }]
      : [],
  );

  return (
    <>
      {paymentStatus === "success" && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-between">
          <span>Mercado Pago returned successfully. Access appears only after the signed payment notification is verified.</span>
        </div>
      )}
      {paymentStatus === "failure" && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 font-medium flex items-center justify-between">
          <span>El pago no se completó. No se activó ninguna inscripción.</span>
        </div>
      )}
      {paymentStatus === "pending" && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500 text-amber-600 dark:text-amber-400 font-medium flex items-center justify-between">
          <span>The payment is pending. Enrollment remains inactive until Mercado Pago confirms approval.</span>
        </div>
      )}

      {/* Welcome Header */}
      <WelcomeHeader userName={userName} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        <div className="lg:col-span-8 space-y-stack-lg">
          <InProgressCoursesSection courses={courses} />
          <FinalProjectPanel enrollments={(enrollments ?? [])} />
        </div>
        <div className="lg:col-span-4">
          <aside className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-6 text-on-surface-variant">
            <h2 className="font-bold text-on-surface">Próximamente habrá más herramientas</h2>
            <p className="mt-2 text-sm">
              Las clases en vivo, la actividad de la comunidad y las métricas de aprendizaje aparecerán aquí cuando estén disponibles.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
