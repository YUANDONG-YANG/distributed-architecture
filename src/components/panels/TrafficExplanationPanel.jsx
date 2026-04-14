import { useTrafficStore } from '../../store/trafficStore.js';

const LAYERS = {
  gateway: {
    name: 'Gateway',
    purpose: 'Control ingress traffic and authenticate callers.',
    protects: 'Core tiers from uncontrolled access and burst admission.',
    failure: 'Unbounded traffic admission and credential abuse.',
  },
  filter: {
    name: 'Business Filter',
    purpose: 'Reject invalid or non-actionable work early.',
    protects: 'CPU, threads, and downstream quotas from wasted effort.',
    failure: 'Resource exhaustion on poisonous or duplicate requests.',
  },
  service: {
    name: 'Service Layer',
    purpose: 'Absorb bursts via scaling and buffering.',
    protects: 'Downstream from synchronized spikes.',
    failure: 'Thundering herd into databases and shared pools.',
  },
  breaker: {
    name: 'Circuit Breaker',
    purpose: 'Isolate unstable dependencies quickly.',
    protects: 'Callers from cascading latency and error propagation.',
    failure: 'Retry storms and metastable overload.',
  },
  db: {
    name: 'Database',
    purpose: 'Authoritative state at the end of the defense chain.',
    protects: 'Durability — must not be the first shock absorber.',
    failure: 'Overload-induced lock contention and data-plane instability.',
  },
};

export function TrafficExplanationPanel() {
  const currentLayer = useTrafficStore((s) => s.currentLayer);
  const key = currentLayer && LAYERS[currentLayer] ? currentLayer : 'gateway';
  const L = LAYERS[key];

  return (
    <section className="panel panel--tight panel--explain" aria-label="Architecture interpretation">
      <h3 className="panel__heading">Layer Interpretation</h3>
      <p className="explain__title">{L.name}</p>
      <p className="explain__line">
        <strong>Purpose:</strong> {L.purpose}
      </p>
      <p className="explain__line">
        <strong>Protects:</strong> {L.protects}
      </p>
      <p className="explain__line">
        <strong>Prevents:</strong> {L.failure}
      </p>
      <div className="traffic-callout">
        <p>
          Database protection is shifted to the middle tier through layered traffic control before requests reach the DB.
        </p>
        <p>
          MQ and cache may shift pressure, but cannot replace proper traffic governance against DB overload.
        </p>
      </div>
    </section>
  );
}
