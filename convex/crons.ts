import { cronJobs } from 'convex/server';
import { makeFunctionReference } from 'convex/server';

const crons = cronJobs();

crons.hourly('clean up abandoned image uploads', makeFunctionReference<'mutation'>('media/mutations:cleanupPending'), {});
crons.hourly('close approved Mercado Pago preferences', makeFunctionReference<'action'>('checkout/actions:retryOpenPreferenceClosures'), {});

export default crons;
