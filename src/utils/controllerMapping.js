const VENDOR_SONY = '054c';
const VENDOR_MICROSOFT = '045e';
const VENDOR_NINTENDO = '057e';

export function detectControllerType(gamepad) {
  const id = (gamepad.id || '').toLowerCase();
  const vendorMatch = id.match(/vendor:\s*([0-9a-f]+)/i);
  const vendor = vendorMatch ? vendorMatch[1].toLowerCase() : '';

  if (id.includes('dualsense') || id.includes('ps5') || id.includes('dual sense')) return 'ps5';
  if (id.includes('dualshock') || (id.includes('wireless controller') && (vendor === VENDOR_SONY || !vendor))) return 'ps4';
  if (id.includes('xbox') || id.includes('cosmic') || id.includes('ares')) {
    if (vendor === VENDOR_MICROSOFT) return 'xbox';
    return 'xbox_alt';
  }
  if (id.includes('pro controller') || vendor === VENDOR_NINTENDO) return 'switch_pro';
  if (id.includes('nswitch') || id.includes('switch')) return 'switch_pro';
  if (id.includes('stadia')) return 'stadia';
  if (id.includes('steam')) return 'steam';

  if (vendor === VENDOR_MICROSOFT) return 'xbox';
  if (vendor === VENDOR_SONY) return 'ps5';
  if (vendor === VENDOR_NINTENDO) return 'switch_pro';

  if (gamepad.mapping === 'standard') return 'generic_standard';
  return 'generic';
}

export function getButtonLabels(type) {
  const layouts = {
    xbox: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Share', 'Menu', 'LS', 'RS', '⬆', '⬇', '⬅', '➡', 'Xbox'],
    xbox_alt: ['X', 'A', 'B', 'Y', 'LB', 'RB', 'LT', 'RT', 'Share', 'Menu', 'LS', 'RS', '⬆', '⬇', '⬅', '➡', 'Xbox'],
    ps5: ['✕', '○', '□', '△', 'L1', 'R1', 'L2', 'R2', 'Share', 'Menu', 'L3', 'R3', '⬆', '⬇', '⬅', '➡', 'PS'],
    ps4: ['✕', '○', '□', '△', 'L1', 'R1', 'L2', 'R2', 'Share', 'Options', 'L3', 'R3', '⬆', '⬇', '⬅', '➡', 'PS'],
    switch_pro: ['B', 'A', 'Y', 'X', 'L', 'R', 'ZL', 'ZR', '−', '+', 'LS', 'RS', '⬆', '⬇', '⬅', '➡', 'Home'],
    stadia: ['A', 'B', 'X', 'Y', 'L1', 'R1', 'L2', 'R2', 'Capture', 'Menu', 'L3', 'R3', '⬆', '⬇', '⬅', '➡', 'Stadia'],
    steam: ['A', 'B', 'X', 'Y', 'L1', 'R1', 'L2', 'R2', 'Select', 'Start', 'LS', 'RS', '⬆', '⬇', '⬅', '➡', 'Steam'],
    generic_standard: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Sel', 'Sta', 'LS', 'RS', '⬆', '⬇', '⬅', '➡', 'Home'],
    generic: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Sel', 'Sta', 'LS', 'RS', '⬆', '⬇', '⬅', '➡', 'Home'],
  };
  return layouts[type] || layouts.generic;
}

export function getControllerDisplayName(type, id) {
  if (id && id.trim()) return id.trim().split('(')[0].trim();
  const names = {
    xbox: 'Xbox Controller',
    xbox_alt: 'Xbox (Alt) Controller',
    ps5: 'DualSense Wireless Controller',
    ps4: 'DualShock 4',
    switch_pro: 'Switch Pro Controller',
    stadia: 'Stadia Controller',
    steam: 'Steam Controller',
    generic_standard: 'Standard Gamepad',
    generic: 'Unknown Controller',
  };
  return names[type] || 'Unknown Controller';
}

export function getFaceButtonOrder(type) {
  const orders = {
    xbox_alt: [1, 2, 0, 3],
  };
  return orders[type] || [0, 1, 2, 3];
}

export function getFaceButtonPositions(type) {
  const layout = getButtonLabels(type);
  const order = getFaceButtonOrder(type);
  return {
    top: { label: layout[order[3]], color: '#ffd700', btnIdx: order[3] },
    right: { label: layout[order[1]], color: '#ff6b35', btnIdx: order[1] },
    bottom: { label: layout[order[0]], color: '#4caf50', btnIdx: order[0] },
    left: { label: layout[order[2]], color: '#3b82f6', btnIdx: order[2] },
  };
}
