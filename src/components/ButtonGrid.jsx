import { detectControllerType, getButtonLabels } from '../utils/controllerMapping';

export default function ButtonGrid({ gamepad }) {
  if (!gamepad) return null;

  const type = detectControllerType(gamepad);
  const labels = getButtonLabels(type);
  const b = gamepad.buttons;

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Buttons
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
        gap: '6px',
      }}>
        {b.slice(0, 17).map((btn, i) => (
          <div key={i} style={{
            padding: '8px 6px',
            borderRadius: '8px',
            textAlign: 'center',
            background: btn.pressed ? '#1a3a1a' : '#151525',
            border: btn.pressed ? '1px solid #4caf50' : '1px solid #2a2a3a',
            transition: 'all 0.08s ease',
            boxShadow: btn.pressed ? '0 0 10px #4caf5066' : 'none',
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: btn.pressed ? '#4caf50' : '#fff',
              marginBottom: '2px',
            }}>
              {labels[i] || `B${i}`}
            </div>
            <div style={{
              fontSize: '10px',
              color: btn.pressed ? '#4caf50' : '#555',
            }}>
              {btn.value.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
