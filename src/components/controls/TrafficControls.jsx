import { useTrafficStore } from '../../store/trafficStore.js';

export function TrafficControls() {
  const simulateNormalTraffic = useTrafficStore((s) => s.simulateNormalTraffic);
  const simulateTrafficSurge = useTrafficStore((s) => s.simulateTrafficSurge);
  const toggleRateLimit = useTrafficStore((s) => s.toggleRateLimit);
  const toggleBusinessFilter = useTrafficStore((s) => s.toggleBusinessFilter);
  const toggleAutoScaling = useTrafficStore((s) => s.toggleAutoScaling);
  const toggleCircuitBreaker = useTrafficStore((s) => s.toggleCircuitBreaker);
  const reset = useTrafficStore((s) => s.reset);

  const gatewayEnabled = useTrafficStore((s) => s.gatewayEnabled);
  const filterEnabled = useTrafficStore((s) => s.filterEnabled);
  const scalingEnabled = useTrafficStore((s) => s.scalingEnabled);
  const breakerEnabled = useTrafficStore((s) => s.breakerEnabled);

  return (
    <div className="sim-controls" role="toolbar" aria-label="Traffic controls">
      <button type="button" className="btn" onClick={simulateNormalTraffic}>
        Simulate Normal Traffic
      </button>
      <button type="button" className="btn btn-primary" onClick={simulateTrafficSurge}>
        Simulate Traffic Surge
      </button>
      <button type="button" className={`btn ${gatewayEnabled ? 'btn-on' : ''}`} onClick={toggleRateLimit}>
        Toggle Rate Limit
      </button>
      <button type="button" className={`btn ${filterEnabled ? 'btn-on' : ''}`} onClick={toggleBusinessFilter}>
        Toggle Business Filter
      </button>
      <button type="button" className={`btn ${scalingEnabled ? 'btn-on' : ''}`} onClick={toggleAutoScaling}>
        Toggle Auto Scaling
      </button>
      <button type="button" className={`btn ${breakerEnabled ? 'btn-on' : ''}`} onClick={toggleCircuitBreaker}>
        Toggle Circuit Breaker
      </button>
      <button type="button" className="btn" onClick={reset}>
        Reset
      </button>
    </div>
  );
}
