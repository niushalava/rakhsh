// Boot and the one loop: input is read every frame, the world advances in fixed
// 1/60 s steps (several in a slow frame, none in a fast one), and the renderer
// paints what is there. Events from the world become particles and sound here.
//
// ?seed=N fixes the run's randomness. ?shot=start|play|clear|victory (with
// &seed=N) stages that scene instead of running the loop, paints it twice and
// sets window.__shotReady for a screenshot.

import { BEST_KEY, MAX_FRAME, STAGE_H, STAGE_W, STEP } from './config.js';
import { createRandom } from './random.js';
import { createAudio } from './audio.js';
import { createParticles } from './particles.js';
import { ACTION_MUTE, createInput } from './input.js';
import { createWorld, updateWorld } from './world.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const random = createRandom(seed);
const world = createWorld(random);
// A debug hook for play-testing: the live world, readable from the console.
window.__inkbound = { world };
const input = createInput(canvas);
const audio = createAudio();
const particles = createParticles();
const renderer = createRenderer(canvas);

// The stage keeps its 16:10 shape at any window size.
function fitCanvas() {
  const scale = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
  canvas.style.width = `${Math.floor(STAGE_W * scale)}px`;
  canvas.style.height = `${Math.floor(STAGE_H * scale)}px`;
}
window.addEventListener('resize', fitCanvas);
fitCanvas();

let lastScreen = world.screen;
function announce() {
  if (world.screen === lastScreen) return;
  lastScreen = world.screen;
  const lines = {
    title: 'Inkbound. Press Enter or click to start.',
    play: `Page ${world.levelIndex + 1}. Score ${world.score}.`,
    clear: 'Page clear. Press Enter for the next page.',
    paused: 'Paused.',
    over: `Game over. Score ${world.score}, best ${world.best}. Press R to try again.`,
    victory: `Home at last. Score ${world.score}. Press R to play again.`,
  };
  status.textContent = lines[world.screen] ?? '';
}

let lastTick = 0;
function handleEvents(events) {
  for (const event of events) {
    if (event.type === 'drawTick') {
      const now = performance.now();
      if (now - lastTick > 60) {
        lastTick = now;
        audio.drawTick();
      }
    } else if (event.type === 'dry') {
      particles.addText(event.x, event.y - 16, 'OUT OF INK', '#ff6b6b');
    } else if (event.type === 'erased') {
      particles.burst(event.x, event.y, '#6ef3ff', 4, 90, 2, 0.3);
      audio.erase();
    } else if (event.type === 'eaten') {
      particles.burst(event.x, event.y, '#8b5cf6', 8, 140, 3, 0.5);
    } else if (event.type === 'star') {
      particles.burst(event.x, event.y, '#ffd76a', 12, 180, 3, 0.6);
      particles.addText(event.x, event.y - 16, '+100', '#ffd76a');
      audio.star(event.count);
    } else if (event.type === 'hit') {
      particles.burst(event.x, event.y, '#ff6b6b', 20, 280, 4, 0.8);
      audio.hit();
    } else if (event.type === 'fall') {
      audio.fall();
    } else if (event.type === 'levelClear') {
      particles.burst(event.x, event.y, '#7cffb2', 24, 260, 3.5, 0.9);
      particles.addText(event.x, event.y - 40, `+${event.value}`, '#7cffb2');
      audio.levelClear();
    } else if (event.type === 'victory') {
      audio.victory();
    } else if (event.type === 'gameOver') {
      audio.gameOver();
    } else if (event.type === 'click') {
      audio.click();
    }
  }
}

function runShot(name) {
  stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world, particles);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

if (shot) {
  runShot(shot);
} else {
  let last = performance.now();
  let acc = 0;
  let frame = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    const elapsed = Math.min(MAX_FRAME, (now - last) / 1000);
    last = now;
    acc += elapsed;
    while (acc >= STEP) {
      const actions = input.drainActions();
      const path = input.drainPath();
      if (actions.size > 0) audio.resume();
      if (actions.has(ACTION_MUTE)) audio.setMuted(!audio.muted);
      const events = [];
      updateWorld(world, input, actions, path, STEP, events);
      handleEvents(events);
      acc -= STEP;
    }
    // Ember's trail: a ribbon of warm light while it rolls.
    frame += 1;
    if (world.screen === 'play' && frame % 2 === 0) {
      const speed = Math.hypot(world.ember.vx, world.ember.vy);
      if (speed > 40) particles.trail(world.ember.x, world.ember.y, '#ffb347');
    }
    particles.update(elapsed);
    renderer.draw(world, particles);
    announce();
  }
  requestAnimationFrame(loop);
}

export { BEST_KEY };
