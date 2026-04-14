import { useTrafficStore } from '../../store/trafficStore.js';

function Row({ label, value }) {
  return (
    <div className="stat-row">
      <span className="stat-row__label">{label}</span>
      <span className="stat-row__value">{value}</span>
    </div>
  );
}

export function TrafficStatusPanel() {
  const simulationStatus = useTrafficStore((s) => s.simulationStatus);
  const mode = useTrafficStore((s) => s.mode);
  const currentLayer = useTrafficStore((s) => s.currentLayer);
  const phaseIndex = useTrafficStore((s) => s.phaseIndex);
  const dbFinalLoad = useTrafficStore((s) => s.dbFinalLoad);
  const incoming = useTrafficStore((s) => s.totalRequests);
  const flowRemainder = useTrafficStore((s) => s.flowRemainder);
  const fallbackTriggered = useTrafficStore((s) => s.fallbackTriggered);

  return (
    <section className="panel panel--tight" aria-label="Traffic simulation status">
      <h3 className="panel__heading">Simulation</h3>
      <Row label="Status" value={simulationStatus} />
      <Row label="Mode" value={mode} />
      <Row label="Step" value={phaseIndex >= 0 ? String(phaseIndex) : '—'} />
      <Row label="Highlight layer" value={currentLayer ?? '—'} />
      <Row label="Incoming" value={incoming || '—'} />
      <Row label="Flow (toward DB)" value={flowRemainder || '—'} />
      <Row label="Fallback" value={fallbackTriggered ? 'triggered' : 'idle'} />
      <Row label="DB final load" value={dbFinalLoad || '—'} />
    </section>
  );
}
