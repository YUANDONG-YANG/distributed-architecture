# Page 5: Engineering practice & implementation (distributed engineer view)

> Simulators: Page 1 — Transaction control · Page 2 — Observability · Page 3 — Traffic protection · Page 4 — Design rationale. **This page** is the same story one notch closer to the metal: artifacts you maintain, where load meets the database, and how you’d explain a real incident.

---

## Role of this page

**Design Rationale** sketches the full picture. Page 5 is narrower: **which code paths and stores matter**, **how spikes and retries are shaped before rows**, and **how you walk through an outage** without stopping at vocabulary.

---

## I · Mechanisms (aligned with each demo tab)

Each section below matches a simulator tab. The second paragraph is the sort of answer you give when someone asks what you actually wired.

### Transaction control

Everyone says idempotency and compensation. The useful part is the wiring: which row moves, which log line is authoritative, and where a duplicate delivery stops.

Guard illegal transitions with a **small state machine**; keep versions with **CAS or optimistic locks**; treat an append-only **process log** as the replay source; pair **outbox rows** with your publisher so publish order matches commit order; make consumers **idempotent on a business key**; wire **retry, then DLQ, then controlled replay** (plus manual steps when replay would lie about money).

### Observability

Dashboards help after you know the slice. The hard bit is carrying the same identifiers through metrics, logs, and traces so half a path is still debuggable.

Pick a **requestId** at the edge and refuse requests without it where you can; add a **business key** (order id, transfer ref) on log lines and span attributes; line up metric labels with those fields. When the partner drops your trace context, you can still stitch from alert → log → rough latency from metrics.

### Traffic protection

“Protect the core” means nothing until you name the hop: gateway, queue, app pool, then database. If the DB is absorbing retries and spikes, the design already lost.

**Rate limit and validate cheaply** at the edge; scale out the stateless tier; use **bulkheads and breakers** so one bad dependency does not flatten the pool; keep a **degraded response path** (cached read, async ticket, static fallback) that caps how many synchronous writes hit the store during a storm.

### Contract governance

Backward compatible is a wish until you track who is on which schema and what happens when you tighten a field.

Ship **explicit API versions**; document additive-only rules for events and payloads; keep a small **matrix** (consumer × min version × known breakage). That is how you schedule a breaking change instead of discovering it in prod logs.

### SLO / capacity / chaos

SLIs matter when they change behavior: freeze features, turn down traffic, or move headcount to the path that is actually burning error budget.

Measure **latency, success, freshness** on the paths you sell; size **headroom** against peak plus replay load; when the budget is gone, **throttle or stop shipping** non-critical work and put fixes for the hot path ahead of new scope.

---

## II · Concurrency & performance

Governance slides rarely mention thread pools and partition hot spots. In practice those are what decide whether a spike becomes an outage.

- **Database first:** pool size matched to what the CPU and locks can take; split hot rows or serialize contentious updates; cap statement time so one query cannot starve the pool; use replicas for read-heavy paths where stale reads are acceptable.
- **Bursts:** let queues or buffers soak traffic that would otherwise open thousands of transactions at once; match admission at the edge to what the slowest hop can drain.
- **App tier:** horizontal pods, shard-aware routing if data is partitioned; warm capacity before known events; session stickiness only when the session store demands it.
- **Retries:** jitter and hard caps; breakers so you do not coordinate a thundering herd; idempotency keys so a retry is not a second payment; DLQ when you are not sure it is safe to try again.
- **Off the synchronous path:** cache with a real invalidation story; hand work to MQ and batch writers; expose async APIs when the user can wait on a callback instead of holding a long HTTP transaction open.

---

## III · Ownership

Abstract principles are easy to copy. What convinces people is a clear split of phases, keys, and failure handling—stated plainly.

- I break cross-system work into **commit → outbox dispatch → idempotent apply → fix-up** (replay or compensate) and I name which store holds the truth at each step.
- **requestId + business key** are non-optional in logs and traces on systems I own; I push vendors toward the same fields even when tracing breaks mid-flight.
- I draw a line between **must succeed now** (sync, strong checks) and **can lag or degrade** (async fan-out, stale reads, canned responses when deps are down).
- Traffic hits **cheap checks first**, then bounded pools and queues, and only then the transactional core—so the database is rarely the first thing that saturates.
- Replay tooling, compensation hooks, and runbooks for the ugly cases ship together; I do not promise automated recovery for flows we would not safely re-drive.

---

## One-line summary

Keep **Design Rationale** for breadth. Use **this page** when the conversation needs **names of mechanisms**, **honest load paths**, and **how you behaved on a real integration**.
