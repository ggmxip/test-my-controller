import { detectControllerType, getFaceButtonPositions } from '../utils/controllerMapping';

const btnStyle = (pressed, color = '#555', activeColor = '#4caf50') => ({
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '13px',
  fontWeight: 'bold',
  color: pressed ? '#000' : '#fff',
  background: pressed ? activeColor : color,
  border: pressed ? `2px solid ${activeColor}` : '2px solid #444',
  transition: 'all 0.08s ease',
  boxShadow: pressed ? `0 0 16px ${activeColor}80` : 'none',
  cursor: 'default',
  userSelect: 'none',
});

const dpadStyle = (pressed) => ({
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  background: pressed ? '#4caf50' : '#222',
  color: pressed ? '#000' : '#aaa',
  border: pressed ? '2px solid #4caf50' : '2px solid #444',
  borderRadius: '6px',
  transition: 'all 0.08s ease',
  cursor: 'default',
  userSelect: 'none',
});

const stickStyle = (x, y, label) => ({
  width: '52px',
  height: '52px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, #2a2a4a 0%, #1a1a2e 100%)',
  border: '2px solid #555',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  cursor: 'default',
});

const stickKnob = (x, y) => ({
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  background: '#4caf50',
  transform: `translate(${x * 12}px, ${y * 12}px)`,
  transition: 'transform 0.05s ease',
  boxShadow: '0 0 8px #4caf5066',
});

function DPad({ up, down, left, right }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
      <div style={dpadStyle(up)}>▲</div>
      <div style={{ display: 'flex', gap: '2px' }}>
        <div style={dpadStyle(left)}>◀</div>
        <div style={{ width: '36px', height: '36px' }} />
        <div style={dpadStyle(right)}>▶</div>
      </div>
      <div style={dpadStyle(down)}>▼</div>
    </div>
  );
}

function AnalogStick({ axes, index }) {
  const x = axes[index * 2] || 0;
  const y = axes[index * 2 + 1] || 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div style={stickStyle(x, y, index === 0 ? 'L' : 'R')}>
        <div style={stickKnob(x, y)} />
      </div>
      <div style={{ fontSize: '11px', color: '#888' }}>
        {index === 0 ? 'L' : 'R'}: {x.toFixed(2)}, {y.toFixed(2)}
      </div>
    </div>
  );
}

export default function ControllerDiagram({ gamepad }) {
  if (!gamepad) return null;

  const type = detectControllerType(gamepad);
  const faces = getFaceButtonPositions(type);
  const b = gamepad.buttons;

  return (
    <div style={{
      background: '#12121e',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #2a2a4a',
      marginBottom: '16px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '20px',
        alignItems: 'center',
        justifyItems: 'center',
      }}>
        {/* Left side: D-Pad */}
        <div style={{ justifySelf: 'center' }}>
          <div style={{ fontSize: '11px', color: '#666', textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>D-Pad</div>
          <DPad
            up={b[12]?.pressed}
            down={b[13]?.pressed}
            left={b[14]?.pressed}
            right={b[15]?.pressed}
          />
        </div>

        {/* Center: Select + Start */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Center</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              ...btnStyle(b[8]?.pressed, '#444', '#ff9800'),
              width: '36px', height: '36px', fontSize: '10px',
            }}>
              {type === 'switch_pro' ? '−' : type === 'xbox' ? '☰' : 'SHARE'}
            </div>
            <div style={{
              ...btnStyle(b[9]?.pressed, '#444', '#ff9800'),
              width: '36px', height: '36px', fontSize: '10px',
            }}>
              {type === 'switch_pro' ? '+' : 'MENU'}
            </div>
          </div>
          {b[16] !== undefined && (
            <div style={{
              ...btnStyle(b[16]?.pressed, '#333', '#f44336'),
              width: '36px', height: '36px', fontSize: '10px', marginTop: '4px',
            }}>
              HOME
            </div>
          )}
        </div>

        {/* Right side: Face Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '4px', justifyItems: 'center', alignItems: 'center' }}>
          <div />
          <div style={btnStyle(b[3]?.pressed, '#555', faces.top.color)}>{faces.top.label}</div>
          <div />
          <div style={btnStyle(b[2]?.pressed, '#555', faces.left.color)}>{faces.left.label}</div>
          <div style={{ width: '40px', height: '40px' }} />
          <div style={btnStyle(b[1]?.pressed, '#555', faces.right.color)}>{faces.right.label}</div>
          <div />
          <div style={btnStyle(b[0]?.pressed, '#555', faces.bottom.color)}>{faces.bottom.label}</div>
          <div />
        </div>
      </div>

      {/* Analog sticks row */}
      <div style={{
        display: 'flex', justifyContent: 'space-around', marginTop: '20px', paddingTop: '16px',
        borderTop: '1px solid #222',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#666', textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>Left Stick</div>
          <AnalogStick axes={gamepad.axes} index={0} />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#666', textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>Right Stick</div>
          <AnalogStick axes={gamepad.axes} index={1} />
        </div>
      </div>
    </div>
  );
}
