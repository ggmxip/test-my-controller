export function supportsVibration(gamepad) {
  if (!gamepad) return false;
  return !!(gamepad.vibrationActuator || gamepad.hapticActuators?.length);
}

export function getVibrationActuator(gamepad) {
  if (gamepad.vibrationActuator) {
    return { type: 'vibrationActuator', actuator: gamepad.vibrationActuator };
  }
  if (gamepad.hapticActuators?.length) {
    return { type: 'hapticActuators', actuator: gamepad.hapticActuators[0] };
  }
  return null;
}

export async function vibrate(gamepad, weakMagnitude, strongMagnitude, duration) {
  const info = getVibrationActuator(gamepad);
  if (!info) return;

  if (info.type === 'vibrationActuator') {
    const effectType = info.actuator.effects?.includes('trigger-rumble')
      ? 'trigger-rumble'
      : 'dual-rumble';
    await info.actuator.playEffect(effectType, {
      startDelay: 0,
      duration,
      weakMagnitude: Math.max(0, Math.min(1, weakMagnitude)),
      strongMagnitude: Math.max(0, Math.min(1, strongMagnitude)),
    });
  } else if (info.type === 'hapticActuators') {
    const intensity = Math.max(0, Math.min(1, (weakMagnitude + strongMagnitude) / 2));
    info.actuator.pulse(intensity, duration);
  }
}

export async function stopVibration(gamepad) {
  const info = getVibrationActuator(gamepad);
  if (!info) return;

  if (info.type === 'vibrationActuator') {
    try { await info.actuator.reset(); } catch {}
  } else if (info.type === 'hapticActuators') {
    info.actuator.pulse(0, 0);
  }
}
