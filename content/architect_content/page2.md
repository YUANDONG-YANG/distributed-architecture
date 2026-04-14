Implement Page 2 of my project as an interview-grade production observability and troubleshooting simulator.

Page title:
Production Observability & Troubleshooting Closed Loop

Page objective:
This page must demonstrate how a distributed system detects, analyzes, isolates, and recovers from production issues.

This is NOT a monitoring dashboard.
This is an interactive architecture simulator showing a full troubleshooting closed loop:
Detect → Analyze → Isolate → Recover

Use:

- React
- JavaScript only
- Zustand
- Framer Motion

================================================================================
CORE ARCHITECTURE MODEL
================================================================================

The system is structured in 4 layers:

1. Metrics & Alerting (Detection Layer)
2. Distributed Tracing (Analysis Layer)
3. Log Correlation (Root Cause Isolation Layer)
4. Business Recoverability (Recovery Layer)

These must be visually separated and clearly labeled.

================================================================================
LAYER 1 — METRICS & ALERTING
================================================================================

Components:

- Prometheus
- Grafana
- Alertmanager

Metrics Model:

- RED metrics:
  - Traffic
  - Errors
  - Latency
- Resource metrics:
  - CPU
  - Memory
  - Saturation

Purpose:

- Detect anomalies at system level
- Identify whether issue is:
  - traffic surge
  - error spike
  - latency increase
  - resource bottleneck

UI behavior:

- Show metric cards (Traffic / Errors / Latency / CPU / Memory)
- Support alert state:
  - normal
  - warning
  - critical
- When failure injected:
  - highlight abnormal metrics
  - flash alert state

================================================================================
LAYER 2 — DISTRIBUTED TRACING
================================================================================

Tool:

- SkyWalking

Model:

- Service dependency graph
- Call chain visualization
- Latency breakdown

Purpose:

- Identify slow services
- Detect unstable downstream dependencies
- Analyze call relationships

UI behavior:

- Show service graph (nodes + edges)
- Highlight slow or failing node
- Animate problematic path

================================================================================
LAYER 3 — LOG CORRELATION & ROOT CAUSE
================================================================================

Tool:

- ELK

Core mechanisms:

- requestId (cross-service correlation)
- business key (orderId)

Key logic:

1. requestId used to trace single request
2. orderId used to reconstruct full business flow
   (including retries, DLQ, replay scenarios)

Important architectural point:
Tracing cannot cross all boundaries:

- third-party systems
- legacy systems

Therefore:
requestId must be:

- low-intrusion
- cross-system propagated
- used as universal correlation key

UI behavior:

- show searchable logs
- simulate query by requestId
- simulate reconstruction by orderId
- show multiple requestIds linked under same orderId

================================================================================
LAYER 4 — BUSINESS RECOVERABILITY
================================================================================

This is CRITICAL and must be visually emphasized.

Components:

- State Log
- Process Log
- Replay
- Retry
- Compensation

Purpose:

- record state transitions
- record operations
- support replay and retry
- restore system without relying on user retry

Key principle:
"System-level recoverability instead of user-driven retry"

UI behavior:

- show state transitions timeline
- show operation log list
- simulate replay execution
- simulate retry execution
- show recovery result

================================================================================
INTERACTION DESIGN
================================================================================

This page must be interactive.

Add control panel with:

- Inject Timeout
- Inject Dependency Failure
- Inject Error Spike
- Search by requestId
- Reconstruct by orderId
- Trigger Replay
- Reset

================================================================================
SIMULATION FLOW (CRITICAL)
================================================================================

When user clicks "Inject Failure":

Step 1 — Metrics Layer

- Error or latency spikes
- Alert triggered

Step 2 — Tracing Layer

- highlight failing service path
- show slow call or failing dependency

Step 3 — Log Layer

- display requestId
- locate failure point
- show related orderId
- reconstruct multiple attempts (retry / DLQ)

Step 4 — Recovery Layer

- show state log and process log
- trigger replay or retry
- update system state to recovered

================================================================================
STATE MANAGEMENT (ZUSTAND)
================================================================================

Create a dedicated store:

State fields:

- incidentType (timeout / dependency / error)
- metricsStatus (normal / warning / critical)
- tracingActiveNode
- tracingPath
- requestId
- orderId
- relatedRequestIds
- logLocated (true/false)
- rootCause
- recoveryStarted
- recoveryType (retry / replay / compensation)
- recoveryStatus (idle / running / completed)
- systemRestored (true/false)

================================================================================
VISUAL DESIGN
================================================================================

Layout:

Top:

- page title
- subtitle

Center:

- 3 horizontal layers:
  Metrics → Tracing → Logs

Bottom:

- Recovery Layer (full width)

Right side:

- Incident panel + explanation panel

================================================================================
COLOR SEMANTICS
================================================================================

- Metrics: blue
- Tracing: purple
- Logs: orange
- Recovery: green
- Failure: red

================================================================================
RIGHT PANEL CONTENT
================================================================================

Show:

- Incident type
- Detection layer
- requestId
- orderId
- root cause
- current layer
- recovery action
- system status

================================================================================
EXPLANATION PANEL (VERY IMPORTANT)
================================================================================

This panel must update dynamically.

For each layer, show:

- what this layer does
- what problem it solves
- why it is necessary in distributed systems

Example style:

Layer: Metrics
Purpose: Detect system-wide anomalies quickly
Problem solved: unknown system degradation

Layer: Tracing
Purpose: Analyze service dependencies and latency
Problem solved: cannot locate slow service

Layer: Logs
Purpose: isolate exact failure point
Problem solved: cannot pinpoint failing request

Layer: Recovery
Purpose: restore system state
Problem solved: system stuck after failure

================================================================================
KEY ARCHITECTURE MESSAGE (MUST BE CLEAR)
================================================================================

This page must clearly communicate:

1. Observability is layered, not a single tool
2. requestId complements tracing across system boundaries
3. business recoverability is essential
4. troubleshooting must end with recovery, not just detection

================================================================================
FILE STRUCTURE
================================================================================

Suggested files:

- pages/ObservabilityPage.jsx
- components/observability/MetricsLayer.jsx
- components/observability/TracingLayer.jsx
- components/observability/LogLayer.jsx
- components/observability/RecoveryLayer.jsx
- components/panels/IncidentPanel.jsx
- components/panels/ObservabilityExplanationPanel.jsx
- components/controls/ObservabilityControls.jsx
- store/observabilityStore.js
- engine/observabilityEngine.js
- data/observabilityMockData.js

================================================================================
IMPORTANT RULES
================================================================================

1. Do NOT build a Grafana-like dashboard.
2. Do NOT remove simulation flow.
3. Do NOT simplify log correlation logic.
4. Do NOT skip requestId vs orderId distinction.
5. Do NOT treat recovery as optional.

================================================================================
IMPLEMENTATION STEPS
================================================================================

Before coding:

1. Generate architecture plan
2. Define component structure
3. Define simulation flow

Then:

- implement layer by layer
- connect interaction flow
- add animation

After implementation:
Explain:

- layer interaction
- failure simulation
- requestId/orderId logic
- recovery mechanism

This page must feel like a real production troubleshooting workflow, not a UI mock.

Focus on:

- cause-effect chain
- layered reasoning
- failure to recovery transition

Avoid:

- static cards
- generic monitoring UI
