import { useState, useRef, useCallback, useEffect } from 'react';
import { supportsVibration, vibrate, stopVibration } from '../utils/vibration';

const PATTERNS = [
  { name: 'Both Motors', weak: 1.0, strong: 1.0, dur: 1000 },
  { name: 'Weak Only', weak: 1.0, strong: 0.0, dur: 1000 },
  { name: 'Strong Only', weak: 0.0, strong: 1.0, dur: 1000 },
  { name: 'Pulse', weak: 0.5, strong: 0.5, dur: 200 },
  { name: 'Ramp Up', weak: 0.2, strong: 0.2, dur: 1500 },
  { name: 'Alternating', weak: 1.0, strong: 0.0, dur: 500 },
];

export default function VibrationTester({ gamepad }) {
  const [weakVal, setWeakVal] = useState(0.5);
  const [strongVal, setStrongVal] = useState(0.5);
  const [duration, setDuration] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('idle');
  const [continuous, setContinuous] = useState(false);
  const intervalRef = useRef(null);
  const gpRef = useRef(gamepad);
  gpRef.current = gamepad;

  const supported = gamepad ? supportsVibration(gamepad) : false;

  const doVibrate = useCallback(async (w, s, d) => {
    const gp = gpRef.current;
    if (!gp) return;
    setStatus('running');
    setIsRunning(true);
    await vibrate(gp, w, s, d);
    setStatus('idle');
    setIsRunning(false);
  }, []);

  const handleStop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const gp = gpRef.current;
    if (gp) stopVibration(gp);
    setIsRunning(false);
    setStatus('stopped');
    setTimeout(() => setStatus('idle'), 500);
  }, []);

  const handlePattern = useCallback(async (pattern) => {
    handleStop();
    await new Promise(r => setTimeout(r, 50));
    setWeakVal(pattern.weak);
    setStrongVal(pattern.strong);
    setDuration(pattern.dur);

    if (pattern.name === 'Ramp Up') {
      setStatus('running');
      setIsRunning(true);
      setContinuous(true);
      let step = 0;
      const gp = gpRef.current;
      if (!gp) return;
      intervalRef.current = setInterval(async () => {
        const t = (step % 10) / 10;
        const gp2 = gpRef.current;
        if (gp2) await vibrate(gp2, t, t, 150);
        step++;
        if (step >= 30) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          setStatus('idle');
          setContinuous(false);
        }
      }, 150);
      return;
    }

    if (pattern.name === 'Alternating') {
      setStatus('running');
      setIsRunning(true);
      setContinuous(true);
      let toggle = true;
      const gp = gpRef.current;
      if (!gp) return;
      intervalRef.current = setInterval(async () => {
        const gp2 = gpRef.current;
        if (gp2) {
          if (toggle) await vibrate(gp2, 1.0, 0.0, 500);
          else await vibrate(gp2, 0.0, 1.0, 500);
        }
        toggle = !toggle;
      }, 600);
      return;
    }

    if (pattern.name === 'Pulse') {
      setStatus('running');
      setIsRunning(true);
      let count = 0;
      const gp = gpRef.current;
      if (!gp) return;
      intervalRef.current = setInterval(async () => {
        const gp2 = gpRef.current;
        if (gp2) await vibrate(gp2, 0.5, 0.5, 200);
        count++;
        if (count >= 5) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          setStatus('idle');
        }
      }, 400);
      return;
    }

    await doVibrate(pattern.weak, pattern.strong, pattern.dur);
  }, [handleStop, doVibrate]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const gp = gpRef.current;
      if (gp) stopVibration(gp);
    };
  }, []);

  const activeStyle = (active) => active ? '1px solid #4caf50' : '1px solid #333';

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Vibration Test
      </h3>

      {!supported && gamepad && (
        <div style={{ padding: '12px', background: '#1a1a1a', borderRadius: '8px', color: '#888', fontSize: '13px', textAlign: 'center', border: '1px solid #333' }}>
          Vibration not supported on this controller/browser. Try Chrome or Edge.
        </div>
      )}

      {!gamepad && (
        <div style={{ padding: '12px', color: '#555', fontSize: '13px', textAlign: 'center' }}>
          Connect a controller to test vibration.
        </div>
      )}

      {supported && (
        <>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>Weak Motor (High-Freq): {weakVal.toFixed(2)}</div>
              <input type="range" min="0" max="1" step="0.01" value={weakVal}
                onChange={e => setWeakVal(parseFloat(e.target.value))}
                style={{ width: '100%' }} disabled={isRunning}
              />
            </div>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>Strong Motor (Low-Freq): {strongVal.toFixed(2)}</div>
              <input type="range" min="0" max="1" step="0.01" value={strongVal}
                onChange={e => setStrongVal(parseFloat(e.target.value))}
                style={{ width: '100%' }} disabled={isRunning}
              />
            </div>
            <div style={{ minWidth: '100px' }}>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>Duration (ms)</div>
              <select value={duration} onChange={e => setDuration(Number(e.target.value))}
                style={{
                  width: '100%', padding: '6px 8px', background: '#222', color: '#fff',
                  border: '1px solid #444', borderRadius: '6px', fontSize: '13px',
                }} disabled={isRunning}
              >
                <option value={200}>200 ms</option>
                <option value={500}>500 ms</option>
                <option value={1000}>1 sec</option>
                <option value={2000}>2 sec</option>
                <option value={5000}>5 sec</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {PATTERNS.map(p => (
              <button key={p.name} onClick={() => handlePattern(p)}
                style={{
                  padding: '6px 12px', border: '1px solid #333', borderRadius: '6px',
                  background: '#1a1a2e', color: '#ccc', cursor: 'pointer', fontSize: '12px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#4caf50'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#333'}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => doVibrate(weakVal, strongVal, duration)} disabled={isRunning}
              style={{
                padding: '8px 20px', border: 'none', borderRadius: '8px',
                background: isRunning ? '#333' : '#4caf50', color: isRunning ? '#666' : '#000',
                cursor: isRunning ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px',
                transition: 'all 0.2s',
              }}
            >
              {isRunning ? 'Running...' : 'Vibrate'}
            </button>
            <button onClick={handleStop} disabled={!isRunning}
              style={{
                padding: '8px 20px', border: '1px solid #f44336', borderRadius: '8px',
                background: 'transparent', color: isRunning ? '#f44336' : '#444',
                cursor: isRunning ? 'pointer' : 'not-allowed', fontSize: '13px',
                transition: 'all 0.2s',
              }}
            >
              Stop
            </button>
            <span style={{ fontSize: '12px', color: status === 'running' ? '#4caf50' : status === 'stopped' ? '#f44336' : '#666' }}>
              {status === 'idle' ? 'Ready' : status === 'running' ? '● Vibrating...' : '■ Stopped'}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
