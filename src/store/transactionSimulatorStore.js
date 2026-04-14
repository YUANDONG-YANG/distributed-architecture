import { create } from 'zustand';
import { NODE_IDS as N } from '../data/transactionFlowData.js';
import { HAPPY_PATH, edgeIdBetween, getPhaseForNode } from '../engine/transactionEngine.js';

/** Module-scoped: advancer loop must survive React StrictMode / tab layout remounts. */
let happyPathTimer = null;

function clearHappyPathTimer() {
  if (happyPathTimer != null) {
    clearTimeout(happyPathTimer);
    happyPathTimer = null;
  }
}

const initialNodeStatuses = () => {
  const o = {};
  Object.values(N).forEach((id) => {
    o[id] = 'idle';
  });
  return o;
};

const defaultState = () => ({
  currentPhase: null,
  currentStep: 0,
  activeNodeId: null,
  activeEdgeIds: [],
  transactionStatus: 'idle',
  isPaused: false,
  isRunning: false,
  failureInjected: false,
  retryCount: 0,
  /** After this many simulated re-consume attempts, the next failure routes to DLQ. */
  retryLimit: 1,
  reachedDLQ: false,
  replayTriggered: false,
  completed: false,
  eventPublished: false,
  consumerSucceeded: false,
  manualRecoveryStarted: false,
  logsTimeline: [],
  /** last activated index in HAPPY_PATH, or -1 */
  currentIndex: -1,
  branch: 'happy',
  nodeStatuses: initialNodeStatuses(),
  /** Bumped when starting a standalone demo action; stale timeouts no-op. */
  interactionEpoch: 0,
  /** During manual replay: yellow path for DLQ re-queue chain. */
  manualReplayRoute: null,
});

export const useTransactionSimulatorStore = create((set, get) => {
  const scheduleHappyPathContinue = () => {
    clearHappyPathTimer();
    happyPathTimer = setTimeout(() => {
      happyPathTimer = null;
      const before = get();
      if (
        !before.isRunning ||
        before.isPaused ||
        before.transactionStatus !== 'running' ||
        before.branch !== 'happy'
      ) {
        return;
      }
      get().advanceStep();
      const after = get();
      if (
        !after.isRunning ||
        after.isPaused ||
        after.transactionStatus !== 'running' ||
        after.branch !== 'happy'
      ) {
        return;
      }
      scheduleHappyPathContinue();
    }, 700);
  };

  return {
  ...defaultState(),

  reset: () => {
    clearHappyPathTimer();
    set({ ...defaultState(), nodeStatuses: initialNodeStatuses() });
  },

  pause: () => {
    clearHappyPathTimer();
    set({ isPaused: true, transactionStatus: 'paused' });
  },

  resume: () => {
    const s = get();
    if (s.transactionStatus === 'paused') {
      set({ isPaused: false, transactionStatus: 'running' });
      scheduleHappyPathContinue();
    }
  },

  injectConsumerFailure: () => {
    set({ failureInjected: true });
    if (get().activeNodeId === N.consumer && get().branch === 'happy') {
      get()._failConsumerFromActive();
    }
  },

  _failConsumerFromActive: () => {
    clearHappyPathTimer();
    const edge = edgeIdBetween(N.consumer, N.retry);
    set((state) => ({
      branch: 'retry',
      transactionStatus: 'failed',
      activeNodeId: N.retry,
      currentPhase: getPhaseForNode(N.retry),
      activeEdgeIds: edge ? [edge] : [],
      isRunning: false,
      isPaused: true,
      nodeStatuses: {
        ...state.nodeStatuses,
        [N.consumer]: 'failed',
        [N.retry]: 'running',
      },
      logsTimeline: [...state.logsTimeline, { t: Date.now(), label: 'Consumer failed → Retry' }],
    }));
  },

  _bumpEpoch: () => {
    set((s) => ({ interactionEpoch: s.interactionEpoch + 1 }));
    return get().interactionEpoch;
  },

  /** Minimal “at Retry gate” snapshot for standalone Trigger Retry (no Start Transaction required). */
  _seedRetryDemoGate: () => {
    set({
      branch: 'retry',
      transactionStatus: 'failed',
      activeNodeId: N.retry,
      currentPhase: getPhaseForNode(N.retry),
      retryCount: 0,
      reachedDLQ: false,
      failureInjected: false,
      completed: false,
      activeEdgeIds: [],
      isRunning: false,
      isPaused: true,
      nodeStatuses: {
        ...initialNodeStatuses(),
        [N.consumer]: 'failed',
        [N.retry]: 'running',
      },
    });
  },

  _applySendToDLQ: () => {
    const e = edgeIdBetween(N.retry, N.dlq);
    set((state) => ({
      branch: 'dlq',
      reachedDLQ: true,
      transactionStatus: 'dlq',
      activeNodeId: N.dlq,
      currentPhase: getPhaseForNode(N.dlq),
      isRunning: false,
      isPaused: true,
      activeEdgeIds: e ? [e] : [],
      nodeStatuses: {
        ...state.nodeStatuses,
        [N.retry]: 'success',
        [N.dlq]: 'dlq',
      },
      logsTimeline: [...state.logsTimeline, { t: Date.now(), label: 'DLQ' }],
    }));
  },

  startTransaction: () => {
    clearHappyPathTimer();
    set({
      ...defaultState(),
      nodeStatuses: initialNodeStatuses(),
      isRunning: true,
      isPaused: false,
      transactionStatus: 'running',
      currentIndex: -1,
      branch: 'happy',
      logsTimeline: [{ t: Date.now(), label: 'Transaction started' }],
    });
    get().advanceStep();
    scheduleHappyPathContinue();
  },

  advanceStep: () => {
    const s = get();
    if (!s.isRunning || s.isPaused) return;

    if (s.branch === 'happy') {
      const nextIndex = s.currentIndex + 1;
      if (nextIndex >= HAPPY_PATH.length) {
        const last = HAPPY_PATH[HAPPY_PATH.length - 1];
        set((state) => ({
          completed: true,
          consumerSucceeded: true,
          transactionStatus: 'completed',
          isRunning: false,
          activeNodeId: null,
          activeEdgeIds: [],
          nodeStatuses: { ...state.nodeStatuses, [last]: 'success' },
          logsTimeline: [...state.logsTimeline, { t: Date.now(), label: 'Completed' }],
        }));
        return;
      }

      const ns = { ...get().nodeStatuses };
      if (s.currentIndex >= 0) {
        const prevId = HAPPY_PATH[s.currentIndex];
        ns[prevId] = 'success';
      }

      const nodeId = HAPPY_PATH[nextIndex];
      const prevForEdge = nextIndex > 0 ? HAPPY_PATH[nextIndex - 1] : null;

      if (nodeId === N.consumer && get().failureInjected) {
        set({
          currentIndex: nextIndex,
          activeNodeId: N.consumer,
          currentPhase: getPhaseForNode(N.consumer),
          currentStep: nextIndex + 1,
          nodeStatuses: { ...ns, [N.consumer]: 'running' },
          activeEdgeIds: prevForEdge ? [edgeIdBetween(prevForEdge, N.consumer)].filter(Boolean) : [],
        });
        get()._failConsumerFromActive();
        return;
      }

      if (nodeId === N.publisher || nodeId === N.mq) set({ eventPublished: true });

      const edge = prevForEdge ? edgeIdBetween(prevForEdge, nodeId) : null;
      ns[nodeId] = 'running';

      set({
        currentIndex: nextIndex,
        activeNodeId: nodeId,
        currentPhase: getPhaseForNode(nodeId),
        currentStep: nextIndex + 1,
        activeEdgeIds: edge ? [edge] : [],
        nodeStatuses: ns,
        consumerSucceeded: nodeId === N.processLogDownstream,
      });

      set((state) => ({
        logsTimeline: [...state.logsTimeline, { t: Date.now(), label: nodeId }],
      }));
    }
  },

  /** Standalone: pauses the main chain, seeds Retry if needed, plays retry→consume→fail→DLQ. */
  triggerRetry: () => {
    clearHappyPathTimer();
    const epoch = get()._bumpEpoch();
    set({ isRunning: false, isPaused: true });

    let s = get();
    const needGate =
      s.branch !== 'retry' ||
      s.activeNodeId !== N.retry ||
      s.branch === 'dlq' ||
      s.reachedDLQ;
    if (needGate) {
      get()._seedRetryDemoGate();
      s = get();
    }

    const nextCount = s.retryCount + 1;
    if (nextCount > s.retryLimit) {
      get()._applySendToDLQ();
      return;
    }
    set({
      retryCount: nextCount,
      transactionStatus: 'retrying',
      branch: 'happy',
      isRunning: false,
      isPaused: true,
      failureInjected: false,
      currentIndex: HAPPY_PATH.indexOf(N.mq),
      currentPhase: getPhaseForNode(N.consumer),
      activeNodeId: N.consumer,
      activeEdgeIds: [edgeIdBetween(N.retry, N.consumer)].filter(Boolean),
      nodeStatuses: {
        ...get().nodeStatuses,
        [N.retry]: 'success',
        [N.consumer]: 'running',
      },
      logsTimeline: [...get().logsTimeline, { t: Date.now(), label: `Retry consume attempt ${nextCount}` }],
    });
    window.setTimeout(() => {
      if (get().interactionEpoch !== epoch) return;
      set((state) => ({
        branch: 'retry',
        transactionStatus: 'failed',
        activeNodeId: N.retry,
        currentPhase: getPhaseForNode(N.retry),
        activeEdgeIds: [edgeIdBetween(N.consumer, N.retry)].filter(Boolean),
        nodeStatuses: {
          ...state.nodeStatuses,
          [N.consumer]: 'failed',
          [N.retry]: 'running',
        },
        logsTimeline: [...state.logsTimeline, { t: Date.now(), label: 'Consumer failed after retry' }],
      }));
      window.setTimeout(() => {
        if (get().interactionEpoch !== epoch) return;
        const st = get();
        if (st.retryCount >= st.retryLimit) {
          get()._applySendToDLQ();
        } else {
          set({ activeEdgeIds: [] });
        }
      }, 420);
    }, 780);
  },

  /**
   * Standalone manual replay.
   * @param {'dlq' | 'guard'} route — `dlq`: highlight DLQ first, then DLQ → MQ → Consumer → downstream log; `guard`: Manual Ops → process log → full chain from Guard.
   */
  replayFromManualOps: (route = 'guard') => {
    clearHappyPathTimer();
    const mode = route === 'dlq' ? 'dlq' : 'guard';
    const epoch = get()._bumpEpoch();

    const baseReplayUpstreamNs = () => {
      const ns = initialNodeStatuses();
      for (const id of HAPPY_PATH) {
        if (id === N.consumer) break;
        ns[id] = 'success';
      }
      return ns;
    };

    if (mode === 'guard') {
      set((s) => ({
        branch: 'manual_replay',
        manualRecoveryStarted: true,
        replayTriggered: true,
        manualReplayRoute: null,
        transactionStatus: 'replaying',
        isRunning: false,
        isPaused: true,
        activeNodeId: N.manualOps,
        currentPhase: getPhaseForNode(N.manualOps),
        activeEdgeIds: [],
        nodeStatuses: {
          ...s.nodeStatuses,
          [N.manualOps]: 'running',
        },
        logsTimeline: [...s.logsTimeline, { t: Date.now(), label: 'Manual ops replay → from Guard' }],
      }));
      window.setTimeout(() => {
        if (get().interactionEpoch !== epoch) return;
        set((state) => ({
          activeNodeId: N.processLogManual,
          currentPhase: getPhaseForNode(N.processLogManual),
          activeEdgeIds: [edgeIdBetween(N.manualOps, N.processLogManual)].filter(Boolean),
          manualReplayRoute: 'guard',
          nodeStatuses: {
            ...state.nodeStatuses,
            [N.manualOps]: 'success',
            [N.processLogManual]: 'running',
          },
          logsTimeline: [...state.logsTimeline, { t: Date.now(), label: 'Manual process log' }],
        }));
      }, 520);
      window.setTimeout(() => {
        if (get().interactionEpoch !== epoch) return;
        const keepEpoch = get().interactionEpoch;
        set((state) => ({
          ...defaultState(),
          interactionEpoch: keepEpoch,
          manualReplayRoute: null,
          nodeStatuses: initialNodeStatuses(),
          isRunning: true,
          isPaused: false,
          transactionStatus: 'running',
          currentIndex: -1,
          branch: 'happy',
          logsTimeline: [...state.logsTimeline, { t: Date.now(), label: 'Replay from Guard' }],
        }));
        get().advanceStep();
        scheduleHappyPathContinue();
      }, 1120);
      return;
    }

    set((s) => ({
      branch: 'manual_replay',
      manualRecoveryStarted: true,
      replayTriggered: true,
      manualReplayRoute: 'dlq',
      transactionStatus: 'replaying',
      isRunning: false,
      isPaused: true,
      activeNodeId: N.dlq,
      currentPhase: getPhaseForNode(N.dlq),
      activeEdgeIds: [],
      nodeStatuses: {
        ...baseReplayUpstreamNs(),
        [N.dlq]: 'running',
      },
      logsTimeline: [...s.logsTimeline, { t: Date.now(), label: 'DLQ retry (start at DLQ)' }],
    }));

    window.setTimeout(() => {
      if (get().interactionEpoch !== epoch) return;

      set((state) => ({
        branch: 'happy',
        manualReplayRoute: 'dlq',
        transactionStatus: 'replaying',
        isRunning: false,
        isPaused: true,
        activeNodeId: N.mq,
        currentPhase: getPhaseForNode(N.mq),
        activeEdgeIds: [edgeIdBetween(N.dlq, N.mq)].filter(Boolean),
        currentIndex: HAPPY_PATH.indexOf(N.mq),
        nodeStatuses: { ...baseReplayUpstreamNs(), [N.dlq]: 'success', [N.mq]: 'running' },
        logsTimeline: [...state.logsTimeline, { t: Date.now(), label: 'DLQ → MQ (re-queue)' }],
      }));

      window.setTimeout(() => {
        if (get().interactionEpoch !== epoch) return;
        set((state) => ({
          activeNodeId: N.consumer,
          currentPhase: getPhaseForNode(N.consumer),
          activeEdgeIds: [edgeIdBetween(N.mq, N.consumer)].filter(Boolean),
          currentIndex: HAPPY_PATH.indexOf(N.consumer),
          nodeStatuses: {
            ...state.nodeStatuses,
            [N.mq]: 'success',
            [N.consumer]: 'running',
          },
          logsTimeline: [...state.logsTimeline, { t: Date.now(), label: 'MQ → Consumer' }],
        }));
      }, 520);

      window.setTimeout(() => {
        if (get().interactionEpoch !== epoch) return;
        set((state) => ({
          activeNodeId: N.processLogDownstream,
          currentPhase: getPhaseForNode(N.processLogDownstream),
          activeEdgeIds: [edgeIdBetween(N.consumer, N.processLogDownstream)].filter(Boolean),
          nodeStatuses: {
            ...state.nodeStatuses,
            [N.consumer]: 'success',
            [N.processLogDownstream]: 'running',
          },
          logsTimeline: [...state.logsTimeline, { t: Date.now(), label: 'Consumer → downstream log' }],
        }));
      }, 1040);

      window.setTimeout(() => {
        if (get().interactionEpoch !== epoch) return;
        set((state) => ({
          activeNodeId: null,
          activeEdgeIds: [],
          manualReplayRoute: null,
          transactionStatus: 'idle',
          branch: 'happy',
          nodeStatuses: {
            ...state.nodeStatuses,
            [N.processLogDownstream]: 'success',
          },
          logsTimeline: [...state.logsTimeline, { t: Date.now(), label: 'DLQ retry path completed' }],
        }));
      }, 1560);
    }, 560);
  },
  };
});
