import { motion } from 'framer-motion';
import { useObservabilityStore } from '../../store/observabilityStore.js';

export function RecoveryLayer() {
  const recoveryStarted = useObservabilityStore((s) => s.recoveryStarted);
  const recoveryType = useObservabilityStore((s) => s.recoveryType);
  const recoveryStatus = useObservabilityStore((s) => s.recoveryStatus);
  const systemRestored = useObservabilityStore((s) => s.systemRestored);
  const currentLayer = useObservabilityStore((s) => s.currentLayer);
  const setExplanationForLayer = useObservabilityStore((s) => s.setExplanationForLayer);

  const active = currentLayer === 'recovery';

  return (
    <motion.section
      className={`layer-card layer-card--recovery layer-card--wide ${active ? 'layer-card--active' : ''}`}
      onMouseEnter={() => setExplanationForLayer('recovery')}
      layout
    >
      <header className="layer-card__head">
        <h3>Business Recoverability</h3>
        <span className="layer-pill layer-pill--ok">{systemRestored ? 'restored' : recoveryStatus}</span>
      </header>
      <div className="recovery-grid">
        {['State Log', 'Process Log', 'Replay', 'Retry', 'Compensation'].map((x) => (
          <div key={x} className="recovery-tile">
            <div className="recovery-tile__t">{x}</div>
            <div className="recovery-tile__s">{recoveryStarted ? 'engaged' : 'idle'}</div>
          </div>
        ))}
      </div>
      <div className="recovery-timeline">
        <div className="recovery-step">detect</div>
        <span>→</span>
        <div className="recovery-step">analyze</div>
        <span>→</span>
        <div className="recovery-step">isolate</div>
        <span>→</span>
        <div className="recovery-step recovery-step--emph">recover</div>
      </div>
      <p className="layer-card__foot">
        System-level recoverability instead of user-driven retry · {recoveryType ?? 'awaiting action'}
      </p>
    </motion.section>
  );
}
