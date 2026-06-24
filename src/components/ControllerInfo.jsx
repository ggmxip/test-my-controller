import { detectControllerType, getControllerDisplayName } from '../utils/controllerMapping';

export default function ControllerInfo({ gamepad }) {
  if (!gamepad) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}>🎮</div>
        <h2 style={{ margin: '0 0 8px', color: '#aaa' }}>No Controller Detected</h2>
        <p style={{ margin: 0, fontSize: '14px' }}>Connect a controller via USB or Bluetooth, then press any button.</p>
      </div>
    );
  }

  const type = detectControllerType(gamepad);
  const name = getControllerDisplayName(type, gamepad.id);

  const vendorMatch = gamepad.id.match(/vendor:\s*([0-9a-f]+)/i);
  const productMatch = gamepad.id.match(/product:\s*([0-9a-f]+)/i);

  return (
    <div style={{
      background: '#1a1a2e',
      borderRadius: '12px',
      padding: '16px 20px',
      marginBottom: '16px',
      border: '1px solid #2a2a4a',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Controller</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{name}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '13px', color: '#aaa' }}>
          <div>Player {gamepad.index + 1}</div>
          <div style={{ color: '#4caf50', fontSize: '12px' }}>● Connected</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap', fontSize: '12px', color: '#888' }}>
        <span>Type: <strong style={{ color: '#ccc' }}>{type}</strong></span>
        <span>Mapping: <strong style={{ color: '#ccc' }}>{gamepad.mapping || 'none'}</strong></span>
        {vendorMatch && <span>Vendor: <strong style={{ color: '#ccc' }}>{vendorMatch[1]}</strong></span>}
        {productMatch && <span>Product: <strong style={{ color: '#ccc' }}>{productMatch[1]}</strong></span>}
      </div>
    </div>
  );
}
