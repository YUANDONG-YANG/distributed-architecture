import { create } from 'zustand';
import { buildTrafficTimeline, scenarioTotal, zeroLayerFields } from '../engine/trafficEngine.js';

const baseToggles = () => ({
  gatewayEnabled: true,
  filterEnabled: true,
  scalingEnabled: true,
  breakerEnabled: true,
  resiliencePreset: 'default',
});

const zeroMetrics = () => ({
  ...zeroLayerFields(0),
  phaseIndex: -1,
  currentLayer: null,
  simulationStatus: 'idle',
  mode: 'normal',
  resiliencePreset: 'default',
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

  /** Stops stepped animation mid-run; keeps toggles and resilience preset (no full reset). */
  stopSimulation: () => {
    clearTrafficAnim();
    set((s) => ({
      ...zeroMetrics(),
      gatewayEnabled: s.gatewayEnabled,
      filterEnabled: s.filterEnabled,
      scalingEnabled: s.scalingEnabled,
      breakerEnabled: s.breakerEnabled,
      resiliencePreset: s.resiliencePreset,
      mode: 'normal',
    }));
  },

  toggleRateLimit: () => set((s) => ({ gatewayEnabled: !s.gatewayEnabled })),
  toggleBusinessFilter: () => set((s) => ({ filterEnabled: !s.filterEnabled })),
  toggleAutoScaling: () => set((s) => ({ scalingEnabled: !s.scalingEnabled })),
  toggleCircuitBreaker: () => set((s) => ({ breakerEnabled: !s.breakerEnabled })),

  applyBestResiliencePreset: () =>
    set({
      gatewayEnabled: true,
      filterEnabled: true,
      scalingEnabled: true,
      breakerEnabled: true,
      resiliencePreset: 'best',
    }),

  applyStandardPreset: () => set({ resiliencePreset: 'default' }),

  simulateNormalTraffic: () => {
    clearTrafficAnim();
    const total = scenarioTotal('normal');
    set((s) => ({
      ...zeroMetrics(),
      gatewayEnabled: s.gatewayEnabled,
      filterEnabled: s.filterEnabled,
      scalingEnabled: s.scalingEnabled,
      breakerEnabled: s.breakerEnabled,
      resiliencePreset: s.resiliencePreset,
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
      resiliencePreset: s.resiliencePreset,
      totalRequests: total,
      mode: 'surge',
    }));
    get()._runSimulation(total);
  },

  _runSimulation: (total) => {
    const { gatewayEnabled, filterEnabled, scalingEnabled, breakerEnabled, resiliencePreset } = get();
    const timeline = buildTrafficTimeline({
      totalRequests: total,
      rateLimitOn: gatewayEnabled,
      filterOn: filterEnabled,
      scalingOn: scalingEnabled,
      breakerOn: breakerEnabled,
      resiliencePreset,
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
