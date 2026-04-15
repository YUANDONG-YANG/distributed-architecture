# Distributed System Simulator

A **distributed systems simulator** frontend for architecture walkthroughs and teaching. It uses interactive UIs to explain transaction control, observability loops, traffic governance, design rationale, and engineering practice (aligned with the narrative Markdown under `content/`).

## Features

| Area                    | Description                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Transaction Control** | Simulates a distributed transaction control chain: local atomicity, outbox, async consumption, retry / DLQ / manual handling, with React Flow swimlanes and state progression. |
| **Observability Loop**  | Narrative page for observability and troubleshooting: metrics, tracing, log correlation, and business-level recovery patterns.                                                 |
| **Traffic Protection**  | Traffic governance and system protection: ingress → gateway → service tier → isolation / breaker → DB, with layered metrics and simulation outcomes.                           |
| **Design Rationale**    | Extended lenses: security, contracts, SLOs, and how to discuss impact.                                                                                                         |
| **Engineering Practice** | Complements the demos with implementation-level detail: concrete mechanisms (state machine, CAS, outbox, idempotency, retry/DLQ), load/DB and concurrency angles, and a first-person view of integration work. See `content/page/page5.md`. |

**Stack:** React 18, Vite 5, React Flow, Zustand, Framer Motion.

## Requirements

- **Node.js** 18+ (current LTS recommended)
- **npm** 9+ (or compatible **pnpm** / **yarn**)

## Install and run

```bash
# start project !!
cd architecture_draft

npm install

npm run dev
```

Open the local URL shown in the terminal (default **http://localhost:5173**).

## Other scripts

```bash
npm run build    # production build

npm run preview  # serve the production build locally (run build first)
```

## Project layout

- `src/app/` — App shell and tab-based navigation
- `src/pages/` — Feature pages
- `src/components/` — Flow canvas, toolbars, panels, etc.
- `src/store/` — Zustand stores
- `src/engine/` — Lightweight simulation logic
- `content/page/` — Architecture narrative (`page4`, `page5`; aligned with Design Rationale & Engineering Practice tabs)
- `content/dev/` — Build prompts and Page 1–3 implementation specs (developer material; see `content/README.md`)

---

To add a new tab or simulation, start from `src/data/tabs.js` and `src/layout/ShellLayout.jsx`.
