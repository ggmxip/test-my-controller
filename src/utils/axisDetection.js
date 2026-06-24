const STICK_THRESHOLD = -0.3;

export function detectAxisLayout(axes) {
  const result = {
    sticks: [{ x: 0, y: 1, label: 'Left Stick' }],
    triggerAxes: [],
    extraAxes: [],
  };

  if (axes.length < 2) return result;

  if (axes.length >= 4) {
    const a2 = axes[2] || 0;
    const a3 = axes[3] || 0;

    if (a2 < STICK_THRESHOLD || a3 < STICK_THRESHOLD) {
      result.sticks.push({ x: 2, y: 3, label: 'Right Stick' });
      if (axes.length >= 6) {
        result.triggerAxes.push({ index: 4, label: 'LT (axis)' });
        result.triggerAxes.push({ index: 5, label: 'RT (axis)' });
      }
      for (let i = 6; i < axes.length; i++) {
        result.extraAxes.push({ index: i, label: `Axis ${i}` });
      }
    } else {
      if (axes.length >= 6) {
        const a4 = axes[4] || 0;
        const a5 = axes[5] || 0;
        if (a4 < STICK_THRESHOLD || a5 < STICK_THRESHOLD) {
          result.sticks.push({ x: 4, y: 5, label: 'Right Stick' });
          result.triggerAxes.push({ index: 2, label: 'LT (axis)' });
          result.triggerAxes.push({ index: 3, label: 'RT (axis)' });
        } else {
          result.sticks.push({ x: 2, y: 3, label: 'Stick 2' });
          result.triggerAxes.push({ index: 4, label: 'Trigger L' });
          result.triggerAxes.push({ index: 5, label: 'Trigger R' });
        }
        for (let i = 6; i < axes.length; i++) {
          result.extraAxes.push({ index: i, label: `Axis ${i}` });
        }
      } else {
        result.triggerAxes.push({ index: 2, label: 'Trigger L' });
        result.triggerAxes.push({ index: 3, label: 'Trigger R' });
      }
    }
  } else if (axes.length >= 2) {
    for (let i = 2; i < axes.length; i++) {
      result.extraAxes.push({ index: i, label: `Axis ${i}` });
    }
  }

  return result;
}

export function getBestTriggerValue(axes, buttons) {
  const bL = buttons[6]?.value || 0;
  const bR = buttons[7]?.value || 0;

  let aL = 0, aR = 0;

  if (axes.length >= 6) {
    const a2 = axes[2] || 0;
    const a3 = axes[3] || 0;
    const a4 = axes[4] || 0;
    const a5 = axes[5] || 0;

    const isTrig2 = a2 >= 0 && a2 <= 1;
    const isTrig3 = a3 >= 0 && a3 <= 1;

    if (isTrig2 && isTrig3) {
      aL = Math.max(aL, a2);
      aR = Math.max(aR, a3);
    }

    if (a4 >= 0 && a4 <= 1) aL = Math.max(aL, a4);
    if (a5 >= 0 && a5 <= 1) aR = Math.max(aR, a5);

    for (let i = 6; i < axes.length; i++) {
      const v = axes[i] || 0;
      if (v >= 0 && v <= 1 && i % 2 === 0) aL = Math.max(aL, v);
      else if (v >= 0 && v <= 1) aR = Math.max(aR, v);
    }
  } else if (axes.length >= 4) {
    const a2 = axes[2] || 0;
    const a3 = axes[3] || 0;
    if (a2 >= 0 && a2 <= 1) aL = Math.max(aL, a2);
    if (a3 >= 0 && a3 <= 1) aR = Math.max(aR, a3);
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
