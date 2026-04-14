/**
 * Full-width narrative: layered production observability and troubleshooting.
 */
export function ObservabilityDesignPhilosophy() {
  return (
    <section className="obs-design-philosophy" aria-labelledby="obs-design-philosophy-title">
      <h3 id="obs-design-philosophy-title" className="obs-design-philosophy__title">
        Design philosophy
      </h3>
      <p className="obs-design-philosophy__lead">
        Production observability and troubleshooting are built in three layers, closing the loop from detecting issues to
        localizing them.
      </p>

      <div className="obs-design-philosophy__layers">
        <div className="obs-design-philosophy__layer obs-design-philosophy__layer--metrics">
          <h4 className="obs-design-philosophy__layer-title">Layer 1: Metrics and alerting</h4>
          <p>
            Use Prometheus, Grafana, and Alertmanager with the RED model (traffic, errors, latency) to monitor overall
            system health, surface spikes in traffic, error rate, and latency quickly, and combine with CPU, memory, and
            other resource signals to judge saturation and bottlenecks.
          </p>
        </div>
        <div className="obs-design-philosophy__layer obs-design-philosophy__layer--tracing">
          <h4 className="obs-design-philosophy__layer-title">Layer 2: Trace analysis</h4>
          <p>
            Use SkyWalking for distributed tracing across internal services to analyze call graphs and latency, e.g. to
            find slow calls or unstable dependencies.
          </p>
        </div>
        <div className="obs-design-philosophy__layer obs-design-philosophy__layer--logs">
          <h4 className="obs-design-philosophy__layer-title">Layer 3: Logs and localization</h4>
          <p>
            Use ELK for log aggregation and search. Propagate requestId across services and query by requestId in ELK to
            pinpoint failure points for a single request. Record business keys (e.g. orderId) to correlate multiple
            requestIds under one business flow—including retries and DLQ—and reconstruct the end-to-end story.
          </p>
        </div>
      </div>

      <div className="obs-design-philosophy__note">
        <p>
          Real systems include third-party and legacy components that cannot join one tracing fabric; traces break at
          those boundaries. requestId is a generic, low-friction correlation key that can cross those hops and
          complements trace data where spans stop.
        </p>
      </div>

      <div className="obs-design-philosophy__note obs-design-philosophy__note--recovery">
        <p>
          Business-side observability augments this: State Log captures state transitions for audit and consistency
          checks; Process Log records critical operations for replay and retry—so the system recovers without relying
          on the end user to retry.
        </p>
      </div>
    </section>
  );
}
