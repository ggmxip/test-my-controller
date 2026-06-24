import { detectControllerType } from '../utils/controllerMapping';

function Trigger({ value, label, color }) {
  const pct = Math.round((value || 0) * 100);
  return (
    <div style={{ flex: 1, minWidth: '140px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
        <span style={{ color: '#aaa', fontWeight: 'bold' }}>{label}</span>
        <span style={{ color: pct > 0 ? color : '#666' }}>{pct}%</span>
      </div>
      <div style={{
        height: '24px',
        background: '#151525',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #2a2a3a',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}66, ${color})`,
          borderRadius: '12px',
          transition: 'width 0.05s ease',
          boxShadow: pct > 0 ? `0 0 12px ${color}66` : 'none',
        }} />
      </div>
    </div>
  );
}

export default function TriggerBar({ gamepad }) {
  if (!gamepad) return null;

  const type = detectControllerType(gamepad);
  const b = gamepad.buttons;

  const ltLabel = type === 'switch_pro' ? 'ZL' : type === 'ps5' || type === 'ps4' ? 'L2' : 'LT';
  const rtLabel = type === 'switch_pro' ? 'ZR' : type === 'ps5' || type === 'ps4' ? 'R2' : 'RT';

  // Buttons 6 and 7 are the analog triggers
  const lt = b[6]?.value || 0;
  const rt = b[7]?.value || 0;

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Triggers
      </h3>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Trigger value={lt} label={ltLabel} color="#ff9800" />
        <Trigger value={rt} label={rtLabel} color="#ff9800" />
      </div>
    </div>
  );
}
