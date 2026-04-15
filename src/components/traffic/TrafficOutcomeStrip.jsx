import { useTrafficStore } from '../../store/trafficStore.js';
import { TRAFFIC } from '../../data/trafficConfig.js';

function fmtNum(n) {
  return n.toLocaleString('en-US');
}

function fmtPct(numerator, denominator) {
  if (!denominator || denominator <= 0) return '0.0';
  return ((numerator / denominator) * 100).toFixed(1);
}

function Cell({ label, value }) {
  return (
    <div className="traffic-outcome-strip__cell">
      <span className="traffic-outcome-strip__label traffic-outcome-strip__label--protection">{label}</span>
      <span className="traffic-outcome-strip__value">{value}</span>
    </div>
  );
}

/** Protection-chain interception summary (not downstream writes). All counts are model-simulated. */
export function TrafficOutcomeStrip() {
  const simulationStatus = useTrafficStore((s) => s.simulationStatus);
  const phaseIndex = useTrafficStore((s) => s.phaseIndex);
  const totalRequests = useTrafficStore((s) => s.totalRequests);
  const pathToIsolationOut = useTrafficStore((s) => s.pathToIsolationOut);

  const show = simulationStatus === 'completed' && phaseIndex >= 5 && totalRequests > 0;
  if (!show) return null;

  const T = totalRequests;
  const corePass = pathToIsolationOut;
  const intercepted = T - corePass;
  const passPct = fmtPct(corePass, T);
  const interceptPct = fmtPct(intercepted, T);

  return (
    <section className="traffic-outcome-strip" aria-label="Protection summary">
      <p className="traffic-outcome-strip__sim-badge">
        Model-simulated data — not real traffic, not production telemetry.
      </p>

      <div className="traffic-outcome-strip__head">
        <h3 className="traffic-outcome-strip__title traffic-outcome-strip__title--protection-single">Protection summary</h3>
        <p className="traffic-outcome-strip__meta traffic-outcome-strip__meta--protection">
          Within the same <strong>{TRAFFIC.windowSeconds}s evaluation window</strong>, this page counts{' '}
          <strong>interception by the protection chain only</strong> — it does not extend to downstream writes or
          persistence outcomes. The chain admitted <strong>{fmtNum(corePass)}</strong> requests to the core path and
          intercepted <strong>{fmtNum(intercepted)}</strong>, for an interception rate of <strong>{interceptPct}%</strong>{' '}
          and a final pass rate of <strong>{passPct}%</strong>.
        </p>
      </div>

      <div className="traffic-outcome-strip__grid traffic-outcome-strip__grid--protection">
        <Cell label="Total ingress" value={fmtNum(T)} />
        <Cell label="Reached core path" value={fmtNum(corePass)} />
        <Cell label="Intercepted" value={fmtNum(intercepted)} />
        <Cell label="Final pass rate" value={`${passPct}%`} />
        <Cell label="Final interception rate" value={`${interceptPct}%`} />
      </div>

      <p className="traffic-outcome-strip__conclusion">
        <strong>Conclusion:</strong> The protection chain materially peak-shaves and isolates ingress: roughly two-thirds
        of requests are stopped at the gateway, business filter, and isolation / circuit-breaker stages; about one-third
        proceeds to the core path.
      </p>

      <p className="traffic-outcome-strip__verdict">
        <strong>Protection assessment:</strong> Effective
        <span className="traffic-outcome-strip__verdict-note">
          The chain compresses total ingress to a <strong>{passPct}%</strong> core-path pass volume.
        </span>
      </p>

      <p className="traffic-outcome-strip__reconcile traffic-outcome-strip__reconcile--protection">
        <strong>Ledger:</strong> intercepted ({fmtNum(intercepted)}) + passed to core ({fmtNum(corePass)}) = ingress (
        {fmtNum(T)}).
      </p>

      <p className="traffic-outcome-strip__disclaimer traffic-outcome-strip__disclaimer--protection">
        Scope: admission and interception on the integration protection chain only. This does not represent overall
        business success rates or final persistence outcomes. Figures are produced by the deterministic simulator for
        illustration.
      </p>
    </section>
  );
}
