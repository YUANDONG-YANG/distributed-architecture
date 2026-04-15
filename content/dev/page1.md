Now implement Page 1: Distributed Transaction Control Simulator.

Goal:
Build an interactive simulator that visually demonstrates a distributed transaction pipeline with consistency protection and failure recovery.

Page title:
Distributed Transaction Control

Architecture phases:

1. Local Transaction Boundary
   - Guard (state machine + idempotency pre-check)
   - Optimistic Lock (CAS/version check)
   - State Log
   - Domain Event
   - Outbox
   - Process Log (upstream)
   - Commit

2. Event Dispatch
   - Publisher
   - MQ

3. Async Processing
   - Consumer (idempotent)
   - Local Transaction
   - Process Log (downstream)

4. Failure Handling
   - Retry
   - DLQ
   - Manual Ops (Replay / Compensation)

Requirements:

1. Use React Flow to render the architecture graph.
2. Group the nodes visually by phase.
3. Use different node colors/styles for:
   - local transaction
   - event dispatch
   - async processing
   - failure handling
4. Add control buttons:
   - Start Transaction
   - Pause
   - Resume
   - Inject Consumer Failure
   - Replay
   - Reset
5. Add animation:
   - active node highlighting
   - edge flow animation
   - failure flashing
   - retry loop effect
6. Add a Zustand store for simulator state:
   - currentStep
   - transactionStatus
   - activeNodeId
   - failedNodeId
   - retryCount
   - dlqCount
   - eventPublished
   - consumerCompleted
7. Add an engine file to simulate progression step by step.
8. Show a right-side status panel with:
   - current transaction phase
   - current active node
   - status
   - retry count
   - whether DLQ is reached
9. Show a bottom explanation panel with concise engineering explanations for the currently active node.
10. Make the simulator feel like a real distributed transaction walkthrough, not a static graph.

Important:

- Keep naming professional
- Avoid toy/demo wording
- Structure code so Page 1 can be extended later
- After implementation, summarize all major files and logic flow

Enhance Page 1 to make it interview-grade.

Add the following:

1. A step timeline panel showing:
   - Guard
   - Lock
   - State Log
   - Domain Event
   - Outbox
   - Commit
   - Publish
   - Consume
   - Retry / DLQ / Replay
2. Improve node labels with concise architecture terminology.
3. Add small status badges on nodes:
   - pending
   - running
   - success
   - failed
   - replayed
4. Add failure branch visualization:
   - when consumer fails, visually route into Retry
   - after max retries, visually route into DLQ
   - when Replay is clicked, visually route from Manual Ops back into processing
5. Add a compact architectural summary panel:
   - local atomicity
   - eventual consistency
   - idempotent consumption
   - recoverability
6. Refine layout spacing and visual hierarchy so it looks polished and enterprise-level.
   Do not overcomplicate the UI.
