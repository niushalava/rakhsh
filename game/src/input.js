// Input: the pointer is the pencil. Left-drag draws ink, right-drag erases it;
// the pointer's path is queued as points the world drains each step. Keys are
// edge-triggered actions, so a tap never fires twice. On touch there is no
// right button: one finger draws, a second finger switches the stroke to
// erasing, and the stroke is marked touch so its lines come out thicker.

import { STAGE_H, STAGE_W } from './config.js';

export const ACTION_CONFIRM = 'confirm';
export const ACTION_PAUSE = 'pause';
export const ACTION_RESTART = 'restart';
export const ACTION_MUTE = 'mute';
export const ACTION_GOLD = 'gold';
export const ACTION_DRAW_START = 'drawStart';
export const ACTION_DRAW_END = 'drawEnd';
export const ACTION_ERASE_START = 'eraseStart';
export const ACTION_ERASE_END = 'eraseEnd';

const CONFIRM_KEYS = new Set(['Enter', ' ']);
const PAUSE_KEYS = new Set(['p', 'P', 'Escape']);
const RESTART_KEYS = new Set(['r', 'R']);
const MUTE_KEYS = new Set(['m', 'M']);
const GOLD_KEYS = new Set(['g', 'G']);

export function createInput(canvas) {
  const queued = new Set();
  const path = [];
  const activePointers = new Set();
  const pointer = { x: STAGE_W / 2, y: STAGE_H / 2, down: false, eraseDown: false, touch: false };

  function toStage(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * STAGE_W,
      y: ((clientY - rect.top) / rect.height) * STAGE_H,
    };
  }

  canvas.addEventListener('pointermove', (event) => {
    const p = toStage(event.clientX, event.clientY);
    pointer.x = p.x;
    pointer.y = p.y;
    if (pointer.down || pointer.eraseDown) path.push({ x: p.x, y: p.y });
  });
  canvas.addEventListener('pointerdown', (event) => {
    const p = toStage(event.clientX, event.clientY);
    pointer.x = p.x;
    pointer.y = p.y;
    activePointers.add(event.pointerId);
    pointer.touch = event.pointerType === 'touch';
    if (pointer.touch && activePointers.size > 1) {
      // A second finger: the stroke becomes an eraser (touch has no right-drag).
      if (pointer.down) queued.add(ACTION_DRAW_END);
      pointer.down = false;
      pointer.eraseDown = true;
      queued.add(ACTION_ERASE_START);
      path.length = 0;
      path.push({ x: p.x, y: p.y });
      return;
    }
    if (event.button === 2) {
      pointer.eraseDown = true;
      queued.add(ACTION_ERASE_START);
      path.push({ x: p.x, y: p.y });
    } else if (event.button === 0) {
      pointer.down = true;
      queued.add(ACTION_DRAW_START);
      queued.add(ACTION_CONFIRM);
      path.push({ x: p.x, y: p.y });
    }
  });
  function endStroke(event) {
    if (event && event.pointerId !== undefined) activePointers.delete(event.pointerId);
    if (activePointers.size > 0) return; // another finger is still down
    if (pointer.down) queued.add(ACTION_DRAW_END);
    if (pointer.eraseDown) queued.add(ACTION_ERASE_END);
    pointer.down = false;
    pointer.eraseDown = false;
  }
  window.addEventListener('pointerup', endStroke);
  window.addEventListener('pointercancel', endStroke);
  window.addEventListener('blur', () => {
    activePointers.clear();
    endStroke();
  });
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    if (CONFIRM_KEYS.has(event.key)) queued.add(ACTION_CONFIRM);
    if (PAUSE_KEYS.has(event.key)) queued.add(ACTION_PAUSE);
    if (RESTART_KEYS.has(event.key)) queued.add(ACTION_RESTART);
    if (MUTE_KEYS.has(event.key)) queued.add(ACTION_MUTE);
    if (GOLD_KEYS.has(event.key)) queued.add(ACTION_GOLD);
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  });

  return {
    pointer,
    /** Pointer points queued since the last drain, in order; drains the queue. */
    drainPath() {
      const out = path.splice(0, path.length);
      return out;
    },
    /** Actions pressed since the last drain, as a Set; drains the queue. */
    drainActions() {
      const out = new Set(queued);
      queued.clear();
      return out;
    },
  };
}
