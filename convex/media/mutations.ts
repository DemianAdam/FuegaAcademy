import { ConvexError } from 'convex/values';
import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';
import type { MutationCtx } from '../_generated/server';
import type { Id } from '../_generated/dataModel';
import type { ImageSource } from '@shared/validators/media';
import { zAdminMutation, zInternalMutation } from '../zod';

const maxImageBytes = 5 * 1024 * 1024;
const allowedContentTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export const generateUploadUrl = zAdminMutation({
  args: z.object({}),
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

export const registerUpload = zAdminMutation({
  args: z.object({ storageId: zid('_storage') }),
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('mediaAssets').withIndex('by_storage_id', (q) => q.eq('storageId', args.storageId)).unique();
    if (existing) {
      if (existing.ownerId !== ctx.userId) throw new ConvexError({ code: 'FORBIDDEN', message: 'This upload belongs to another administrator.' });
      return args.storageId;
    }
    const metadata = await ctx.db.system.get('_storage', args.storageId);
    if (!metadata || !metadata.contentType || !allowedContentTypes.has(metadata.contentType) || metadata.size > maxImageBytes) {
      throw new ConvexError({ code: 'INVALID_IMAGE', message: 'Upload a JPEG, PNG, WebP, or GIF image no larger than 5 MB.' });
    }
    await ctx.db.insert('mediaAssets', { storageId: args.storageId, ownerId: ctx.userId, contentType: metadata.contentType, size: metadata.size, status: 'pending' });
    return args.storageId;
  },
});

export async function assertAndAttachImageSource(ctx: MutationCtx, userId: Id<'users'>, source: ImageSource) {
  if (source.kind === 'external') return;
  const asset = await ctx.db.query('mediaAssets').withIndex('by_storage_id', (q) => q.eq('storageId', source.storageId)).unique();
  if (!asset) throw new ConvexError({ code: 'UNREGISTERED_IMAGE', message: 'Upload the image before saving it.' });
  if (asset.ownerId !== userId) throw new ConvexError({ code: 'FORBIDDEN', message: 'This upload belongs to another administrator.' });
  if (asset.status !== 'attached') await ctx.db.patch(asset._id, { status: 'attached' });
}

export async function releaseImageSourceIfUnused(ctx: MutationCtx, source: ImageSource | undefined) {
  if (!source || source.kind !== 'storage') return;
  const [courses, teachers] = await Promise.all([ctx.db.query('courses').collect(), ctx.db.query('teachers').collect()]);
  const used = courses.some((course) => (course.image?.kind === 'storage' && course.image.storageId === source.storageId) || (course.polaroid?.kind === 'storage' && course.polaroid.storageId === source.storageId))
    || teachers.some((teacher) => teacher.image?.kind === 'storage' && teacher.image.storageId === source.storageId);
  if (used) return;
  const asset = await ctx.db.query('mediaAssets').withIndex('by_storage_id', (q) => q.eq('storageId', source.storageId)).unique();
  if (asset) await ctx.db.delete(asset._id);
  await ctx.storage.delete(source.storageId);
}

export const cleanupPending = zInternalMutation({
  args: z.object({}),
  handler: async (ctx) => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const pending = await ctx.db.query('mediaAssets').withIndex('by_status', (q) => q.eq('status', 'pending')).collect();
    for (const asset of pending) {
      if (asset._creationTime >= cutoff) continue;
      await ctx.storage.delete(asset.storageId);
      await ctx.db.delete(asset._id);
    }
  },
});
