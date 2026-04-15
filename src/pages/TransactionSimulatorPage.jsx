import { TAB_META } from '../data/tabs.js';
import { TransactionFlowCanvas } from '../components/flow/TransactionFlowCanvas.jsx';
import { TransactionControls } from '../components/controls/TransactionControls.jsx';
import { TransactionStatusPanel } from '../components/panels/TransactionStatusPanel.jsx';
import { ArchitectureExplanationPanel } from '../components/panels/ArchitectureExplanationPanel.jsx';
import { ArchitectureSummaryPanel } from '../components/panels/ArchitectureSummaryPanel.jsx';
import { ExecutionTimelinePanel } from '../components/panels/ExecutionTimelinePanel.jsx';

const meta = TAB_META.transaction;

/** Page 1 — distributed transaction control chain (interactive simulator). */
export function TransactionSimulatorPage() {
  return (
    <div className="sim-page sim-page--txn">
      <header className="sim-page__header">
        <div className="sim-page__header-main">
          <h2 className="sim-page__title">{meta.pageTitle}</h2>
          <p className="sim-page__subtitle">
            Local atomicity, event dispatch, idempotent consumption, and recoverable failure handling.
          </p>
        </div>
        <span className="sim-page__credit">Robin Yang</span>
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
