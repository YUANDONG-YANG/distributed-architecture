/**
 * Sidebar narrative: layered traffic governance from ingress to downstream protection.
 */
export function TrafficDesignPhilosophy() {
  return (
    <section className="traffic-design-philosophy" aria-labelledby="traffic-design-philosophy-title">
      <h3 id="traffic-design-philosophy-title" className="traffic-design-philosophy__title">
        Design philosophy
      </h3>
      <p className="traffic-design-philosophy__lead">
        Traffic is governed in depth: before requests reach the DB or core systems, volume is reduced and shaped at the
        edge, business boundary, elastic tier, and downstream isolation layers—moving protection forward into the middle
        tier.
      </p>

      <ul className="traffic-design-philosophy__list">
        <li className="traffic-design-philosophy__item traffic-design-philosophy__item--gateway">
          <h4 className="traffic-design-philosophy__item-title">Gateway (Auth, rate limit, token bucket)</h4>
          <p>
            Outermost identity and admission control: authentication establishes trust; rate limiting and a token bucket
            cap bursts and aggregate ingress so unshaped traffic does not spill straight into business and data
            tiers—cheap, high-leverage overload defense.
          </p>
        </li>
        <li className="traffic-design-philosophy__item traffic-design-philosophy__item--filter">
          <h4 className="traffic-design-philosophy__item-title">Business filter / validation</h4>
          <p>
            Drop invalid or non-actionable work early at the business boundary (parameters, state machine, idempotency
            pre-checks), cutting wasted CPU, connections, and downstream calls so junk traffic does not amplify inside
            the system.
          </p>
        </li>
        <li className="traffic-design-philosophy__item traffic-design-philosophy__item--service">
          <h4 className="traffic-design-philosophy__item-title">Service layer (auto scaling)</h4>
          <p>
            Horizontal scale and elastic capacity absorb legitimate spikes at the compute tier, easing synchronized
            pressure on shared pools (e.g. connection pools, DB). Elasticity absorbs load; it does not replace upstream
            rate limiting and filtering.
          </p>
        </li>
        <li className="traffic-design-philosophy__item traffic-design-philosophy__item--breaker">
          <h4 className="traffic-design-philosophy__item-title">Downstream protection (circuit breaker, fallback)</h4>
          <p>
            When downstreams are unstable or failing, breakers and fail-fast cut error propagation; use degradation or
            fallback where appropriate to avoid retry storms and cascading latency, keeping critical dependencies from
            being dragged down.
          </p>
        </li>
      </ul>
    </section>
  );
}
