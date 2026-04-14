import { useEffect } from 'react';
import { TAB_META } from '../data/tabs.js';
import { TransactionFlowCanvas } from '../components/flow/TransactionFlowCanvas.jsx';
import { TransactionControls } from '../components/controls/TransactionControls.jsx';
import { TransactionStatusPanel } from '../components/panels/TransactionStatusPanel.jsx';
import { ArchitectureExplanationPanel } from '../components/panels/ArchitectureExplanationPanel.jsx';
import { ArchitectureSummaryPanel } from '../components/panels/ArchitectureSummaryPanel.jsx';
import { ExecutionTimelinePanel } from '../components/panels/ExecutionTimelinePanel.jsx';
import { useTransactionSimulatorStore } from '../store/transactionSimulatorStore.js';

const meta = TAB_META.transaction;

/** Page 1 — distributed transaction control chain (interactive simulator). */
export function TransactionSimulatorPage() {
  const isRunning = useTransactionSimulatorStore((s) => s.isRunning);
  const isPaused = useTransactionSimulatorStore((s) => s.isPaused);
  const transactionStatus = useTransactionSimulatorStore((s) => s.transactionStatus);
  const branch = useTransactionSimulatorStore((s) => s.branch);
  const advanceStep = useTransactionSimulatorStore((s) => s.advanceStep);

  useEffect(() => {
    if (!isRunning || isPaused || transactionStatus !== 'running' || branch !== 'happy') {
      return undefined;
    }
    const id = setInterval(() => {
      advanceStep();
    }, 700);
    return () => clearInterval(id);
  }, [isRunning, isPaused, transactionStatus, branch, advanceStep]);

  return (
    <div className="sim-page sim-page--txn">
      <header className="sim-page__header">
        <div className="sim-page__header-main">
          <h2 className="sim-page__title">{meta.pageTitle}</h2>
          <p className="sim-page__subtitle">
            Local atomicity, event dispatch, idempotent consumption, and recoverable failure handling.
          </p>
        </div>
        <span className="sim-page__credit">Robin yang</span>
      </header>

      <div className="sim-page__body">
        <div className="sim-page__primary">
          <TransactionControls />
          <div className="sim-canvas-area">
            <TransactionFlowCanvas />
          </div>
          <ExecutionTimelinePanel />
        </div>
        <aside className="sim-page__aside">
          <TransactionStatusPanel />
          <ArchitectureExplanationPanel />
          <ArchitectureSummaryPanel />
        </aside>
      </div>
    </div>
  );
}
