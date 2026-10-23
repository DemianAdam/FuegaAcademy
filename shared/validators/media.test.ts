import { describe, expect, it } from 'vitest';
import { imageSourceValidator } from './media';

describe('image source contract', () => {
  it('accepts a valid external URL source', () => {
    expect(imageSourceValidator.safeParse({ kind: 'external', url: 'https://example.com/image.webp' }).success).toBe(true);
  });

  it('rejects a malformed external URL', () => {
    expect(imageSourceValidator.safeParse({ kind: 'external', url: 'not-a-url' }).success).toBe(false);
  });

  it('requires the selected source shape', () => {
    expect(imageSourceValidator.safeParse({ kind: 'storage', url: 'https://example.com/image.webp' }).success).toBe(false);
    expect(imageSourceValidator.safeParse({ kind: 'external', url: 'https://example.com/image.webp', storageId: 'storage-id' }).success).toBe(false);
  });
});
