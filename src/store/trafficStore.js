import { create } from 'zustand';
import { buildTrafficTimeline, scenarioTotal } from '../engine/trafficEngine.js';

const baseToggles = () => ({
  gatewayEnabled: true,
  filterEnabled: true,
  scalingEnabled: true,
  breakerEnabled: true,
});

const zeroMetrics = () => ({
  totalRequests: 0,
  phaseIndex: -1,
  currentLayer: null,
  gatewayIncoming: 0,
  gatewayPassed: 0,
  gatewayDropped: 0,
  filterIncoming: 0,
  filterPassed: 0,
  filterDropped: 0,
  serviceIncoming: 0,
  serviceProcessed: 0,
  serviceAbsorbed: 0,
  bufferedRequests: 0,
  serviceCapacity: 0,
  breakerIncoming: 0,
  breakerPassed: 0,
  breakerBlocked: 0,
  fallbackTriggered: false,
  dbFinalLoad: 0,
  flowRemainder: 0,
  simulationStatus: 'idle',
  mode: 'normal',
});

/** Clears stepped animation timeouts between runs. */
let trafficAnimIds = [];

function clearTrafficAnim() {
  trafficAnimIds.forEach((id) => clearTimeout(id));
  trafficAnimIds = [];
}

const STEP_MS = 400;

export const useTrafficStore = create((set, get) => ({
  ...baseToggles(),
  ...zeroMetrics(),

  reset: () => {
    clearTrafficAnim();
    set({ ...baseToggles(), ...zeroMetrics() });
  },

  toggleRateLimit: () => set((s) => ({ gatewayEnabled: !s.gatewayEnabled })),
  toggleBusinessFilter: () => set((s) => ({ filterEnabled: !s.filterEnabled })),
  toggleAutoScaling: () => set((s) => ({ scalingEnabled: !s.scalingEnabled })),
  toggleCircuitBreaker: () => set((s) => ({ breakerEnabled: !s.breakerEnabled })),

  simulateNormalTraffic: () => {
    clearTrafficAnim();
    const total = scenarioTotal('normal');
    set((s) => ({
      ...zeroMetrics(),
      gatewayEnabled: s.gatewayEnabled,
      filterEnabled: s.filterEnabled,
      scalingEnabled: s.scalingEnabled,
      breakerEnabled: s.breakerEnabled,
      totalRequests: total,
      mode: 'normal',
    }));
    get()._runSimulation(total);
  },

  simulateTrafficSurge: () => {
    clearTrafficAnim();
    const total = scenarioTotal('surge');
    set((s) => ({
      ...zeroMetrics(),
      gatewayEnabled: s.gatewayEnabled,
      filterEnabled: s.filterEnabled,
      scalingEnabled: s.scalingEnabled,
      breakerEnabled: s.breakerEnabled,
      totalRequests: total,
      mode: 'surge',
    }));
    get()._runSimulation(total);
  },

  _runSimulation: (total) => {
    const { gatewayEnabled, filterEnabled, scalingEnabled, breakerEnabled } = get();
    const timeline = buildTrafficTimeline({
      totalRequests: total,
      rateLimitOn: gatewayEnabled,
      filterOn: filterEnabled,
      scalingOn: scalingEnabled,
      breakerOn: breakerEnabled,
    });

    timeline.forEach((step, i) => {
      const id = setTimeout(() => {
        set((s) => ({
          ...s,
          ...step,
          totalRequests: total,
        }));
      }, i * STEP_MS);
      trafficAnimIds.push(id);
    });
  },
}));
