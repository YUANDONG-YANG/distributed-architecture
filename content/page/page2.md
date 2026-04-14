Now implement Page 2: Production Observability & Troubleshooting Closed Loop.

Goal:
Visually demonstrate how a production distributed system is monitored, troubleshot, correlated, and recovered.

Page title:
Production Observability & Troubleshooting Closed Loop

Structure:
Upper section has 3 observability layers:

1. Metrics & Alerting
   - Prometheus
   - Grafana
   - Alertmanager
   - RED metrics: Traffic / Errors / Latency
   - CPU / Memory / Saturation

2. Distributed Tracing
   - SkyWalking
   - service dependency
   - latency breakdown
   - slow calls
   - unstable dependency visualization

3. Log Correlation & Root Cause Isolation
   - ELK
   - requestId correlation
   - orderId/business key correlation
   - retry / DLQ trace reconstruction

Lower section: 4. Business Recoverability

- State Log
- Process Log
- Replay
- Retry
- Compensation

Requirements:

1. Build this page as a layered architecture visualization, not a generic dashboard.
2. Add control buttons:
   - Inject Timeout
   - Inject Dependency Failure
   - Search by requestId
   - Reconstruct by orderId
   - Trigger Replay
   - Reset
3. Add animation flow:
   - metrics layer alerts first
   - tracing layer highlights failing chain
   - log layer reveals correlated request
   - recovery layer executes replay/recovery
4. Visually emphasize that requestId complements trace across third-party / legacy boundaries.
5. Use a right-side panel to show:
   - current incident
   - current detected layer
   - requestId
   - orderId
   - root cause
   - recovery status
6. Use concise, technical wording.
7. Add polished UI cards/panels for each observability layer.
8. The page should communicate:
   "detect -> analyze -> isolate -> recover"

Important:
Do not make this page look like a monitoring dashboard screenshot.
It should remain a designed architecture simulation page.
After implementation, explain page logic clearly.
