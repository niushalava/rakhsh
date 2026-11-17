// Levels: eleven hand-made pages of the paper world. Each level is ground
// pieces (platforms are line segments Ember rolls on), a start, a home portal,
// stars to collect, blots on patrol, and the ink the page grants. Gaps are
// crossed by drawing bridges; steps are climbed by drawing ramps (gentle ones:
// Ember's roll climbs slopes to about 50 degrees).
//
// The story: the Paper Sky went dark, and Ember — the last little light —
// must cross eleven pages of night to reach the Dawn Door. Each page opens
// with one story beat, and every star has a funny line Ember thinks on
// collecting it.

export const LEVELS = [
  {
    name: 'First Light',
    story: 'Ember wakes in the dark. Home is far — but the ink is warm.',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 100,
    platforms: [
      { x1: 0, y1: 520, x2: 420, y2: 520 },
      { x1: 560, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [{ x: 490, y: 440, line: 'First star! Ember feels 12% more heroic already.' }],
    blots: [],
  },
  {
    name: 'Two Gaps',
    story: 'The night is full of holes. Good thing Ember brought a pen.',
    start: { x: 70, y: 470 },
    goal: { x: 890, y: 494 },
    ink: 110,
    platforms: [
      { x1: 0, y1: 520, x2: 300, y2: 520 },
      { x1: 400, y1: 520, x2: 620, y2: 520 },
      { x1: 720, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [
      { x: 350, y: 440, line: 'A star! Pocket it. Stars are light snacks.' },
      { x: 670, y: 430, line: 'Two stars down. Ember is basically a collector now.' },
    ],
    blots: [],
  },
  {
    name: 'The Climb',
    story: 'Up, up — the stars are closer than they look.',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 354 },
    ink: 120,
    platforms: [
      { x1: 0, y1: 520, x2: 500, y2: 520 },
      { x1: 520, y1: 450, x2: 640, y2: 450 },
      { x1: 660, y1: 380, x2: 960, y2: 380 },
    ],
    stars: [
      { x: 480, y: 440, line: 'Climbing pays off. Who knew?' },
      { x: 600, y: 370, line: 'Up here the air smells like… victory. And pencil.' },
    ],
    blots: [],
  },
  {
    name: 'Blot Alley',
    story: 'Something moves in the dark. It is hungry. It is also slow.',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 130,
    platforms: [
      { x1: 0, y1: 520, x2: 380, y2: 520 },
      { x1: 580, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [{ x: 480, y: 420, line: "A star, right under a shadow's nose. Bold." }],
    blots: [{ x: 480, y: 505, axis: 'x', range: 55, speed: 42 }],
  },
  {
    name: 'Star Bridge',
    story: 'Three stars wink from the dark. They know the way.',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 130,
    platforms: [
      { x1: 0, y1: 520, x2: 330, y2: 520 },
      { x1: 630, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [
      { x: 400, y: 430, line: 'The stars form a bridge. Suspiciously helpful.' },
      { x: 480, y: 380, line: 'Middle star! The best seat in the sky.' },
      { x: 560, y: 430, line: 'Three in a row. Ember should buy a lottery ticket.' },
    ],
    blots: [],
  },
  {
    name: 'The Well',
    story: 'Down in the well, the dark is deeper. So is the ink.',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 130,
    platforms: [
      { x1: 0, y1: 520, x2: 420, y2: 520 },
      { x1: 640, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [
      { x: 480, y: 440, line: 'Down the well, up the score.' },
      { x: 580, y: 400, line: 'This star was hiding. Not anymore.' },
    ],
    blots: [{ x: 530, y: 450, axis: 'y', range: 70, speed: 36, phase: -Math.PI / 2 }],
  },
  {
    name: 'Twin Blots',
    story: 'Two shadows, one Ember. Unfair? The ink disagrees.',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 140,
    platforms: [
      { x1: 0, y1: 520, x2: 280, y2: 520 },
      { x1: 300, y1: 450, x2: 520, y2: 450 },
      { x1: 540, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [
      { x: 290, y: 420, line: 'Twins on patrol, star in pocket. Worth it.' },
      { x: 410, y: 370, line: 'Ember tiptoes. The star tiptoes back. Cute.' },
      { x: 530, y: 420, line: "Last twin-star! The shadows didn't even notice." },
    ],
    blots: [
      { x: 290, y: 470, axis: 'x', range: 26, speed: 38 },
      { x: 530, y: 470, axis: 'x', range: 26, speed: 38 },
    ],
  },
  {
    name: 'The Tower',
    story: 'The tallest page. The moon is watching.',
    start: { x: 80, y: 470 },
    goal: { x: 900, y: 254 },
    ink: 180,
    platforms: [
      { x1: 0, y1: 520, x2: 200, y2: 520 },
      { x1: 240, y1: 440, x2: 400, y2: 440 },
      { x1: 440, y1: 360, x2: 600, y2: 360 },
      { x1: 640, y1: 280, x2: 800, y2: 280 },
      { x1: 840, y1: 280, x2: 960, y2: 280 },
    ],
    stars: [
      { x: 220, y: 450, line: 'High up, the stars taste like moonlight.' },
      { x: 420, y: 370, line: 'Halfway to the moon and still climbing.' },
      { x: 620, y: 290, line: 'Top of the tower! Ember waves at the moon.' },
    ],
    // No blot here: the climb itself is the puzzle, and a blot on a ramp
    // would eat the road out from under Ember mid-climb.
    blots: [],
  },
  {
    name: 'The Chase',
    story: 'Run, little light. The night is getting impatient.',
    start: { x: 80, y: 470 },
    goal: { x: 890, y: 494 },
    ink: 170,
    platforms: [
      { x1: 0, y1: 520, x2: 300, y2: 520 },
      { x1: 660, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [
      { x: 380, y: 430, line: 'Grabbed mid-run. Multitasking level: Ember.' },
      { x: 480, y: 380, line: 'A star at full speed! Somebody write this down.' },
      { x: 580, y: 430, line: 'The night is chasing. The star is coming along.' },
    ],
    blots: [{ x: 480, y: 505, axis: 'x', range: 120, speed: 50 }],
  },
  {
    name: 'Homecoming',
    story: 'Almost there — the Dawn Door glows just ahead.',
    start: { x: 80, y: 470 },
    goal: { x: 890, y: 334 },
    ink: 180,
    platforms: [
      { x1: 0, y1: 520, x2: 240, y2: 520 },
      { x1: 320, y1: 440, x2: 460, y2: 440 },
      { x1: 560, y1: 360, x2: 700, y2: 360 },
      { x1: 780, y1: 360, x2: 960, y2: 360 },
    ],
    stars: [
      { x: 280, y: 430, line: 'Almost home — this star smells like breakfast.' },
      { x: 510, y: 330, line: 'Second-to-last page. Ember can see the door!' },
      { x: 740, y: 280, line: 'One page left. Ember polishes the star. For luck.' },
    ],
    blots: [
      { x: 280, y: 495, axis: 'x', range: 30, speed: 40 },
      { x: 510, y: 395, axis: 'x', range: 35, speed: 44 },
      { x: 740, y: 345, axis: 'x', range: 30, speed: 48 },
    ],
  },
  {
    name: 'The Long Night',
    story: 'The Maw wakes. Run, Ember. RUN.',
    start: { x: 80, y: 470 },
    goal: { x: 920, y: 494 },
    ink: 200,
    platforms: [
      { x1: 0, y1: 520, x2: 220, y2: 520 },
      { x1: 300, y1: 520, x2: 420, y2: 520 },
      { x1: 500, y1: 520, x2: 620, y2: 520 },
      { x1: 700, y1: 520, x2: 820, y2: 520 },
      { x1: 880, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [
      { x: 260, y: 440, line: 'A star, mid-chase! Brave or silly? Both.' },
      { x: 460, y: 440, line: 'The Maw is behind. The star is ahead. Priorities.' },
      { x: 660, y: 440, line: 'Last star ever. Ember saves it for the door.' },
    ],
    // The Maw: a giant shadow that sleeps 2.5 seconds (time to draw the first
    // bridges), then hunts Ember at 112 px/s — slower than Ember's roll, so a
    // clear road outruns it. It eats the road behind Ember; only gold ink
    // survives it. It lurks above the start, clear of Ember, until it wakes.
    blots: [{ x: 40, y: 400, mode: 'chase', speed: 112, radius: 30, maw: true, wake: 2.5 }],
  },
];

export function levelCount() {
  return LEVELS.length;
}
