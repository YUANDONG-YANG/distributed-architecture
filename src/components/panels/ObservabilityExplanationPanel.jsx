import { useObservabilityStore } from '../../store/observabilityStore.js';

export function ObservabilityExplanationPanel() {
  const ex = useObservabilityStore((s) => s.explanation);

  return (
    <section className="panel panel--tight panel--explain" aria-label="Layer explanation">
      <h3 className="panel__heading">Layer Narrative</h3>
      <p className="explain__title">{ex.layer}</p>
      <p className="explain__line">
        <strong>Purpose:</strong> {ex.purpose}
      </p>
      <p className="explain__line">
        <strong>Problem solved:</strong> {ex.problem}
      </p>
      <p className="explain__line">
        <strong>Necessity:</strong> {ex.necessity}
      </p>
    </section>
  );
}
