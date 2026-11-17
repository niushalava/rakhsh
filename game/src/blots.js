// Blots: the shadows. A patrol blot drifts back and forth on a short line; a
// chase blot (the Maw of the final page) sleeps for `wake` seconds, then hunts
// Ember at its own speed — slower than Ember's roll, so a clear road outruns
// it, but any delay lets it catch up. All blots eat the ink they rest on.

import { BLOT_RADIUS } from './config.js';

export function createBlot(def) {
  return {
    baseX: def.x,
    baseY: def.y,
    x: def.x,
    y: def.y,
    prevX: def.x,
    prevY: def.y,
    axis: def.axis ?? 'x',
    range: def.range ?? 0,
    speed: def.speed,
    phase: def.phase ?? 0,
    mode: def.mode ?? 'patrol',
    wake: def.wake ?? 0,
    maw: def.maw ?? false,
    sleeping: (def.wake ?? 0) > 0,
    justWoke: false,
    radius: def.radius ?? BLOT_RADIUS,
    wobble: Math.random() * Math.PI * 2,
  };
}

// Back to its starting place (after Ember loses a life and respawns).
export function resetBlot(blot) {
  blot.x = blot.baseX;
  blot.y = blot.baseY;
  blot.prevX = blot.baseX;
  blot.prevY = blot.baseY;
  blot.phase = 0;
  blot.sleeping = blot.wake > 0;
  blot.justWoke = false;
}

// `target` is Ember (for chase blots); `levelTime` is the seconds since the
// page started (for the wake delay).
export function updateBlot(blot, dt, target, levelTime) {
  blot.wobble += dt * 3;
  blot.prevX = blot.x;
  blot.prevY = blot.y;
  if (blot.mode === 'chase') {
    if (levelTime < blot.wake) {
      blot.sleeping = true;
      return;
    }
    // The first frame awake: the world turns this into a roar and a shake.
    if (blot.sleeping) blot.justWoke = true;
    blot.sleeping = false;
    if (!target) return;
    // Straight at Ember, at a fixed speed — it never accelerates, so a clear
    // road always outruns it.
    const dx = target.x - blot.x;
    const dy = target.y - blot.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 1) {
      blot.x += (dx / dist) * blot.speed * dt;
      blot.y += (dy / dist) * blot.speed * dt;
    }
    return;
  }
  blot.phase += (dt * blot.speed) / Math.max(1, blot.range);
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
