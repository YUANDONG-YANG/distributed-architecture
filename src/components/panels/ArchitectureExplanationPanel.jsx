import { NODE_INTERPRETATION } from '../../data/transactionFlowData.js';
import { useTransactionSimulatorStore } from '../../store/transactionSimulatorStore.js';

export function ArchitectureExplanationPanel() {
  const activeNodeId = useTransactionSimulatorStore((s) => s.activeNodeId);
  const meta = activeNodeId ? NODE_INTERPRETATION[activeNodeId] : null;

  return (
    <section className="panel panel--tight panel--explain" aria-label="Architecture interpretation">
      <h3 className="panel__heading">Architecture Interpretation</h3>
      {!meta ? (
        <p className="panel__muted">Run the simulator to anchor interpretation on the active node.</p>
      ) : (
        <>
          <p className="explain__title">{meta.title}</p>
          <p className="explain__line">
            <strong>Problem:</strong> {meta.problem}
          </p>
          <p className="explain__line">
            <strong>Role:</strong> {meta.why}
          </p>
          <p className="explain__line">
            <strong>Principle:</strong> {meta.principle}
          </p>
        </>
      )}
    </section>
  );
}
