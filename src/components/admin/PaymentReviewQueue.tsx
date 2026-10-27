import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAction, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui';

const reasonLabel = (reason?: string) => {
  if (reason === 'Payment preference mismatch.') return 'No se pudo vincular el pago con su checkout.';
  if (reason === 'Payment amount or currency mismatch.') return 'El importe o la moneda pagada no coincide con el checkout.';
  if (reason === 'Mercado Pago did not return a payer email.') return 'Mercado Pago no devolvió la evidencia del pagador.';
  return reason ?? 'Este pago requiere una decisión manual de conciliación o reembolso.';
};

export function PaymentReviewQueue() {
  const orders = useQuery(api.orders.queries.listReviewQueue, {}) ?? [];
  const reconcilePayment = useAction(api.checkout.actions.reconcilePaymentById);
  const [paymentId, setPaymentId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);

  const reconcile = async (id: string) => {
    const normalizedPaymentId = id.trim();
    if (!normalizedPaymentId) return;
    setReconcilingId(normalizedPaymentId);
    setMessage(null);
    try {
      const result = await reconcilePayment({ paymentId: normalizedPaymentId });
      setMessage(result.enrolled ? 'Pago conciliado y estudiante inscripto.' : `La conciliación finalizó con estado: ${result.status}.`);
      setPaymentId('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo conciliar el pago.');
    } finally {
      setReconcilingId(null);
    }
  };

  const handleReconcile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await reconcile(paymentId);
  };

  return <div className="space-y-4">
    <div className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
      {orders.length ? `${orders.length} pago${orders.length === 1 ? '' : 's'} requiere${orders.length === 1 ? '' : 'n'} atención. No se otorga acceso hasta validar los datos del proveedor.` : 'No hay pagos que requieran atención.'}
    </div>
    {orders.map((order) => <article key={order._id} className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold">{order.courseTitle}</p><p className="mt-1 text-sm text-on-surface-variant">Estudiante: {order.studentEmail}</p></div><span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-200">Requiere revisión</span></div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4"><div><dt className="text-on-surface-variant">Modalidad</dt><dd className="mt-0.5 font-medium">{order.tier === 'live' ? 'En vivo' : 'Grabado'}</dd></div><div><dt className="text-on-surface-variant">Importe</dt><dd className="mt-0.5 font-medium">{order.currency} {((order.amountMinor ?? 0) / 100).toLocaleString('es-AR')}</dd></div><div><dt className="text-on-surface-variant">Pago de Mercado Pago</dt><dd className="mt-0.5 font-medium">{order.externalPaymentId ?? 'No disponible'}</dd></div><div><dt className="text-on-surface-variant">Email del recibo del pagador</dt><dd className="mt-0.5 break-all font-medium">{order.payerEmail ?? 'No disponible'}</dd></div></dl>
      <p className="mt-4 border-t border-amber-500/20 pt-3 text-sm text-amber-900 dark:text-amber-100">{reasonLabel(order.failureReason)}</p>
      {order.externalPaymentId && <div className="mt-4"><Button size="sm" disabled={reconcilingId !== null} onClick={() => void reconcile(order.externalPaymentId!)}>{reconcilingId === order.externalPaymentId ? 'Verificando…' : 'Verificar y conciliar'}</Button></div>}
    </article>)}
    <details className="rounded-xl border border-outline-variant bg-surface-container-low p-4"><summary className="cursor-pointer font-semibold">Conciliar otro pago con su ID</summary><form className="mt-3" onSubmit={handleReconcile}><label className="sr-only" htmlFor="mercadopago-payment-id">ID de pago de Mercado Pago</label><div className="flex flex-col gap-2 sm:flex-row"><input id="mercadopago-payment-id" className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface px-3 py-2" inputMode="numeric" value={paymentId} onChange={(event) => setPaymentId(event.target.value)} placeholder="ID de pago de Mercado Pago" /><Button type="submit" size="sm" disabled={reconcilingId !== null || !paymentId.trim()}>{reconcilingId === paymentId.trim() ? 'Verificando…' : 'Verificar pago'}</Button></div></form></details>
    {message && <p className="text-sm text-on-surface-variant" role="status">{message}</p>}
  </div>;
}
