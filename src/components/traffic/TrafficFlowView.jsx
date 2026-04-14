import { motion } from 'framer-motion';
import { useTrafficStore } from '../../store/trafficStore.js';
import { TrafficLayerCard } from './TrafficLayerCard.jsx';
import { TrafficParticleStream } from './TrafficParticleStream.jsx';

function Metric({ label, value }) {
  const isNum = typeof value === 'number';
  const show = value !== null && value !== undefined && (isNum || value !== '');
  return (
    <div className="traffic-metric">
      <span className="traffic-metric__k">{label}</span>
      <span className="traffic-metric__v">
        {show ? (
          isNum ? (
            <motion.span
              key={value}
              initial={{ opacity: 0.35, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {value}
            </motion.span>
          ) : (
            value
          )
        ) : (
          '—'
        )}
      </span>
    </div>
  );
}

export function TrafficFlowView() {
  const currentLayer = useTrafficStore((s) => s.currentLayer);
  const simulationStatus = useTrafficStore((s) => s.simulationStatus);
  const incoming = useTrafficStore((s) => s.totalRequests);
  const gatewayIncoming = useTrafficStore((s) => s.gatewayIncoming);
  const gatewayPassed = useTrafficStore((s) => s.gatewayPassed);
  const gatewayDropped = useTrafficStore((s) => s.gatewayDropped);
  const filterIncoming = useTrafficStore((s) => s.filterIncoming);
  const filterPassed = useTrafficStore((s) => s.filterPassed);
  const filterDropped = useTrafficStore((s) => s.filterDropped);
  const serviceIncoming = useTrafficStore((s) => s.serviceIncoming);
  const serviceProcessed = useTrafficStore((s) => s.serviceProcessed);
  const serviceAbsorbed = useTrafficStore((s) => s.serviceAbsorbed);
  const bufferedRequests = useTrafficStore((s) => s.bufferedRequests);
  const serviceCapacity = useTrafficStore((s) => s.serviceCapacity);
  const breakerIncoming = useTrafficStore((s) => s.breakerIncoming);
  const breakerPassed = useTrafficStore((s) => s.breakerPassed);
  const breakerBlocked = useTrafficStore((s) => s.breakerBlocked);
  const fallbackTriggered = useTrafficStore((s) => s.fallbackTriggered);
  const dbFinalLoad = useTrafficStore((s) => s.dbFinalLoad);
  const phaseIndex = useTrafficStore((s) => s.phaseIndex);

  const hasData = simulationStatus !== 'idle';

  const showFilter = hasData && phaseIndex >= 2;
  const showService = hasData && phaseIndex >= 3;
  const showBreaker = hasData && phaseIndex >= 4;
  const showDb = hasData && phaseIndex >= 5;

  return (
    <div className="traffic-stack-outer">
      <div className="traffic-stack" aria-label="Traffic defense stack">
        <TrafficLayerCard
          title="Incoming Traffic"
          subtitle="Synthetic load generator"
          tone="ingress"
          active={hasData && currentLayer === 'ingress'}
        >
          <Metric label="incoming" value={hasData ? incoming : null} />
        </TrafficLayerCard>

        <TrafficLayerCard
          title="Gateway"
          subtitle="Auth · Rate limit · Token bucket"
          tone="gateway"
          active={currentLayer === 'gateway'}
        >
          <Metric label="incoming" value={hasData && phaseIndex >= 0 ? gatewayIncoming : null} />
          <Metric label="passed" value={hasData && phaseIndex >= 1 ? gatewayPassed : null} />
          <Metric label="dropped" value={hasData && phaseIndex >= 1 ? gatewayDropped : null} />
        </TrafficLayerCard>

        <TrafficLayerCard
          title="Business Filter / Validation"
          subtitle="Invalid rejection · state validation · idempotency pre-check"
          tone="filter"
          active={currentLayer === 'filter'}
        >
          <Metric label="incoming" value={showFilter ? filterIncoming : null} />
          <Metric label="passed" value={showFilter ? filterPassed : null} />
          <Metric label="dropped" value={showFilter ? filterDropped : null} />
        </TrafficLayerCard>

        <TrafficLayerCard
          title="Service Layer"
          subtitle="Elastic absorption · horizontal scaling"
          tone="service"
          active={currentLayer === 'service'}
          dense
        >
          <Metric label="incoming" value={showService ? serviceIncoming : null} />
          <Metric label="processed" value={showService ? serviceProcessed : null} />
          <Metric label="absorbed" value={showService ? serviceAbsorbed : null} />
          <Metric label="buffered (out)" value={showService ? bufferedRequests : null} />
          <Metric label="instances" value={showService ? serviceCapacity : null} />
        </TrafficLayerCard>

        <TrafficLayerCard
          title="Downstream Protection"
          subtitle="Circuit breaker · fallback · fail fast"
          tone="breaker"
          active={currentLayer === 'breaker'}
        >
          <Metric label="incoming" value={showBreaker ? breakerIncoming : null} />
          <Metric label="passed" value={showBreaker ? breakerPassed : null} />
          <Metric label="blocked" value={showBreaker ? breakerBlocked : null} />
          <Metric label="fallback" value={showBreaker ? (fallbackTriggered ? 'triggered' : 'idle') : null} />
        </TrafficLayerCard>

        <TrafficLayerCard
          title="DB / Core Systems"
          subtitle="Final protected resource"
          tone="db"
          active={currentLayer === 'db'}
        >
          <Metric label="from breaker" value={showDb ? breakerPassed : null} />
          <Metric label="final load" value={showDb ? dbFinalLoad : null} />
        </TrafficLayerCard>
      </div>
      <div className="traffic-stack-rail" aria-hidden>
        <TrafficParticleStream />
      </div>
    </div>
  );
}
