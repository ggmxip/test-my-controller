export default function ControllerSelector({ gamepads, activeIndex, onSelect }) {
  const indices = Object.keys(gamepads).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < 4; i++) {
    if (!indices.includes(i)) indices.push(i);
  }
  indices.sort((a, b) => a - b);
  const unique = [...new Set(indices)].slice(0, 4);

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
      {unique.map(idx => {
        const gp = gamepads[idx];
        const connected = !!gp;
        const isActive = idx === activeIndex && connected;
        return (
          <button
            key={idx}
            onClick={() => connected && onSelect(idx)}
            disabled={!connected}
            style={{
              flex: 1,
              minWidth: '100px',
              padding: '10px 16px',
              border: isActive ? '2px solid #4caf50' : '2px solid #333',
              borderRadius: '8px',
              background: isActive ? '#1a3a1a' : connected ? '#1a1a2e' : '#111',
              color: connected ? '#fff' : '#555',
              cursor: connected ? 'pointer' : 'default',
              fontSize: '14px',
              fontWeight: isActive ? 'bold' : 'normal',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '2px' }}>PLAYER {idx + 1}</div>
            <div>{connected ? gp.id.split('(')[0].trim() || 'Connected' : 'Not Connected'}</div>
          </button>
        );
      })}
    </div>
  );
}
