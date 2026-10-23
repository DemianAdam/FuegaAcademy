import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const mediaAssetSchema = defineTable({
  storageId: v.id('_storage'),
  ownerId: v.id('users'),
  contentType: v.string(),
  size: v.number(),
  status: v.union(v.literal('pending'), v.literal('attached')),
})
  .index('by_storage_id', ['storageId'])
  .index('by_status', ['status']);
