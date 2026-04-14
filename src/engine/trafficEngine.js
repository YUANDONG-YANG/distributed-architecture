import { TRAFFIC } from '../data/trafficConfig.js';

/** Deterministic layer reduction for resilience visualization. */
export function projectTraffic({
  totalRequests,
  rateLimitOn,
  filterOn,
  scalingOn,
  breakerOn,
}) {
  const incoming = totalRequests;

  let gatewayPassed = incoming;
  let gatewayDropped = 0;
  if (rateLimitOn) {
    gatewayPassed = Math.round(incoming * 0.62);
    gatewayDropped = incoming - gatewayPassed;
  }

  let filterPassed = gatewayPassed;
  let filterDropped = 0;
  if (filterOn) {
    filterDropped = Math.round(gatewayPassed * 0.18);
    filterPassed = gatewayPassed - filterDropped;
  }

  let bufferedRequests = filterPassed;
  const serviceCapacity = scalingOn ? 10 : 4;
  if (!scalingOn) {
    const cap = serviceCapacity * 42;
    if (bufferedRequests > cap) {
      bufferedRequests = cap;
    }
  }

  const serviceAbsorbed = Math.max(0, filterPassed - bufferedRequests);
  const serviceProcessed = filterPassed;

  let breakerPassed = bufferedRequests;
  let breakerBlocked = 0;
  if (breakerOn) {
    breakerBlocked = Math.round(bufferedRequests * 0.22);
    breakerPassed = bufferedRequests - breakerBlocked;
  }

  const dbFinalLoad = Math.max(0, Math.round(breakerPassed * 0.95));
  const fallbackTriggered = breakerOn && breakerBlocked > 0;

  return {
    totalRequests: incoming,
    incoming,
    gatewayPassed,
    gatewayDropped,
    filterPassed,
    filterDropped,
    bufferedRequests,
    serviceCapacity,
    serviceProcessed,
    serviceAbsorbed,
    breakerPassed,
    breakerBlocked,
    dbFinalLoad,
    fallbackTriggered,
  };
}

export function scenarioTotal(mode) {
  return mode === 'surge' ? TRAFFIC.surgeTotal : TRAFFIC.normalTotal;
}

/**
 * Ordered snapshots for stepped animation: each step reveals metrics up to that layer.
 * `flowRemainder` approximates in-flight volume toward DB (for particle density).
 */
export function buildTrafficTimeline(params) {
  const full = projectTraffic(params);
  const t = full.totalRequests;

  return [
    {
      phaseIndex: 0,
      currentLayer: 'ingress',
      simulationStatus: 'running',
      totalRequests: t,
      gatewayIncoming: t,
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
      flowRemainder: t,
    },
    {
      phaseIndex: 1,
      currentLayer: 'gateway',
      simulationStatus: 'running',
      totalRequests: t,
      gatewayIncoming: t,
      gatewayPassed: full.gatewayPassed,
      gatewayDropped: full.gatewayDropped,
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
      flowRemainder: full.gatewayPassed,
    },
    {
      phaseIndex: 2,
      currentLayer: 'filter',
      simulationStatus: 'running',
      totalRequests: t,
      gatewayIncoming: t,
      gatewayPassed: full.gatewayPassed,
      gatewayDropped: full.gatewayDropped,
      filterIncoming: full.gatewayPassed,
      filterPassed: full.filterPassed,
      filterDropped: full.filterDropped,
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
      flowRemainder: full.filterPassed,
    },
    {
      phaseIndex: 3,
      currentLayer: 'service',
      simulationStatus: 'running',
      totalRequests: t,
      gatewayIncoming: t,
      gatewayPassed: full.gatewayPassed,
      gatewayDropped: full.gatewayDropped,
      filterIncoming: full.gatewayPassed,
      filterPassed: full.filterPassed,
      filterDropped: full.filterDropped,
      serviceIncoming: full.filterPassed,
      serviceProcessed: full.serviceProcessed,
      serviceAbsorbed: full.serviceAbsorbed,
      bufferedRequests: full.bufferedRequests,
      serviceCapacity: full.serviceCapacity,
      breakerIncoming: 0,
      breakerPassed: 0,
      breakerBlocked: 0,
      fallbackTriggered: false,
      dbFinalLoad: 0,
      flowRemainder: full.bufferedRequests,
    },
    {
      phaseIndex: 4,
      currentLayer: 'breaker',
      simulationStatus: 'running',
      totalRequests: t,
      gatewayIncoming: t,
      gatewayPassed: full.gatewayPassed,
      gatewayDropped: full.gatewayDropped,
      filterIncoming: full.gatewayPassed,
      filterPassed: full.filterPassed,
      filterDropped: full.filterDropped,
      serviceIncoming: full.filterPassed,
      serviceProcessed: full.serviceProcessed,
      serviceAbsorbed: full.serviceAbsorbed,
      bufferedRequests: full.bufferedRequests,
      serviceCapacity: full.serviceCapacity,
      breakerIncoming: full.bufferedRequests,
      breakerPassed: full.breakerPassed,
      breakerBlocked: full.breakerBlocked,
      fallbackTriggered: full.fallbackTriggered,
      dbFinalLoad: 0,
      flowRemainder: full.breakerPassed,
    },
    {
      phaseIndex: 5,
      currentLayer: 'db',
      simulationStatus: 'completed',
      totalRequests: t,
      gatewayIncoming: t,
      gatewayPassed: full.gatewayPassed,
      gatewayDropped: full.gatewayDropped,
      filterIncoming: full.gatewayPassed,
      filterPassed: full.filterPassed,
      filterDropped: full.filterDropped,
      serviceIncoming: full.filterPassed,
      serviceProcessed: full.serviceProcessed,
      serviceAbsorbed: full.serviceAbsorbed,
      bufferedRequests: full.bufferedRequests,
      serviceCapacity: full.serviceCapacity,
      breakerIncoming: full.bufferedRequests,
      breakerPassed: full.breakerPassed,
      breakerBlocked: full.breakerBlocked,
      fallbackTriggered: full.fallbackTriggered,
      dbFinalLoad: full.dbFinalLoad,
      flowRemainder: full.dbFinalLoad,
    },
  ];
}
