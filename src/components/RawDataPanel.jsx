import { useState } from 'react';

export default function RawDataPanel({ gamepad }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ marginBottom: '16px' }}>
      <button onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', padding: '10px 16px', textAlign: 'left',
          background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '8px',
          color: '#aaa', cursor: 'pointer', fontSize: '14px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <span>Raw Gamepad Data</span>
        <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: expanded ? 'rotate(180deg)' : 'none' }}>▼</span>
      </button>
      {expanded && (
        <div style={{
          marginTop: '8px', padding: '16px', background: '#0a0a10',
          borderRadius: '8px', border: '1px solid #1a1a2e',
          fontFamily: 'monospace', fontSize: '12px', color: '#888',
          overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        }}>
          {gamepad ? (
            <>
              <div style={{ color: '#4caf50', marginBottom: '8px' }}>Gamepad #{gamepad.index}</div>
              <div>id: "{gamepad.id}"</div>
              <div>mapping: "{gamepad.mapping}"</div>
              <div>timestamp: {gamepad.timestamp}</div>
              <div>connected: {String(gamepad.connected)}</div>
              <div>axes: [{gamepad.axes.map((a, i) => `\n  ${i}: ${a.toFixed(4)}`).join('')}\n]</div>
              <div>buttons: [{gamepad.buttons.map((b, i) => `\n  ${i}: { pressed: ${b.pressed}, value: ${b.value.toFixed(4)} }`).join('')}\n]</div>
              <div style={{ marginTop: '8px', color: '#666' }}>
                vibrationActuator: {gamepad.vibrationActuator ? 'present' : 'none'}
              </div>
              <div style={{ color: '#666' }}>
                hapticActuators: {gamepad.hapticActuators ? `${gamepad.hapticActuators.length} available` : 'none'}
              </div>
            </>
          ) : (
            <div style={{ color: '#555' }}>No gamepad data available.</div>
          )}
        </div>
      )}
    </div>
  );
}
