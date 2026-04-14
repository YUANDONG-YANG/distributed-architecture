import { create } from 'zustand';
import { EXPLANATIONS } from '../data/observabilityMockData.js';

const initial = () => ({
  incidentType: null,
  metricsStatus: 'normal',
  tracingActiveNode: null,
  tracingPath: [],
  requestId: null,
  orderId: null,
  relatedRequestIds: [],
  logLocated: false,
  rootCause: null,
  recoveryStarted: false,
  recoveryType: null,
  recoveryStatus: 'idle',
  systemRestored: false,
  currentLayer: null,
  scenarioRunning: false,
});

export const useObservabilityStore = create((set, get) => ({
  ...initial(),

  explanation: EXPLANATIONS.metrics,

  reset: () => set({ ...initial(), explanation: EXPLANATIONS.metrics }),

  setExplanationForLayer: (layerKey) => {
    const map = {
      metrics: EXPLANATIONS.metrics,
      tracing: EXPLANATIONS.tracing,
      logs: EXPLANATIONS.logs,
      recovery: EXPLANATIONS.recovery,
    };
    set({ explanation: map[layerKey] ?? EXPLANATIONS.metrics });
  },

  injectTimeout: () => get()._runScenario('timeout'),

  injectDependencyFailure: () => get()._runScenario('dependency'),

  injectErrorSpike: () => get()._runScenario('error'),

  _runScenario: (incidentType) => {
    if (get().scenarioRunning) return;
    set({ scenarioRunning: true, systemRestored: false, recoveryStatus: 'idle' });
    const rid = `req-${Math.random().toString(36).slice(2, 10)}`;
    const oid = `ord-${Math.random().toString(36).slice(2, 8)}`;
    const related = [`${rid}-a`, `${rid}-retry`];

    set({
      incidentType,
      metricsStatus: 'critical',
      currentLayer: 'metrics',
      tracingActiveNode: null,
      tracingPath: [],
      requestId: null,
      orderId: null,
      relatedRequestIds: [],
      logLocated: false,
      rootCause: null,
      recoveryStarted: false,
      explanation: EXPLANATIONS.metrics,
    });

    setTimeout(() => {
      set({
        currentLayer: 'tracing',
        tracingActiveNode: 'Orders',
        tracingPath: ['Gateway', 'Orders', 'Payments'],
        explanation: EXPLANATIONS.tracing,
      });
    }, 450);

    setTimeout(() => {
      set({
        currentLayer: 'logs',
        requestId: rid,
        orderId: oid,
        relatedRequestIds: related,
        logLocated: true,
        rootCause:
          incidentType === 'timeout'
            ? 'Downstream timeout from Payments'
            : incidentType === 'dependency'
              ? 'Unstable dependency: Legacy CRM'
              : 'Error spike: Orders validation failures',
        explanation: EXPLANATIONS.logs,
      });
    }, 900);

    setTimeout(() => {
      set({
        currentLayer: 'recovery',
        recoveryStarted: true,
        recoveryType: 'replay',
        recoveryStatus: 'running',
        explanation: EXPLANATIONS.recovery,
      });
    }, 1350);

    setTimeout(() => {
      set({
        recoveryStatus: 'completed',
        systemRestored: true,
        scenarioRunning: false,
        metricsStatus: 'normal',
        currentLayer: 'recovery',
      });
    }, 1850);
  },

  searchByRequestId: () => {
    const rid = get().requestId;
    if (!rid) return;
    set({ logLocated: true, currentLayer: 'logs', explanation: EXPLANATIONS.logs });
  },

  reconstructByOrderId: () => {
    const oid = get().orderId;
    if (!oid) return;
    set({
      relatedRequestIds: [`${oid}-r1`, `${oid}-r2-dlq`],
      logLocated: true,
      currentLayer: 'logs',
      explanation: EXPLANATIONS.logs,
    });
  },

  triggerReplay: () => {
    set({
      recoveryStarted: true,
      recoveryType: 'replay',
      recoveryStatus: 'running',
      currentLayer: 'recovery',
      explanation: EXPLANATIONS.recovery,
    });
    setTimeout(() => {
      set({ recoveryStatus: 'completed', systemRestored: true, metricsStatus: 'normal' });
    }, 700);
  },
}));
