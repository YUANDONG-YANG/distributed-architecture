import { TRAFFIC } from '../data/trafficConfig.js';

/**
 * Deterministic, integer-conserving traffic projection.
 *
 * Units: every count is “requests in one evaluation window” (see TRAFFIC.windowSeconds).
 * Equivalent rate shown in UI as req/s = count / windowSeconds.
 *
 * Conservation:
 *  T = authDenied + rateLimited + policyDenied + gatewayAdmitted
 *  gatewayAdmitted = filterInvalid + filterPassed
 *  filterPassed = processedInline + queuedForIsolation
 *  Elastic scale-out: processedInline = filterPassed, queuedForIsolation = 0 (no backlog row).
 *  isolationIncoming (= filterPassed) = breakerBlocked + pathToIsolationOut
 *  pathToIsolationOut = cacheHitBypass + dbAdmitted   (no mystery loss)
 *
 * Outcome (same window T): full success + degraded success + hard rejected = T
 */

/**
 * @param {'default'|'best'} [resiliencePreset] — `best` shifts rejects earlier (stricter gateway & filter),
 *   slightly gentler core isolation, read-safe bypass tuned — optimized for survivability under DB ceiling.
 */
export function projectTraffic({
  totalRequests: T,
  rateLimitOn,
  filterOn,
  scalingOn,
  breakerOn,
  resiliencePreset = 'default',
}) {
  const W = TRAFFIC.windowSeconds;
  const best = resiliencePreset === 'best';

  let authDenied = 0;
  let rateLimited = 0;
  let policyDenied = 0;
  let gatewayAdmitted = T;

  if (rateLimitOn) {
    const admitRatio = best ? 0.56 : 0.62;
    gatewayAdmitted = Math.round(T * admitRatio);
    const drop = T - gatewayAdmitted;
    authDenied = Math.round(drop * 0.18);
    rateLimited = Math.round(drop * 0.68);
    policyDenied = drop - authDenied - rateLimited;
  }

  let filterInvalid = 0;
  let filterPassed = gatewayAdmitted;
  if (filterOn) {
    const invalidRatio = best ? 0.22 : 0.18;
    filterInvalid = Math.round(gatewayAdmitted * invalidRatio);
    filterPassed = gatewayAdmitted - filterInvalid;
  }

  const serviceCapacity = scalingOn ? 10 : 4;
  const cap = serviceCapacity * 42;
  let processedInline = 0;
  let queuedForIsolation = 0;
  if (scalingOn) {
    processedInline = filterPassed;
    queuedForIsolation = 0;
  } else if (filterPassed > cap) {
    queuedForIsolation = cap;
    processedInline = filterPassed - cap;
  } else {
    queuedForIsolation = filterPassed;
  }

  const scaleAction = scalingOn
    ? `replicas=${serviceCapacity} (${best ? 'best-resilience: elastic absorbs window' : 'scale-out headroom'})`
    : `replicas=${serviceCapacity} (floor; backlog capped at ${cap})`;

  const isolationIncoming = processedInline + queuedForIsolation;
  let breakerBlocked = 0;
  let pathToIsolationOut = isolationIncoming;

  if (breakerOn) {
    const breakerRatio = best ? 0.2 : 0.22;
    breakerBlocked = Math.round(isolationIncoming * breakerRatio);
    pathToIsolationOut = isolationIncoming - breakerBlocked;
  }

  /** Split core path: read-safe / degraded bypass vs primary write (ratio preset-tuned). */
  const bypassFrac = best ? 5 / 92 : 4 / 87;
  const cacheHitBypass = Math.max(0, Math.round(pathToIsolationOut * bypassFrac));
  const dbAdmitted = pathToIsolationOut - cacheHitBypass;

  const finalDbLoad = dbAdmitted;
  const dbLoadReduction = Math.max(0, T - finalDbLoad);

  const dbSafeCeilingWrites = TRAFFIC.dbSafeCeilingWrites;
  const corePressureRatio =
    dbSafeCeilingWrites > 0 ? finalDbLoad / dbSafeCeilingWrites : 0;
  const corePressureRatioPct = Math.round(corePressureRatio * 1000) / 10;
  const elevatedFloor = TRAFFIC.blastElevatedAboveRatio ?? 0.85;
  let blastRadiusLevel = 'Controlled';
  if (finalDbLoad > dbSafeCeilingWrites) {
    blastRadiusLevel = 'Critical';
  } else if (corePressureRatio > elevatedFloor) {
    blastRadiusLevel = 'Elevated';
  }

  /** Mutually exclusive partition of ingress T (conserved). */
  const outcomeFullSuccess = dbAdmitted;
  const outcomeDegradedSuccess = cacheHitBypass;
  const outcomeHardRejected = T - outcomeFullSuccess - outcomeDegradedSuccess;

  const protectionGainWrites = Math.max(0, T - finalDbLoad);

  let breakerState = 'closed';
  if (breakerOn && breakerBlocked > 0) {
    breakerState = breakerBlocked >= isolationIncoming * 0.5 ? 'open' : 'half-open';
  }

  return {
    totalRequests: T,
    windowSeconds: W,
    resiliencePreset,

    gatewayIncoming: T,
    authDenied,
    rateLimited,
    policyDenied,
    gatewayAdmitted,

    filterIncoming: gatewayAdmitted,
    filterInvalid,
    filterPassed,

    elasticIncoming: filterPassed,
    processedInline,
    queuedForIsolation,
    serviceInstances: serviceCapacity,
    scaleAction,

    isolationIncoming,
    breakerState,
    breakerBlocked,
    pathToIsolationOut,
    cacheHitBypass,
    dbAdmitted,
    finalDbLoad,
    dbLoadReduction,

    outcomeFullSuccess,
    outcomeDegradedSuccess,
    outcomeHardRejected,
    dbSafeCeilingWrites,
    corePressureRatioPct,
    blastRadiusLevel,
    protectionGainWrites,

    fallbackTriggered: breakerOn && breakerBlocked > 0,

    /** Legacy names for particle density / old panels */
    gatewayPassed: gatewayAdmitted,
    gatewayDropped: T - gatewayAdmitted,
    filterDropped: filterInvalid,
    serviceProcessed: filterPassed,
    serviceAbsorbed: processedInline,
    bufferedRequests: queuedForIsolation,
    serviceCapacity,
    breakerIncoming: isolationIncoming,
    breakerPassed: pathToIsolationOut,
    dbFinalLoad: finalDbLoad,
    flowRemainder: finalDbLoad,
  };
}

export function scenarioTotal(mode) {
  return mode === 'surge' ? TRAFFIC.surgeTotal : TRAFFIC.normalTotal;
}

/** Initial / reset shape; use with t=0 for idle store. */
export function zeroLayerFields(t) {
  return {
    totalRequests: t,
    windowSeconds: TRAFFIC.windowSeconds,
    gatewayIncoming: 0,
    authDenied: 0,
    rateLimited: 0,
    policyDenied: 0,
    gatewayAdmitted: 0,
    filterIncoming: 0,
    filterInvalid: 0,
    filterPassed: 0,
    elasticIncoming: 0,
    processedInline: 0,
    queuedForIsolation: 0,
    serviceInstances: 0,
    scaleAction: '—',
    isolationIncoming: 0,
    breakerState: 'closed',
    breakerBlocked: 0,
    pathToIsolationOut: 0,
    cacheHitBypass: 0,
    dbAdmitted: 0,
    finalDbLoad: 0,
    dbLoadReduction: 0,
    outcomeFullSuccess: 0,
    outcomeDegradedSuccess: 0,
    outcomeHardRejected: 0,
    dbSafeCeilingWrites: TRAFFIC.dbSafeCeilingWrites,
    corePressureRatioPct: 0,
    blastRadiusLevel: 'Controlled',
    protectionGainWrites: 0,
    gatewayPassed: 0,
    gatewayDropped: 0,
    filterDropped: 0,
    serviceProcessed: 0,
    serviceAbsorbed: 0,
    bufferedRequests: 0,
    serviceCapacity: 0,
    breakerIncoming: 0,
    breakerPassed: 0,
    flowRemainder: t,
    fallbackTriggered: false,
    resiliencePreset: 'default',
  };
}

export function buildTrafficTimeline(params) {
  const full = projectTraffic({
    resiliencePreset: 'default',
    ...params,
  });
  const t = full.totalRequests;
  const z = (over) => ({ ...zeroLayerFields(t), resiliencePreset: full.resiliencePreset, ...over });

  return [
    z({
      phaseIndex: 0,
      currentLayer: 'ingress',
      simulationStatus: 'running',
      gatewayIncoming: t,
      flowRemainder: t,
    }),
    z({
      phaseIndex: 1,
      currentLayer: 'gateway',
      simulationStatus: 'running',
      gatewayIncoming: t,
      authDenied: full.authDenied,
      rateLimited: full.rateLimited,
      policyDenied: full.policyDenied,
      gatewayAdmitted: full.gatewayAdmitted,
      gatewayPassed: full.gatewayPassed,
      gatewayDropped: full.gatewayDropped,
      flowRemainder: full.gatewayAdmitted,
    }),
    z({
      phaseIndex: 2,
      currentLayer: 'filter',
      simulationStatus: 'running',
      gatewayIncoming: t,
      authDenied: full.authDenied,
      rateLimited: full.rateLimited,
      policyDenied: full.policyDenied,
      gatewayAdmitted: full.gatewayAdmitted,
      gatewayPassed: full.gatewayPassed,
      gatewayDropped: full.gatewayDropped,
      filterIncoming: full.filterIncoming,
      filterInvalid: full.filterInvalid,
      filterPassed: full.filterPassed,
      filterDropped: full.filterDropped,
      flowRemainder: full.filterPassed,
    }),
    z({
      phaseIndex: 3,
      currentLayer: 'service',
      simulationStatus: 'running',
      gatewayIncoming: t,
      authDenied: full.authDenied,
      rateLimited: full.rateLimited,
      policyDenied: full.policyDenied,
      gatewayAdmitted: full.gatewayAdmitted,
      gatewayPassed: full.gatewayPassed,
      gatewayDropped: full.gatewayDropped,
      filterIncoming: full.filterIncoming,
      filterInvalid: full.filterInvalid,
      filterPassed: full.filterPassed,
      filterDropped: full.filterDropped,
      elasticIncoming: full.elasticIncoming,
      processedInline: full.processedInline,
      queuedForIsolation: full.queuedForIsolation,
      serviceInstances: full.serviceInstances,
      scaleAction: full.scaleAction,
      serviceProcessed: full.serviceProcessed,
      serviceAbsorbed: full.serviceAbsorbed,
      bufferedRequests: full.bufferedRequests,
      serviceCapacity: full.serviceCapacity,
      flowRemainder: full.filterPassed,
    }),
    z({
      phaseIndex: 4,
      currentLayer: 'breaker',
      simulationStatus: 'running',
      gatewayIncoming: t,
      authDenied: full.authDenied,
      rateLimited: full.rateLimited,
      policyDenied: full.policyDenied,
      gatewayAdmitted: full.gatewayAdmitted,
      gatewayPassed: full.gatewayPassed,
      gatewayDropped: full.gatewayDropped,
      filterIncoming: full.filterIncoming,
      filterInvalid: full.filterInvalid,
      filterPassed: full.filterPassed,
      filterDropped: full.filterDropped,
      elasticIncoming: full.elasticIncoming,
      processedInline: full.processedInline,
      queuedForIsolation: full.queuedForIsolation,
      serviceInstances: full.serviceInstances,
      scaleAction: full.scaleAction,
      serviceProcessed: full.serviceProcessed,
      serviceAbsorbed: full.serviceAbsorbed,
      bufferedRequests: full.bufferedRequests,
      serviceCapacity: full.serviceCapacity,
      isolationIncoming: full.isolationIncoming,
      breakerState: full.breakerState,
      breakerBlocked: full.breakerBlocked,
      pathToIsolationOut: full.pathToIsolationOut,
      breakerIncoming: full.breakerIncoming,
      breakerPassed: full.breakerPassed,
      fallbackTriggered: full.fallbackTriggered,
      flowRemainder: full.pathToIsolationOut,
    }),
    {
      ...zeroLayerFields(t),
      ...full,
      phaseIndex: 5,
      currentLayer: 'db',
      simulationStatus: 'completed',
      flowRemainder: full.finalDbLoad,
    },
  ];
}
