# Design: Reliable Course Purchase

Orders keep the provider checkout URL and expiration. A trusted checkout action reserves or resumes a pending order, and a student-only order query drives a protected status route. Webhooks remain authoritative and reverse only the enrollment linked to the reversed order.

## Interfaces and Data

Orders add `checkoutUrl`, `expiresAt`, and `expired`/`charged_back` statuses. `orders/queries.getMyStatus` is student-authorized. Mercado Pago back URLs point to `/checkout/:orderId`.

## Security and Failure Behavior

Return URLs grant no access. The action validates price, schedule, role, and active order state. The webhook validates its signature and provider payment before reconciliation. Reversal deletes only the enrollment associated with the order and decrements capacity defensively.

## Test Strategy

REQ-PURCHASE-001 through 005 are covered by checkout-rule, Convex reconciliation, component, and mocked browser tests; no test invokes a live payment.
