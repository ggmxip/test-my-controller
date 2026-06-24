export function getStickPairs(axes) {
  const pairs = [];
  if (axes.length >= 2) {
    pairs.push({ x: 0, y: 1, label: 'Left Stick' });
  }
  if (axes.length >= 4) {
    pairs.push({ x: 2, y: 3, label: 'Right Stick' });
  }
  if (axes.length >= 6) {
    pairs.push({ x: 4, y: 5, label: 'Extra Axes (4-5)' });
  }
  for (let i = pairs.length * 2; i + 1 < axes.length; i += 2) {
    pairs.push({ x: i, y: i + 1, label: `Axes ${i}-${i + 1}` });
  }
  return pairs;
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
