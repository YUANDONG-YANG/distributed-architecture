import { useTransactionSimulatorStore } from '../../store/transactionSimulatorStore.js';

export function TransactionControls() {
  const status = useTransactionSimulatorStore((s) => s.transactionStatus);
  const isRunning = useTransactionSimulatorStore((s) => s.isRunning);
  const isPaused = useTransactionSimulatorStore((s) => s.isPaused);

  const startTransaction = useTransactionSimulatorStore((s) => s.startTransaction);
  const pause = useTransactionSimulatorStore((s) => s.pause);
  const resume = useTransactionSimulatorStore((s) => s.resume);
  const triggerRetry = useTransactionSimulatorStore((s) => s.triggerRetry);
  const replayFromManualOps = useTransactionSimulatorStore((s) => s.replayFromManualOps);
  const reset = useTransactionSimulatorStore((s) => s.reset);

  const retryTitle =
    'Standalone demo: pauses the main chain, seeds Retry if needed, plays retry → consume → fail → DLQ. Click anytime.';
  const replayDlqTitle =
    'Starts at DLQ: DLQ → MQ → Consumer → downstream process log (re-consume only). Standalone; click anytime.';
  const replayGuardTitle =
    'Manual Ops → Process Log (Manual) → full happy path from Guard. Standalone; click anytime.';

  return (
    <div className="sim-controls" role="toolbar" aria-label="Transaction simulator controls">
      <div className="sim-controls__group">
        <button type="button" className="btn btn-primary" onClick={startTransaction} disabled={isRunning && status !== 'completed'}>
          Start Transaction
        </button>
        <button type="button" className="btn" onClick={pause} disabled={!isRunning || isPaused}>
          Pause
        </button>
        <button type="button" className="btn" onClick={resume} disabled={status !== 'paused'}>
          Resume
        </button>
      </div>
      <div className="sim-controls__group sim-controls__group--secondary">
        <button type="button" className="btn" onClick={triggerRetry} title={retryTitle}>
          Trigger Retry
        </button>
        <div className="sim-controls__replay-pair" role="group" aria-label="Manual replay">
          <button type="button" className="btn" onClick={() => replayFromManualOps('dlq')} title={replayDlqTitle}>
            DLQ retry
          </button>
          <button type="button" className="btn" onClick={() => replayFromManualOps('guard')} title={replayGuardTitle}>
            manual Ops
          </button>
        </div>
        <button type="button" className="btn" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
