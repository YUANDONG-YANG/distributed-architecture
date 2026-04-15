/** Top-level navigation: matches placeholder page components and product narrative. */
export const TAB_ORDER = [
  'transaction',
  'observability',
  'traffic',
  'rationale',
  'engineering',
];

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
      'Survivability: reconciled admission, validation, elastic capacity, isolation, and DB outcomes (per evaluation window).',
  },
  rationale: {
    id: 'rationale',
    shortLabel: 'Design Rationale',
    pageTitle: 'Design Rationale',
    pageSubtitle:
      'What the three demos leave implicit: security, contracts, SLOs, and how to talk about impact.',
  },
  engineering: {
    id: 'engineering',
    shortLabel: 'My Practice',
    pageTitle: 'My Design Philosophy & Engineering Practice',
    pageSubtitle:
      'Notes on wiring, load, DB pressure, and explaining incidents without hand-waving.',
  },
};
