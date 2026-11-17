// Levels: eight hand-made pages of the paper world. Each level is ground pieces
// (platforms are line segments Ember rolls on), a start, a home portal, stars
// to collect, blots on patrol, and the ink the page grants. Gaps are crossed by
// drawing bridges; steps are climbed by drawing ramps (gentle ones: Ember's
// roll climbs slopes to about 50 degrees).

export const LEVELS = [
  {
    name: 'First Light',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 100,
    platforms: [
      { x1: 0, y1: 520, x2: 420, y2: 520 },
      { x1: 560, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [{ x: 490, y: 440 }],
    blots: [],
  },
  {
    name: 'Two Gaps',
    start: { x: 70, y: 470 },
    goal: { x: 890, y: 494 },
    ink: 110,
    platforms: [
      { x1: 0, y1: 520, x2: 300, y2: 520 },
      { x1: 400, y1: 520, x2: 620, y2: 520 },
      { x1: 720, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [{ x: 350, y: 440 }, { x: 670, y: 430 }],
    blots: [],
  },
  {
    name: 'The Climb',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 354 },
    ink: 120,
    platforms: [
      { x1: 0, y1: 520, x2: 500, y2: 520 },
      { x1: 520, y1: 450, x2: 640, y2: 450 },
      { x1: 660, y1: 380, x2: 960, y2: 380 },
    ],
    stars: [{ x: 480, y: 440 }, { x: 600, y: 370 }],
    blots: [],
  },
  {
    name: 'Blot Alley',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 110,
    platforms: [
      { x1: 0, y1: 520, x2: 380, y2: 520 },
      { x1: 580, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [{ x: 480, y: 420 }],
    blots: [{ x: 480, y: 505, axis: 'x', range: 55, speed: 42 }],
  },
  {
    name: 'Star Bridge',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 130,
    platforms: [
      { x1: 0, y1: 520, x2: 330, y2: 520 },
      { x1: 630, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [{ x: 400, y: 430 }, { x: 480, y: 380 }, { x: 560, y: 430 }],
    blots: [],
  },
  {
    name: 'The Well',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 130,
    platforms: [
      { x1: 0, y1: 520, x2: 420, y2: 520 },
      { x1: 640, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [{ x: 480, y: 440 }, { x: 580, y: 400 }],
    blots: [{ x: 530, y: 450, axis: 'y', range: 70, speed: 36, phase: -Math.PI / 2 }],
  },
  {
    name: 'Twin Blots',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 140,
    platforms: [
      { x1: 0, y1: 520, x2: 280, y2: 520 },
      { x1: 300, y1: 450, x2: 520, y2: 450 },
      { x1: 540, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [{ x: 290, y: 420 }, { x: 410, y: 370 }, { x: 530, y: 420 }],
    blots: [
      { x: 290, y: 470, axis: 'x', range: 26, speed: 38 },
      { x: 530, y: 470, axis: 'x', range: 26, speed: 38 },
    ],
  },
  {
    name: 'Homecoming',
    start: { x: 80, y: 470 },
    goal: { x: 890, y: 334 },
    ink: 180,
    platforms: [
      { x1: 0, y1: 520, x2: 240, y2: 520 },
      { x1: 320, y1: 440, x2: 460, y2: 440 },
      { x1: 560, y1: 360, x2: 700, y2: 360 },
      { x1: 780, y1: 360, x2: 960, y2: 360 },
    ],
    stars: [{ x: 280, y: 430 }, { x: 510, y: 330 }, { x: 740, y: 280 }],
    blots: [
      { x: 280, y: 495, axis: 'x', range: 30, speed: 40 },
      { x: 510, y: 395, axis: 'x', range: 35, speed: 44 },
      { x: 740, y: 345, axis: 'x', range: 30, speed: 48 },
    ],
  },
];

export function levelCount() {
  return LEVELS.length;
}
