import { motion } from 'framer-motion';
import { useObservabilityStore } from '../../store/observabilityStore.js';

const cards = [
  { id: 'traffic', label: 'Traffic (RED)' },
  { id: 'errors', label: 'Errors (RED)' },
  { id: 'latency', label: 'Latency (RED)' },
  { id: 'cpu', label: 'CPU' },
  { id: 'memory', label: 'Memory' },
  { id: 'sat', label: 'Saturation' },
];

export function MetricsLayer() {
  const metricsStatus = useObservabilityStore((s) => s.metricsStatus);
  const currentLayer = useObservabilityStore((s) => s.currentLayer);
  const setExplanationForLayer = useObservabilityStore((s) => s.setExplanationForLayer);

  const active = currentLayer === 'metrics';
  const warn = metricsStatus === 'warning';
  const crit = metricsStatus === 'critical';

  return (
    <motion.section
      className={`layer-card layer-card--metrics ${active ? 'layer-card--active' : ''}`}
      onMouseEnter={() => setExplanationForLayer('metrics')}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className="layer-card__head">
        <h3>Metrics & Alerting</h3>
        <span className={`layer-pill layer-pill--${crit ? 'crit' : warn ? 'warn' : 'ok'}`}>
          {metricsStatus}
        </span>
      </header>
      <div className="metric-grid">
        {cards.map((c) => (
          <motion.div
            key={c.id}
            className={`metric-cell ${crit && (c.id === 'errors' || c.id === 'latency') ? 'metric-cell--alert' : ''}`}
            animate={crit && c.id === 'errors' ? { boxShadow: ['0 0 0 rgba(248,113,113,0)', '0 0 18px rgba(248,113,113,0.35)'] } : {}}
            transition={{ repeat: crit ? Infinity : 0, duration: 1.2 }}
          >
            <div className="metric-cell__label">{c.label}</div>
            <div className="metric-cell__value">{crit && c.id === 'errors' ? '↑' : crit && c.id === 'latency' ? 'p95↑' : 'stable'}</div>
          </motion.div>
        ))}
      </div>
      <p className="layer-card__foot">Prometheus · Grafana · Alertmanager</p>
    </motion.section>
  );
}
