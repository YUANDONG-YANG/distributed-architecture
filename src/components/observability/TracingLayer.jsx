import { motion } from 'framer-motion';
import { useObservabilityStore } from '../../store/observabilityStore.js';

export function TracingLayer() {
  const tracingPath = useObservabilityStore((s) => s.tracingPath);
  const tracingActiveNode = useObservabilityStore((s) => s.tracingActiveNode);
  const currentLayer = useObservabilityStore((s) => s.currentLayer);
  const setExplanationForLayer = useObservabilityStore((s) => s.setExplanationForLayer);

  const nodes = tracingPath.length ? tracingPath : ['Gateway', 'Orders', 'Payments', 'Legacy CRM'];
  const active = currentLayer === 'tracing';

  return (
    <motion.section
      className={`layer-card layer-card--tracing ${active ? 'layer-card--active' : ''}`}
      onMouseEnter={() => setExplanationForLayer('tracing')}
    >
      <header className="layer-card__head">
        <h3>Distributed Tracing</h3>
        <span className="layer-pill layer-pill--muted">SkyWalking</span>
      </header>
      <div className="trace-chain">
        {nodes.map((n, i) => (
          <div className="trace-chain__seg" key={`${n}-${i}`}>
            <motion.div
              className={`trace-node ${tracingActiveNode === n ? 'trace-node--hot' : ''}`}
              animate={tracingActiveNode === n ? { scale: [1, 1.03, 1] } : {}}
              transition={{ repeat: tracingActiveNode === n ? Infinity : 0, duration: 1.1 }}
            >
              {n}
            </motion.div>
            {i < nodes.length - 1 && <span className="trace-arrow">→</span>}
          </div>
        ))}
      </div>
      <p className="layer-card__foot">Dependency graph · latency breakdown · slow calls</p>
    </motion.section>
  );
}
