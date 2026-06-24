import { detectControllerType, getFaceButtonPositions } from '../utils/controllerMapping';
import { detectAxisLayout } from '../utils/axisDetection';

const BODY_PATH = `
  M 50,70 C 50,25 85,12 115,12 L 145,12 C 175,12 195,22 202,38 L 202,52 C 202,64 192,70 176,70 L 80,70
  C 56,70 48,84 48,104 L 48,132 C 48,168 36,198 22,222 C 12,240 26,256 46,252 C 62,248 76,232 90,205
  L 112,160 C 124,138 144,132 164,130 L 220,128 L 276,130 C 296,132 316,138 328,160 L 350,205
  C 364,232 378,248 394,252 C 414,256 428,240 418,222 C 404,198 392,168 392,132 L 392,104
  C 392,84 384,70 360,70 L 264,70 C 248,70 238,64 238,52 L 238,38 C 245,22 265,12 295,12 L 325,12
  C 355,12 390,25 390,70 Z
`;

const layoutCoords = {
  dPad: { x: 95, y: 155 },
  leftStick: { x: 120, y: 98 },
  rightStick: { x: 320, y: 98 },
  faceButtons: { x: 320, y: 160 },
  select: { x: 175, y: 140 },
  start: { x: 210, y: 140 },
  home: { x: 192, y: 108 },
  lt: { x: 68, y: 22 },
  rt: { x: 320, y: 22 },
  lb: { x: 80, y: 42 },
  rb: { x: 300, y: 42 },
};

function DPadArrows({ buttons }) {
  const up = buttons[12]?.pressed;
  const down = buttons[13]?.pressed;
  const left = buttons[14]?.pressed;
  const right = buttons[15]?.pressed;
  const { x, y } = layoutCoords.dPad;
  const s = 26;

  return (
    <g>
      <rect x={x - s / 2} y={y - s / 2 - s} width={s} height={s} rx={4}
        fill={up ? '#4caf50' : '#222'} stroke={up ? '#4caf50' : '#444'} strokeWidth={1.5}
        style={{ transition: 'all 0.08s' }} />
      <text x={x} y={y - s / 2 - s / 2 + 4} textAnchor="middle" fill={up ? '#000' : '#888'} fontSize={12} fontWeight="bold">▲</text>

      <rect x={x - s / 2} y={y + s / 2} width={s} height={s} rx={4}
        fill={down ? '#4caf50' : '#222'} stroke={down ? '#4caf50' : '#444'} strokeWidth={1.5}
        style={{ transition: 'all 0.08s' }} />
      <text x={x} y={y + s / 2 + s / 2 + 4} textAnchor="middle" fill={down ? '#000' : '#888'} fontSize={12} fontWeight="bold">▼</text>

      <rect x={x - s / 2 - s} y={y - s / 2} width={s} height={s} rx={4}
        fill={left ? '#4caf50' : '#222'} stroke={left ? '#4caf50' : '#444'} strokeWidth={1.5}
        style={{ transition: 'all 0.08s' }} />
      <text x={x - s / 2} y={y + 4} textAnchor="middle" fill={left ? '#000' : '#888'} fontSize={12} fontWeight="bold">◀</text>

      <rect x={x + s / 2} y={y - s / 2} width={s} height={s} rx={4}
        fill={right ? '#4caf50' : '#222'} stroke={right ? '#4caf50' : '#444'} strokeWidth={1.5}
        style={{ transition: 'all 0.08s' }} />
      <text x={x + s + s / 2} y={y + 4} textAnchor="middle" fill={right ? '#000' : '#888'} fontSize={12} fontWeight="bold">▶</text>
    </g>
  );
}

function FaceButtonsSVG({ buttons, type }) {
  const faces = getFaceButtonPositions(type);
  const { x, y } = layoutCoords.faceButtons;
  const r = 22;
  const gap = 28;
  const pressed = [
    buttons[0]?.pressed, // bottom
    buttons[1]?.pressed, // right
    buttons[2]?.pressed, // left
    buttons[3]?.pressed, // top
  ];
  const colors = [faces.bottom.color, faces.right.color, faces.left.color, faces.top.color];
  const labels = [faces.bottom.label, faces.right.label, faces.left.label, faces.top.label];
  const positions = [
    { dx: 0, dy: gap },     // bottom
    { dx: gap, dy: 0 },     // right
    { dx: -gap, dy: 0 },    // left
    { dx: 0, dy: -gap },    // top
  ];

  return (
    <g>
      {positions.map((p, i) => (
        <g key={i}>
          <circle cx={x + p.dx} cy={y + p.dy} r={r / 2}
            fill={pressed[i] ? colors[i] : '#1a1a2e'}
            stroke={pressed[i] ? colors[i] : '#555'}
            strokeWidth={1.5}
            style={{ transition: 'all 0.08s' }} />
          <text x={x + p.dx} y={y + p.dy + 4} textAnchor="middle"
            fill={pressed[i] ? '#000' : '#ccc'} fontSize={11} fontWeight="bold">
            {labels[i]}
          </text>
        </g>
      ))}
    </g>
  );
}

function AnalogStickSVG({ axes, xIdx, yIdx, cx, cy }) {
  const x = axes[xIdx] || 0;
  const y = axes[yIdx] || 0;
  const r = 24;
  const knobR = 10;
  const sx = cx + x * (r - knobR);
  const sy = cy + y * (r - knobR);

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0d0d18" stroke="#444" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r * 0.25} fill="none" stroke="#333" strokeWidth={1} strokeDasharray="4 4" />
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#222" strokeWidth={1} />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#222" strokeWidth={1} />
      <circle cx={sx} cy={sy} r={knobR} fill="#4caf50" stroke="#66bb6a" strokeWidth={1.5}
        style={{ transition: 'all 0.05s' }} />
    </g>
  );
}

function CenterButtonsSVG({ buttons, type }) {
  const sel = buttons[8]?.pressed;
  const sta = buttons[9]?.pressed;
  const home = buttons[16]?.pressed;
  const { select, start, home: homePos } = layoutCoords;
  const r = 10;

  const selLabel = type === 'switch_pro' ? '−' : 'SEL';
  const staLabel = type === 'switch_pro' ? '+' : 'STA';

  return (
    <g>
      <rect x={select.x - r} y={select.y - r} width={r * 2} height={r * 2} rx={r}
        fill={sel ? '#ff9800' : '#222'} stroke={sel ? '#ff9800' : '#444'} strokeWidth={1}
        style={{ transition: 'all 0.08s' }} />
      <text x={select.x} y={select.y + 3} textAnchor="middle" fill={sel ? '#000' : '#888'} fontSize={8} fontWeight="bold">{selLabel}</text>

      <rect x={start.x - r} y={start.y - r} width={r * 2} height={r * 2} rx={r}
        fill={sta ? '#ff9800' : '#222'} stroke={sta ? '#ff9800' : '#444'} strokeWidth={1}
        style={{ transition: 'all 0.08s' }} />
      <text x={start.x} y={start.y + 3} textAnchor="middle" fill={sta ? '#000' : '#888'} fontSize={8} fontWeight="bold">{staLabel}</text>

      {buttons[16] !== undefined && (
        <>
          <circle cx={homePos.x} cy={homePos.y} r={r + 2}
            fill={home ? '#f44336' : '#1a1a2e'} stroke={home ? '#f44336' : '#555'} strokeWidth={1}
            style={{ transition: 'all 0.08s' }} />
          <text x={homePos.x} y={homePos.y + 3} textAnchor="middle" fill={home ? '#000' : '#888'} fontSize={7} fontWeight="bold">HOME</text>
        </>
      )}
    </g>
  );
}

function TriggerBumpersSVG({ buttons, type }) {
  const lt = buttons[6]?.pressed || buttons[6]?.value > 0.5;
  const rt = buttons[7]?.pressed || buttons[7]?.value > 0.5;
  const lb = buttons[4]?.pressed;
  const rb = buttons[5]?.pressed;

  const ltLabel = type === 'switch_pro' ? 'ZL' : type === 'ps5' || type === 'ps4' ? 'L2' : 'LT';
  const rtLabel = type === 'switch_pro' ? 'ZR' : type === 'ps5' || type === 'ps4' ? 'R2' : 'RT';
  const lbLabel = type === 'switch_pro' ? 'L' : type === 'ps5' || type === 'ps4' ? 'L1' : 'LB';
  const rbLabel = type === 'switch_pro' ? 'R' : type === 'ps5' || type === 'ps4' ? 'R1' : 'RB';

  return (
    <g>
      {[{ ...layoutCoords.lt, label: ltLabel, pressed: lt },
        { ...layoutCoords.rt, label: rtLabel, pressed: rt },
        { ...layoutCoords.lb, label: lbLabel, pressed: lb },
        { ...layoutCoords.rb, label: rbLabel, pressed: rb }].map((b, i) => (
        <g key={i}>
          <rect x={b.x - 18} y={b.y - 8} width={36} height={16} rx={8}
            fill={b.pressed ? '#ff9800' : '#1a1a2e'}
            stroke={b.pressed ? '#ff9800' : '#444'}
            strokeWidth={1}
            style={{ transition: 'all 0.08s' }} />
          <text x={b.x} y={b.y + 4} textAnchor="middle" fill={b.pressed ? '#000' : '#aaa'} fontSize={9} fontWeight="bold">{b.label}</text>
        </g>
      ))}
    </g>
  );
}

export default function ControllerDiagram({ gamepad }) {
  if (!gamepad) return null;

  const type = detectControllerType(gamepad);
  const layout = detectAxisLayout(gamepad.axes);
  const b = gamepad.buttons;

  const rightStickAxes = layout.sticks.length > 1
    ? layout.sticks[1]
    : { x: 2, y: 3 };

  return (
    <div style={{ marginBottom: '16px' }}>
      <svg viewBox="0 0 440 280" style={{ width: '100%', maxWidth: '440px', display: 'block', margin: '0 auto' }}>
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a30" />
            <stop offset="100%" stopColor="#0d0d18" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Controller body silhouette */}
        <path d={BODY_PATH} fill="url(#bodyGrad)" stroke="#2a2a50" strokeWidth="2" />
        <path d={BODY_PATH} fill="none" stroke="#4caf50" strokeWidth="1" opacity="0.1" />

        {/* Type label */}
        <text x={220} y={265} textAnchor="middle" fill="#333" fontSize={11} textTransform="uppercase" letterSpacing="2">
          {type.toUpperCase()}
        </text>

        {/* Interactive elements */}
        <TriggerBumpersSVG buttons={b} type={type} />
        <DPadArrows buttons={b} />
        <FaceButtonsSVG buttons={b} type={type} />
        <CenterButtonsSVG buttons={b} type={type} />
        <AnalogStickSVG axes={gamepad.axes} xIdx={0} yIdx={1} cx={layoutCoords.leftStick.x} cy={layoutCoords.leftStick.y} />
        <AnalogStickSVG axes={gamepad.axes} xIdx={rightStickAxes.x} yIdx={rightStickAxes.y}
          cx={layoutCoords.rightStick.x} cy={layoutCoords.rightStick.y} />
      </svg>
    </div>
  );
}
