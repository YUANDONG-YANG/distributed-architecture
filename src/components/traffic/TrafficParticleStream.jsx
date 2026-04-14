import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTrafficStore } from '../../store/trafficStore.js';

/**
 * Lightweight downward “request” particles; density follows flowRemainder / total.
 */
export function TrafficParticleStream() {
  const simulationStatus = useTrafficStore((s) => s.simulationStatus);
  const mode = useTrafficStore((s) => s.mode);
  const totalRequests = useTrafficStore((s) => s.totalRequests) || 1;
  const flowRemainder = useTrafficStore((s) => s.flowRemainder);
  const currentLayer = useTrafficStore((s) => s.currentLayer);

  const active = simulationStatus === 'running' || simulationStatus === 'completed';

  const density = useMemo(() => {
    if (!active || !totalRequests) return 0.35;
    const r = Math.min(1.2, Math.max(0.12, flowRemainder / totalRequests));
    return 0.2 + r * 0.85;
  }, [active, flowRemainder, totalRequests]);

  const count = mode === 'surge' ? 32 : 16;

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        i,
        left: 6 + ((i * 37) % 88),
        dur: 2.15 + (i % 7) * 0.11,
        delay: (i * 0.09) % 1.8,
        hue: currentLayer === 'breaker' ? 'warn' : currentLayer === 'db' ? 'safe' : 'neutral',
      })),
    [count, currentLayer]
  );

  if (!active) return null;

  return (
    <div className="traffic-particle-stream" aria-hidden>
      <div className="traffic-particle-stream__glow" style={{ opacity: 0.12 + density * 0.25 }} />
      {particles.map((p) => (
        <motion.span
          key={p.i}
          className={`traffic-particle traffic-particle--${p.hue}`}
          style={{ left: `${p.left}%` }}
          initial={{ top: '-6%', opacity: 0.15 + density * 0.5 }}
          animate={{
            top: ['-6%', '106%'],
            opacity: [0.2 + density * 0.55, 0.05 + density * 0.12],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: 'linear',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
