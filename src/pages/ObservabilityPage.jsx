import { TAB_META } from '../data/tabs.js';
import { ObservabilityControls } from '../components/controls/ObservabilityControls.jsx';
import { MetricsLayer } from '../components/observability/MetricsLayer.jsx';
import { TracingLayer } from '../components/observability/TracingLayer.jsx';
import { LogLayer } from '../components/observability/LogLayer.jsx';
import { RecoveryLayer } from '../components/observability/RecoveryLayer.jsx';
import { IncidentPanel } from '../components/panels/IncidentPanel.jsx';
import { ObservabilityExplanationPanel } from '../components/panels/ObservabilityExplanationPanel.jsx';
import { ObservabilityDesignPhilosophy } from '../components/observability/ObservabilityDesignPhilosophy.jsx';

const meta = TAB_META.observability;

/** Page 2 — layered observability simulator (detect → analyze → isolate → recover). */
export function ObservabilityPage() {
  return (
    <div className="sim-page sim-page--obs">
      <header className="sim-page__header">
        <h2 className="sim-page__title">{meta.pageTitle}</h2>
        <p className="sim-page__subtitle">
          Detect → analyze → isolate → recover. Observability is layered; recovery closes the loop.
        </p>
      </header>

      <div className="sim-page__body">
        <div className="sim-page__primary">
          <ObservabilityControls />
          <div className="obs-layers-row">
            <MetricsLayer />
            <TracingLayer />
            <LogLayer />
          </div>
          <RecoveryLayer />
        </div>
        <aside className="sim-page__aside">
          <IncidentPanel />
          <ObservabilityExplanationPanel />
        </aside>
      </div>

      <ObservabilityDesignPhilosophy />
    </div>
  );
}
