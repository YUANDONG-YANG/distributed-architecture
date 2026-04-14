You are my senior front-end architect and implementation partner.

Build a production-style interactive "Distributed System Simulator" using:

- React
- Vite
- JavaScript only
- React Flow
- Zustand
- Framer Motion

The goal is NOT to build a generic dashboard.
The goal is to build a visually strong architecture demo system for interviews, showing senior/staff-level distributed system design ability.

Project requirements:

1. Build a single-page app with 3 major presentation pages/tabs:
   - Page 1: Distributed Transaction Control
   - Page 2: Production Observability & Troubleshooting Closed Loop
   - Page 3: Traffic Governance & System Protection

2. The application must feel like a system simulator, not a PPT:
   - clickable
   - animated
   - step-based
   - failure injection supported
   - replay supported
   - traffic surge simulation supported

3. Use a clean dark enterprise architecture style:
   - dark background
   - glowing flow lines
   - layered panels
   - clear technical labels
   - concise but professional UI copy

4. Build the app with reusable architecture-oriented components.

5. Keep code modular, clean, and interview-quality.

6. Use no TypeScript. JavaScript only.

7. Use this project structure if possible:

src/
app/
pages/
components/
layout/
flow/
nodes/
panels/
controls/
store/
engine/
data/
styles/

8. Core design principle:
   - Page 1 demonstrates consistency control
   - Page 2 demonstrates observability and recovery
   - Page 3 demonstrates traffic protection and DB protection
     Together they should form a complete architecture story:
     "correctness -> diagnosability -> survivability"

9. Add a top navigation/header with 3 tabs and a short architecture title:
   "Distributed System Simulator"

10. Each page must include:

- visual diagram
- control buttons
- status panel
- explanation panel
- animated transitions

Before coding:

- first generate the full implementation plan
- then generate the folder structure
- then implement step by step
- do not simplify into a static mockup
- do not remove animation support
- do not replace the simulator with plain text cards
