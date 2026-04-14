# Page 4: Design rationale (integration engineer view)

> Simulators: Page 1 — Distributed transaction control · Page 2 — Observability & troubleshooting loop · Page 3 — Traffic governance & system protection (survivability / resilience).

---

## Why these three topics

Integration work sits on **system boundaries**: async messaging, third-party APIs, multi-service flows, and legacy interfaces. Three risks are always present:

1. **Consistency**: how cross-system work stays loss-free, duplicate-free, alignable, and recoverable or compensatable.
2. **Observability**: when the chain is long and ownership is split, how to correlate evidence, find root cause, and support recovery actions.
3. **Survivability and resilience**: integration ingress often drives bursts and retry storms—how to shed load **before** it hits the DB or core dependencies.

The three pages turn these into **interactive architecture narratives**, not static diagrams.

---

## Mapping

| Page | Topic | Why it matters for integration engineers |
|------|-------|------------------------------------------|
| 1 | Transaction control | Local atomic boundaries, outbox, idempotency, process logs, DLQ, replay/compensation—you own **consistency engineering** end to end. |
| 2 | Monitoring & observability loop | Metrics–traces–logs tied to business keys; links to process logs and replay—shorter MTTR. |
| 3 | Traffic governance & protection | Edge limits, validation, elastic absorption, circuit breaking—**protect the core early** so integration does not become a site-wide bottleneck. |

---

## One-line summary

**Transaction control** makes cross-system work **correct and recoverable**; **observability** makes incidents **visible and traceable**; **survivability governance** keeps the **core healthy under pressure and failure**. All three are required to move from “hooking up APIs” to **designing reliable integration architecture**.
