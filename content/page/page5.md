# Page 5: Design philosophy & engineering practice (notes)

> Simulators: Page 1 — Transaction control · Page 2 — Observability · Page 3 — Traffic protection · Page 4 — Design rationale. This file mirrors tab 5 in the app: wiring, load, DB, and how to talk about incidents without fluff.

---

## Role of this page

**Design Rationale** is the wide shot. Here: which stores and code paths matter, how retries show up before rows, and how to walk through a bad rollout or outage with specifics.

---

## I · Mechanisms (aligned with each demo tab)

Sections follow the simulators plus contracts and SLOs. Under each heading: short point, then implementation-ish detail you’d say in review.

### Transaction control

Idempotency and compensation are table stakes. The review argument is which row moves, which log line wins on replay, where duplicates stop.

Small **state machine** for illegal transitions. Versions via **CAS / optimistic locks**. Append-only **process log** as replay source. **Outbox** tied to the publisher so commit and publish order match. Consumers **idempotent** on a business id. Path: **retry → DLQ → controlled replay**; manual steps when replay would falsify money.

### Observability

Dashboards help after you know the slice. The grind is one request id end to end and a business key on logs/spans so you can stitch when a vendor drops trace context.

**requestId** at the edge where realistic. **Business key** on log lines and span attrs; metric labels aligned. Trace gone? Alert → log → rough latency from metrics still works.

### Traffic protection

“Protect the core” is fluff until you list gateway, queue, app pool, DB. DB eating retries means the design failed upstream.

**Rate limit + validate** cheap at the edge. Scale stateless out. **Bulkheads and breakers** so one dep does not flatten the pool. **Degraded path** (cache, async ticket, static fallback) caps sync writes in a storm.

### Contract governance

“Backward compatible” is paper until you track schema revision per consumer and what breaks when you tighten a field.

**Explicit API versions**. Additive rules for events. Small **matrix**: consumer × min version × known breakage. Schedule breaks; do not discover them in prod logs only.

### SLO / capacity / chaos

SLIs matter when they change behavior: freeze scope, shed load, move people to the path burning budget.

**Latency, success, freshness** on what you sell. **Headroom** for peak + replay. Budget gone: **throttle or stop** non-critical work; hot-path fixes before new scope.

---

## II · Concurrency & performance

Slide decks skip pools and hot rows. Those decide spike vs outage.

- **Database:** pool sized to CPU and locks; split or serialize hot rows; cap statement time; replicas where stale reads are OK.
- **Bursts:** queues soak traffic that would open thousands of txs; edge admission matches slowest drain.
- **App tier:** horizontal scale; shard-aware routing if partitioned; warm before known spikes; session stickiness only if required.
- **Retries:** jitter, caps, breakers; idempotency keys; DLQ when replay is unsafe.
- **Off sync path:** cache with invalidation; MQ and batch; async APIs when the client can wait on a callback.

---

## III · Ownership

Buzzwords copy-paste. Useful is naming phases, keys, and who owns the ugly path.

- Split work into **commit → outbox dispatch → idempotent apply → fix-up**; name the authoritative store each step.
- **requestId + business key** on systems I own are mandatory in logs/traces; push vendors on the same fields when traces break.
- Split **must work now** vs **can lag** (async, stale, canned when deps fail).
- Order: **cheap checks**, pools/queues, then core. DB should not saturate first.
- Replay, compensation, runbooks ship with the feature. No auto-recovery promises on flows I would not re-drive by hand.

---

## One-line summary

**Design Rationale** for breadth. This page for mechanism names, load paths that look like prod, and a straight story of what happened on a real integration.

---

## Afterword

> When you run into an architecture problem and try to solve it with business-side levers alone, you have not fixed the underlying gap—you will keep stepping into pitfalls. If you have more thoughts, please reach out.

**If you have more thoughts:** [Robin Yang](https://www.linkedin.com/in/yuandong-yang-robin/)
