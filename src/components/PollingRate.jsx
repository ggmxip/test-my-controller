import { useState, useRef, useEffect } from 'react';

export default function PollingRate({ gamepad }) {
  const [rate, setRate] = useState(0);
  const [samples, setSamples] = useState([]);
  const lastTsRef = useRef(null);
  const timesRef = useRef([]);
  const frameRef = useRef(null);

  useEffect(() => {
    timesRef.current = [];
    lastTsRef.current = null;

    if (!gamepad) {
      setRate(0);
      setSamples([]);
      return;
    }

    const measure = () => {
      const gp = navigator.getGamepads?.()?.[gamepad.index];
      if (gp && gp.connected) {
        const ts = gp.timestamp;
        if (lastTsRef.current !== null && ts !== lastTsRef.current) {
          const delta = ts - lastTsRef.current;
          if (delta > 0 && delta < 100) {
            timesRef.current.push(delta);
            if (timesRef.current.length > 120) timesRef.current.shift();
          }
        }
        lastTsRef.current = ts;

        if (timesRef.current.length >= 10) {
          const avg = timesRef.current.reduce((a, b) => a + b, 0) / timesRef.current.length;
          setRate(Math.round(1000 / avg));
          setSamples([...timesRef.current.slice(-60)]);
        }
      }
      frameRef.current = requestAnimationFrame(measure);
    };

    frameRef.current = requestAnimationFrame(measure);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [gamepad?.index]);

  const maxSamples = 60;
  const barWidth = Math.min(4, 280 / maxSamples);

  const maxR = Math.max(...samples, 20);
  const avg = samples.length > 0 ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
  const jitter = samples.length > 0
    ? Math.round(Math.sqrt(samples.reduce((sum, v) => sum + (v - avg) ** 2, 0) / samples.length) * 10) / 10
    : 0;

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Polling Rate
      </h3>
      {!gamepad ? (
        <div style={{ color: '#555', fontSize: '13px' }}>Connect a controller to measure polling rate.</div>
      ) : (
        <div style={{
          background: '#12121e',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #2a2a4a',
        }}>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Rate</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: rate > 250 ? '#4caf50' : rate > 100 ? '#ff9800' : '#f44336' }}>
                {rate || '--'}
                <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal' }}> Hz</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Interval</div>
              <div style={{ fontSize: '18px', color: '#ccc' }}>
                {avg > 0 ? `${avg.toFixed(1)} ms` : '--'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Jitter (σ)</div>
              <div style={{ fontSize: '18px', color: jitter < 2 ? '#4caf50' : jitter < 5 ? '#ff9800' : '#f44336' }}>
                {samples.length > 0 ? `${jitter} ms` : '--'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Samples</div>
              <div style={{ fontSize: '18px', color: '#ccc' }}>{samples.length}</div>
            </div>
          </div>

          {samples.length > 0 && (
            <div style={{ height: '40px', display: 'flex', alignItems: 'flex-end', gap: '1px' }}>
              {samples.map((v, i) => {
                const h = (v / maxR) * 36;
                const stable = Math.abs(v - avg) < avg * 0.3;
                return (
                  <div key={i} style={{
                    width: `${barWidth}px`,
                    height: `${Math.max(2, h)}px`,
                    background: stable ? '#4caf50' : '#ff9800',
                    borderRadius: '1px 1px 0 0',
                    opacity: 0.7,
                    flexShrink: 0,
                  }} />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
