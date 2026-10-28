import { useNow } from "@/shared/useNow";
import { useAuth } from "@/lib/useAuth";
import { useState } from "react";
import { useAction, useQuery, useConvexAuth } from "convex/react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/Button";
import { AppLink } from "../shared/AppLink";
import type { CourseWithRelations } from "@shared/validators/courses";
import { activeTiersForFormat, type CourseTier } from "@shared/courseCommerce";

interface CourseSidebarProps {
  course: CourseWithRelations;
  preview?: boolean;
}

export function CourseSidebar({ course, preview = false }: CourseSidebarProps) {
  const now = useNow();
  const { user } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const tiers = activeTiersForFormat(course.format);
  const [formatType, setFormatType] = useState<CourseTier>(() =>
    new URLSearchParams(location.search).get("tier") === "recorded"
      ? "recorded"
      : tiers[0],
  );
  const selectedTier = tiers.includes(formatType) ? formatType : tiers[0];

  const enrollments = useQuery(
    api.enrollments.queries.listMyEnrollments,
    isAuthenticated && user?.role === "student" && !preview ? {} : "skip",
  );

  const isEnrolled =
    !preview &&
    enrollments !== undefined &&
    enrollments.some((e) => e.courseId === course._id && e.status === "active");

  const defaultScheduleId =
    course.schedules?.find(
      (s) => s.enrolledCount < s.capacity && s.startsAt > now,
    )?._id ||
    course.schedules?.[0]?._id ||
    "";
  const [selectedScheduleId, setSelectedScheduleId] = useState(
    new URLSearchParams(location.search).get("cohort") || defaultScheduleId,
  );

  const createPreference = useAction(api.checkout.actions.createPreference);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const liveSchedules = course.schedules ?? [];
  const allLiveSchedulesFull =
    selectedTier === "live" &&
    liveSchedules.length > 0 &&
    liveSchedules.every(
      (schedule) =>
        schedule.enrolledCount >= schedule.capacity || schedule.startsAt <= now,
    );

  const handleEnroll = async () => {
    if (preview) return;
    if (!isAuthenticated) {
      navigate(
        `/login?returnTo=${encodeURIComponent(`${location.pathname}?tier=${selectedTier}&cohort=${encodeURIComponent(selectedScheduleId)}`)}`,
      );
      return;
    }
    try {
      setIsEnrolling(true);
      setCheckoutError(null);
      const res = await createPreference({
        courseId: course._id,
        tier: selectedTier,
        scheduleId:
          selectedTier === "live" && (selectedScheduleId || defaultScheduleId)
            ? ((selectedScheduleId || defaultScheduleId) as Id<"schedules">)
            : undefined,
      });

      if (!res.initPoint) navigate(`/checkout/${res.orderId}`);
      if (res.initPoint) {
        window.location.href = res.initPoint;
      }
    } catch (error: unknown) {
      console.error("Error creating checkout preference:", error);
      setCheckoutError(
        "No se pudo iniciar el pago. Revisá tu inscripción, los cupos o intentá nuevamente en unos minutos.",
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ARS",
  });
  const livePrice = course.pricing.live
    ? priceFormatter.format(course.pricing.live.amountMinor / 100)
    : "No disponible";
  const recordedPrice = course.pricing.recorded
    ? priceFormatter.format(course.pricing.recorded.amountMinor / 100)
    : "No disponible";

  if (isEnrolled) {
    return (
      <div
        className={`course-sidebar sticky top-24 p-6 rounded-2xl border border-outline-variant bg-surface-container-low space-y-6 shadow-xl ${preview ? "course-sidebar--preview" : ""}`}
      >
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-on-surface">Inscripción</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>
            Ya estás inscripto
          </span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-outline-variant space-y-2">
          <p className="text-sm font-medium text-on-surface">{course.title}</p>
          <p className="text-xs text-on-surface-variant">
            Tenés acceso a los contenidos de tu modalidad hasta aprobar el
            examen.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <AppLink to="/dashboard" className="block w-full">
            <Button
              variant="primary"
              className="w-full py-4 font-bold text-base shadow-md flex items-center justify-center gap-2"
            >
              Ir al panel
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Button>
          </AppLink>
          <p className="text-center text-xs text-on-surface-variant">
            Acceso hasta aprobar el examen
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`course-sidebar sticky top-24 p-6 rounded-2xl border border-outline-variant bg-surface-container-low space-y-6 shadow-xl ${preview ? "course-sidebar--preview" : ""}`}
    >
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg text-on-surface">Inscripción</span>
        {tiers.length > 1 && (
          <div className="flex gap-1 bg-surface p-1 rounded-lg border border-outline-variant">
            <Button
              variant={selectedTier === "live" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFormatType("live")}
              className={
                selectedTier === "live"
                  ? "shadow-sm"
                  : "text-on-surface-variant"
              }
            >
              En vivo
            </Button>
            <Button
              variant={selectedTier === "recorded" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFormatType("recorded")}
              className={
                selectedTier === "recorded"
                  ? "shadow-sm"
                  : "text-on-surface-variant"
              }
            >
              Grabado
            </Button>
          </div>
        )}
      </div>

      <div className="text-3xl font-black text-on-surface">
        {selectedTier === "live" ? livePrice : recordedPrice}
        <span className="text-xs font-normal text-on-surface-variant ml-2">
          ARS pago único
        </span>
      </div>

      {selectedTier === "live" &&
        course.schedules &&
        course.schedules.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Elegí tu grupo y horario:
              </label>
              <span className="text-xs text-primary font-medium">
                Cupos limitados
              </span>
            </div>
            <div className="space-y-2.5">
              {course.schedules.map((sched) => {
                const isFull =
                  sched.enrolledCount >= sched.capacity ||
                  sched.startsAt <= now;
                const activeScheduleId =
                  selectedScheduleId || defaultScheduleId;
                const isSelected = activeScheduleId === sched._id;

                return (
                  <button
                    key={sched._id}
                    disabled={isFull}
                    onClick={() => setSelectedScheduleId(sched._id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all relative ${
                      isFull
                        ? "border-outline-variant bg-surface opacity-50 cursor-not-allowed"
                        : isSelected
                          ? "border-primary bg-primary/10 ring-1 ring-primary shadow-sm"
                          : "border-outline-variant hover:bg-surface text-on-surface-variant"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span
                        className={`text-xs font-bold ${isSelected ? "text-primary" : "text-on-surface"}`}
                      >
                        {sched.name}
                        <span className="block text-xs font-normal">
                          Inicio:{" "}
                          {new Date(sched.startsAt).toLocaleString("es-AR", {
                            timeZone: "America/Buenos_Aires",
                          })}
                        </span>
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          isFull
                            ? "bg-error/10 text-error"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        {isFull
                          ? "Completo"
                          : `${sched.capacity - sched.enrolledCount} cupos disponibles`}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {sched.sessions.map((session, index) => (
                        <div
                          key={`${session.day}-${session.startTime}-${index}`}
                          className="flex items-center gap-1.5 text-xs text-on-surface-variant"
                        >
                          <span className="material-symbols-outlined text-xs text-primary">
                            event
                          </span>
                          <span className="font-medium text-on-surface">
                            {session.day}:
                          </span>
                          <span>
                            {session.startTime} - {session.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      <div className="space-y-3 pt-2">
        <Button
          variant="primary"
          className="w-full py-4 font-bold text-base shadow-md"
          onClick={handleEnroll}
          disabled={
            course.purchaseEnabled === false ||
            preview ||
            (isAuthenticated && user?.role !== "student") ||
            isEnrolling ||
            !course.pricing[selectedTier] ||
            (selectedTier === "live" &&
              ((!selectedScheduleId && !defaultScheduleId) ||
                allLiveSchedulesFull))
          }
        >
          {course.purchaseEnabled === false
            ? "Inscripción próximamente"
            : preview
              ? "Vista previa: pago desactivado"
              : !isAuthenticated
                ? "Ingresá para pagar"
                : isEnrolling
                  ? "Conectando con Mercado Pago..."
                  : allLiveSchedulesFull
                    ? "No hay cupos disponibles"
                    : "Pagar con Mercado Pago"}
        </Button>
        {checkoutError && (
          <p
            role="alert"
            className="rounded-xl border border-error/20 bg-error/10 p-3 text-center text-xs text-error"
          >
            {checkoutError}
          </p>
        )}
        <p className="text-center text-xs text-on-surface-variant">
          El acceso termina al aprobar el examen. 🔒 Pago seguro con Mercado
          Pago. Tu lugar se confirma tras verificar el pago.
        </p>
      </div>
    </div>
  );
}
