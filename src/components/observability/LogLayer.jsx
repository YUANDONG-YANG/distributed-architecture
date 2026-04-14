import { useObservabilityStore } from '../../store/observabilityStore.js';

export function LogLayer() {
  const requestId = useObservabilityStore((s) => s.requestId);
  const orderId = useObservabilityStore((s) => s.orderId);
  const relatedRequestIds = useObservabilityStore((s) => s.relatedRequestIds);
  const logLocated = useObservabilityStore((s) => s.logLocated);
  const rootCause = useObservabilityStore((s) => s.rootCause);
  const currentLayer = useObservabilityStore((s) => s.currentLayer);
  const setExplanationForLayer = useObservabilityStore((s) => s.setExplanationForLayer);

  const active = currentLayer === 'logs';

  return (
    <section
      className={`layer-card layer-card--logs ${active ? 'layer-card--active' : ''}`}
      onMouseEnter={() => setExplanationForLayer('logs')}
    >
      <header className="layer-card__head">
        <h3>Log Correlation & Root Cause</h3>
        <span className="layer-pill layer-pill--muted">ELK</span>
      </header>
      <div className="log-corr">
        <div className="log-line">
          <span className="log-k">requestId</span>
          <span className="log-v">{requestId ?? '—'}</span>
        </div>
        <div className="log-line">
          <span className="log-k">orderId</span>
          <span className="log-v">{orderId ?? '—'}</span>
        </div>
        <div className="log-line">
          <span className="log-k">related</span>
          <span className="log-v">{relatedRequestIds.length ? relatedRequestIds.join(', ') : '—'}</span>
        </div>
        <div className="log-line">
          <span className="log-k">isolated</span>
          <span className="log-v">{logLocated ? 'yes' : 'no'}</span>
        </div>
        <div className="log-line">
          <span className="log-k">root cause</span>
          <span className="log-v">{rootCause ?? '—'}</span>
        </div>
      </div>
      <p className="layer-card__foot">requestId complements trace across third-party / legacy boundaries.</p>
    </section>
  );
}
