// Physics: Ember is a ball that rolls toward home under gravity, and every
// surface — a level platform or a drawn ink line — is a segment the ball
// collides with. Collision is circle-vs-segment: the closest point on the
// segment pushes the ball out, and the velocity into the surface is removed
// with a soft bounce.

import {
  AIR_CONTROL,
  EMBER_RADIUS,
  GRAVITY,
  RESTITUTION,
  ROLL_ACCEL,
  ROLL_SPEED,
  STAGE_W,
} from './config.js';

export function createEmber(x, y) {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    radius: EMBER_RADIUS,
    onGround: false,
    invulnerable: 0,
  };
}

function closestOnSegment(px, py, seg) {
  const dx = seg.x2 - seg.x1;
  const dy = seg.y2 - seg.y1;
  const len2 = dx * dx + dy * dy;
  let t = 0;
  if (len2 > 0) t = Math.max(0, Math.min(1, ((px - seg.x1) * dx + (py - seg.y1) * dy) / len2));
  return { x: seg.x1 + dx * t, y: seg.y1 + dy * t };
}

// Pushes the ball out of every segment it overlaps and removes the velocity
// into each surface. Two passes keep corners stable. Returns true when the
// ball rests on a surface (a normal pointing mostly up).
export function collideSegments(ember, segments) {
  let grounded = false;
  for (let pass = 0; pass < 2; pass += 1) {
    for (const seg of segments) {
      const c = closestOnSegment(ember.x, ember.y, seg);
      let nx = ember.x - c.x;
      let ny = ember.y - c.y;
      let dist = Math.hypot(nx, ny);
      if (dist >= ember.radius) continue;
      if (dist < 0.001) {
        // Dead centre on the segment: push along its normal instead.
        const dx = seg.x2 - seg.x1;
        const dy = seg.y2 - seg.y1;
        const len = Math.hypot(dx, dy) || 1;
        nx = -dy / len;
        ny = dx / len;
        dist = 0.001;
      } else {
        nx /= dist;
        ny /= dist;
      }
      ember.x += nx * (ember.radius - dist);
      ember.y += ny * (ember.radius - dist);
      const vn = ember.vx * nx + ember.vy * ny;
      if (vn < 0) {
        ember.vx -= (1 + RESTITUTION) * vn * nx;
        ember.vy -= (1 + RESTITUTION) * vn * ny;
        // A touch of friction along the surface.
        const tx = -ny;
        const ty = nx;
        const vt = ember.vx * tx + ember.vy * ty;
        ember.vx -= vt * 0.02 * tx;
        ember.vy -= vt * 0.02 * ty;
      }
      if (ny < -0.5) grounded = true;
    }
  }
  return grounded;
}

// One step: gravity, the roll toward home, then integrate and collide.
export function updateEmber(ember, goalX, dt, segments) {
  ember.invulnerable = Math.max(0, ember.invulnerable - dt);
  ember.vy += GRAVITY * dt;

  // The roll seeks a steady speed toward the goal's side — strong on the
  // ground, weaker in the air — so Ember climbs ramps but never sprints.
  const dir = goalX >= ember.x ? 1 : -1;
  const accel = (ember.onGround ? ROLL_ACCEL : ROLL_ACCEL * AIR_CONTROL) * dt;
  const target = dir * ROLL_SPEED;
  const dv = Math.max(-accel, Math.min(accel, target - ember.vx));
  ember.vx += dv;
  if (ember.vx > 320) ember.vx = 320;
  if (ember.vx < -320) ember.vx = -320;
  if (ember.vy > 700) ember.vy = 700;

  ember.x += ember.vx * dt;
  ember.y += ember.vy * dt;

  // The page's side walls bounce Ember back in.
  if (ember.x < ember.radius) { ember.x = ember.radius; ember.vx = Math.abs(ember.vx) * 0.4; }
  if (ember.x > STAGE_W - ember.radius) { ember.x = STAGE_W - ember.radius; ember.vx = -Math.abs(ember.vx) * 0.4; }

  ember.onGround = collideSegments(ember, segments);
}
