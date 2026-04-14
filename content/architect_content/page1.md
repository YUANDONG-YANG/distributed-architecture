Implement Page 1 of my project as an interview-grade distributed architecture simulator.

Page title:
Distributed Transaction Control

Page objective:
This page must visually demonstrate a complete distributed transaction control chain, showing how the system ensures consistency, auditability, replayability, idempotency, and recoverability.

This is NOT a generic architecture diagram.
It must be an interactive simulator with animation, phase grouping, and failure/recovery behavior.

Use:

- React
- JavaScript only
- React Flow
- Zustand
- Framer Motion

================================================================================
PAGE 1 CONTENT MODEL
================================================================================

The full architecture chain is:

Guard (State Machine)
→ Optimistic Lock (CAS + concurrency conflict control)
→ State Log (written in same transaction for state auditing)
→ Domain Event (explicit event modeling)
→ Outbox (write event in same transaction; persist message record)
→ Process Log (upstream operation log; replayable / retryable)
→ Commit
→ Publisher (Outbox → MQ, with acknowledgement and deduplication)
→ Consumer (idempotency + local transaction)
→ Process Log (downstream operation log; replayable / retryable)
→ Retry (idempotent retry)
→ DLQ (failure convergence + alerting)
→ Manual Ops (Replay / Compensation)
→ Process Log (manual intervention log)

================================================================================
VISUAL STRUCTURE
================================================================================

Do NOT render this as one long flat line.

Group the page into 4 visual phases:

1. Local Transaction Boundary
   - Guard
   - Optimistic Lock
   - State Log
   - Domain Event
   - Outbox
   - Process Log (Upstream)
   - Commit

2. Event Dispatch
   - Publisher
   - MQ

3. Async Processing
   - Consumer
   - Process Log (Downstream)

4. Failure Handling & Recovery
   - Retry
   - DLQ
   - Manual Ops
   - Process Log (Manual)

Use clear visual grouping containers or labeled sections.

================================================================================
ARCHITECTURE SEMANTICS
================================================================================

This page must clearly communicate these engineering points:

1. Guard
   - state-machine-based pre-check
   - request validity / transition validity
   - pre-idempotency gate

2. Optimistic Lock
   - CAS / version-based conflict control
   - prevents concurrent overwrite

3. State Log
   - written in same local transaction
   - supports state auditing and consistency inspection

4. Domain Event
   - explicit business event modeling
   - separates state mutation from event propagation

5. Outbox
   - event and business mutation persisted in same transaction
   - avoids DB/MQ inconsistency

6. Process Log (Upstream)
   - operation trace for replay / retry / diagnosis

7. Commit
   - closes local atomic boundary

8. Publisher
   - pulls or reads Outbox events
   - publishes to MQ with acknowledgement and deduplication

9. MQ
   - decouples producer and consumer

10. Consumer

- idempotent processing
- local transaction on consumer side

11. Process Log (Downstream)

- records downstream execution for replay / retry / audit

12. Retry

- idempotent retry mechanism

13. DLQ

- final failure convergence
- alerting / manual follow-up

14. Manual Ops

- replay / compensation
- operator-assisted recovery path

15. Process Log (Manual)

- records human intervention operations for traceability

================================================================================
INTERACTION REQUIREMENTS
================================================================================

This must be a simulator, not a static page.

Add control buttons:

- Start Transaction
- Pause
- Resume
- Inject Consumer Failure
- Trigger Retry
- Send to DLQ
- Replay from Manual Ops
- Reset

Behavior requirements:

1. Start Transaction
   - execute the flow step by step from Guard to Consumer
   - visually highlight current active node
   - animate active edges

2. Inject Consumer Failure
   - Consumer node enters failed state
   - flow enters Retry path
   - Retry node becomes active
   - if retry limit exceeded, route to DLQ

3. Replay from Manual Ops
   - from DLQ or manual recovery state, route transaction through Manual Ops
   - then replay back into processing path
   - mark recovered/replayed state visually

4. Reset
   - restore all nodes and edges to initial idle state

================================================================================
STATE MANAGEMENT
================================================================================

Create a dedicated Zustand store for page 1.

Suggested state shape:

- currentPhase
- currentStep
- activeNodeId
- activeEdgeIds
- transactionStatus
- isPaused
- failureInjected
- retryCount
- retryLimit
- reachedDLQ
- replayTriggered
- completed
- eventPublished
- consumerSucceeded
- manualRecoveryStarted
- logsTimeline

Suggested transactionStatus values:

- idle
- running
- paused
- failed
- retrying
- dlq
- manual_recovery
- replaying
- completed

================================================================================
NODE STATUS SYSTEM
================================================================================

Each node should support status badges:

- idle
- pending
- running
- success
- failed
- retrying
- dlq
- replayed

Each node should visually reflect status:

- running: glow/highlight
- success: stable success color
- failed: red flash
- retrying: amber pulse
- dlq: strong red
- replayed: distinct recovered color

================================================================================
EDGE / FLOW ANIMATION
================================================================================

Edges must not look static.

Requirements:

- active path edges should animate
- failure branch edges should activate on error
- replay path should have a visually distinct animation
- different colors for:
  - local transaction path
  - event dispatch path
  - async processing path
  - failure/recovery path

================================================================================
RIGHT-SIDE STATUS PANEL
================================================================================

Add a right-side architecture status panel showing:

1. Current Transaction State
2. Current Active Phase
3. Current Active Node
4. Retry Count
5. Event Published?
6. Consumer Status
7. DLQ Reached?
8. Replay Triggered?
9. Recovery Status

Below that, add a concise “Architecture Interpretation” panel that updates with the current active node.

Example style:

- Node name
- What problem it solves
- Why it exists in distributed systems
- What architectural principle it demonstrates

================================================================================
BOTTOM EXPLANATION / TIMELINE PANEL
================================================================================

Add a bottom execution timeline panel showing the ordered architecture chain:

Guard
Lock
State Log
Domain Event
Outbox
Upstream Process Log
Commit
Publisher
MQ
Consumer
Downstream Process Log
Retry
DLQ
Manual Ops
Manual Process Log

Each step should visually update as the simulator runs.

================================================================================
LAYOUT REQUIREMENTS
================================================================================

Use a strong enterprise dark architecture style.

Main layout:

- top: page title + short subtitle
- center-left: React Flow architecture simulator
- right: status / interpretation panel
- bottom: execution timeline + concise architectural notes

Subtitle suggestion:
“Local atomicity, event dispatch, idempotent consumption, and recoverable failure handling.”

The page must feel like a senior/staff-level architecture demonstration tool.

================================================================================
WORDING REQUIREMENTS
================================================================================

Use concise engineering wording in the UI.

Preferred labels:

- Local Transaction Boundary
- Event Dispatch
- Async Processing
- Failure Handling
- State Audit
- Operation Replayability
- Idempotent Consumption
- Manual Recovery Path

Do not use childish or presentation-style language.

================================================================================
FILE / COMPONENT STRUCTURE
================================================================================

Implement with clean modular code.

Suggested files:

- pages/TransactionSimulatorPage.jsx
- components/nodes/ArchitectureNode.jsx
- components/flow/TransactionFlowCanvas.jsx
- components/panels/TransactionStatusPanel.jsx
- components/panels/ArchitectureExplanationPanel.jsx
- components/panels/ExecutionTimelinePanel.jsx
- components/controls/TransactionControls.jsx
- store/transactionSimulatorStore.js
- engine/transactionEngine.js
- data/transactionFlowData.js

================================================================================
IMPORTANT IMPLEMENTATION NOTES
================================================================================

1. Do not simplify this into plain cards.
2. Do not flatten phases into one row without grouping.
3. Do not remove failure and replay logic.
4. Keep the code reusable and structured.
5. Prioritize architecture clarity and technical credibility.
6. The page should be demo-ready for interviews.

First, generate:

1. implementation plan
2. component breakdown
3. flow data model
   Then implement step by step.
   After implementation, summarize:

- created files
- state model
- simulator logic
- replay/failure flow
