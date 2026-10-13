/// <reference types="node" />
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/mercadopago-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id") || url.searchParams.get("data.id");

      let paymentId: string | null = id;

      const body = (await request.json().catch(() => null)) as any;
      if (body) {
        if (body.type === "payment" && body.data?.id) {
          paymentId = String(body.data.id);
        } else if (body.topic === "payment" && body.resource) {
          const parts = body.resource.split("/");
          paymentId = parts[parts.length - 1];
        }
      }

      if (!paymentId) {
        return new Response("Webhook received without payment ID", { status: 200 });
      }

      const accessToken = process.env.MP_ACCESS_TOKEN;
      if (!accessToken) {
        console.error("Missing MP_ACCESS_TOKEN in webhook handler");
        return new Response("Server configuration error", { status: 500 });
      }

      const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!paymentRes.ok) {
        console.error(`Failed to fetch payment ${paymentId} from Mercado Pago`);
        return new Response("Failed to verify payment", { status: 400 });
      }

      const payment = (await paymentRes.json()) as any;
      const orderId = payment.external_reference;
      const status = payment.status; // 'approved', 'pending', 'rejected', etc.

      if (orderId && status === "approved") {
        await ctx.runMutation(internal.orders.internal.fulfillOrderInternal, {
          orderId,
          externalPaymentId: String(payment.id),
        });
      }

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Error processing Mercado Pago webhook:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

export default http;
