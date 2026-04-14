/** Compact principles panel required for interview-grade Page 1 narrative. */
export function ArchitectureSummaryPanel() {
  const items = [
    { k: 'Local atomicity', v: 'Single service boundary commits state and outbox together.' },
    { k: 'Eventual consistency', v: 'Cross-boundary convergence via messages and idempotent handlers.' },
    { k: 'Idempotent consumption', v: 'Downstream work tolerates duplicates and retries.' },
    { k: 'Recoverability', v: 'DLQ + manual replay/compensation close the operational loop.' },
  ];
  return (
    <section className="panel panel--tight panel--summary" aria-label="Architecture summary">
      <h3 className="panel__heading">Architecture Summary</h3>
      <ul className="summary-list">
        {items.map((it) => (
          <li key={it.k}>
            <span className="summary-list__k">{it.k}</span>
            <span className="summary-list__v">{it.v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
