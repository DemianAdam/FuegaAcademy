import { describe, expect, it } from 'vitest';
import {
  createMercadoPagoManifest,
  parseMercadoPagoSignature,
  verifyMercadoPagoSignature,
} from './mercadoPagoWebhook';

describe('Mercado Pago webhook signatures', () => {
  it('builds the documented lowercase manifest', () => {
    expect(createMercadoPagoManifest('ORD-ABC', 'request-1', '123')).toBe(
      'id:ord-abc;request-id:request-1;ts:123;',
    );
  });

  it('parses signature components regardless of spacing', () => {
    expect(parseMercadoPagoSignature('ts=123, v1=abc')).toEqual({
      timestamp: '123',
      signature: 'abc',
    });
  });

  it('validates an HMAC and rejects altered identifiers', async () => {
    const secret = 'test-secret';
    const manifest = createMercadoPagoManifest('payment-1', 'request-1', '123');
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const digest = new Uint8Array(
      await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest)),
    );
    const signature = [...digest].map((byte) => byte.toString(16).padStart(2, '0')).join('');

    await expect(
      verifyMercadoPagoSignature({
        signatureHeader: `ts=123,v1=${signature}`,
        requestId: 'request-1',
        dataId: 'payment-1',
        secret,
      }),
    ).resolves.toBe(true);
    await expect(
      verifyMercadoPagoSignature({
        signatureHeader: `ts=123,v1=${signature}`,
        requestId: 'request-1',
        dataId: 'payment-2',
        secret,
      }),
    ).resolves.toBe(false);
  });

  it('rejects missing or malformed signatures', async () => {
    await expect(verifyMercadoPagoSignature({
      signatureHeader: null,
      requestId: 'request-1',
      dataId: 'payment-1',
      secret: 'test-secret',
    })).resolves.toBe(false);
    await expect(verifyMercadoPagoSignature({
      signatureHeader: 'ts=123,v1=not-hex',
      requestId: 'request-1',
      dataId: 'payment-1',
      secret: 'test-secret',
    })).resolves.toBe(false);
  });
});

