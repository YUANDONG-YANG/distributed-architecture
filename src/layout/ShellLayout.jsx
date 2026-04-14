import { AnimatePresence, motion } from 'framer-motion';
import { TAB_META, TAB_ORDER } from '../data/tabs.js';
import { useUiStore } from '../store/uiStore.js';
import { ObservabilityPage } from '../pages/ObservabilityPage.jsx';
import { TrafficProtectionPage } from '../pages/TrafficProtectionPage.jsx';
import { TransactionSimulatorPage } from '../pages/TransactionSimulatorPage.jsx';

const PAGE_BY_TAB = {
  transaction: TransactionSimulatorPage,
  observability: ObservabilityPage,
  traffic: TrafficProtectionPage,
};

export function ShellLayout() {
  const activeTab = useUiStore((s) => s.activeTab);
  const setActiveTab = useUiStore((s) => s.setActiveTab);
  const ActivePage = PAGE_BY_TAB[activeTab];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title-block">
          <h1 className="app-title">Distributed System Simulator</h1>
          <p className="app-subtitle">Correctness → diagnosability → survivability</p>
          <p className="app-author">Author: Robin yang</p>
        </div>
        <nav className="app-tabs" aria-label="Primary">
          {TAB_ORDER.map((id) => {
            const meta = TAB_META[id];
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                className="app-tab"
                data-active={isActive}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(id)}
              >
                {meta.shortLabel}
              </button>
            );
          })}
        </nav>
      </header>
      <div className="app-body app-body--full">
        <main className="app-main app-main--full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              style={{ minHeight: '100%' }}
            >
              <ActivePage />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
