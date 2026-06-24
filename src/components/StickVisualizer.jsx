import { useState, useRef, useEffect } from 'react';
import { detectAxisLayout } from '../utils/axisDetection';

const SIZE = 170;
const CENTER = SIZE / 2;
const RADIUS = (SIZE / 2) - 10;

function StickCanvas({ axes, xIdx, yIdx, label }) {
  const canvasRef = useRef(null);
  const trailRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const x = axes[xIdx] || 0;
    const y = axes[yIdx] || 0;

    ctx.clearRect(0, 0, SIZE, SIZE);

    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS * 0.25, 0, Math.PI * 2);
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(CENTER - RADIUS, CENTER);
    ctx.lineTo(CENTER + RADIUS, CENTER);
    ctx.moveTo(CENTER, CENTER - RADIUS);
    ctx.lineTo(CENTER, CENTER + RADIUS);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.stroke();

    trailRef.current.push({ x, y });
    if (trailRef.current.length > 30) trailRef.current.shift();
    trailRef.current.forEach((p, i) => {
      const alpha = i / trailRef.current.length * 0.3;
      ctx.beginPath();
      ctx.arc(CENTER + p.x * RADIUS, CENTER + p.y * RADIUS, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(76, 175, 80, ${alpha})`;
      ctx.fill();
    });

    const sx = CENTER + x * RADIUS;
    const sy = CENTER + y * RADIUS;

    ctx.beginPath();
    ctx.arc(sx, sy, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#4caf50';
    ctx.fill();
    ctx.strokeStyle = '#66bb6a';
    ctx.lineWidth = 2;
    ctx.stroke();

    const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, 20);
    gradient.addColorStop(0, 'rgba(76, 175, 80, 0.3)');
    gradient.addColorStop(1, 'rgba(76, 175, 80, 0)');
    ctx.beginPath();
    ctx.arc(sx, sy, 20, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [axes, xIdx, yIdx]);

  const x = axes[xIdx] || 0;
  const y = axes[yIdx] || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div style={{ fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>{label}</div>
      <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ borderRadius: '10px', background: '#0d0d16' }} />
      <div style={{ fontSize: '11px', color: '#888' }}>X: {x.toFixed(3)} Y: {y.toFixed(3)}</div>
    </div>
  );
}

export default function StickVisualizer({ gamepad }) {
  if (!gamepad) return null;

  const axes = gamepad.axes;
  const layout = detectAxisLayout(axes);

  const allAxisEls = [];
  for (let i = 0; i < axes.length; i++) {
    const isStick = layout.sticks.some(s => s.x === i || s.y === i);
    const isTrigger = layout.triggerAxes.some(t => t.index === i);
    if (!isStick && !isTrigger) {
      allAxisEls.push({ index: i, value: axes[i] || 0 });
    }
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Analog Sticks & Axes
      </h3>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {layout.sticks.map((s, i) => (
          <StickCanvas key={i} axes={axes} xIdx={s.x} yIdx={s.y} label={s.label} />
        ))}
      </div>

      {layout.triggerAxes.length > 0 && (
        <div style={{ marginTop: '10px', fontSize: '11px', color: '#666', textAlign: 'center' }}>
          Trigger axes: {layout.triggerAxes.map(t => `${t.label}=${(axes[t.index] || 0).toFixed(3)}`).join(' | ')}
        </div>
      )}

      {allAxisEls.length > 0 && (
        <details style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          <summary style={{ cursor: 'pointer', color: '#888' }}>All Raw Axes</summary>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
            {axes.map((v, i) => (
              <span key={i} style={{ background: '#151525', padding: '2px 8px', borderRadius: '4px' }}>
                [{i}]: {v.toFixed(3)}
              </span>
            ))}
          </div>
        </details>
      )}

      {axes.length < 2 && (
        <div style={{ color: '#666', fontSize: '13px', textAlign: 'center' }}>No analog sticks detected</div>
      )}
    </div>
  );
}
