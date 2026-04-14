Implement Page 3 of my project as an interview-grade traffic governance and system protection simulator.

Page title:
Traffic Governance & System Protection

Page objective:
This page must demonstrate how a distributed system protects its core systems (especially DB) from traffic surge using layered defense.

This is NOT a request flow diagram.
This is a dynamic resilience simulation system.

The core message:
"Database protection is achieved by layered traffic control before requests reach the DB."

Use:

- React
- JavaScript only
- Zustand
- Framer Motion

================================================================================
CORE ARCHITECTURE MODEL
================================================================================

Traffic enters from the top and passes through 4 defense layers:

1. Gateway (Ingress Control)
   - Authentication
   - Rate Limit (Token Bucket)

2. Business Filter / Validation
   - request validation
   - state validation (Guard-like logic)
   - idempotency pre-check
   - invalid request rejection

3. Service Layer (Elastic Layer)
   - auto scaling
   - horizontal scaling
   - absorbs traffic burst

4. Downstream Protection
   - Circuit Breaker
   - Fallback
   - Fail Fast

Final target:

- DB / Core Systems

================================================================================
KEY ARCHITECTURE PRINCIPLES (MUST BE CLEAR)
================================================================================

1. DB should never be the first line of defense
2. Traffic must be reduced before reaching DB
3. MQ / Cache only shift pressure, not eliminate DB risk
4. Protection must be layered, not single-point

================================================================================
VISUAL STRUCTURE
================================================================================

Use vertical layered layout:

Top:
Incoming Traffic (large volume)

Then layers:

[ Gateway ]
[ Business Filter ]
[ Service Layer ]
[ Circuit Breaker ]

Bottom:
[ DB ]

Each layer must be visually distinct and labeled.

================================================================================
SIMULATION DESIGN
================================================================================

This page must simulate traffic flow reduction.

Initial scenario:

- 1000 incoming requests

Each layer modifies traffic:

Gateway:

- applies rate limit
- reduces traffic

Business Filter:

- drops invalid / useless requests

Service Layer:

- absorbs traffic (not reduce, but buffer/scale)

Circuit Breaker:

- blocks failing downstream calls
- reduces final DB pressure

Final:

- only safe amount reaches DB

================================================================================
INTERACTION CONTROLS
================================================================================

Add control panel:

- Simulate Normal Traffic
- Simulate Traffic Surge
- Toggle Rate Limit
- Toggle Business Filter
- Toggle Auto Scaling
- Toggle Circuit Breaker
- Reset

================================================================================
SIMULATION FLOW (CRITICAL)
================================================================================

When "Simulate Traffic Surge" is clicked:

Step 1:

- generate high traffic (e.g., 1000 requests)
- visualize as flowing particles or streams

Step 2:
Gateway Layer:

- apply token bucket
- reduce traffic
- show:
  - incoming
  - allowed
  - dropped

Step 3:
Business Filter:

- drop invalid requests
- show:
  - filtered count

Step 4:
Service Layer:

- absorb traffic
- simulate scaling effect
- show:
  - active instances
  - buffered requests

Step 5:
Circuit Breaker:

- block unstable downstream calls
- show:
  - blocked requests
  - fallback triggered

Step 6:
DB:

- show final request count
- must be significantly reduced

================================================================================
STATE MANAGEMENT (ZUSTAND)
================================================================================

Create traffic store:

Fields:

- totalRequests
- currentLayer
- gatewayEnabled
- filterEnabled
- scalingEnabled
- breakerEnabled

- gatewayPassed
- gatewayDropped

- filterPassed
- filterDropped

- serviceCapacity
- bufferedRequests

- breakerBlocked
- breakerPassed

- dbFinalLoad

- simulationStatus (idle / running / completed)

================================================================================
VISUAL METRICS DISPLAY
================================================================================

Each layer must display:

- incoming requests
- processed requests
- dropped / blocked requests
- pass-through requests

Use counters that update during simulation.

================================================================================
ANIMATION REQUIREMENTS
================================================================================

- traffic flows downward
- volume visually decreases after each layer
- dropped traffic disappears or fades out
- blocked traffic flashes red
- safe traffic becomes green near DB

================================================================================
COLOR SEMANTICS
================================================================================

- incoming traffic: white/neutral
- controlled traffic: blue
- filtered/dropped: red
- absorbed/scaled: green
- blocked by breaker: orange/red
- safe DB traffic: green

================================================================================
RIGHT PANEL — ARCHITECTURE INTERPRETATION
================================================================================

Show:

Layer Name
Purpose
What it protects
What failure it prevents

Examples:

Gateway:
Purpose: control ingress traffic
Prevents: overload from uncontrolled access

Business Filter:
Purpose: remove useless requests early
Prevents: waste of system resources

Service Layer:
Purpose: absorb burst traffic
Prevents: sudden overload

Circuit Breaker:
Purpose: isolate failing downstream systems
Prevents: cascading failure

DB:
Final protected resource

================================================================================
KEY MESSAGE PANEL (VERY IMPORTANT)
================================================================================

Add a highlighted architecture note:

"Database protection is shifted to the middle tier through layered traffic control."

Also include:

"MQ and cache may shift pressure, but cannot replace proper traffic governance."

================================================================================
FILE STRUCTURE
================================================================================

Suggested files:

- pages/TrafficProtectionPage.jsx
- components/traffic/TrafficFlowView.jsx
- components/traffic/TrafficLayerCard.jsx
- components/panels/TrafficStatusPanel.jsx
- components/panels/TrafficExplanationPanel.jsx
- components/controls/TrafficControls.jsx
- store/trafficStore.js
- engine/trafficEngine.js
- data/trafficConfig.js

================================================================================
IMPORTANT RULES
================================================================================

1. Do NOT turn this into a static diagram.
2. Do NOT remove simulation behavior.
3. Do NOT skip traffic reduction visualization.
4. Do NOT simplify layers into generic boxes.
5. Focus on DB protection narrative.

================================================================================
IMPLEMENTATION STEPS
================================================================================

Before coding:

1. Define simulation model
2. Define traffic flow per layer
3. Define UI structure

Then:

- implement layers
- connect simulation
- add animation

After implementation:
Explain:

- traffic reduction logic
- how each layer protects system
- why DB is protected before it is hit

This page must clearly demonstrate that system resilience is achieved by preventing overload before it reaches the database, not by relying on the database to handle overload.
