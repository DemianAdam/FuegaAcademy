export interface MercadoPagoPayment {
  id?: string | number;
  status?: string;
  external_reference?: string;
  transaction_amount?: number;
  currency_id?: string;
  preference_id?: string;
  order?: { id?: string | number };
  payer?: { email?: string };
}

interface MercadoPagoMerchantOrder {
  preference_id?: string;
}

export async function fetchPaymentWithPreference(accessToken: string, paymentId: string) {
  const paymentResponse = await fetch(
    `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!paymentResponse.ok) throw new Error(`Could not verify payment (${paymentResponse.status}).`);
  const payment = await paymentResponse.json() as MercadoPagoPayment;

  if (payment.preference_id) return { payment, preferenceId: payment.preference_id };
  if (!payment.order?.id) throw new Error('Payment did not include merchant-order evidence for its preference.');

  const merchantOrderResponse = await fetch(
    `https://api.mercadopago.com/merchant_orders/${encodeURIComponent(String(payment.order.id))}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!merchantOrderResponse.ok) {
    throw new Error(`Could not verify the payment preference (${merchantOrderResponse.status}).`);
  }
  const merchantOrder = await merchantOrderResponse.json() as MercadoPagoMerchantOrder;
  if (!merchantOrder.preference_id) throw new Error('Merchant order did not include a preference ID.');
  return { payment, preferenceId: merchantOrder.preference_id };
}
