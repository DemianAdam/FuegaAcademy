import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';

export const externalImageSourceValidator = z.object({
  kind: z.literal('external'),
  url: z.string().url(),
}).strict();

export const storageImageSourceValidator = z.object({
  kind: z.literal('storage'),
  storageId: zid('_storage'),
}).strict();

export const imageSourceValidator = z.discriminatedUnion('kind', [
  externalImageSourceValidator,
  storageImageSourceValidator,
]);

export type ImageSource = z.infer<typeof imageSourceValidator>;
