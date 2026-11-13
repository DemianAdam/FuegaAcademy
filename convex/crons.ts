import { cronJobs } from "convex/server";
import { makeFunctionReference } from "convex/server";

const crons = cronJobs();

crons.hourly(
  "clean up abandoned image uploads",
  makeFunctionReference<"mutation">("media/mutations:cleanupPending"),
  {},
);
crons.interval(
  "recover Mercado Pago checkouts",
  { minutes: 1 },
  makeFunctionReference<"action">(
    "checkout/actions:retryOpenPreferenceClosures",
  ),
  {},
);

crons.hourly(
  "clean private uploads",
  makeFunctionReference<"mutation">("learning/functions:cleanup"),
  {},
);
export default crons;
