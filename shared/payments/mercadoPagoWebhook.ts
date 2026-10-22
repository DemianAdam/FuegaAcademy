export interface MercadoPagoSignatureInput {
  signatureHeader: string | null;
  requestId: string | null;
  dataId: string | null;
  secret: string;
}

export function parseMercadoPagoSignature(signatureHeader: string | null) {
  const parts = new Map<string, string>();
  for (const part of signatureHeader?.split(',') ?? []) {
    const separator = part.indexOf('=');
    if (separator < 1) continue;
    parts.set(part.slice(0, separator).trim(), part.slice(separator + 1).trim());
  }
  return { timestamp: parts.get('ts') ?? null, signature: parts.get('v1') ?? null };
}

export function createMercadoPagoManifest(
  dataId: string | null,
  requestId: string | null,
  timestamp: string | null,
) {
  return [
    dataId ? `id:${dataId.toLowerCase()};` : '',
    requestId ? `request-id:${requestId};` : '',
    timestamp ? `ts:${timestamp};` : '',
  ].join('');
}

function bytesFromHex(hex: string) {
  if (!/^[a-f\d]+$/i.test(hex) || hex.length % 2 !== 0) return null;
  return new Uint8Array(hex.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []);
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

export async function verifyMercadoPagoSignature(input: MercadoPagoSignatureInput) {
  const { timestamp, signature } = parseMercadoPagoSignature(input.signatureHeader);
  if (!timestamp || !signature || !input.secret) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(input.secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const manifest = createMercadoPagoManifest(input.dataId, input.requestId, timestamp);
  const calculated = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest)),
  );
  const received = bytesFromHex(signature);
  return received ? constantTimeEqual(calculated, received) : false;
}

