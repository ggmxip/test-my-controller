import { useState, useEffect, useRef, useCallback } from 'react';

export default function useGamepad() {
  const [gamepads, setGamepads] = useState({});
  const [connectedCount, setConnectedCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef(null);

  const poll = useCallback(() => {
    const raw = navigator.getGamepads ? [...navigator.getGamepads()] : [];
    const connected = {};
    let count = 0;

    for (const gp of raw) {
      if (gp && gp.connected) {
        connected[gp.index] = {
          index: gp.index,
          id: gp.id,
          mapping: gp.mapping,
          connected: gp.connected,
          timestamp: gp.timestamp,
          buttons: gp.buttons.map(b => ({
            pressed: b.pressed,
            touched: b.touched || false,
            value: b.value,
          })),
          axes: [...gp.axes],
          vibrationActuator: gp.vibrationActuator || null,
          hapticActuators: gp.hapticActuators || null,
        };
        count++;
      }
    }

    setGamepads(prev => {
      const keys = Object.keys(connected);
      if (keys.length > 0 && !prev[activeIndex] && !connected[activeIndex]) {
        setActiveIndex(parseInt(keys[0]));
      }
      return connected;
    });
    setConnectedCount(count);
    rafRef.current = requestAnimationFrame(poll);
  }, [activeIndex]);

  useEffect(() => {
    const handleConnect = (e) => {
      setActiveIndex(e.gamepad.index);
    };
    const handleDisconnect = () => {
      setActiveIndex(0);
    };

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);
    rafRef.current = requestAnimationFrame(poll);

    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [poll]);

  const activeGamepad = gamepads[activeIndex] || null;

  return { gamepads, activeGamepad, connectedCount, activeIndex, setActiveIndex };
}
