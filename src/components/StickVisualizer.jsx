import { useState, useRef, useEffect } from 'react';

const SIZE = 180;
const CENTER = SIZE / 2;
const RADIUS = (SIZE / 2) - 12;

function StickCanvas({ axes, index, label, driftSamples, onDriftUpdate }) {
  const canvasRef = useRef(null);
  const trailRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const x = axes[index * 2] || 0;
    const y = axes[index * 2 + 1] || 0;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // Outer circle
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner deadzone circle
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS * 0.25, 0, Math.PI * 2);
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Crosshair
    ctx.beginPath();
    ctx.moveTo(CENTER - RADIUS, CENTER);
    ctx.lineTo(CENTER + RADIUS, CENTER);
    ctx.moveTo(CENTER, CENTER - RADIUS);
    ctx.lineTo(CENTER, CENTER + RADIUS);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Trail
    trailRef.current.push({ x, y });
    if (trailRef.current.length > 30) trailRef.current.shift();
    trailRef.current.forEach((p, i) => {
      const alpha = i / trailRef.current.length * 0.3;
      ctx.beginPath();
      ctx.arc(CENTER + p.x * RADIUS, CENTER + p.y * RADIUS, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(76, 175, 80, ${alpha})`;
      ctx.fill();
    });

    // Stick position
    const sx = CENTER + x * RADIUS;
    const sy = CENTER + y * RADIUS;

    ctx.beginPath();
    ctx.arc(sx, sy, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#4caf50';
    ctx.fill();
    ctx.strokeStyle = '#66bb6a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glow
    const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, 20);
    gradient.addColorStop(0, 'rgba(76, 175, 80, 0.3)');
    gradient.addColorStop(1, 'rgba(76, 175, 80, 0)');
    ctx.beginPath();
    ctx.arc(sx, sy, 20, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Drift tracking
    if (onDriftUpdate && Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
      onDriftUpdate(index, x, y);
    }
  }, [axes, index, onDriftUpdate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div style={{ fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>{label}</div>
      <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ borderRadius: '12px', background: '#0d0d16' }} />
      <div style={{ fontSize: '12px', color: '#888' }}>X: {(axes[index * 2] || 0).toFixed(3)} Y: {(axes[index * 2 + 1] || 0).toFixed(3)}</div>
    </div>
  );
}

export default function StickVisualizer({ gamepad, driftData, onDriftUpdate }) {
  if (!gamepad) return null;

  const axes = gamepad.axes;
  const drift = d => d || { offsetX: 0, offsetY: 0, severity: 'none' };

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Analog Sticks
      </h3>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {axes.length >= 2 && (
          <div>
            <StickCanvas axes={axes} index={0} label="Left Stick" driftSamples={driftData?.[0]} onDriftUpdate={onDriftUpdate} />
            {drift(driftData?.[0]).severity !== 'none' && (
              <div style={{ fontSize: '11px', color: '#ff9800', textAlign: 'center', marginTop: '4px' }}>
                Drift: {drift(driftData?.[0]).severity}
              </div>
            )}
          </div>
        )}
        {axes.length >= 4 && (
          <div>
            <StickCanvas axes={axes} index={1} label="Right Stick" driftSamples={driftData?.[1]} onDriftUpdate={onDriftUpdate} />
            {drift(driftData?.[1]).severity !== 'none' && (
              <div style={{ fontSize: '11px', color: '#ff9800', textAlign: 'center', marginTop: '4px' }}>
                Drift: {drift(driftData?.[1]).severity}
              </div>
            )}
          </div>
        )}
      </div>
      {axes.length < 2 && <div style={{ color: '#666', fontSize: '13px', textAlign: 'center' }}>No analog sticks detected</div>}
    </div>
  );
}
