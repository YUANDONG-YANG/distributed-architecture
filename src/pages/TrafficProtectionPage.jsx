import { TAB_META } from '../data/tabs.js';
import { TrafficControls } from '../components/controls/TrafficControls.jsx';
import { TrafficFlowView } from '../components/traffic/TrafficFlowView.jsx';
import { TrafficStatusPanel } from '../components/panels/TrafficStatusPanel.jsx';
import { TrafficExplanationPanel } from '../components/panels/TrafficExplanationPanel.jsx';
import { TrafficDesignPhilosophy } from '../components/panels/TrafficDesignPhilosophy.jsx';

const meta = TAB_META.traffic;

/** Page 3 — layered traffic governance protecting core systems. */
export function TrafficProtectionPage() {
  return (
    <div className="sim-page sim-page--traffic">
      <header className="sim-page__header">
        <h2 className="sim-page__title">{meta.pageTitle}</h2>
        <p className="sim-page__subtitle">
          Database protection is achieved by layered traffic control before requests reach the DB.
        </p>
      </header>

      <div className="sim-page__body">
        <div className="sim-page__primary">
          <TrafficControls />
          <TrafficFlowView />
        </div>
        <aside className="sim-page__aside">
          <TrafficStatusPanel />
          <TrafficExplanationPanel />
          <TrafficDesignPhilosophy />
        </aside>
      </div>
    </div>
  );
}
