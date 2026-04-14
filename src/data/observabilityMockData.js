export const SERVICES = ['Gateway', 'Orders', 'Payments', 'Legacy CRM'];

export const EXPLANATIONS = {
  metrics: {
    layer: 'Metrics & Alerting',
    purpose: 'Detect system-wide anomalies quickly.',
    problem: 'Unknown degradation before user impact spreads.',
    necessity: 'Provides RED + saturation signals for triage.',
  },
  tracing: {
    layer: 'Distributed Tracing',
    purpose: 'Analyze dependencies and latency composition.',
    problem: 'Cannot localize slow or unstable services.',
    necessity: 'Turns symptoms into candidate service paths.',
  },
  logs: {
    layer: 'Log Correlation',
    purpose: 'Isolate exact failing request and business context.',
    problem: 'Tracing cannot cross third-party / legacy boundaries.',
    necessity: 'requestId + business keys stitch partial views.',
  },
  recovery: {
    layer: 'Business Recoverability',
    purpose: 'Restore durable state without user-driven retry.',
    problem: 'Detection without recovery leaves incidents open.',
    necessity: 'State Log / Process Log enable replay & compensation.',
  },
};
