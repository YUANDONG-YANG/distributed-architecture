import { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { Background, MarkerType, useEdgesState, useNodesState } from 'reactflow';
import { ArchitectureNode } from '../nodes/ArchitectureNode.jsx';
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
  const colors = {
    local: '#38bdf8',
    dispatch: '#a78bfa',
    async: '#34d399',
    failure: '#f87171',
    replay: '#fbbf24',
  };
  return colors[kind] ?? '#94a3b8';
}

export function TransactionFlowCanvas() {
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
    setRfNodes(nodes);
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
    setRfEdges(edges);
  }, [edges, setRfEdges]);

  const onInit = useCallback((instance) => {
    instance.fitView({ padding: 0.15, maxZoom: 1.1 });
  }, []);

  return (
    <div className="txn-flow-wrap">
      <div className="txn-phase-tags" aria-hidden>
        <span style={{ top: 18 }}>Local Transaction Boundary</span>
        <span style={{ top: 158 }}>Event Dispatch</span>
        <span style={{ top: 288 }}>Async Processing</span>
        <span style={{ top: 418 }}>Failure Handling & Recovery</span>
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
        minZoom={0.4}
        maxZoom={1.4}
        onInit={onInit}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={18} size={1.2} color="rgba(148,163,184,0.08)" />
      </ReactFlow>
    </div>
  );
}
