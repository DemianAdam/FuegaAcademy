/// <reference types="node" />
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";
import { verifyMercadoPagoSignature } from "@shared/payments/mercadoPagoWebhook";

interface MercadoPagoNotification {
  type?: string;
  topic?: string;
  data?: { id?: string | number };
  resource?: string;
}

const http = httpRouter();
auth.addHttpRoutes(http);

http.route({
  path: "/mercadopago-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.MP_WEBHOOK_SECRET;
    if (!webhookSecret)
      return new Response("Webhook is not configured", { status: 503 });

    const url = new URL(request.url);
    const dataId =
      url.searchParams.get("data.id") ?? url.searchParams.get("id");
    const isAuthentic = await verifyMercadoPagoSignature({
      signatureHeader: request.headers.get("x-signature"),
      requestId: request.headers.get("x-request-id"),
      dataId,
      secret: webhookSecret,
    });
    if (!dataId || !request.headers.get("x-request-id") || !isAuthentic)
      return new Response("Invalid signature", { status: 401 });

    try {
      const body = (await request
        .json()
        .catch(() => ({}))) as MercadoPagoNotification;
      if (body.type && body.type !== "payment" && body.topic !== "payment") {
        return new Response("Ignored", { status: 200 });
      }
      const resourcePaymentId = body.resource?.split("/").at(-1);
      const paymentId = String(
        dataId ?? body.data?.id ?? resourcePaymentId ?? "",
      );
      if (!paymentId)
        return new Response("Missing payment ID", { status: 400 });

      await ctx.runMutation(internal.orders.internal.acceptNotification, {
        paymentId,
      });
      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Mercado Pago webhook reconciliation failed", error);
      return new Response("Webhook reconciliation failed", { status: 500 });
    }
  }),
});

const fileHeaders = {
  "Access-Control-Allow-Origin": (process.env.SITE_URL ?? "").replace(
    /\/$/,
    "",
  ),
  "Access-Control-Expose-Headers": "Content-Disposition",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
http.route({
  path: "/private-file",
  method: "OPTIONS",
  handler: httpAction(
    async () => new Response(null, { status: 204, headers: fileHeaders }),
  ),
});
http.route({
  path: "/private-file",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      return new Response("Unauthorized", {
        status: 401,
        headers: fileHeaders,
      });
    const uploadId = new URL(request.url).searchParams.get(
      "uploadId",
    ) as Id<"privateUploads">;
    try {
      const permission = await ctx.runQuery(
        internal.learning.functions.uploadPermission,
        { userId, uploadId },
      );
      if (!permission)
        return new Response("Forbidden", { status: 403, headers: fileHeaders });
      if (Number(request.headers.get("content-length")) > 25 * 1024 * 1024)
        return new Response("Too large", { status: 413, headers: fileHeaders });
      const reader = request.body?.getReader();
      if (!reader)
        return new Response("Missing file", {
          status: 400,
          headers: fileHeaders,
        });
      const chunks: Uint8Array<ArrayBuffer>[] = [];
      let size = 0;
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        size += next.value.byteLength;
        if (size > 25 * 1024 * 1024) {
          await reader.cancel();
          return new Response("Too large", {
            status: 413,
            headers: fileHeaders,
          });
        }
        chunks.push(new Uint8Array(next.value));
      }
      const blob = new Blob(chunks, {
        type: request.headers.get("content-type") ?? "",
      });
      const storageId = await ctx.storage.store(blob);
      try {
        await ctx.runMutation(internal.learning.functions.finishUpload, {
          uploadId,
          storageId,
          userId,
        });
      } catch {
        await ctx.storage.delete(storageId);
        return new Response("Invalid file", {
          status: 400,
          headers: fileHeaders,
        });
      }
      return new Response("OK", { headers: fileHeaders });
    } catch {
      return new Response("Invalid upload", {
        status: 400,
        headers: fileHeaders,
      });
    }
  }),
});
http.route({
  path: "/private-file",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      return new Response("Unauthorized", {
        status: 401,
        headers: fileHeaders,
      });
    const url = new URL(request.url);
    try {
      const upload = await ctx.runQuery(
        internal.learning.functions.downloadPermission,
        {
          userId,
          uploadId: url.searchParams.get("uploadId") as Id<"privateUploads">,
          enrollmentId: (url.searchParams.get("enrollmentId") ?? undefined) as
            Id<"enrollments"> | undefined,
        },
      );
      if (!upload?.storageId)
        return new Response("Forbidden", { status: 403, headers: fileHeaders });
      const blob = await ctx.storage.get(upload.storageId);
      if (!blob)
        return new Response("Not found", { status: 404, headers: fileHeaders });
      return new Response(blob, {
        headers: {
          ...fileHeaders,
          "Content-Type": upload.contentType ?? "application/octet-stream",
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(upload.fileName)}`,
        },
      });
    } catch {
      return new Response("Forbidden", { status: 403, headers: fileHeaders });
    }
  }),
});
export default http;
