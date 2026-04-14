/** React Flow graph: four grouped phases, typed edges for path semantics. */

export const PHASE = {
  local: 'local',
  dispatch: 'dispatch',
  async: 'async',
  failure: 'failure',
};

export const NODE_IDS = {
  guard: 'guard',
  optimisticLock: 'optimisticLock',
  stateLog: 'stateLog',
  domainEvent: 'domainEvent',
  outbox: 'outbox',
  processLogUpstream: 'processLogUpstream',
  commit: 'commit',
  publisher: 'publisher',
  mq: 'mq',
  consumer: 'consumer',
  processLogDownstream: 'processLogDownstream',
  retry: 'retry',
  dlq: 'dlq',
  manualOps: 'manualOps',
  processLogManual: 'processLogManual',
};

const N = NODE_IDS;

export const NODE_PHASE = {
  [N.guard]: PHASE.local,
  [N.optimisticLock]: PHASE.local,
  [N.stateLog]: PHASE.local,
  [N.domainEvent]: PHASE.local,
  [N.outbox]: PHASE.local,
  [N.processLogUpstream]: PHASE.local,
  [N.commit]: PHASE.local,
  [N.publisher]: PHASE.dispatch,
  [N.mq]: PHASE.dispatch,
  [N.consumer]: PHASE.async,
  [N.processLogDownstream]: PHASE.async,
  [N.retry]: PHASE.failure,
  [N.dlq]: PHASE.failure,
  [N.manualOps]: PHASE.failure,
  [N.processLogManual]: PHASE.failure,
};

const groupStyle = (phase) => ({
  padding: '10px 12px',
  borderRadius: '12px',
  border: '1px solid rgba(148, 163, 184, 0.18)',
  background: 'rgba(15, 23, 42, 0.45)',
});

/**
 * Fixed card size + horizontal gap — keep in sync with `.arch-node` in global.css.
 * Rows with fewer nodes are centered inside `GROUP_INNER_W`.
 */
export const ARCH_NODE_LAYOUT = {
  width: 122,
  height: 76,
  gap: 14,
  groupInnerWidth: 980,
  rowY: 34,
};

const L = ARCH_NODE_LAYOUT;
const DX = L.width + L.gap;

function rowStartX(nodeCount) {
  const rowW = nodeCount * L.width + (nodeCount - 1) * L.gap;
  return Math.round((L.groupInnerWidth - rowW) / 2);
}

function xInRow(nodeCount, index) {
  return rowStartX(nodeCount) + index * DX;
}

const GROUP_H = 128;

export const PHASE_GROUPS = [
  {
    id: 'group-local',
    type: 'group',
    position: { x: 8, y: 8 },
    style: { width: L.groupInnerWidth, height: GROUP_H, ...groupStyle(PHASE.local) },
    data: { label: 'Local Transaction Boundary' },
    draggable: false,
    selectable: false,
  },
  {
    id: 'group-dispatch',
    type: 'group',
    position: { x: 8, y: 148 },
    style: { width: L.groupInnerWidth, height: GROUP_H, ...groupStyle(PHASE.dispatch) },
    data: { label: 'Event Dispatch' },
    draggable: false,
    selectable: false,
  },
  {
    id: 'group-async',
    type: 'group',
    position: { x: 8, y: 278 },
    style: { width: L.groupInnerWidth, height: GROUP_H, ...groupStyle(PHASE.async) },
    data: { label: 'Async Processing' },
    draggable: false,
    selectable: false,
  },
  {
    id: 'group-failure',
    type: 'group',
    position: { x: 8, y: 408 },
    style: { width: L.groupInnerWidth, height: GROUP_H, ...groupStyle(PHASE.failure) },
    data: { label: 'Failure Handling & Recovery' },
    draggable: false,
    selectable: false,
  },
];

const LOCAL_COUNT = 7;
const DISPATCH_COUNT = 2;
const ASYNC_COUNT = 2;
const FAILURE_COUNT = 4;

function nLocal(id, label, i) {
  return {
    id,
    type: 'architectureNode',
    position: { x: xInRow(LOCAL_COUNT, i), y: L.rowY },
    parentNode: 'group-local',
    extent: 'parent',
    data: {
      label,
      phase: PHASE.local,
      nodeId: id,
    },
  };
}

export const TRANSACTION_NODES = [
  ...PHASE_GROUPS,
  nLocal(N.guard, 'Guard', 0),
  nLocal(N.optimisticLock, 'Optimistic Lock', 1),
  nLocal(N.stateLog, 'State Log', 2),
  nLocal(N.domainEvent, 'Domain Event', 3),
  nLocal(N.outbox, 'Outbox', 4),
  nLocal(N.processLogUpstream, 'Process Log (Upstream)', 5),
  nLocal(N.commit, 'Commit', 6),
  {
    id: N.publisher,
    type: 'architectureNode',
    position: { x: xInRow(DISPATCH_COUNT, 0), y: L.rowY },
    parentNode: 'group-dispatch',
    extent: 'parent',
    data: { label: 'Publisher', phase: PHASE.dispatch, nodeId: N.publisher },
  },
  {
    id: N.mq,
    type: 'architectureNode',
    position: { x: xInRow(DISPATCH_COUNT, 1), y: L.rowY },
    parentNode: 'group-dispatch',
    extent: 'parent',
    data: { label: 'MQ', phase: PHASE.dispatch, nodeId: N.mq },
  },
  {
    id: N.consumer,
    type: 'architectureNode',
    position: { x: xInRow(ASYNC_COUNT, 0), y: L.rowY },
    parentNode: 'group-async',
    extent: 'parent',
    data: { label: 'Consumer', phase: PHASE.async, nodeId: N.consumer },
  },
  {
    id: N.processLogDownstream,
    type: 'architectureNode',
    position: { x: xInRow(ASYNC_COUNT, 1), y: L.rowY },
    parentNode: 'group-async',
    extent: 'parent',
    data: {
      label: 'Process Log (Downstream)',
      phase: PHASE.async,
      nodeId: N.processLogDownstream,
    },
  },
  {
    id: N.retry,
    type: 'architectureNode',
    position: { x: xInRow(FAILURE_COUNT, 0), y: L.rowY },
    parentNode: 'group-failure',
    extent: 'parent',
    data: { label: 'Retry', phase: PHASE.failure, nodeId: N.retry },
  },
  {
    id: N.dlq,
    type: 'architectureNode',
    position: { x: xInRow(FAILURE_COUNT, 1), y: L.rowY },
    parentNode: 'group-failure',
    extent: 'parent',
    data: { label: 'DLQ', phase: PHASE.failure, nodeId: N.dlq },
  },
  {
    id: N.manualOps,
    type: 'architectureNode',
    position: { x: xInRow(FAILURE_COUNT, 2), y: L.rowY },
    parentNode: 'group-failure',
    extent: 'parent',
    data: { label: 'Manual Ops', phase: PHASE.failure, nodeId: N.manualOps },
  },
  {
    id: N.processLogManual,
    type: 'architectureNode',
    position: { x: xInRow(FAILURE_COUNT, 3), y: L.rowY },
    parentNode: 'group-failure',
    extent: 'parent',
    data: {
      label: 'Process Log (Manual)',
      phase: PHASE.failure,
      nodeId: N.processLogManual,
    },
  },
];

function edge(id, s, t, kind, extra = {}) {
  const type = kind === 'local' ? 'straight' : 'smoothstep';
  return {
    id,
    source: s,
    target: t,
    type,
    animated: false,
    data: { kind },
    style: { strokeWidth: 2 },
    ...extra,
  };
}

export const TRANSACTION_EDGES = [
  edge('e1', N.guard, N.optimisticLock, 'local'),
  edge('e2', N.optimisticLock, N.stateLog, 'local'),
  edge('e3', N.stateLog, N.domainEvent, 'local'),
  edge('e4', N.domainEvent, N.outbox, 'local'),
  edge('e5', N.outbox, N.processLogUpstream, 'local'),
  edge('e6', N.processLogUpstream, N.commit, 'local'),
  edge('e7', N.commit, N.publisher, 'dispatch', { sourceHandle: 'b', targetHandle: 't' }),
  edge('e8', N.publisher, N.mq, 'dispatch'),
  edge('e9', N.mq, N.consumer, 'async', { sourceHandle: 'b', targetHandle: 't' }),
  edge('e10', N.consumer, N.processLogDownstream, 'async'),
  /** Topology: broker-level quarantine / poison routing (shown as reference paths on happy branch). */
  edge('e_mq_dlq', N.mq, N.dlq, 'failure', { sourceHandle: 'b', targetHandle: 't' }),
  edge('e_consumer_dlq', N.consumer, N.dlq, 'failure', { sourceHandle: 'b', targetHandle: 't' }),
  edge('e_fail', N.consumer, N.retry, 'failure', { sourceHandle: 'b', targetHandle: 't' }),
  edge('e_retry_cons', N.retry, N.consumer, 'failure', { sourceHandle: 'r', targetHandle: 'l' }),
  edge('e_retry_dlq', N.retry, N.dlq, 'failure'),
  edge('e_dlq_mq', N.dlq, N.mq, 'failure', { sourceHandle: 'b', targetHandle: 't' }),
  edge('e_manual_pl', N.manualOps, N.processLogManual, 'failure'),
];

export const TIMELINE_STEPS = [
  { id: 'guard', label: 'Guard' },
  { id: 'optimisticLock', label: 'Lock' },
  { id: 'stateLog', label: 'State Log' },
  { id: 'domainEvent', label: 'Domain Event' },
  { id: 'outbox', label: 'Outbox' },
  { id: 'processLogUpstream', label: 'Upstream Process Log' },
  { id: 'commit', label: 'Commit' },
  { id: 'publisher', label: 'Publisher' },
  { id: 'mq', label: 'MQ' },
  { id: 'consumer', label: 'Consumer' },
  { id: 'processLogDownstream', label: 'Downstream Process Log' },
  { id: 'retry', label: 'Retry' },
  { id: 'dlq', label: 'DLQ' },
  { id: 'manualOps', label: 'Manual Ops' },
  { id: 'processLogManual', label: 'Manual Process Log' },
];

export const NODE_INTERPRETATION = {
  [N.guard]: {
    title: 'Guard (State Machine)',
    problem: 'Invalid transitions and duplicate submissions.',
    why: 'Gates requests before mutable work; supports idempotency pre-check.',
    principle: 'State Audit',
  },
  [N.optimisticLock]: {
    title: 'Optimistic Lock',
    problem: 'Concurrent writers overwriting each other.',
    why: 'Version/CAS detects conflicts without long-held locks.',
    principle: 'Consistency under concurrency',
  },
  [N.stateLog]: {
    title: 'State Log',
    problem: 'No auditable trail inside the atomic boundary.',
    why: 'Co-located state history for inspection and replay.',
    principle: 'State Audit',
  },
  [N.domainEvent]: {
    title: 'Domain Event',
    problem: 'Tight coupling between mutation and propagation.',
    why: 'Explicit events separate domain change from async fan-out.',
    principle: 'Event modeling',
  },
  [N.outbox]: {
    title: 'Outbox',
    problem: 'DB committed but message never published (or vice versa).',
    why: 'Persists outbound intent in the same transaction as state.',
    principle: 'Atomic publish contract',
  },
  [N.processLogUpstream]: {
    title: 'Process Log (Upstream)',
    problem: 'Operations not traceable for replay or diagnosis.',
    why: 'Durable operation trail inside the service boundary.',
    principle: 'Operation Replayability',
  },
  [N.commit]: {
    title: 'Commit',
    problem: 'Half-applied business state.',
    why: 'Closes the local ACID boundary before external effects.',
    principle: 'Local atomicity',
  },
  [N.publisher]: {
    title: 'Publisher',
    problem: 'At-least-once delivery duplicates.',
    why: 'Reads outbox, publishes with ack + deduplication strategy.',
    principle: 'Reliable dispatch',
  },
  [N.mq]: {
    title: 'Message Queue',
    problem: 'Tight coupling and burst overload at consumers.',
    why: 'Buffers and decouples producers from consumer speed.',
    principle: 'Backpressure boundary',
  },
  [N.consumer]: {
    title: 'Consumer',
    problem: 'Duplicate deliveries and partial side effects.',
    why: 'Idempotent handlers with local transactions.',
    principle: 'Idempotent Consumption',
  },
  [N.processLogDownstream]: {
    title: 'Process Log (Downstream)',
    problem: 'Downstream work not reconstructable.',
    why: 'Captures execution for audit, retry, and replay.',
    principle: 'Operation Replayability',
  },
  [N.retry]: {
    title: 'Retry',
    problem: 'Transient faults would permanently fail business flow.',
    why: 'Idempotent backoff paths before quarantine.',
    principle: 'Recoverability',
  },
  [N.dlq]: {
    title: 'DLQ',
    problem: 'Poison messages block progress.',
    why: 'Converges failure for alerting and manual handling.',
    principle: 'Failure isolation',
  },
  [N.manualOps]: {
    title: 'Manual Ops',
    problem: 'Automation cannot safely reconcile edge cases.',
    why: 'Human-governed replay/compensation paths.',
    principle: 'Manual Recovery Path',
  },
  [N.processLogManual]: {
    title: 'Process Log (Manual)',
    problem: 'Human actions must be traceable.',
    why: 'Immutable record of intervention for compliance.',
    principle: 'Operation Replayability',
  },
};
