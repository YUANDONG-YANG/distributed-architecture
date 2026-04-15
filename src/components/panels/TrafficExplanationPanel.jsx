import { useTrafficStore } from '../../store/trafficStore.js';

const LAYERS = {
  gateway: {
    name: 'Gateway',
    purpose:
      'Split identity, rate-control, and policy outcomes: auth denial, token-bucket / rate limiting, and policy rejects are different failure families and must not be lumped into one “dropped” bucket.',
    protects: 'Downstream tiers from anonymous bursts, credential abuse, and quota exhaustion.',
    failure: 'Ambiguous drops that hide whether you are failing secure or failing fair.',
  },
  service: {
    name: 'Service Layer',
    purpose:
      'Filter and validate requests inside the tier (invalid work, state, idempotency pre-checks); absorb bursts via elastic scale-out when enabled, otherwise backlog against a fixed floor; apply downstream isolation (circuit breakers, fail-fast, fallback)—all as service-side mechanisms, not separate “layers” above the service.',
    protects:
      'CPU, pools, and databases from wasted work, synchronized spikes, and cascading failures.',
    failure:
      'Poison traffic amplification, thundering herds, retry storms, and metastable overload reaching the data plane.',
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
  const resolved =
    currentLayer === 'breaker' || currentLayer === 'filter' || currentLayer === 'service'
      ? 'service'
      : currentLayer;
  const key = resolved && LAYERS[resolved] ? resolved : 'gateway';
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
