import { useNow } from "@/shared/useNow";
import { useQuery } from "convex/react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/Button";

const statusCopy = {
  pending: {
    title: "Estamos verificando tu pago",
    body: "Tu inscripción se activará apenas Mercado Pago confirme el pago.",
    tone: "text-amber-700",
  },
  approved: {
    title: "Tu inscripción está confirmada",
    body: "Ya podés acceder a tu curso desde tu panel.",
    tone: "text-emerald-700",
  },
  review: {
    title: "Tu pago está siendo revisado",
    body: "No se activará el acceso hasta que el equipo revise esta operación.",
    tone: "text-amber-700",
  },
  rejected: {
    title: "No se pudo completar el pago",
    body: "Podés volver al curso e intentar nuevamente.",
    tone: "text-red-700",
  },
  expired: {
    title: "El checkout venció",
    body: "Volvé al curso para iniciar un nuevo pago.",
    tone: "text-red-700",
  },
  refunded: {
    title: "El pago fue reembolsado",
    body: "Tu acceso al curso fue desactivado.",
    tone: "text-red-700",
  },
  charged_back: {
    title: "El pago fue desconocido",
    body: "Tu acceso al curso fue desactivado.",
    tone: "text-red-700",
  },
} as const;

export function CheckoutStatusPage() {
  const now = useNow();
  const { orderId } = useParams<{ orderId: string }>();
  const order = useQuery(
    api.orders.queries.getMyStatus,
    orderId ? { orderId } : "skip",
  );
  if (order === undefined)
    return (
      <main className="mx-auto max-w-xl p-12 text-center">
        Cargando estado del pago…
      </main>
    );
  if (order === null)
    return (
      <main className="mx-auto max-w-xl p-12 text-center">
        <h1 className="text-2xl font-bold">No encontramos esta compra</h1>
        <p className="mt-3 text-on-surface-variant">
          Verificá que ingresaste con la misma cuenta.
        </p>
      </main>
    );
  const expired =
    order.status === "pending" &&
    !order.processing &&
    (order.expiresAt ?? Infinity) <= now;
  const copy = expired
    ? statusCopy.expired
    : order.status === "pending" &&
        ["creating", "closing", "uncertain"].includes(order.checkoutState)
      ? {
          title: "Estamos preparando tu compra",
          body: "Esperá unos instantes. No vuelvas a pagar si ya completaste el pago.",
          tone: "text-amber-700",
        }
      : statusCopy[order.status];
  const coursePath = order.courseSlug
    ? `/course/${order.courseSlug}`
    : "/courses";

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 py-12">
      <section className="w-full rounded-2xl border border-outline-variant bg-surface-container-low p-8 text-center shadow-lg">
        <p className={`text-sm font-bold ${copy.tone}`}>
          Compra de {order.courseTitle}
        </p>
        <h1 className="mt-3 text-3xl font-black text-on-surface">
          {copy.title}
        </h1>
        <p className="mt-4 text-on-surface-variant">{copy.body}</p>
        {order.status === "pending" &&
          order.tier === "live" &&
          order.expiresAt && (
            <p className="mt-3 text-sm">
              Reserva hasta{" "}
              {new Date(order.expiresAt).toLocaleString("es-AR", {
                timeZone: "America/Buenos_Aires",
              })}
            </p>
          )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {order.status === "approved" ? (
            <Link to="/dashboard">
              <Button variant="primary">Ir a mi panel</Button>
            </Link>
          ) : (
            <Link to={coursePath}>
              <Button variant="outline">Volver al curso</Button>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
