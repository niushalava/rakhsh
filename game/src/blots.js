// Blots: the shadows. Each patrols a short line, back and forth, and eats any
// ink it rests on; touching Ember costs a life.

import { BLOT_RADIUS } from './config.js';

export function createBlot(def) {
  return {
    baseX: def.x,
    baseY: def.y,
    x: def.x,
    y: def.y,
    axis: def.axis,
    range: def.range,
    speed: def.speed,
    phase: def.phase ?? 0,
    radius: BLOT_RADIUS,
    wobble: Math.random() * Math.PI * 2,
  };
}

export function updateBlot(blot, dt) {
  blot.phase += (dt * blot.speed) / Math.max(1, blot.range);
  blot.wobble += dt * 3;
  const offset = Math.sin(blot.phase) * blot.range;
  const sway = Math.sin(blot.wobble) * 4;
  if (blot.axis === 'x') {
    blot.x = blot.baseX + offset;
    blot.y = blot.baseY + sway;
  } else {
    blot.x = blot.baseX + sway;
    blot.y = blot.baseY + offset;
  }
}
