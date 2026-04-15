# Distributed System Simulator

Interactive web application for demonstrating distributed-systems concepts—transaction boundaries, observability, traffic governance, and design tradeoffs—through simulations and narrative copy. This repository contains the **frontend only** (no backend API).

## What it does

The app is organized as a **single-page application** with a tabbed shell. Each tab targets a different theme:

| Tab                     | Purpose                                                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Transaction Control** | Interactive flow (React Flow) simulating a transaction pipeline: local consistency, outbox, async paths, retries, DLQ, and manual replay. |
| **Observability Loop**  | Read-only narrative on metrics, tracing, logs, and recovery-oriented observability.                                                       |
| **Traffic Protection**  | Layered traffic simulation (ingress → gateway → service → breaker/DB) with metrics and outcome summaries.                                 |
| **Design Rationale**    | Broader framing: security, contracts, SLOs, and communicating impact.                                                                     |
| **My Practice**         | Author notes on wiring, load, DB pressure, and ownership (`content/page/page5.md`).                                                       |

Supporting architecture text lives under `content/`; it is reference material and is not required for `npm run build`.

## Tech stack

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [React Flow](https://reactflow.dev/) (graph UI)
- [Zustand](https://github.com/pmndrs/zustand) (state)
- [Framer Motion](https://www.framer.com/motion/) (animation)

## Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9 (or a compatible package manager)

## Getting started

Clone the repository, install dependencies, and start the dev server:

```bash
git clone <repository-url>
cd architecture_draft
npm install
npm run dev
```

The dev server prints a local URL (Vite default: **http://localhost:5173**). Open it in a browser.

## npm scripts

| Command           | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `npm run dev`     | Start Vite in development mode with HMR.                |
| `npm run build`   | Production build to `dist/`.                            |
| `npm run preview` | Serve the production build locally (run `build` first). |

## Repository layout

```
architecture_draft/
├── index.html         # Vite entry HTML
├── src/
│   ├── app/           # Root app component
│   ├── components/    # UI: flow canvas, controls, panels
│   ├── data/          # Tab metadata and static config
│   ├── engine/        # Simulation helpers
│   ├── layout/        # Shell layout (tabs)
│   ├── pages/         # One page per tab
│   ├── store/         # Zustand stores
│   └── styles/        # Global CSS
└── content/           # Markdown narratives (optional reading)
```

## Extending the app

- **New or renamed tabs:** `src/data/tabs.js` and `src/layout/ShellLayout.jsx`
- **Cursor automation (optional):** `.cursor/skills/distributed-simulator-dev/SKILL.md`

## License

Private project (`"private": true` in `package.json`). Add a license file if you intend to open-source.
