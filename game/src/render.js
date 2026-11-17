// Render: every pixel the game paints. A dark paper world — indigo night with
// paper grain, stone ledges, glowing cyan ink, a warm little ember, purple
// blots, gold stars and the home portal — plus a HUD readable at a glance and
// the title, page-clear, pause, game-over and victory screens.

import { BLOT_EAT_TIME, COLORS, LEVEL_BONUS, STAGE_H, STAGE_W } from './config.js';
import { createRandom } from './random.js';
import {
  GOAL_RADIUS,
  SCREEN_CLEAR,
  SCREEN_OVER,
  SCREEN_PAUSED,
  SCREEN_PLAY,
  SCREEN_TITLE,
  SCREEN_VICTORY,
  currentLevel,
} from './world.js';
import { levelCount } from './levels.js';

const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawHeart(ctx, x, y, size, fill) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 16, size / 16);
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(-7, -3, -12, 2, -8, 8);
  ctx.bezierCurveTo(-5, 12, 0, 15, 0, 15);
  ctx.bezierCurveTo(0, 15, 5, 12, 8, 8);
  ctx.bezierCurveTo(12, 2, 7, -3, 0, 5);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

function drawStar(ctx, x, y, r, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = Math.cos(angle) * rad;
    const py = Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.restore();
}

function glowDot(ctx, x, y, radius, color, coreColor) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
  grad.addColorStop(0, coreColor);
  grad.addColorStop(0.25, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = coreColor;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = STAGE_W * dpr;
  canvas.height = STAGE_H * dpr;

  // The paper: gradient, grain and faint ink splatters, drawn once.
  const bg = document.createElement('canvas');
  bg.width = STAGE_W;
  bg.height = STAGE_H;
  const bctx = bg.getContext('2d');
  const grad = bctx.createLinearGradient(0, 0, 0, STAGE_H);
  grad.addColorStop(0, COLORS.bg0);
  grad.addColorStop(1, COLORS.bg1);
  bctx.fillStyle = grad;
  bctx.fillRect(0, 0, STAGE_W, STAGE_H);
  const rng = createRandom(4242);
  bctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let i = 0; i < 500; i += 1) {
    bctx.fillRect(rng.range(0, STAGE_W), rng.range(0, STAGE_H), 1.5, 1.5);
  }
  // Brighter stars, mostly in the upper sky.
  for (let i = 0; i < 70; i += 1) {
    const sx = rng.range(0, STAGE_W);
    const sy = rng.range(0, STAGE_H * 0.62);
    const sr = rng.range(0.6, 1.8);
    bctx.fillStyle = `rgba(255,255,255,${rng.range(0.15, 0.6).toFixed(2)})`;
    bctx.beginPath();
    bctx.arc(sx, sy, sr, 0, Math.PI * 2);
    bctx.fill();
  }
  // A pale moon with a halo, upper right.
  const moonX = 830;
  const moonY = 105;
  const halo = bctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 130);
  halo.addColorStop(0, 'rgba(220, 230, 255, 0.28)');
  halo.addColorStop(1, 'rgba(220, 230, 255, 0)');
  bctx.fillStyle = halo;
  bctx.fillRect(moonX - 130, moonY - 130, 260, 260);
  bctx.fillStyle = 'rgba(235, 240, 255, 0.9)';
  bctx.beginPath();
  bctx.arc(moonX, moonY, 26, 0, Math.PI * 2);
  bctx.fill();
  bctx.fillStyle = 'rgba(200, 210, 235, 0.5)';
  bctx.beginPath();
  bctx.arc(moonX - 8, moonY - 4, 6, 0, Math.PI * 2);
  bctx.arc(moonX + 9, moonY + 8, 4, 0, Math.PI * 2);
  bctx.fill();
  const splats = [
    { x: 150, y: 120, r: 130, c: 'rgba(60, 40, 120, 0.35)' },
    { x: 820, y: 480, r: 170, c: 'rgba(20, 70, 110, 0.3)' },
    { x: 500, y: 80, r: 110, c: 'rgba(90, 30, 100, 0.28)' },
  ];
  for (const s of splats) {
    const g = bctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
    g.addColorStop(0, s.c);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    bctx.fillStyle = g;
    bctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
  }
  // Faint ruled lines, like a notebook page.
  bctx.strokeStyle = 'rgba(255,255,255,0.045)';
  bctx.lineWidth = 1;
  for (let y = 60; y < STAGE_H; y += 60) {
    bctx.beginPath();
    bctx.moveTo(0, y);
    bctx.lineTo(STAGE_W, y);
    bctx.stroke();
  }

  // Fireflies: drifting motes of warm light, seeded so a screenshot is the
  // same twice. Their positions are a function of time, never of frame order.
  const fireflies = [];
  const frng = createRandom(777);
  for (let i = 0; i < 36; i += 1) {
    fireflies.push({
      x: frng.range(0, STAGE_W),
      y: frng.range(60, STAGE_H - 80),
      r: frng.range(14, 42),
      speed: frng.range(0.1, 0.35),
      phase: frng.range(0, Math.PI * 2),
      size: frng.range(1.2, 2.6),
    });
  }

  function drawFireflies(time) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const f of fireflies) {
      const x = f.x + Math.sin(time * f.speed + f.phase) * f.r;
      const y = f.y + Math.cos(time * f.speed * 0.8 + f.phase * 1.7) * f.r * 0.6;
      const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 1.4 + f.phase * 3));
      ctx.globalAlpha = twinkle * 0.8;
      ctx.fillStyle = '#ffe9a3';
      ctx.beginPath();
      ctx.arc(x, y, f.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPlatforms(level) {
    for (const p of level.platforms) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.strokeStyle = COLORS.platform;
      ctx.lineWidth = 24;
      ctx.beginPath();
      ctx.moveTo(p.x1, p.y1 + 12);
      ctx.lineTo(p.x2, p.y2 + 12);
      ctx.stroke();
      ctx.strokeStyle = COLORS.platformTop;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(p.x1, p.y1);
      ctx.lineTo(p.x2, p.y2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawInk(segments) {
    if (segments.length === 0) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'lighter';
    for (const seg of segments) {
      const fade = seg.eaten > 0 ? 1 - (seg.eaten / BLOT_EAT_TIME) * 0.65 : 1;
      ctx.globalAlpha = fade;
      ctx.strokeStyle = seg.gold ? COLORS.goldInk : COLORS.ink;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.stroke();
    }
    for (const seg of segments) {
      const fade = seg.eaten > 0 ? 1 - (seg.eaten / BLOT_EAT_TIME) * 0.65 : 1;
      ctx.globalAlpha = fade;
      ctx.strokeStyle = seg.gold ? COLORS.goldInkCore : COLORS.inkCore;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawStars(stars, time) {
    for (const s of stars) {
      if (s.taken) continue;
      const pulse = 1 + 0.15 * Math.sin(time * 3 + s.x);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = COLORS.star;
      ctx.shadowBlur = 18;
      ctx.fillStyle = COLORS.star;
      drawStar(ctx, s.x, s.y, 13 * pulse, time * 0.6);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawPortal(goal, time) {
    const x = goal.x;
    const y = goal.y;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const beam = ctx.createLinearGradient(x, y - 90, x, y + 30);
    beam.addColorStop(0, 'rgba(124,255,178,0)');
    beam.addColorStop(1, 'rgba(124,255,178,0.25)');
    ctx.fillStyle = beam;
    ctx.fillRect(x - 16, y - 90, 32, 120);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = COLORS.portal;
    ctx.lineWidth = 4;
    ctx.shadowColor = COLORS.portal;
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(x, y, GOAL_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(124,255,178,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, GOAL_RADIUS - 9, time * 1.5, time * 1.5 + Math.PI * 1.4);
    ctx.stroke();
    ctx.fillStyle = COLORS.portal;
    ctx.font = `800 13px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('HOME', x, y - GOAL_RADIUS - 10);
    ctx.restore();
  }

  function drawBlots(blots, time) {
    for (const b of blots) {
      const rimColor = b.maw ? '#c026d3' : COLORS.blot;
      ctx.save();
      if (b.sleeping) ctx.globalAlpha = 0.7;
      ctx.globalCompositeOperation = 'lighter';
      const rim = ctx.createRadialGradient(b.x, b.y, b.radius * 0.4, b.x, b.y, b.radius * 1.8);
      rim.addColorStop(0, 'rgba(0,0,0,0)');
      rim.addColorStop(1, rimColor);
      ctx.globalAlpha = b.sleeping ? 0.3 : 0.5;
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      if (b.sleeping) ctx.globalAlpha = 0.75;
      ctx.fillStyle = COLORS.blotCore;
      ctx.strokeStyle = rimColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const spikes = 9;
      for (let i = 0; i <= spikes * 2; i += 1) {
        const angle = (i / (spikes * 2)) * Math.PI * 2 + b.wobble * 0.3;
        const r = i % 2 === 0 ? b.radius : b.radius * 0.7;
        const px = b.x + Math.cos(angle) * r;
        const py = b.y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Eyes scale with the blot; the Maw's burn red, and a sleeping blot's
      // are shut.
      const es = b.radius / 16;
      if (b.sleeping) {
        ctx.strokeStyle = '#e8d5ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.x - 7 * es, b.y - 2);
        ctx.lineTo(b.x - 3 * es, b.y - 2);
        ctx.moveTo(b.x + 3 * es, b.y - 2);
        ctx.lineTo(b.x + 7 * es, b.y - 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = b.maw ? '#ff5a5a' : '#e8d5ff';
        if (b.maw) {
          ctx.shadowColor = '#ff5a5a';
          ctx.shadowBlur = 10;
        }
        ctx.beginPath();
        ctx.arc(b.x - 5 * es, b.y - 2, 2.6 * es, 0, Math.PI * 2);
        ctx.arc(b.x + 5 * es, b.y - 2, 2.6 * es, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawEmber(ember, time) {
    const flicker = ember.invulnerable > 0 && Math.sin(time * 26) > 0;
    ctx.save();
    if (flicker) ctx.globalAlpha = 0.4;
    glowDot(ctx, ember.x, ember.y, ember.radius, COLORS.ember, COLORS.emberCore);
    // Two little eyes, looking where Ember rolls.
    const look = ember.vx >= 0 ? 2 : -2;
    ctx.fillStyle = '#3a2200';
    ctx.beginPath();
    ctx.arc(ember.x - 4 + look, ember.y - 2, 2.2, 0, Math.PI * 2);
    ctx.arc(ember.x + 4 + look, ember.y - 2, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawHud(world) {
    const level = currentLevel(world);
    ctx.save();
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = COLORS.text;
    ctx.font = `800 30px ${FONT}`;
    ctx.fillText(world.score.toLocaleString('en-US'), 20, 14);
    ctx.fillStyle = COLORS.dim;
    ctx.font = `600 12px ${FONT}`;
    ctx.fillText(`BEST ${world.best.toLocaleString('en-US')}`, 21, 50);
    // Page name, top centre.
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.text;
    ctx.font = `800 19px ${FONT}`;
    ctx.fillText(`PAGE ${world.levelIndex + 1}/${levelCount()} — ${level.name}`, STAGE_W / 2, 16);
    ctx.fillStyle = COLORS.dim;
    ctx.font = `600 12px ${FONT}`;
    ctx.fillText(`${world.levelStars}/${level.stars.length} STARS`, STAGE_W / 2, 42);
    // Lives as hearts, top right.
    for (let i = 0; i < world.lives; i += 1) {
      drawHeart(ctx, STAGE_W - 28 - i * 30, 32, 15, '#ff8fa3');
    }
    // Ink meter, bottom centre: the resource that matters most.
    const frac = world.ink.ink / world.ink.maxInk;
    const low = frac < 0.18;
    const bw = 320;
    const bx = STAGE_W / 2 - bw / 2;
    const by = STAGE_H - 30;
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    roundRect(ctx, bx, by, bw, 12, 6);
    ctx.fill();
    ctx.fillStyle = low ? COLORS.danger : (world.ink.gold ? COLORS.goldInk : COLORS.ink);
    if (frac > 0) {
      roundRect(ctx, bx, by, bw * frac, 12, 6);
      ctx.fill();
    }
    ctx.fillStyle = low ? COLORS.danger : (world.ink.gold ? COLORS.goldInk : COLORS.ink);
    ctx.font = `700 12px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(
      low ? 'INK LOW — WAIT FOR IT TO REFILL' : (world.ink.gold ? 'GOLD INK — 50% MORE, BLOTS CAN\'T EAT IT' : 'INK'),
      STAGE_W / 2,
      by - 20,
    );
    ctx.fillStyle = COLORS.dim;
    ctx.font = `600 11px ${FONT}`;
    ctx.fillText('DRAW with the mouse · RIGHT-DRAG erases · G gold ink · R restarts the page', STAGE_W / 2, STAGE_H - 14);
    ctx.restore();
  }

  function dimScreen(alpha) {
    ctx.save();
    ctx.fillStyle = `rgba(8, 6, 20, ${alpha})`;
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    ctx.restore();
  }

  function drawTitle(world, time) {
    dimScreen(0.5);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.text;
    ctx.font = `900 76px ${FONT}`;
    ctx.shadowColor = COLORS.ink;
    ctx.shadowBlur = 30;
    ctx.fillText('INKBOUND', STAGE_W / 2, 120);
    ctx.shadowBlur = 0;
    ctx.fillStyle = COLORS.gold;
    ctx.font = `600 21px ${FONT}`;
    ctx.fillText('Draw the way home.', STAGE_W / 2, 210);
    ctx.fillStyle = COLORS.text;
    ctx.font = `500 17px ${FONT}`;
    ctx.fillText('Ember is lost in the dark. Draw bridges of ink to guide the little light home —', STAGE_W / 2, 258);
    ctx.fillText('but ink runs out, and the shadows eat it. Eleven pages. Three lives.', STAGE_W / 2, 284);
    ctx.fillStyle = COLORS.dim;
    ctx.font = `600 15px ${FONT}`;
    ctx.fillText('MOUSE — draw ink      RIGHT-DRAG — erase      R — restart page      P — pause      M — mute', STAGE_W / 2, 340);
    ctx.fillStyle = COLORS.goldInk;
    ctx.fillText('G — gold ink: costs 50% more, the shadows can\'t eat it', STAGE_W / 2, 366);
    const pulse = 0.65 + 0.35 * Math.sin(time * 3.2);
    ctx.globalAlpha = pulse;
    ctx.fillStyle = COLORS.ink;
    ctx.font = `800 22px ${FONT}`;
    ctx.fillText('CLICK OR PRESS ENTER TO BEGIN', STAGE_W / 2, 414);
    ctx.globalAlpha = 1;
    if (world.best > 0) {
      ctx.fillStyle = COLORS.dim;
      ctx.font = `600 15px ${FONT}`;
      ctx.fillText(`BEST ${world.best.toLocaleString('en-US')}`, STAGE_W / 2, 458);
    }
    ctx.restore();
  }

  function drawClear(world) {
    dimScreen(0.6);
    const info = world.clearInfo || { bonus: 0, inkBonus: 0, stars: 0, starsTotal: 1 };
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.portal;
    ctx.font = `800 40px ${FONT}`;
    ctx.fillText('PAGE CLEAR!', STAGE_W / 2, 130);
    // Stars earned, filled or dim.
    for (let i = 0; i < info.starsTotal; i += 1) {
      const x = STAGE_W / 2 + (i - (info.starsTotal - 1) / 2) * 64;
      ctx.save();
      ctx.fillStyle = i < info.stars ? COLORS.star : 'rgba(255,215,106,0.25)';
      if (i < info.stars) {
        ctx.shadowColor = COLORS.star;
        ctx.shadowBlur = 16;
      }
      drawStar(ctx, x, 230, 22);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = COLORS.text;
    ctx.font = `600 18px ${FONT}`;
    ctx.fillText(`Page bonus +${LEVEL_BONUS}   ·   Ink bonus +${info.inkBonus}`, STAGE_W / 2, 282);
    ctx.fillStyle = COLORS.gold;
    ctx.font = `800 26px ${FONT}`;
    ctx.fillText(`+${info.bonus.toLocaleString('en-US')}   —   SCORE ${world.score.toLocaleString('en-US')}`, STAGE_W / 2, 322);
    ctx.fillStyle = COLORS.ink;
    ctx.font = `800 21px ${FONT}`;
    ctx.fillText('CLICK OR PRESS ENTER FOR THE NEXT PAGE', STAGE_W / 2, 398);
    ctx.restore();
  }

  function drawPaused() {
    dimScreen(0.6);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.text;
    ctx.font = `800 44px ${FONT}`;
    ctx.fillText('PAUSED', STAGE_W / 2, 250);
    ctx.fillStyle = COLORS.dim;
    ctx.font = `600 17px ${FONT}`;
    ctx.fillText('Press P or click to keep drawing', STAGE_W / 2, 310);
    ctx.restore();
  }

  function drawOver(world) {
    dimScreen(0.55);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.danger;
    ctx.font = `900 48px ${FONT}`;
    ctx.fillText('THE LIGHT GOES OUT', STAGE_W / 2, 140);
    ctx.fillStyle = COLORS.text;
    ctx.font = `800 40px ${FONT}`;
    ctx.fillText(world.score.toLocaleString('en-US'), STAGE_W / 2, 220);
    ctx.fillStyle = COLORS.dim;
    ctx.font = `600 17px ${FONT}`;
    ctx.fillText(`BEST ${world.best.toLocaleString('en-US')}      PAGE ${world.levelIndex + 1}/${levelCount()}`, STAGE_W / 2, 280);
    ctx.fillStyle = COLORS.ink;
    ctx.font = `800 21px ${FONT}`;
    ctx.fillText('PRESS R OR CLICK TO TRY AGAIN', STAGE_W / 2, 360);
    ctx.restore();
  }

  function drawVictory(world) {
    dimScreen(0.5);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.portal;
    ctx.font = `900 54px ${FONT}`;
    ctx.fillText('HOME AT LAST', STAGE_W / 2, 120);
    if (world.newBest) {
      ctx.fillStyle = COLORS.gold;
      ctx.font = `800 20px ${FONT}`;
      ctx.fillText('★ NEW BEST ★', STAGE_W / 2, 186);
    }
    ctx.fillStyle = COLORS.text;
    ctx.font = `800 42px ${FONT}`;
    ctx.fillText(world.score.toLocaleString('en-US'), STAGE_W / 2, 230);
    ctx.fillStyle = COLORS.dim;
    ctx.font = `600 17px ${FONT}`;
    ctx.fillText(`BEST ${world.best.toLocaleString('en-US')}      ${world.starsTotal} STARS COLLECTED`, STAGE_W / 2, 292);
    ctx.fillStyle = COLORS.text;
    ctx.font = `500 17px ${FONT}`;
    ctx.fillText('Ember is home. Every page, every star, every line of ink — yours.', STAGE_W / 2, 336);
    ctx.fillStyle = COLORS.ink;
    ctx.font = `800 21px ${FONT}`;
    ctx.fillText('PRESS R OR CLICK TO PLAY AGAIN', STAGE_W / 2, 400);
    ctx.restore();
  }

  return {
    draw(world, particles) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, STAGE_W, STAGE_H);
      ctx.save();
      if (world.shake > 0.2) {
        ctx.translate((Math.random() - 0.5) * world.shake, (Math.random() - 0.5) * world.shake);
      }
      ctx.drawImage(bg, 0, 0);
      drawFireflies(world.time);
      const level = currentLevel(world);
      drawPlatforms(level);
      drawPortal(world.goal, world.time);
      drawStars(world.stars, world.time);
      drawInk(world.ink.segments);
      drawBlots(world.blots, world.time);
      drawEmber(world.ember, world.time);
      particles.draw(ctx);
      ctx.restore();

      if (world.screen === SCREEN_PLAY || world.screen === SCREEN_CLEAR || world.screen === SCREEN_PAUSED) {
        drawHud(world);
      }
      if (world.screen === SCREEN_TITLE) drawTitle(world, world.time);
      if (world.screen === SCREEN_CLEAR) drawClear(world);
      if (world.screen === SCREEN_PAUSED) drawPaused();
      if (world.screen === SCREEN_OVER) drawOver(world);
      if (world.screen === SCREEN_VICTORY) drawVictory(world);

      ctx.save();
      const vg = ctx.createRadialGradient(
        STAGE_W / 2, STAGE_H / 2, STAGE_H * 0.45,
        STAGE_W / 2, STAGE_H / 2, STAGE_H * 0.85,
      );
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(4,3,12,0.5)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, STAGE_W, STAGE_H);
      ctx.restore();
    },
  };
}
