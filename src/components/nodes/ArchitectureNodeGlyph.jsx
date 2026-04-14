import { memo } from 'react';

const svgProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
};

/** Semantic glyphs for distributed transaction architecture nodes (inline SVG, no external assets). */
export const ArchitectureNodeGlyph = memo(function ArchitectureNodeGlyph({ nodeId }) {
  const stroke = (extra = {}) => ({ ...svgProps, stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', ...extra });

  switch (nodeId) {
    case 'guard':
      return (
        <svg {...stroke()}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'optimisticLock':
      return (
        <svg {...stroke()}>
          <rect x="5" y="11" width="14" height="10" rx="1.5" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case 'stateLog':
      return (
        <svg {...stroke()}>
          <ellipse cx="12" cy="5" rx="8" ry="2.5" />
          <path d="M4 5v6c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5V5" />
          <path d="M4 11v6c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5v-6" />
        </svg>
      );
    case 'domainEvent':
      return (
        <svg {...stroke()}>
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
        </svg>
      );
    case 'outbox':
      return (
        <svg {...stroke()}>
          <path d="M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9z" />
          <path d="M8 9V7a4 4 0 0 1 8 0v2" />
          <path d="M12 13v4" />
          <path d="M10 15h4" />
        </svg>
      );
    case 'processLogUpstream':
    case 'processLogDownstream':
      return (
        <svg {...stroke()}>
          <path d="M6 4h12v16H6z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );
    case 'processLogManual':
      return (
        <svg {...stroke({ strokeWidth: 1.45 })}>
          <path d="M6 4h10v16H6z" />
          <path d="M9 8h5M9 12h5M9 16h3" />
          <path d="M15 3l3 3-5 5-2 .5.5-2 5-5z" />
        </svg>
      );
    case 'commit':
      return (
        <svg {...stroke()}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8 12l2.5 2.5L16 9" />
        </svg>
      );
    case 'publisher':
      return (
        <svg {...stroke()}>
          <rect x="3" y="9" width="9" height="9" rx="1" />
          <path d="M12 13h6l2 2v3H12" />
          <path d="M7.5 6V4M6 5h3" />
        </svg>
      );
    case 'mq':
      return (
        <svg {...stroke()}>
          <rect x="4" y="4" width="4" height="16" rx="1" />
          <rect x="10" y="7" width="4" height="10" rx="1" />
          <rect x="16" y="5" width="4" height="14" rx="1" />
        </svg>
      );
    case 'consumer':
      return (
        <svg {...stroke()}>
          <path d="M4 8l8-4 8 4v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8z" />
          <path d="M12 11v5M9 14h6" />
        </svg>
      );
    case 'retry':
      return (
        <svg {...stroke()}>
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 21h5v-5" />
        </svg>
      );
    case 'dlq':
      return (
        <svg {...stroke({ strokeWidth: 1.45 })}>
          <path d="M4 7h16l-1.5 12H5.5L4 7z" />
          <path d="M9 11v4M12 10v5M15 11v4" />
          <path d="M10 4h4l1 3H9l1-3z" />
        </svg>
      );
    case 'manualOps':
      return (
        <svg {...stroke()}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    default:
      return (
        <svg {...stroke()}>
          <rect x="5" y="5" width="14" height="14" rx="2" />
        </svg>
      );
  }
});
