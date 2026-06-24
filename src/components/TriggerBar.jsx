import { detectControllerType } from '../utils/controllerMapping';
import { getBestTriggerValue } from '../utils/axisDetection';

function Trigger({ value, label, color, sources }) {
  const pct = Math.round(Math.min(1, Math.max(0, value || 0)) * 100);
  return (
    <div style={{ flex: 1, minWidth: '140px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
        <span style={{ color: '#aaa', fontWeight: 'bold' }}>{label}</span>
        <span style={{ color: pct > 0 ? color : '#666' }}>{pct}%</span>
      </div>
      <div style={{
        height: '28px', background: '#151525', borderRadius: '12px', overflow: 'hidden',
        border: '1px solid #2a2a3a', position: 'relative',
      }}>
        <div style={{
          height: '100%', width: `${Math.min(100, pct)}%`,
          background: `linear-gradient(90deg, ${color}44, ${color})`,
          borderRadius: '12px', transition: 'width 0.04s ease',
          boxShadow: pct > 0 ? `0 0 10px ${color}44` : 'none',
        }} />
      </div>
      {sources && (
        <div style={{ fontSize: '10px', color: '#555', marginTop: '2px', textAlign: 'center' }}>
          {sources.btn > 0 && <span>Btn: {(sources.btn * 100).toFixed(0)}% </span>}
          {sources.axis > 0 && <span>Axis: {(sources.axis * 100).toFixed(0)}%</span>}
        </div>
      )}
    </div>
  );
}

export default function TriggerBar({ gamepad }) {
  if (!gamepad) return null;

  const type = detectControllerType(gamepad);
  const data = getBestTriggerValue(gamepad.axes, gamepad.buttons);

  const ltLabel = type === 'switch_pro' ? 'ZL' : type === 'ps5' || type === 'ps4' ? 'L2' : 'LT';
  const rtLabel = type === 'switch_pro' ? 'ZR' : type === 'ps5' || type === 'ps4' ? 'R2' : 'RT';

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Triggers
      </h3>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Trigger value={data.left} label={ltLabel} color="#ff9800"
          sources={{ btn: data.sources.buttonLeft, axis: data.sources.axisLeft }} />
        <Trigger value={data.right} label={rtLabel} color="#ff9800"
          sources={{ btn: data.sources.buttonRight, axis: data.sources.axisRight }} />
      </div>
    </div>
  );
}
