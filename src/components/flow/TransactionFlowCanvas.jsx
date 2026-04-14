import { useCallback, useMemo, useEffect, useRef } from 'react';
import ReactFlow, { Background, MarkerType, useEdgesState, useNodesState } from 'reactflow';
import { ArchitectureNode } from '../nodes/ArchitectureNode.jsx';
import { FLOW_PHASE_EDGE } from '../../data/flowPhaseColors.js';
import { TRANSACTION_EDGES, TRANSACTION_NODES } from '../../data/transactionFlowData.js';
import { useTransactionSimulatorStore } from '../../store/transactionSimulatorStore.js';

const nodeTypes = { architectureNode: ArchitectureNode };

function isRecoveryFlowEdge(edgeId, active, transactionStatus, branch, manualReplayRoute) {
  if (!active) return false;
  if (transactionStatus === 'retrying') return edgeId === 'e_retry_cons';
  if (transactionStatus === 'failed' && branch === 'retry') return edgeId === 'e_fail';
  if (transactionStatus === 'replaying' && manualReplayRoute === 'dlq') {
    return ['e_dlq_mq', 'e9', 'e10'].includes(edgeId);
  }
  if (transactionStatus === 'replaying' && manualReplayRoute === 'guard') {
    return edgeId === 'e_manual_pl';
  }
  return false;
}

function edgeStroke(kind, active, dim, recoveryGlow) {
  if (recoveryGlow && active) return '#fbbf24';
  if (!active) return dim ? 'rgba(100,116,139,0.55)' : 'rgba(148,163,184,0.22)';
  return FLOW_PHASE_EDGE[kind] ?? '#94a3b8';
}

export function TransactionFlowCanvas() {
  const wrapRef = useRef(null);
  const rfRef = useRef(null);

  const activeEdgeIds = useTransactionSimulatorStore((s) => s.activeEdgeIds);
  const nodeStatuses = useTransactionSimulatorStore((s) => s.nodeStatuses);
  const branch = useTransactionSimulatorStore((s) => s.branch);
  const transactionStatus = useTransactionSimulatorStore((s) => s.transactionStatus);
  const manualReplayRoute = useTransactionSimulatorStore((s) => s.manualReplayRoute);
  const activeNodeId = useTransactionSimulatorStore((s) => s.activeNodeId);

  const nodes = useMemo(
    () =>
      TRANSACTION_NODES.map((n) => {
        if (n.type === 'group') return n;
        const id = n.data?.nodeId;
        const recoveryLit =
          Boolean(id) &&
          activeNodeId === id &&
          (transactionStatus === 'retrying' || transactionStatus === 'replaying');
        return {
          ...n,
          data: {
            ...n.data,
            status: id ? nodeStatuses[id] : 'idle',
            recoveryLit,
          },
        };
      }),
    [nodeStatuses, activeNodeId, transactionStatus]
  );

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(nodes);
  useEffect(() => {
    setRfNodes((prev) =>
      nodes.map((n) => {
        const existing = prev.find((p) => p.id === n.id);
        if (!existing) return n;
        if (n.type === 'group') return { ...existing, ...n };
        return {
          ...existing,
          ...n,
          data: { ...n.data },
          position: existing.position,
        };
      })
    );
  }, [nodes, setRfNodes]);

  const edges = useMemo(() => {
    return TRANSACTION_EDGES.map((e) => {
      const active = activeEdgeIds.includes(e.id);
      const isFailurePath = e.data?.kind === 'failure' || e.data?.kind === 'replay';
      const dim = branch === 'happy' && isFailurePath && !active;
      const recoveryGlow = isRecoveryFlowEdge(e.id, active, transactionStatus, branch, manualReplayRoute);
      const stroke = edgeStroke(e.data?.kind, active, dim, recoveryGlow);
      return {
        ...e,
        className: recoveryGlow && active ? 'txn-edge--recovery' : undefined,
        animated: active,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 12,
          height: 12,
          color: stroke,
        },
        style: {
          ...e.style,
          stroke,
          strokeOpacity: dim ? 0.85 : 1,
          strokeWidth: recoveryGlow && active ? 2.5 : dim ? 1.5 : 2,
          strokeDasharray: dim ? '6 4' : undefined,
        },
      };
    });
  }, [activeEdgeIds, branch, transactionStatus, manualReplayRoute]);

  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(edges);
  useEffect(() => {
    setRfEdges((prev) =>
      edges.map((e) => {
        const existing = prev.find((p) => p.id === e.id);
        if (!existing) return e;
        return {
          ...existing,
          ...e,
          style: e.style,
          animated: e.animated,
          markerEnd: e.markerEnd,
          className: e.className,
        };
      })
    );
  }, [edges, setRfEdges]);

  /**
   * padding multiplies node bounds (see getViewportForBounds): 0 = use full pane width/height for zoom.
   * Higher maxZoom avoids capping scale when the graph is short/wide vs the viewport.
   */
  const fitOpts = useMemo(
    () => ({
      padding: 0,
      minZoom: 0.15,
      maxZoom: 2.5,
    }),
    []
  );

  /** Maximize graph in the flow pane (centered; uniform scale). Letterboxing only if graph vs pane aspect differs. */
  const fitViewFillPane = useCallback(
    (instance) => {
      instance.fitView(fitOpts);
    },
    [fitOpts]
  );

  const onInit = useCallback(
    (instance) => {
      rfRef.current = instance;
      fitViewFillPane(instance);
    },
    [fitViewFillPane]
  );

  /**
   * Refit only on real window resize — not on internal layout churn from buttons/store updates.
   * (visualViewport resize can fire on focus/zoom and re-run fitView unnecessarily.)
   */
  useEffect(() => {
    let debounceTimer;
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const scheduleFit = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 2) return;
      lastW = w;
      lastH = h;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const inst = rfRef.current;
        if (inst) fitViewFillPane(inst);
      }, 200);
    };

    window.addEventListener('resize', scheduleFit);

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener('resize', scheduleFit);
    };
  }, [fitViewFillPane]);

  return (
    <div className="txn-flow-wrap" ref={wrapRef}>
      <div className="txn-phase-tags" lang="en" aria-hidden>
        <div className="txn-phase-tags__box txn-phase-tags__box--1">
          <span className="txn-phase-tags__label txn-phase-tags__label--1">Local Transaction Boundary</span>
        </div>
        <div className="txn-phase-tags__box txn-phase-tags__box--2">
          <span className="txn-phase-tags__label txn-phase-tags__label--2">Event Dispatch</span>
        </div>
        <div className="txn-phase-tags__box txn-phase-tags__box--3">
          <span className="txn-phase-tags__label txn-phase-tags__label--3">Async Processing</span>
        </div>
        <div className="txn-phase-tags__box txn-phase-tags__box--4">
          <span className="txn-phase-tags__label txn-phase-tags__label--4">Failure Handling & Recovery</span>
        </div>
      </div>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling
        minZoom={0.15}
        maxZoom={2.5}
        onInit={onInit}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={18} size={1.2} color="rgba(148,163,184,0.08)" />
      </ReactFlow>
    </div>
  );
}
