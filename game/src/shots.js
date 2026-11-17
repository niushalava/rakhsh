// Screenshot scenes: ?shot=start|play|clear|victory stages a fixed moment of
// the game (with ?seed=N for its randomness) instead of running the loop, so the
// screenshots are real renders of the game's own code, taken the same way twice.

import { SCREEN_CLEAR, SCREEN_PLAY, SCREEN_TITLE, SCREEN_VICTORY, loadLevel } from './world.js';

function addLine(world, x1, y1, x2, y2) {
  world.ink.segments.push({
    x1, y1, x2, y2,
    cost: Math.hypot(x2 - x1, y2 - y1) * 0.3,
    eaten: 0,
    stroke: 1,
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
    // Mid-level on page 7 (Twin Blots): a ramp up to the middle step, Ember
    // rolling across it, a blot threatening the ramp, stars above.
    loadLevel(world, 6);
    world.screen = SCREEN_PLAY;
    world.score = 2340;
    world.best = 3420;
    world.lives = 3;
    world.levelStars = 1;
    world.ink.ink = 62;
    world.ember.x = 410;
    world.ember.y = 436;
    world.ember.vx = 120;
    if (world.stars[0]) world.stars[0].taken = true;
    addLine(world, 200, 520, 300, 450);
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
    loadLevel(world, 7);
    world.screen = SCREEN_VICTORY;
    world.score = 5240;
    world.best = 5240;
    world.newBest = true;
    world.starsTotal = 14;
    world.blots = [];
    for (const s of world.stars) s.taken = true;
    world.ember.x = 860;
    world.ember.y = 340;
    return;
  }
}
