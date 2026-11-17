// Tuning for Rakhsh: one place for every number the game balances on.
// Sizes are in logical pixels; the renderer scales the 960x600 stage to the window.

export const STAGE_W = 960;
export const STAGE_H = 600;

// Fixed-step loop: the world advances in 1/60 s steps, several in a slow frame.
export const STEP = 1 / 60;
export const MAX_FRAME = 0.25;

export const LIVES_START = 3;

// Ember, the little light: a ball that always rolls toward home.
export const EMBER_RADIUS = 12;
export const GRAVITY = 900; // px/s^2
export const ROLL_SPEED = 130; // px/s toward the goal's side
export const ROLL_ACCEL = 1400; // px/s^2 driving the roll (climbs ramps to ~50 deg)
export const AIR_CONTROL = 0.35; // the roll steers this much in the air
export const RESTITUTION = 0.12; // a soft bounce off surfaces
export const FALL_Y = 640; // below this, Ember is lost and a life is spent

// Ink: the resource drawing spends. Cost is per pixel of line. Gold ink costs
// half as much again, but the blots cannot eat it — press G to switch.
export const INK_COST_PER_PX = 0.3;
export const GOLD_COST_MULT = 1.5;
export const INK_REGEN = 7; // ink per second, always trickling back
export const INK_STAR_BONUS = 25; // a star refills this much ink
export const DRAW_SPACING = 14; // px between polyline points while drawing
export const ERASE_REFUND = 0.5; // erasing your own line refunds half its ink

// Touch: a finger is a clumsier pencil than a mouse, so finger-drawn lines are
// thicker (easier to draw and to roll on), erasing reaches further, and the
// gold button stands in for the G key. None of this touches mouse play.
export const TOUCH_SEGMENT_EXTRA = 5; // extra collision radius of touch-drawn lines
export const TOUCH_ERASE_RADIUS = 28; // erase radius for a finger (mouse: 20)
export const GOLD_BUTTON = { x: 848, y: 52, w: 92, h: 30 }; // top right, under the hearts

// Blots: shadows that eat ink and hurt Ember.
export const BLOT_EAT_TIME = 0.4; // seconds of contact to eat one segment
export const BLOT_RADIUS = 16;
export const HIT_INVULNERABLE = 1.8; // seconds of mercy after a blot touches Ember

// Scoring.
export const STAR_SCORE = 100;
export const LEVEL_BONUS = 250;
export const INK_BONUS_PER = 2; // remaining ink is worth this each at level clear

// Palette: a dark paper world — a deep night sky, cyan ink, amber ember,
// gold stars. The darker the page, the brighter the light reads.
export const COLORS = {
  bg0: '#060412',
  bg1: '#0d091f',
  paper: '#150f30',
  platform: '#2a2348',
  platformTop: '#575080',
  ink: '#6ef3ff',
  inkCore: '#e8feff',
  goldInk: '#ffd76a',
  goldInkCore: '#fff8dc',
  ember: '#ffb347',
  emberCore: '#fff3c4',
  blot: '#8b5cf6',
  blotCore: '#2a1650',
  star: '#ffd76a',
  portal: '#7cffb2',
  text: '#f2efff',
  dim: '#9a93c4',
  danger: '#ff6b6b',
  gold: '#ffd76a',
};

export const BEST_KEY = 'rakhsh-best';
export const MUTE_KEY = 'rakhsh-muted';
