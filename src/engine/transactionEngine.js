import { NODE_IDS as N, NODE_PHASE } from '../data/transactionFlowData.js';

/** Ordered walk for the primary success path (through downstream process log). */
export const HAPPY_PATH = [
  N.guard,
  N.optimisticLock,
  N.stateLog,
  N.domainEvent,
  N.outbox,
  N.processLogUpstream,
  N.commit,
  N.publisher,
  N.mq,
  N.consumer,
  N.processLogDownstream,
];

export function getPhaseForNode(nodeId) {
  return NODE_PHASE[nodeId] ?? null;
}

export function edgeIdBetween(source, target) {
  const map = new Map([
    [`${N.guard}|${N.optimisticLock}`, 'e1'],
    [`${N.optimisticLock}|${N.stateLog}`, 'e2'],
    [`${N.stateLog}|${N.domainEvent}`, 'e3'],
    [`${N.domainEvent}|${N.outbox}`, 'e4'],
    [`${N.outbox}|${N.processLogUpstream}`, 'e5'],
    [`${N.processLogUpstream}|${N.commit}`, 'e6'],
    [`${N.commit}|${N.publisher}`, 'e7'],
    [`${N.publisher}|${N.mq}`, 'e8'],
    [`${N.mq}|${N.consumer}`, 'e9'],
    [`${N.consumer}|${N.processLogDownstream}`, 'e10'],
    [`${N.mq}|${N.dlq}`, 'e_mq_dlq'],
    [`${N.consumer}|${N.dlq}`, 'e_consumer_dlq'],
    [`${N.consumer}|${N.retry}`, 'e_fail'],
    [`${N.retry}|${N.consumer}`, 'e_retry_cons'],
    [`${N.retry}|${N.dlq}`, 'e_retry_dlq'],
    [`${N.dlq}|${N.mq}`, 'e_dlq_mq'],
    [`${N.manualOps}|${N.processLogManual}`, 'e_manual_pl'],
  ]);
  return map.get(`${source}|${target}`) ?? null;
}
