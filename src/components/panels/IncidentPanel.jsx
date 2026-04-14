import { useObservabilityStore } from '../../store/observabilityStore.js';

function Row({ label, value }) {
  return (
    <div className="stat-row">
      <span className="stat-row__label">{label}</span>
      <span className="stat-row__value">{value ?? '—'}</span>
    </div>
  );
}

export function IncidentPanel() {
  const incidentType = useObservabilityStore((s) => s.incidentType);
  const currentLayer = useObservabilityStore((s) => s.currentLayer);
  const requestId = useObservabilityStore((s) => s.requestId);
  const orderId = useObservabilityStore((s) => s.orderId);
  const rootCause = useObservabilityStore((s) => s.rootCause);
  const recoveryType = useObservabilityStore((s) => s.recoveryType);
  const recoveryStatus = useObservabilityStore((s) => s.recoveryStatus);
  const systemRestored = useObservabilityStore((s) => s.systemRestored);

  return (
    <section className="panel panel--tight" aria-label="Incident">
      <h3 className="panel__heading">Incident</h3>
      <Row label="Incident type" value={incidentType} />
      <Row label="Detection layer" value={currentLayer === 'metrics' ? 'Metrics' : '—'} />
      <Row label="Current layer" value={currentLayer} />
      <Row label="requestId" value={requestId} />
      <Row label="orderId" value={orderId} />
      <Row label="Root cause" value={rootCause} />
      <Row label="Recovery action" value={recoveryType} />
      <Row label="System status" value={systemRestored ? 'restored' : recoveryStatus} />
    </section>
  );
}
