/** Top-level navigation: matches placeholder page components and product narrative. */
export const TAB_ORDER = ['transaction', 'observability', 'traffic', 'rationale'];

export const TAB_META = {
  transaction: {
    id: 'transaction',
    shortLabel: 'Transaction Control',
    pageTitle: 'Distributed Transaction Control',
    pageSubtitle:
      'Local atomicity, event dispatch, idempotent consumption, and failure recovery.',
  },
  observability: {
    id: 'observability',
    shortLabel: 'Observability Loop',
    pageTitle: 'Production Observability & Troubleshooting Closed Loop',
    pageSubtitle:
      'Metrics, tracing, log correlation, and business-level recoverability.',
  },
  traffic: {
    id: 'traffic',
    shortLabel: 'Traffic Protection',
    pageTitle: 'Traffic Governance & System Protection',
    pageSubtitle:
      'Ingress control, validation, elastic absorption, and downstream isolation.',
  },
  rationale: {
    id: 'rationale',
    shortLabel: 'Design Rationale',
    pageTitle: 'Why These Three Simulators',
    pageSubtitle:
      'Integration engineering: transactions, observability, survivability, and resilience.',
  },
};
