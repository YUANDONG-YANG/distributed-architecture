import { ObservabilityDesignPhilosophy } from '../components/observability/ObservabilityDesignPhilosophy.jsx';

/** Page 2 — three-layer observability narrative only (no interactive simulator). */
export function ObservabilityPage() {
  return (
    <div className="sim-page sim-page--obs sim-page--obs-philosophy-only">
      <ObservabilityDesignPhilosophy />
    </div>
  );
}
