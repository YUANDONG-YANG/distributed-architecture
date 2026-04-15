import { useLayoutEffect, useRef } from 'react';
import { TAB_META } from '../data/tabs.js';
import { TrafficControls } from '../components/controls/TrafficControls.jsx';
import { TrafficFlowView } from '../components/traffic/TrafficFlowView.jsx';
import { TrafficStatusPanel } from '../components/panels/TrafficStatusPanel.jsx';
import { TrafficExplanationPanel } from '../components/panels/TrafficExplanationPanel.jsx';
import { TrafficDesignPhilosophy } from '../components/panels/TrafficDesignPhilosophy.jsx';

const meta = TAB_META.traffic;

/** Page 3 — layered traffic governance protecting core systems. */
export function TrafficProtectionPage() {
  const pageRef = useRef(null);
  const primaryRef = useRef(null);

  useLayoutEffect(() => {
    const root = pageRef.current;
    const primary = primaryRef.current;
    if (!root || !primary) return;

    const sync = () => {
      root.style.setProperty('--traffic-primary-h', `${primary.offsetHeight}px`);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(primary);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

  return (
    <div ref={pageRef} className="sim-page sim-page--traffic">
      <header className="sim-page__header">
        <h2 className="sim-page__title">{meta.pageTitle}</h2>
        <p className="sim-page__subtitle">{meta.pageSubtitle}</p>
        <p className="sim-page__kicker">
          This tab is the <strong>survivability</strong> leg only (ingress → service tier → core).{' '}
          <strong>Correctness</strong> and <strong>diagnosability</strong> are modeled in the other tabs—global header
          above is the full triangle.
        </p>
      </header>

      <div className="sim-page__body">
        <div ref={primaryRef} className="sim-page__primary">
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
