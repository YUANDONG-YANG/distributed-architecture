# Page 4: Design rationale (integration engineer view)

> **App navigation:** five tabs — (1) Transaction control · (2) Observability · (3) Traffic protection · (4) **Design Rationale** (this document’s themes: trust, contracts, SLOs, business framing — see in-app copy) · (5) **Engineering Practice** (implementation and load/DB detail; see `page5.md`).

> Simulators 1–3 below are the **interactive core** that maps to consistency, observability, and survivability.

---

## Why these three topics

Integration work sits on **system boundaries**: async messaging, third-party APIs, multi-service flows, and legacy interfaces. Three risks are always present:

1. **Consistency**: how cross-system work stays loss-free, duplicate-free, reconcilable, and recoverable or compensatable.
2. **Observability**: when the chain is long and ownership is split, how to correlate evidence, find root cause, and support recovery actions.
3. **Survivability and resilience**: integration ingress often drives bursts and retry storms—how to shed load **before** it hits the DB or core dependencies.

The three simulators turn these into **interactive architecture narratives**, not static diagrams. Tabs 4–5 add the **full integration stance** and **engineering landing points** without replacing the demos.

---

## Mapping

| Page | Topic | Why it matters for integration engineers |
|------|-------|------------------------------------------|
| 1 | Transaction control | Local atomic boundaries, outbox, idempotency, process logs, DLQ, replay/compensation—you own **consistency engineering** end to end. |
| 2 | Monitoring & observability loop | Metrics–traces–logs tied to business keys; links to process logs and replay—shorter MTTR. |
| 3 | Traffic governance & protection | Edge limits, validation, elastic absorption, circuit breaking—**protect the core early** so integration does not become a site-wide bottleneck. |

---

## One-line summary

**Transaction control** makes cross-system work **correct and recoverable**; **observability** makes incidents **visible and traceable**; **survivability governance** keeps the **core healthy under pressure and failure**. All three are required to move from ad hoc integrations to **reliable integration architecture**; the Design Rationale and Engineering Practice tabs spell out what sits around those three when you argue scope, trust, contracts, and concrete mechanisms.
