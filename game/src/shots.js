// Screenshot scenes: ?shot=start|play|clear|victory stages a fixed moment of
// the game (with ?seed=N for its randomness) instead of running the loop, so the
// screenshots are real renders of the game's own code, taken the same way twice.

import { SCREEN_CLEAR, SCREEN_PLAY, SCREEN_TITLE, SCREEN_VICTORY, loadLevel } from './world.js';

function addLine(world, x1, y1, x2, y2, gold = false) {
  world.ink.segments.push({
    x1, y1, x2, y2,
    cost: Math.hypot(x2 - x1, y2 - y1) * 0.3 * (gold ? 1.5 : 1),
    eaten: 0,
    stroke: 1,
    gold,
  });
}

export function stageShot(name, world) {
  if (name === 'start') {
    world.screen = SCREEN_TITLE;
    world.best = 3420;
    world.ember.x = 200;
    world.ember.y = 505;
    if (world.stars[0]) world.stars[0].taken = true;
    addLine(world, 420, 520, 560, 520);
    return;
  }

  if (name === 'play') {
    // Mid-chase on the final page (The Long Night): Ember fleeing across the
    // islands, the Maw awake behind it, three bridges drawn and the last gap
    // still open ahead.
    loadLevel(world, 10);
    world.screen = SCREEN_PLAY;
    world.score = 5100;
    world.best = 6106;
    world.lives = 2;
    world.levelStars = 1;
    world.ink.ink = 90;
    world.ember.x = 760;
    world.ember.y = 505;
    world.ember.vx = 130;
    if (world.stars[0]) world.stars[0].taken = true;
    addLine(world, 200, 520, 320, 520);
    addLine(world, 400, 520, 520, 520);
    addLine(world, 600, 520, 720, 520);
    if (world.blots[0]) {
      world.blots[0].x = 560;
      world.blots[0].y = 475;
      world.blots[0].sleeping = false;
    }
    return;
  }

  if (name === 'clear') {
    loadLevel(world, 1);
    world.screen = SCREEN_CLEAR;
    world.score = 1860;
    world.best = 3420;
    world.levelStars = 2;
    for (const s of world.stars) s.taken = true;
    world.clearInfo = { bonus: 390, inkBonus: 140, stars: 2, starsTotal: 2 };
    return;
  }

  if (name === 'victory') {
    loadLevel(world, 10);
    world.screen = SCREEN_VICTORY;
    world.score = 6240;
    world.best = 6240;
    world.newBest = true;
    world.starsTotal = 16;
    // The Maw, left behind in the dark.
    if (world.blots[0]) {
      world.blots[0].x = 320;
      world.blots[0].y = 470;
      world.blots[0].sleeping = false;
    }
    for (const s of world.stars) s.taken = true;
    world.ember.x = 890;
    world.ember.y = 505;
    return;
  }
}
