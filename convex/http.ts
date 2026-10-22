/// <reference types="node" />
import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { auth } from './auth';
import { verifyMercadoPagoSignature } from '@shared/payments/mercadoPagoWebhook';

interface MercadoPagoNotification {
  type?: string;
  topic?: string;
  data?: { id?: string | number };
  resource?: string;
}

interface MercadoPagoPayment {
  id?: string | number;
  status?: string;
  external_reference?: string;
  transaction_amount?: number;
  currency_id?: string;
  preference_id?: string;
  payer?: { email?: string };
}

const http = httpRouter();
auth.addHttpRoutes(http);

http.route({
  path: '/mercadopago-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.MP_WEBHOOK_SECRET;
    if (!webhookSecret) return new Response('Webhook is not configured', { status: 503 });

    const url = new URL(request.url);
    const dataId = url.searchParams.get('data.id') ?? url.searchParams.get('id');
    const isAuthentic = await verifyMercadoPagoSignature({
      signatureHeader: request.headers.get('x-signature'),
      requestId: request.headers.get('x-request-id'),
      dataId,
      secret: webhookSecret,
    });
    if (!isAuthentic) return new Response('Invalid signature', { status: 401 });

    try {
      const body = (await request.json().catch(() => ({}))) as MercadoPagoNotification;
      if (body.type && body.type !== 'payment' && body.topic !== 'payment') {
        return new Response('Ignored', { status: 200 });
      }
      const resourcePaymentId = body.resource?.split('/').at(-1);
      const paymentId = String(dataId ?? body.data?.id ?? resourcePaymentId ?? '');
      if (!paymentId) return new Response('Missing payment ID', { status: 400 });

      const accessToken = process.env.MP_ACCESS_TOKEN;
      if (!accessToken) return new Response('Payment provider is not configured', { status: 503 });
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!paymentResponse.ok) return new Response('Could not verify payment', { status: 502 });
      const payment = (await paymentResponse.json()) as MercadoPagoPayment;
      if (
        !payment.id ||
        !payment.status ||
        !payment.external_reference ||
        typeof payment.transaction_amount !== 'number' ||
        !payment.currency_id
      ) {
        return new Response('Incomplete payment', { status: 400 });
      }

      await ctx.runMutation(internal.orders.internal.reconcilePayment, {
        orderId: payment.external_reference,
        externalPaymentId: String(payment.id),
        externalPreferenceId: payment.preference_id,
        status: payment.status,
        amountMinor: Math.round(payment.transaction_amount * 100),
        currency: payment.currency_id,
        payerEmail: payment.payer?.email,
      });
      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Mercado Pago webhook reconciliation failed', error);
      return new Response('Webhook reconciliation failed', { status: 500 });
    }
  }),
});

export default http;
