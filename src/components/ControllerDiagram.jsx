import { detectControllerType, getFaceButtonPositions } from '../utils/controllerMapping';
import { getStickPairs } from '../utils/axisDetection';

const BODY_PATH = `
  M 50,70 C 50,25 85,12 115,12 L 145,12 C 175,12 195,22 202,38 L 202,52 C 202,64 192,70 176,70 L 80,70
  C 56,70 48,84 48,104 L 48,132 C 48,168 36,198 22,222 C 12,240 26,256 46,252 C 62,248 76,232 90,205
  L 112,160 C 124,138 144,132 164,130 L 220,128 L 276,130 C 296,132 316,138 328,160 L 350,205
  C 364,232 378,248 394,252 C 414,256 428,240 418,222 C 404,198 392,168 392,132 L 392,104
  C 392,84 384,70 360,70 L 264,70 C 248,70 238,64 238,52 L 238,38 C 245,22 265,12 295,12 L 325,12
  C 355,12 390,25 390,70 Z
`;

function getLayout(type) {
  const xbox = {
    leftUpper: { type: 'stick', x: 125, y: 95, xIdx: 0, yIdx: 1, label: 'L' },
    leftLower: { type: 'dpad', x: 100, y: 155 },
    rightUpper: { type: 'face', x: 315, y: 132 },
    rightLower: { type: 'stick', x: 315, y: 175, xIdx: 2, yIdx: 3, label: 'R' },
    select: { x: 178, y: 140 },
    start: { x: 215, y: 140 },
  };
  const ps = {
    leftUpper: { type: 'dpad', x: 100, y: 95 },
    leftLower: { type: 'stick', x: 125, y: 155, xIdx: 0, yIdx: 1, label: 'L' },
    rightUpper: { type: 'face', x: 315, y: 132 },
    rightLower: { type: 'stick', x: 315, y: 175, xIdx: 2, yIdx: 3, label: 'R' },
    select: { x: 178, y: 140 },
    start: { x: 215, y: 140 },
  };
  if (type === 'ps5' || type === 'ps4') return ps;
  return xbox;
}

function DPadSVG({ x, y, buttons }) {
  const up = buttons[12]?.pressed;
  const down = buttons[13]?.pressed;
  const left = buttons[14]?.pressed;
  const right = buttons[15]?.pressed;
  const sz = 24, gap = 28;

  const btn = (cx, cy, pressed, label) => (
    <g>
      <rect x={cx - sz / 2} y={cy - sz / 2} width={sz} height={sz} rx={4}
        fill={pressed ? '#4caf50' : '#1a1a2e'} stroke={pressed ? '#4caf50' : '#444'} strokeWidth={1.5}
        style={{ transition: 'all 0.06s' }} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill={pressed ? '#000' : '#888'} fontSize={12} fontWeight="bold">{label}</text>
    </g>
  );

  return (
    <g>
      {btn(x, y - gap, up, '▲')}
      {btn(x, y + gap, down, '▼')}
      {btn(x - gap, y, left, '◀')}
      {btn(x + gap, y, right, '▶')}
    </g>
  );
}

function FaceButtonsSVG({ x, y, buttons, type }) {
  const faces = getFaceButtonPositions(type);
  const r = 20, gap = 26;

  const items = [
    { dx: 0, dy: gap, idx: 0, color: faces.bottom.color, label: faces.bottom.label },
    { dx: gap, dy: 0, idx: 1, color: faces.right.color, label: faces.right.label },
    { dx: -gap, dy: 0, idx: 2, color: faces.left.color, label: faces.left.label },
    { dx: 0, dy: -gap, idx: 3, color: faces.top.color, label: faces.top.label },
  ];

  return (
    <g>
      {items.map((item, i) => (
        <g key={i}>
          <circle cx={x + item.dx} cy={y + item.dy} r={r / 2}
            fill={buttons[item.idx]?.pressed ? item.color : '#1a1a2e'}
            stroke={buttons[item.idx]?.pressed ? item.color : '#555'}
            strokeWidth={1.5}
            style={{ transition: 'all 0.06s' }} />
          <text x={x + item.dx} y={y + item.dy + 4} textAnchor="middle"
            fill={buttons[item.idx]?.pressed ? '#000' : '#ccc'} fontSize={10} fontWeight="bold">{item.label}</text>
        </g>
      ))}
    </g>
  );
}

function StickSVG({ cx, cy, axes, xIdx, yIdx, label }) {
  const x = axes[xIdx] || 0;
  const y = axes[yIdx] || 0;
  const outerR = 22, knobR = 9;
  const sx = cx + x * (outerR - knobR - 2);
  const sy = cy + y * (outerR - knobR - 2);

  return (
    <g>
      <circle cx={cx} cy={cy} r={outerR} fill="#0d0d18" stroke="#444" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={outerR * 0.25} fill="none" stroke="#333" strokeWidth={1} strokeDasharray="3 3" />
      <line x1={cx - outerR} y1={cy} x2={cx + outerR} y2={cy} stroke="#222" strokeWidth={1} />
      <line x1={cx} y1={cy - outerR} x2={cx} y2={cy + outerR} stroke="#222" strokeWidth={1} />
      <circle cx={sx} cy={sy} r={knobR} fill="#4caf50" stroke="#66bb6a" strokeWidth={1.5}
        style={{ transition: 'all 0.04s' }} />
      <text x={cx} y={cy + outerR + 12} textAnchor="middle" fill="#666" fontSize={8}>{label}</text>
    </g>
  );
}

function CenterButtonsSVG({ buttons, layout, type }) {
  const sel = buttons[8]?.pressed;
  const sta = buttons[9]?.pressed;
  const home = buttons[16]?.pressed;
  const r = 10, gap = 30;
  const selLabel = type === 'switch_pro' ? '−' : 'SEL';
  const staLabel = type === 'switch_pro' ? '+' : 'STA';
  const cx = (layout.select.x + layout.start.x) / 2;
  const cy = layout.select.y;

  return (
    <g>
      <rect x={layout.select.x - r} y={layout.select.y - r} width={r * 2} height={r * 2} rx={r}
        fill={sel ? '#ff9800' : '#1a1a2e'} stroke={sel ? '#ff9800' : '#444'} strokeWidth={1}
        style={{ transition: 'all 0.06s' }} />
      <text x={layout.select.x} y={layout.select.y + 3} textAnchor="middle" fill={sel ? '#000' : '#888'} fontSize={8} fontWeight="bold">{selLabel}</text>

      <rect x={layout.start.x - r} y={layout.start.y - r} width={r * 2} height={r * 2} rx={r}
        fill={sta ? '#ff9800' : '#1a1a2e'} stroke={sta ? '#ff9800' : '#444'} strokeWidth={1}
        style={{ transition: 'all 0.06s' }} />
      <text x={layout.start.x} y={layout.start.y + 3} textAnchor="middle" fill={sta ? '#000' : '#888'} fontSize={8} fontWeight="bold">{staLabel}</text>

      {buttons[16] !== undefined && (
        <g>
          <circle cx={cx} cy={cy - gap} r={r}
            fill={home ? '#f44336' : '#1a1a2e'} stroke={home ? '#f44336' : '#555'} strokeWidth={1}
            style={{ transition: 'all 0.06s' }} />
          <text x={cx} y={cy - gap + 3} textAnchor="middle" fill={home ? '#000' : '#888'} fontSize={7} fontWeight="bold">●</text>
        </g>
      )}
    </g>
  );
}

function TriggerBumpersSVG({ buttons, type }) {
  const { x: lx } = getLayout(type).leftUpper;
  const { x: rx } = getLayout(type).rightUpper;

  const lt = (buttons[6]?.value || 0) > 0.3;
  const rt = (buttons[7]?.value || 0) > 0.3;
  const lb = buttons[4]?.pressed;
  const rb = buttons[5]?.pressed;

  const ltLabel = type === 'switch_pro' ? 'ZL' : type === 'ps5' || type === 'ps4' ? 'L2' : 'LT';
  const rtLabel = type === 'switch_pro' ? 'ZR' : type === 'ps5' || type === 'ps4' ? 'R2' : 'RT';
  const lbLabel = type === 'switch_pro' ? 'L' : type === 'ps5' || type === 'ps4' ? 'L1' : 'LB';
  const rbLabel = type === 'switch_pro' ? 'R' : type === 'ps5' || type === 'ps4' ? 'R1' : 'RB';

  const pos = [
    { x: lx, y: 22, label: ltLabel, pressed: lt },
    { x: rx, y: 22, label: rtLabel, pressed: rt },
    { x: lx, y: 44, label: lbLabel, pressed: lb },
    { x: rx, y: 44, label: rbLabel, pressed: rb },
  ];

  return (
    <g>
      {pos.map((b, i) => (
        <g key={i}>
          <rect x={b.x - 18} y={b.y - 8} width={36} height={16} rx={8}
            fill={b.pressed ? '#ff9800' : '#1a1a2e'}
            stroke={b.pressed ? '#ff9800' : '#444'} strokeWidth={1}
            style={{ transition: 'all 0.06s' }} />
          <text x={b.x} y={b.y + 4} textAnchor="middle" fill={b.pressed ? '#000' : '#aaa'} fontSize={8} fontWeight="bold">{b.label}</text>
        </g>
      ))}
    </g>
  );
}

export default function ControllerDiagram({ gamepad }) {
  if (!gamepad) return null;

  const type = detectControllerType(gamepad);
  const layout = getLayout(type);
  const pairs = getStickPairs(gamepad.axes);
  const b = gamepad.buttons;

  const getStickCoords = (type) => {
    const l = getLayout(type);
    for (const key of ['leftUpper', 'leftLower', 'rightUpper', 'rightLower']) {
      const item = l[key];
      if (item.type === 'stick' && item.label === 'L') return { x: item.x, y: item.y, xIdx: 0, yIdx: 1 };
    }
    for (const key of ['leftUpper', 'leftLower', 'rightUpper', 'rightLower']) {
      const item = l[key];
      if (item.type === 'stick' && item.label === 'R') return { x: item.x, y: item.y, xIdx: 2, yIdx: 3 };
    }
    return { x: 125, y: 95, xIdx: 0, yIdx: 1 };
  };

  const leftStick = getStickCoords(type);
  const rightStick = {
    x: layout.rightLower.type === 'stick' ? layout.rightLower.x : 315,
    y: layout.rightLower.type === 'stick' ? layout.rightLower.y : 175,
    xIdx: 2, yIdx: 3,
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <svg viewBox="0 0 440 280" style={{ width: '100%', maxWidth: '440px', display: 'block', margin: '0 auto' }}>
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a30" />
            <stop offset="100%" stopColor="#0d0d18" />
          </linearGradient>
        </defs>
        <path d={BODY_PATH} fill="url(#bodyGrad)" stroke="#2a2a50" strokeWidth="2" />
        <path d={BODY_PATH} fill="none" stroke="#4caf50" strokeWidth="1" opacity="0.08" />
        <text x={220} y={265} textAnchor="middle" fill="#333" fontSize={10} letterSpacing="2">{type.toUpperCase()}</text>

        <TriggerBumpersSVG buttons={b} type={type} />
        <DPadSVG x={layout.leftUpper.type === 'dpad' ? layout.leftUpper.x : layout.leftLower.x}
                 y={layout.leftUpper.type === 'dpad' ? layout.leftUpper.y : layout.leftLower.y}
                 buttons={b} />
        <FaceButtonsSVG x={layout.rightUpper.x} y={layout.rightUpper.y} buttons={b} type={type} />
        <CenterButtonsSVG buttons={b} layout={layout} type={type} />
        <StickSVG cx={leftStick.x} cy={leftStick.y} axes={gamepad.axes}
                  xIdx={leftStick.xIdx} yIdx={leftStick.yIdx} label="L" />
        <StickSVG cx={rightStick.x} cy={rightStick.y} axes={gamepad.axes}
                  xIdx={rightStick.xIdx} yIdx={rightStick.yIdx} label="R" />
      </svg>
    </div>
  );
}
