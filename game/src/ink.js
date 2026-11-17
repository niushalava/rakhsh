// Ink: the lines the player draws. A stroke is built point by point as the
// pointer moves; each span becomes a solid segment Ember can roll on, and costs
// ink by its length. Right-drag erases segments (half the ink back); blots eat
// segments they rest on.

import {
  BLOT_EAT_TIME,
  DRAW_SPACING,
  ERASE_REFUND,
  INK_COST_PER_PX,
  INK_REGEN,
} from './config.js';

export function createInkStore(maxInk) {
  return {
    segments: [],
    current: null,
    ink: maxInk,
    maxInk,
    nextStroke: 1,
  };
}

export function beginStroke(store, x, y) {
  if (store.ink <= 0) return;
  store.current = { id: store.nextStroke, points: [{ x, y }] };
  store.nextStroke += 1;
}

// Extends the stroke in progress toward (x, y), adding a segment each time the
// pointer has moved DRAW_SPACING from the last point. Returns how many segments
// were added, or 'dry' when the ink ran out mid-stroke.
export function extendStroke(store, x, y) {
  const stroke = store.current;
  if (!stroke) return 0;
  let added = 0;
  let last = stroke.points[stroke.points.length - 1];
  let dx = x - last.x;
  let dy = y - last.y;
  let dist = Math.hypot(dx, dy);
  while (dist >= DRAW_SPACING) {
    const step = DRAW_SPACING / dist;
    const nx = last.x + dx * step;
    const ny = last.y + dy * step;
    const cost = DRAW_SPACING * INK_COST_PER_PX;
    if (store.ink < cost) {
      store.ink = 0;
      store.current = null;
      return 'dry';
    }
    store.ink -= cost;
    store.segments.push({
      x1: last.x, y1: last.y, x2: nx, y2: ny,
      cost, eaten: 0, stroke: stroke.id,
    });
    stroke.points.push({ x: nx, y: ny });
    added += 1;
    last = { x: nx, y: ny };
    dx = x - last.x;
    dy = y - last.y;
    dist = Math.hypot(dx, dy);
  }
  return added;
}

export function endStroke(store) {
  store.current = null;
}

function pointSegmentDistance(px, py, seg) {
  const dx = seg.x2 - seg.x1;
  const dy = seg.y2 - seg.y1;
  const len2 = dx * dx + dy * dy;
  let t = 0;
  if (len2 > 0) t = Math.max(0, Math.min(1, ((px - seg.x1) * dx + (py - seg.y1) * dy) / len2));
  const cx = seg.x1 + dx * t;
  const cy = seg.y1 + dy * t;
  return Math.hypot(px - cx, py - cy);
}

// Erases every segment within radius of (x, y), refunding half their ink.
// Returns how many segments were erased.
export function eraseAt(store, x, y, radius = 20) {
  let erased = 0;
  let refund = 0;
  store.segments = store.segments.filter((seg) => {
    if (pointSegmentDistance(x, y, seg) < radius) {
      erased += 1;
      refund += seg.cost * ERASE_REFUND;
      return false;
    }
    return true;
  });
  if (erased > 0) store.ink = Math.min(store.maxInk, store.ink + refund);
  return erased;
}

// A blot resting on segments eats them, one after BLOT_EAT_TIME of contact.
// Returns the eaten segments (for particles).
export function blotEat(store, blot, dt) {
  const eaten = [];
  for (const seg of store.segments) {
    if (pointSegmentDistance(blot.x, blot.y, seg) < blot.radius + 2) {
      seg.eaten += dt;
    } else {
      seg.eaten = Math.max(0, seg.eaten - dt * 2);
    }
  }
  store.segments = store.segments.filter((seg) => {
    if (seg.eaten >= BLOT_EAT_TIME) {
      eaten.push(seg);
      return false;
    }
    return true;
  });
  return eaten;
}

export function regenerateInk(store, dt) {
  store.ink = Math.min(store.maxInk, store.ink + INK_REGEN * dt);
}
