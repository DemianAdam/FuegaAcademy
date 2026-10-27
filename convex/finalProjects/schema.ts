import { defineTable } from 'convex/server';
import { zodOutputToConvex } from 'convex-helpers/server/zod';
import { finalProjectSubmissionValidator } from '@shared/validators/finalProjects';

export const finalProjectSubmissionSchema = defineTable(zodOutputToConvex(finalProjectSubmissionValidator))
  .index('by_enrollment', ['enrollmentId'])
  .index('by_status', ['status'])
  .index('by_user', ['userId']);
