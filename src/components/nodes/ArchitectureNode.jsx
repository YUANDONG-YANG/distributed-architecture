import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ArchitectureNodeGlyph } from './ArchitectureNodeGlyph.jsx';

function toneClass(status) {
  switch (status) {
    case 'success':
      return 'ok';
    case 'failed':
      return 'fail';
    case 'retrying':
      return 'retry';
    case 'dlq':
      return 'dlq';
    case 'replayed':
      return 'replay';
    case 'running':
      return 'running';
    case 'pending':
      return 'pending';
    default:
      return 'idle';
  }
}

export const ArchitectureNode = memo(({ data, selected }) => {
  const status = data.status ?? 'idle';
  const tone = toneClass(status);
  const nodeId = data.nodeId ?? '';

  const recoveryLit = Boolean(data.recoveryLit);

  return (
    <div
      className={`arch-node arch-node--${data.phase ?? 'local'} arch-node--${tone}${
        recoveryLit ? ' arch-node--recovery-lit' : ''
      }`}
      data-selected={selected}
    >
      <Handle id="t" type="target" position={Position.Top} />
      <Handle id="l" type="target" position={Position.Left} />
      <div className="arch-node__inner">
        <div className={`arch-node__glyph arch-node__glyph--${data.phase ?? 'local'}`}>
          <ArchitectureNodeGlyph nodeId={nodeId} />
        </div>
        <div className="arch-node__text">
          <div className="arch-node__title">{data.label}</div>
          <div className="arch-node__badge" data-badge={tone}>
            {status}
          </div>
        </div>
      </div>
      <Handle id="r" type="source" position={Position.Right} />
      <Handle id="b" type="source" position={Position.Bottom} />
    </div>
  );
});
