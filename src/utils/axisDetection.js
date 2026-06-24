export function getStickPairs(axes) {
  const pairs = [];
  if (axes.length >= 2) {
    pairs.push({ x: 0, y: 1, label: 'Left Stick (0-1)' });
  }
  if (axes.length >= 4) {
    pairs.push({ x: 2, y: 3, label: 'Pair (2-3)' });
  }
  if (axes.length >= 6) {
    pairs.push({ x: 4, y: 5, label: 'Pair (4-5)' });
  }
  for (let i = pairs.length * 2; i + 1 < axes.length; i += 2) {
    pairs.push({ x: i, y: i + 1, label: `Axes ${i}-${i + 1}` });
  }
  return pairs;
}

export function findRightStickAxes(axes) {
  if (axes.length < 4) return { xIdx: 2, yIdx: 3, source: 'default' };
  const candidates = [];
  if (axes.length >= 4) candidates.push({ x: 2, y: 3, mag: Math.abs(axes[2] || 0) + Math.abs(axes[3] || 0) });
  if (axes.length >= 6) candidates.push({ x: 4, y: 5, mag: Math.abs(axes[4] || 0) + Math.abs(axes[5] || 0) });
  if (axes.length >= 8) candidates.push({ x: 6, y: 7, mag: Math.abs(axes[6] || 0) + Math.abs(axes[7] || 0) });
  candidates.sort((a, b) => b.mag - a.mag);
  return { xIdx: candidates[0].x, yIdx: candidates[0].y, source: 'auto' };
}

export function getBestTriggerValue(axes, buttons) {
  const bL = buttons[6]?.value || 0;
  const bR = buttons[7]?.value || 0;
  let aL = 0, aR = 0;

  if (axes.length >= 6) {
    const v4 = axes[4] || 0;
    const v5 = axes[5] || 0;
    if (v4 >= 0 && v4 <= 1) aL = v4;
    if (v5 >= 0 && v5 <= 1) aR = v5;
  }

  if (axes.length >= 4) {
    const v2 = axes[2] || 0;
    const v3 = axes[3] || 0;
    if (v2 >= 0 && v2 <= 1) aL = Math.max(aL, v2);
    if (v3 >= 0 && v3 <= 1) aR = Math.max(aR, v3);
  }

  return {
    left: Math.max(bL, aL),
    right: Math.max(bR, aR),
    sources: {
      buttonLeft: bL,
      buttonRight: bR,
      axisLeft: aL,
      axisRight: aR,
    },
  };
}
