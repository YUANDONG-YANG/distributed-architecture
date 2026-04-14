Now implement Page 3: Traffic Governance & System Protection.

Goal:
Demonstrate how the architecture protects DB/core systems from traffic surges through layered control.

Page title:
Traffic Governance & System Protection

Core protection chain:

1. Gateway
   - Auth
   - Rate Limit
   - Token Bucket

2. Business Filter / Validation
   - invalid request rejection
   - state validation
   - idempotency pre-check

3. Service Layer
   - auto scaling
   - elastic absorption

4. Downstream Protection
   - Circuit Breaker
   - Fallback
   - Fail Fast

5. DB / Core Systems as final protected target

Requirements:

1. Build a vertical or layered defensive architecture view.
2. Show incoming traffic surge visually from top to bottom.
3. Add controls:
   - Simulate Normal Traffic
   - Simulate Traffic Surge
   - Toggle Rate Limit
   - Toggle Business Filter
   - Toggle Auto Scaling
   - Toggle Circuit Breaker
   - Reset
4. Animate request volume reduction across layers.
5. Show counters at each layer:
   - incoming requests
   - passed requests
   - dropped requests
   - absorbed requests
   - blocked requests
   - final requests reaching DB
6. Use color semantics carefully:
   - control/protection layers
   - danger traffic
   - blocked traffic
   - safe traffic to DB
7. Add side panel with architecture interpretation:
   - ingress protection
   - business filtering
   - elastic absorption
   - downstream isolation
8. The page must make clear:
   "DB protection is moved forward into the middle tier"
9. Add a small architecture insight note:
   "MQ/cache may shift pressure, but layered protection is the primary defense against DB overload"

Important:
Make this page feel like a resilience simulation, not a chart page.
After implementation, explain the simulation logic and component structure.
