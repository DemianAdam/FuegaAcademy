---
title: "Reliable Course Purchase"
status: approved
owner: "Product owner"
created: 2026-10-23
updated: 2026-10-26
change-key: "PURCHASE"
---

# Specification: Reliable Course Purchase

## Summary

Students can safely start, resume, verify, and reverse course purchases through Mercado Pago.

## Requirements

### REQ-PURCHASE-001: Authenticated checkout entry

Visitors must be sent to authentication and returned to the selected course before checkout starts.

### REQ-PURCHASE-002: Resumable single checkout

A student must have at most one active checkout for the same course, regardless of tier or schedule. It expires after 24 hours.

### REQ-PURCHASE-003: Verified order status

Students must see only their own verified order status after returning from Mercado Pago.

### REQ-PURCHASE-004: Reversible enrollment

Approved payments must enroll exactly once; confirmed refunds and chargebacks must revoke that enrollment and release its seat exactly once.

### REQ-PURCHASE-005: Testable purchase boundaries

Checkout, authorization, capacity, reconciliation, and reversal behavior must have automated evidence without real payments.

### REQ-PURCHASE-006: Independent payment payer

The authenticated Academy student must receive the enrollment even when the Mercado Pago payer is a guest or uses a different email address. The authoritative payer email must be recorded for audit, but must not be compared to the student's Academy email.

### REQ-PURCHASE-007: Final payment state

After an approved payment, the system must prevent another checkout or enrollment for that student's active run of the course. It must close the associated provider preference and route exceptional late duplicate payments to administrator review without creating access.
