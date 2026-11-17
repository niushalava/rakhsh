// World: the game's state machine and its rules. Screens are title, play,
// clear (a level finished), paused, over and victory; the world owns the score,
// lives, stars, ink and every collision, and reports what happened as events
// the main loop turns into particles and sound.

import {
  BEST_KEY,
  FALL_Y,
  GOLD_BUTTON,
  HIT_INVULNERABLE,
  INK_BONUS_PER,
  INK_STAR_BONUS,
  LEVEL_BONUS,
  LIVES_START,
  STAR_SCORE,
  TOUCH_ERASE_RADIUS,
} from './config.js';
import { LEVELS, levelCount } from './levels.js';
import { createEmber, updateEmber } from './physics.js';
import {
  beginStroke,
  blotEat,
  createInkStore,
  endStroke,
  eraseAt,
  extendStroke,
  regenerateInk,
} from './ink.js';
import { createBlot, resetBlot, updateBlot } from './blots.js';
import {
  ACTION_CONFIRM,
  ACTION_DRAW_END,
  ACTION_DRAW_START,
  ACTION_ERASE_END,
  ACTION_ERASE_START,
  ACTION_GOLD,
  ACTION_PAUSE,
  ACTION_RESTART,
} from './input.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_OVER = 'over';
export const SCREEN_VICTORY = 'victory';

export const GOAL_RADIUS = 26;

export function createWorld(random) {
  const world = {
    random,
    screen: SCREEN_TITLE,
    levelIndex: 0,
    score: 0,
    levelScore: 0,
    best: 0,
    newBest: false,
    lives: LIVES_START,
    starsTotal: 0,
    levelStars: 0,
    ember: null,
    ink: null,
    blots: [],
    stars: [],
    goal: null,
    clearInfo: null,
    shake: 0,
    time: 0,
    levelTime: 0,
    dryNotified: false,
    touchMode: false, // set by the boot code on coarse pointers (phones, tablets)
  };
  try {
    world.best = Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    world.best = 0;
  }
  loadLevel(world, 0);
  return world;
}

export function currentLevel(world) {
  return LEVELS[world.levelIndex];
}

export function loadLevel(world, index) {
  const level = LEVELS[index];
  world.levelIndex = index;
  world.levelScore = 0;
  world.levelStars = 0;
  world.ember = createEmber(level.start.x, level.start.y);
  world.ink = createInkStore(level.ink);
  world.blots = level.blots.map(createBlot);
  world.stars = level.stars.map((s) => ({ ...s, taken: false }));
  world.goal = { ...level.goal };
  world.clearInfo = null;
  world.levelTime = 0;
  world.dryNotified = false;
}

function saveBest(world) {
  if (world.score > world.best) {
    world.best = world.score;
    world.newBest = true;
    try {
      window.localStorage.setItem(BEST_KEY, String(world.best));
    } catch {
      // Storage can be off: the best then lasts this visit only.
    }
  }
}

function startRun(world) {
  world.screen = SCREEN_PLAY;
  world.score = 0;
  world.newBest = false;
  world.lives = LIVES_START;
  world.starsTotal = 0;
  world.shake = 0;
  loadLevel(world, 0);
}

function restartLevel(world) {
  // The level's score is given back, so restarting can never farm points.
  world.score -= world.levelScore;
  loadLevel(world, world.levelIndex);
  world.screen = SCREEN_PLAY;
}

function loseLife(world, events, kind) {
  world.lives -= 1;
  world.shake = 14;
  if (world.lives <= 0) {
    saveBest(world);
    world.screen = SCREEN_OVER;
    events.push({ type: 'gameOver' });
    return;
  }
  if (kind === 'fall') {
    events.push({ type: 'fall', x: world.ember.x, y: world.ember.y });
  } else {
    events.push({ type: 'hit', x: world.ember.x, y: world.ember.y });
  }
  // Ember returns to the page's start, briefly untouchable, and the shadows
  // return to theirs — the Maw goes back to sleep.
  const level = currentLevel(world);
  world.ember = createEmber(level.start.x, level.start.y);
  world.ember.invulnerable = HIT_INVULNERABLE;
  for (const blot of world.blots) resetBlot(blot);
  world.levelTime = 0;
}

function levelCleared(world, events) {
  const inkBonus = Math.round(world.ink.ink) * INK_BONUS_PER;
  const bonus = LEVEL_BONUS + inkBonus;
  world.score += bonus;
  world.levelScore += bonus;
  world.clearInfo = {
    bonus,
    inkBonus,
    stars: world.levelStars,
    starsTotal: currentLevel(world).stars.length,
  };
  events.push({ type: 'levelClear', x: world.goal.x, y: world.goal.y, value: bonus });
  if (world.levelIndex + 1 >= levelCount()) {
    saveBest(world);
    world.screen = SCREEN_VICTORY;
    events.push({ type: 'victory' });
  } else {
    world.screen = SCREEN_CLEAR;
  }
}

function inGoldButton(p) {
  return p.x >= GOLD_BUTTON.x && p.x <= GOLD_BUTTON.x + GOLD_BUTTON.w
    && p.y >= GOLD_BUTTON.y && p.y <= GOLD_BUTTON.y + GOLD_BUTTON.h;
}

// One fixed step. `actions` is the set of edge-triggered actions since the last
// step, `path` the pointer points queued since then; `events` collects what
// happened for particles and sound.
export function updateWorld(world, input, actions, path, dt, events) {
  world.time += dt;
  world.shake = Math.max(0, world.shake - dt * 34);

  if (world.screen === SCREEN_TITLE) {
    // Ember idles on the first page behind the title: the world is alive.
    updateEmber(world.ember, world.goal.x, dt, currentLevel(world).platforms);
    for (const blot of world.blots) updateBlot(blot, dt, null, world.levelTime);
    if (actions.has(ACTION_CONFIRM)) {
      startRun(world);
      events.push({ type: 'click' });
    }
    return;
  }

  if (world.screen === SCREEN_OVER || world.screen === SCREEN_VICTORY) {
    if (actions.has(ACTION_RESTART) || actions.has(ACTION_CONFIRM)) {
      startRun(world);
      events.push({ type: 'click' });
    }
    return;
  }

  if (world.screen === SCREEN_CLEAR) {
    if (actions.has(ACTION_CONFIRM)) {
      loadLevel(world, world.levelIndex + 1);
      world.screen = SCREEN_PLAY;
      events.push({ type: 'click' });
    }
    return;
  }

  if (world.screen === SCREEN_PAUSED) {
    if (actions.has(ACTION_PAUSE) || actions.has(ACTION_CONFIRM)) {
      world.screen = SCREEN_PLAY;
      events.push({ type: 'click' });
    } else if (actions.has(ACTION_RESTART)) {
      restartLevel(world);
      events.push({ type: 'click' });
    }
    return;
  }

  // SCREEN_PLAY
  if (actions.has(ACTION_PAUSE)) {
    world.screen = SCREEN_PAUSED;
    events.push({ type: 'click' });
    return;
  }
  if (actions.has(ACTION_RESTART)) {
    restartLevel(world);
    events.push({ type: 'click' });
    return;
  }
  world.levelTime += dt;
  // G switches between plain ink and gold ink (half as much again, the blots
  // cannot eat it).
  if (actions.has(ACTION_GOLD)) {
    world.ink.gold = !world.ink.gold;
    events.push({ type: 'gold', on: world.ink.gold, x: input.pointer.x, y: input.pointer.y });
  }

  // Drawing and erasing follow the pointer's queued path. On touch, a tap on
  // the gold button switches ink instead of starting a line, and finger-drawn
  // lines come out thicker (input.pointer.touch marks the stroke).
  if (actions.has(ACTION_DRAW_START)) {
    if (world.touchMode && inGoldButton(input.pointer)) {
      world.ink.gold = !world.ink.gold;
      events.push({ type: 'gold', on: world.ink.gold, x: input.pointer.x, y: input.pointer.y });
    } else {
      beginStroke(world.ink, input.pointer.x, input.pointer.y, input.pointer.touch);
    }
  }
  if (actions.has(ACTION_DRAW_END)) endStroke(world.ink);
  const erasing = input.pointer.eraseDown || actions.has(ACTION_ERASE_START);
  const eraseRadius = input.pointer.touch ? TOUCH_ERASE_RADIUS : 20;
  for (const p of path) {
    if (erasing) {
      const n = eraseAt(world.ink, p.x, p.y, eraseRadius);
      if (n > 0) events.push({ type: 'erased', x: p.x, y: p.y });
    } else if (input.pointer.down) {
      const added = extendStroke(world.ink, p.x, p.y);
      if (added === 'dry') {
        if (!world.dryNotified) {
          world.dryNotified = true;
          events.push({ type: 'dry', x: p.x, y: p.y });
        }
      } else if (added > 0) {
        events.push({ type: 'drawTick' });
      }
    }
  }
  if (actions.has(ACTION_ERASE_END)) endStroke(world.ink);
  if (world.ink.ink > 5) world.dryNotified = false;
  regenerateInk(world.ink, dt);

  for (const blot of world.blots) updateBlot(blot, dt, world.ember, world.levelTime);
  for (const blot of world.blots) {
    if (blot.sleeping) continue; // a sleeping shadow neither eats nor hunts
    const eaten = blotEat(world.ink, blot, dt);
    for (const seg of eaten) {
      events.push({ type: 'eaten', x: (seg.x1 + seg.x2) / 2, y: (seg.y1 + seg.y2) / 2 });
    }
  }

  const segments = currentLevel(world).platforms.concat(world.ink.segments);
  updateEmber(world.ember, world.goal.x, dt, segments);

  // Stars: collect on touch, for score and ink.
  for (const star of world.stars) {
    if (star.taken) continue;
    const d = Math.hypot(star.x - world.ember.x, star.y - world.ember.y);
    if (d < world.ember.radius + 16) {
      star.taken = true;
      world.levelStars += 1;
      world.starsTotal += 1;
      world.score += STAR_SCORE;
      world.levelScore += STAR_SCORE;
      world.ink.ink = Math.min(world.ink.maxInk, world.ink.ink + INK_STAR_BONUS);
      events.push({ type: 'star', x: star.x, y: star.y, count: world.levelStars });
    }
  }

  // The home portal: reaching it clears the page.
  const gd = Math.hypot(world.goal.x - world.ember.x, world.goal.y - world.ember.y);
  if (gd < GOAL_RADIUS + world.ember.radius) {
    levelCleared(world, events);
    return;
  }

  // Blots: a touch costs a life, unless Ember is still untouchable or the
  // blot is asleep. Ember then returns to the page's start (loseLife respawns it).
  for (const blot of world.blots) {
    if (blot.sleeping) continue;
    const d = Math.hypot(blot.x - world.ember.x, blot.y - world.ember.y);
    if (d < blot.radius + world.ember.radius && world.ember.invulnerable <= 0) {
      loseLife(world, events, 'hit');
      return;
    }
  }

  // Falling off the page costs a life too.
  if (world.ember.y > FALL_Y) {
    loseLife(world, events, 'fall');
  }
}
