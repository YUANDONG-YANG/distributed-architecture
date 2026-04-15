import { motion } from 'framer-motion';
import { useTrafficStore } from '../../store/trafficStore.js';
import { TRAFFIC } from '../../data/trafficConfig.js';
import { TrafficLayerCard } from './TrafficLayerCard.jsx';
import { TrafficParticleStream } from './TrafficParticleStream.jsx';
import { TrafficOutcomeStrip } from './TrafficOutcomeStrip.jsx';

/** Pass rate as percentage string; safe for denominator 0. */
function fmtPassRate(numerator, denominator) {
  if (denominator == null || denominator <= 0 || numerator == null) return '—';
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function Metric({ label, value }) {
  const isNum = typeof value === 'number';
  const show = value !== null && value !== undefined && (isNum || value !== '');
  return (
    <div className="traffic-metric">
      <span className="traffic-metric__k">{label}</span>
      <span className="traffic-metric__v">
        {show ? (
          isNum ? (
            <motion.span
              key={value}
              initial={{ opacity: 0.35, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {value}
            </motion.span>
          ) : (
            value
          )
        ) : (
          '—'
        )}
      </span>
    </div>
  );
}

export function TrafficFlowView() {
  const currentLayer = useTrafficStore((s) => s.currentLayer);
  const simulationStatus = useTrafficStore((s) => s.simulationStatus);
  const incoming = useTrafficStore((s) => s.totalRequests);
  const gatewayIncoming = useTrafficStore((s) => s.gatewayIncoming);
  const authDenied = useTrafficStore((s) => s.authDenied);
  const rateLimited = useTrafficStore((s) => s.rateLimited);
  const policyDenied = useTrafficStore((s) => s.policyDenied);
  const gatewayAdmitted = useTrafficStore((s) => s.gatewayAdmitted);

  const filterIncoming = useTrafficStore((s) => s.filterIncoming);
  const filterInvalid = useTrafficStore((s) => s.filterInvalid);
  const filterPassed = useTrafficStore((s) => s.filterPassed);

  const elasticIncoming = useTrafficStore((s) => s.elasticIncoming);
  const processedInline = useTrafficStore((s) => s.processedInline);
  const queuedForIsolation = useTrafficStore((s) => s.queuedForIsolation);
  const serviceInstances = useTrafficStore((s) => s.serviceInstances);
  const scaleAction = useTrafficStore((s) => s.scaleAction);

  const isolationIncoming = useTrafficStore((s) => s.isolationIncoming);
  const breakerState = useTrafficStore((s) => s.breakerState);
  const breakerBlocked = useTrafficStore((s) => s.breakerBlocked);
  const pathToIsolationOut = useTrafficStore((s) => s.pathToIsolationOut);
  const fallbackTriggered = useTrafficStore((s) => s.fallbackTriggered);

  const phaseIndex = useTrafficStore((s) => s.phaseIndex);
  const scalingEnabled = useTrafficStore((s) => s.scalingEnabled);

  const hasData = simulationStatus !== 'idle';

  const showFilter = hasData && phaseIndex >= 2;
  const showService = hasData && phaseIndex >= 3;
  const showBreaker = hasData && phaseIndex >= 4;
  const showGatewaySplit = hasData && phaseIndex >= 1;

  return (
    <div className="traffic-flow-root">
      <p className="traffic-unit-banner">
        <strong>Units:</strong> one <strong>{TRAFFIC.windowLabel}</strong> at <strong>{TRAFFIC.ingressQpsDisplay} QPS</strong>
        {hasData ? (
          <>
            {' '}
            → <strong>{incoming.toLocaleString('en-US')}</strong> requests in this run&apos;s window; average rate ≈{' '}
            <strong>{(incoming / TRAFFIC.windowSeconds).toLocaleString('en-US')} req/s</strong>.
          </>
        ) : (
          <>
            {' '}
            → <strong>{TRAFFIC.normalTotal.toLocaleString('en-US')}</strong> requests for a normal run (surge uses a
            larger window volume).
          </>
        )}{' '}
        All tier counts are reconciled on that same window volume.
      </p>

      <div className="traffic-stack-outer">
        <div className="traffic-stack" aria-label="Traffic defense stack">
          <TrafficLayerCard
            title="Incoming Traffic"
            subtitle={`Synthetic load · req / ${TRAFFIC.windowSeconds}s window`}
            tone="ingress"
            active={hasData && currentLayer === 'ingress'}
          >
            <Metric
              label={`req / ${TRAFFIC.windowSeconds}s`}
              value={hasData ? `${incoming}/${TRAFFIC.windowSeconds}s` : null}
            />
            <Metric label="pass rate (reference cohort)" value={hasData && incoming > 0 ? fmtPassRate(incoming, incoming) : null} />
          </TrafficLayerCard>

          <TrafficLayerCard
            title="Gateway"
            subtitle="Auth · Rate limit · Token bucket (split rejects by semantics)"
            subtitleClassName="traffic-layer__subtitle--shimmer-gateway"
            tone="gateway"
            active={currentLayer === 'gateway'}
            dense
          >
            <Metric label={`admitted (to filter)`} value={showGatewaySplit ? gatewayAdmitted : null} />
            <Metric label="auth denied" value={showGatewaySplit ? authDenied : null} />
            <Metric label="rate limited" value={showGatewaySplit ? rateLimited : null} />
            <Metric label="policy denied" value={showGatewaySplit ? policyDenied : null} />
            <Metric
              label="pass rate (admitted / ingress)"
              value={showGatewaySplit ? fmtPassRate(gatewayAdmitted, gatewayIncoming) : null}
            />
            {showGatewaySplit ? (
              <p className="traffic-conservation-note">
                Check: auth + rate + policy + admitted = {authDenied + rateLimited + policyDenied + gatewayAdmitted} =
                ingress ({gatewayIncoming})
              </p>
            ) : null}
          </TrafficLayerCard>

          <TrafficLayerCard
            title="Service Layer"
            subtitle="Business validation · elastic capacity · isolation/breaker (same tier, different mechanisms)"
            tone="service"
            active={
              currentLayer === 'filter' ||
              currentLayer === 'service' ||
              currentLayer === 'breaker' ||
              currentLayer === 'db'
            }
            dense
            bodyClassName="traffic-layer__body--service-combo"
          >
            {!hasData ? (
              <p className="traffic-layer__idle-hint" role="status">
                Run <strong>Simulate Normal Traffic</strong> to step through reconciled metrics.
              </p>
            ) : phaseIndex < 2 ? (
              <p className="traffic-layer__idle-hint" role="status">
                Advancing through ingress — service-tier metrics appear next.
              </p>
            ) : (
              <>
                {showFilter ? (
                  <>
                    <span className="traffic-layer__subhead traffic-layer__subhead--shimmer-filter">
                      Business filter / validation
                    </span>
                    <Metric label="incoming (from gateway)" value={filterIncoming} />
                    <Metric label="malformed / invalid" value={filterInvalid} />
                    <Metric label="passed" value={filterPassed} />
                    <Metric
                      label="pass rate (passed / gateway admitted)"
                      value={showFilter ? fmtPassRate(filterPassed, filterIncoming) : null}
                    />
                  </>
                ) : null}
                {showService ? (
                  <>
                    <span className="traffic-layer__subhead traffic-layer__subhead--section traffic-layer__subhead--shimmer-elastic">
                      {scalingEnabled ? 'Elastic scale-out' : 'Capacity ceiling · backlog'}
                    </span>
                    <Metric
                      label={
                        scalingEnabled
                          ? 'handled inline (scaled fleet, this window)'
                          : 'overflow / not admitted inline (same window)'
                      }
                      value={processedInline}
                    />
                    <Metric
                      label={
                        scalingEnabled
                          ? 'backlog / deferred (not used when scaled)'
                          : 'toward isolation (capped by floor capacity)'
                      }
                      value={queuedForIsolation}
                    />
                    <Metric
                      label="check (inline + backlog = elastic)"
                      value={
                        showService
                          ? processedInline + queuedForIsolation === elasticIncoming
                            ? '✓'
                            : '✗'
                          : null
                      }
                    />
                    <Metric label="instances (replicas)" value={serviceInstances} />
                    <Metric label="scale / capacity note" value={scaleAction} />
                    <Metric
                      label="pass rate (inline + backlog / elastic workload)"
                      value={
                        showService && elasticIncoming > 0
                          ? fmtPassRate(processedInline + queuedForIsolation, elasticIncoming)
                          : null
                      }
                    />
                  </>
                ) : null}
                {showBreaker ? (
                  <>
                    <span className="traffic-layer__subhead traffic-layer__subhead--section traffic-layer__subhead--nested traffic-layer__subhead--shimmer-isolation">
                      Isolation / breaker
                    </span>
                    <Metric label="breaker state" value={breakerState} />
                    <Metric label="incoming to isolation" value={isolationIncoming} />
                    <Metric label="blocked (open/half-open)" value={breakerBlocked} />
                    <Metric label="passed (to core path)" value={pathToIsolationOut} />
                    <Metric label="fallback pressure" value={fallbackTriggered ? 'yes' : 'no'} />
                    <Metric
                      label="pass rate (to core path / isolation incoming)"
                      value={showBreaker ? fmtPassRate(pathToIsolationOut, isolationIncoming) : null}
                    />
                  </>
                ) : null}
              </>
            )}
          </TrafficLayerCard>
        </div>
        <div className="traffic-stack-rail" aria-hidden>
          <TrafficParticleStream />
        </div>
      </div>

      <TrafficOutcomeStrip />
    </div>
  );
}
