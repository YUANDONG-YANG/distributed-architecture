/**
 * Sidebar narrative: ingress vs service-tier governance (filtering, scaling, isolation).
 */
export function TrafficDesignPhilosophy() {
  return (
    <section className="traffic-design-philosophy" aria-labelledby="traffic-design-philosophy-title">
      <h3 id="traffic-design-philosophy-title" className="traffic-design-philosophy__title">
        Design philosophy
      </h3>
      <p className="traffic-design-philosophy__lead">
        Traffic is governed in depth: shape volume at the edge, then carry out{' '}
        <strong>request filtering</strong>, <strong>elastic absorption</strong>, and{' '}
        <strong>downstream isolation</strong> inside the service tier—before anything hits the DB or core systems.
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
        <li className="traffic-design-philosophy__item traffic-design-philosophy__item--service">
          <h4 className="traffic-design-philosophy__item-title">Service layer (filtering, scaling, isolation)</h4>
          <p>
            <strong>Business filtering / validation</strong> rejects invalid or non-actionable requests early
            (parameters, state machine, idempotency pre-checks)—it is a <em>service-side</em> way to drop bad traffic
            before it burns CPU or fans out downstream.
          </p>
          <p>
            <strong>Elastic compute</strong> and buffering absorb legitimate spikes; they complement—not replace—ingress
            limits and filtering.
          </p>
          <p>
            <strong>Downstream isolation</strong> (circuit breakers, fail-fast, fallback) also runs in the same tier:
            when dependencies fail, cut propagation and retry storms before traffic reaches core systems.
          </p>
        </li>
      </ul>
    </section>
  );
}
