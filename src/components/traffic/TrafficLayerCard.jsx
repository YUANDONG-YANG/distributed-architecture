import { motion } from 'framer-motion';

export function TrafficLayerCard({
  title,
  subtitle,
  tone,
  active,
  dense,
  bodyClassName = '',
  subtitleClassName = '',
  children,
}) {
  return (
    <motion.div
      className={`traffic-layer traffic-layer--${tone} ${active ? 'traffic-layer--active' : ''} ${dense ? 'traffic-layer--dense' : ''}`}
      layout
      transition={{ duration: 0.2 }}
    >
      <header className="traffic-layer__head">
        <div>
          <h3>{title}</h3>
          <p className={subtitleClassName.trim() || undefined}>{subtitle}</p>
        </div>
      </header>
      <div className={`traffic-layer__body ${bodyClassName}`.trim()}>{children}</div>
    </motion.div>
  );
}
