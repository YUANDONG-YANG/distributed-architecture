import { useObservabilityStore } from '../../store/observabilityStore.js';

export function ObservabilityControls() {
  const injectTimeout = useObservabilityStore((s) => s.injectTimeout);
  const injectDependencyFailure = useObservabilityStore((s) => s.injectDependencyFailure);
  const injectErrorSpike = useObservabilityStore((s) => s.injectErrorSpike);
  const searchByRequestId = useObservabilityStore((s) => s.searchByRequestId);
  const reconstructByOrderId = useObservabilityStore((s) => s.reconstructByOrderId);
  const triggerReplay = useObservabilityStore((s) => s.triggerReplay);
  const reset = useObservabilityStore((s) => s.reset);
  const scenarioRunning = useObservabilityStore((s) => s.scenarioRunning);

  return (
    <div className="sim-controls" role="toolbar" aria-label="Observability controls">
      <button type="button" className="btn" onClick={injectTimeout} disabled={scenarioRunning}>
        Inject Timeout
      </button>
      <button type="button" className="btn" onClick={injectDependencyFailure} disabled={scenarioRunning}>
        Inject Dependency Failure
      </button>
      <button type="button" className="btn" onClick={injectErrorSpike} disabled={scenarioRunning}>
        Inject Error Spike
      </button>
      <button type="button" className="btn" onClick={searchByRequestId}>
        Search by requestId
      </button>
      <button type="button" className="btn" onClick={reconstructByOrderId}>
        Reconstruct by orderId
      </button>
      <button type="button" className="btn btn-primary" onClick={triggerReplay}>
        Trigger Replay
      </button>
      <button type="button" className="btn" onClick={reset}>
        Reset
      </button>
    </div>
  );
}
