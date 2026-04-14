import { HAPPY_PATH } from '../../engine/transactionEngine.js';
import { TIMELINE_STEPS } from '../../data/transactionFlowData.js';
import { useTransactionSimulatorStore } from '../../store/transactionSimulatorStore.js';

export function ExecutionTimelinePanel() {
  const currentIndex = useTransactionSimulatorStore((s) => s.currentIndex);
  const branch = useTransactionSimulatorStore((s) => s.branch);
  const activeNodeId = useTransactionSimulatorStore((s) => s.activeNodeId);
  const logsTimeline = useTransactionSimulatorStore((s) => s.logsTimeline);

  function stepTone(stepId) {
    if (activeNodeId === stepId) return 'active';
    const hp = HAPPY_PATH.indexOf(stepId);
    if (hp >= 0) {
      if (branch === 'happy') {
        if (currentIndex > hp) return 'done';
        if (currentIndex === hp) return 'active';
      }
      if (branch !== 'happy' && hp < HAPPY_PATH.length) {
        if (currentIndex > hp || (currentIndex === hp && stepId !== activeNodeId)) return 'done';
      }
    }
    if (['retry', 'dlq', 'manualOps', 'processLogManual'].includes(stepId)) {
      if (activeNodeId === stepId) return 'active';
      if (logsTimeline.some((l) => String(l.label).includes(stepId))) return 'done';
    }
    return 'idle';
  }

  return (
    <section className="timeline-panel" aria-label="Execution timeline">
      <div className="timeline-panel__head">
        <h3 className="panel__heading">Execution Timeline</h3>
        <p className="panel__muted">
          This is an eventual-consistency paradigm for distributed transaction control. It anchors local
          strong consistency with a transactional outbox, extends system boundaries through asynchronous
          messaging (MQ), and relies on upstream/downstream process logs for observability and idempotency.
          Failure handling uses retries, dead-letter queues, and manual operations—deliberately avoiding
          heavyweight two-phase commit (2PC) in favor of availability and maintainability.
        </p>
      </div>
      <div className="timeline-strip">
        {TIMELINE_STEPS.map((s) => (
          <div key={s.id} className={`timeline-chip timeline-chip--${stepTone(s.id)}`} title={s.id}>
            {s.label}
          </div>
        ))}
      </div>
    </section>
  );
}
