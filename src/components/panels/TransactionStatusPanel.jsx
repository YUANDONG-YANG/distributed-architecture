import { useTransactionSimulatorStore } from '../../store/transactionSimulatorStore.js';

function Row({ label, value }) {
  return (
    <div className="stat-row">
      <span className="stat-row__label">{label}</span>
      <span className="stat-row__value">{value}</span>
    </div>
  );
}

export function TransactionStatusPanel() {
  const transactionStatus = useTransactionSimulatorStore((s) => s.transactionStatus);
  const currentPhase = useTransactionSimulatorStore((s) => s.currentPhase);
  const activeNodeId = useTransactionSimulatorStore((s) => s.activeNodeId);
  const retryCount = useTransactionSimulatorStore((s) => s.retryCount);
  const eventPublished = useTransactionSimulatorStore((s) => s.eventPublished);
  const consumerSucceeded = useTransactionSimulatorStore((s) => s.consumerSucceeded);
  const reachedDLQ = useTransactionSimulatorStore((s) => s.reachedDLQ);
  const replayTriggered = useTransactionSimulatorStore((s) => s.replayTriggered);
  const manualRecoveryStarted = useTransactionSimulatorStore((s) => s.manualRecoveryStarted);

  const consumerLabel = consumerSucceeded ? 'success' : transactionStatus === 'failed' ? 'failed' : 'pending';

  const recovery = manualRecoveryStarted
    ? replayTriggered
      ? 'replaying'
      : 'manual_recovery'
    : reachedDLQ
      ? 'quarantined'
      : 'none';

  return (
    <section className="panel panel--tight" aria-label="Transaction state">
      <h3 className="panel__heading">Current Transaction State</h3>
      <Row label="State" value={transactionStatus} />
      <Row label="Active Phase" value={currentPhase ?? '—'} />
      <Row label="Active Node" value={activeNodeId ?? '—'} />
      <Row label="Retry Count" value={String(retryCount)} />
      <Row label="Event Published" value={eventPublished ? 'yes' : 'no'} />
      <Row label="Consumer" value={consumerLabel} />
      <Row label="DLQ Reached" value={reachedDLQ ? 'yes' : 'no'} />
      <Row label="Replay Triggered" value={replayTriggered ? 'yes' : 'no'} />
      <Row label="Recovery Status" value={recovery} />
    </section>
  );
}
