import { useEffect, useRef, useState } from 'react';
import { useTrafficStore } from '../../store/trafficStore.js';

const SIM_CLICK_DELAY_MS = 280;

export function TrafficControls() {
  const simulateNormalTraffic = useTrafficStore((s) => s.simulateNormalTraffic);
  const stopSimulation = useTrafficStore((s) => s.stopSimulation);
  const applyBestResiliencePreset = useTrafficStore((s) => s.applyBestResiliencePreset);

  const resiliencePreset = useTrafficStore((s) => s.resiliencePreset);
  const mode = useTrafficStore((s) => s.mode);
  const simulationStatus = useTrafficStore((s) => s.simulationStatus);

  const [bestDetailOpen, setBestDetailOpen] = useState(false);
  const simSingleClickTimerRef = useRef(null);

  useEffect(() => {
    if (resiliencePreset === 'default') {
      setBestDetailOpen(false);
    }
  }, [resiliencePreset]);

  useEffect(() => {
    return () => {
      if (simSingleClickTimerRef.current) {
        clearTimeout(simSingleClickTimerRef.current);
      }
    };
  }, []);

  const ran = simulationStatus !== 'idle';
  const normalActive = ran && mode === 'normal';
  const bestActive = resiliencePreset === 'best';

  const toggleBestResilience = () => {
    applyBestResiliencePreset();
    setBestDetailOpen((open) => !open);
  };

  const onSimulateClick = (e) => {
    if (e.detail === 2) {
      if (simSingleClickTimerRef.current) {
        clearTimeout(simSingleClickTimerRef.current);
        simSingleClickTimerRef.current = null;
      }
      stopSimulation();
      return;
    }
    if (e.detail === 1) {
      simSingleClickTimerRef.current = setTimeout(() => {
        simSingleClickTimerRef.current = null;
        simulateNormalTraffic();
      }, SIM_CLICK_DELAY_MS);
    }
  };

  return (
    <div className="traffic-controls-wrap">
      <p className="traffic-controls-goal">
        <strong>Goal:</strong> maximize survivable throughput while keeping primary DB writes under the configured safe
        ceiling.
      </p>

      <div className="sim-controls sim-controls--traffic-bar" role="toolbar" aria-label="Presets and simulation">
        <button
          type="button"
          id="best-resilience-trigger"
          className={`btn ${bestActive ? 'btn-on' : ''}`}
          onClick={toggleBestResilience}
          aria-expanded={bestDetailOpen}
          aria-controls="best-resilience-detail"
          title="Apply best-resilience projection; click again to show or hide the mapping details"
        >
          Best Resilience Mode
        </button>
        <button
          type="button"
          className={`btn btn-simulate-rainbow ${normalActive ? 'btn-primary' : ''}`}
          onClick={onSimulateClick}
          title="Single-click to run simulation; double-click to stop"
        >
          Simulate Normal Traffic
        </button>
      </div>

      {bestDetailOpen ? (
        <div
          id="best-resilience-detail"
          className="traffic-preset-detail"
          role="region"
          aria-labelledby="best-resilience-trigger"
        >
          <p className="traffic-preset-detail__title">Best Resilience Mode maps to this tab as:</p>
          <ul className="traffic-preset-detail__list">
            <li>
              <strong>Strict gateway admission</strong>
            </li>
            <li>
              <strong>Aggressive business filtering</strong>
            </li>
            <li>
              <strong>Elastic scale-out before downstream pressure</strong>
            </li>
            <li>
              <strong>Controlled release toward the core path</strong>
            </li>
            <li>
              <strong>Read-safe degraded bypass</strong>
            </li>
            <li>
              <strong>Edge-side retry discipline</strong>
            </li>
            <li>
              <strong>Early rejection of low-priority traffic</strong>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
