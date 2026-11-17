// Levels: the Seven Labours of Rustam — the Haft Khan of Ferdowsi's
// Shahnameh — retold as seven pages of the paper world. Ember follows in
// Rustam's footsteps: the Lion, the Desert, the Dragon, the Witch, Olad,
// Arzhang, and the White Div. Each page opens with a line from the poem
// itself (Warner & Warner's English translation, 1906), and every star has
// a funny line of Ember's own.
//
// The mechanics follow the myth: the Desert is thirst (little ink, stars
// are springs); the Witch is a star that is not a star (a mimic blot, in
// disguise until Ember draws near); Olad is a guide (dashed gold lines
// show the way up the tower); the Dragon and the White Div hunt Ember.

export const LEVELS = [
  {
    khan: 'I',
    name: 'The Lion',
    story: "He deemed it safe though it was fear's own door,\nFor in it was a lion's lair.",
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 120,
    platforms: [
      { x1: 0, y1: 520, x2: 380, y2: 520 },
      { x1: 580, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [{ x: 480, y: 420, line: "A star, right under a lion's nose. Bold." }],
    // The Lion: big, slow, amber — Rakhsh's first trial, Ember's first blot.
    blots: [{ x: 480, y: 505, axis: 'x', range: 55, speed: 30, radius: 20, tint: '#e8a33d' }],
  },
  {
    khan: 'II',
    name: 'The Desert',
    story: 'A desert waterless, a heat intense\nThat dried the birds to powder.',
    start: { x: 80, y: 470 },
    goal: { x: 920, y: 494 },
    ink: 100,
    platforms: [
      { x1: 0, y1: 520, x2: 240, y2: 520 },
      { x1: 340, y1: 520, x2: 520, y2: 520 },
      { x1: 620, y1: 520, x2: 780, y2: 520 },
      { x1: 880, y1: 520, x2: 960, y2: 520 },
    ],
    // The stars sit low over the gaps: they are the springs, and Ember
    // drinks them in as it crosses. Three bridges cost ~90 ink; the page
    // grants 100 — waste nothing, or drink deep.
    stars: [
      { x: 290, y: 490, line: 'A spring in the desert! Ember drinks it in.' },
      { x: 570, y: 490, line: 'Second spring. Thirst: defeated.' },
      { x: 830, y: 490, line: "Third spring! The desert didn't stand a chance." },
    ],
    blots: [],
  },
  {
    khan: 'III',
    name: 'The Dragon',
    story: "A dragon, such an one as, thou hadst said,\nNo elephant could 'scape, came from the waste.",
    start: { x: 80, y: 470 },
    goal: { x: 890, y: 494 },
    ink: 150,
    platforms: [
      { x1: 0, y1: 520, x2: 300, y2: 520 },
      { x1: 420, y1: 520, x2: 600, y2: 520 },
      { x1: 720, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [
      { x: 360, y: 440, line: 'Grabbed mid-run. Multitasking level: Ember.' },
      { x: 660, y: 440, line: 'A star at full speed! Somebody write this down.' },
    ],
    // The Dragon: the first hunt. It sleeps 3.5 seconds, then chases at 95
    // px/s — slower than Ember's roll, but it never tires.
    blots: [{ x: 60, y: 400, mode: 'chase', speed: 95, radius: 22, wake: 3.5, tint: '#2dd4a8' }],
  },
  {
    khan: 'IV',
    name: 'The Witch',
    story: 'She made her cheeks like spring, although by rights\nShe was not fair.',
    start: { x: 80, y: 470 },
    goal: { x: 880, y: 494 },
    ink: 130,
    platforms: [
      { x1: 0, y1: 520, x2: 330, y2: 520 },
      { x1: 630, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [{ x: 400, y: 430, line: 'This star is real. Ember checked. Twice.' }],
    // The Witch: a blot disguised as a star, hanging over the gap. Draw
    // near and her true face appears — she drops onto the road and patrols
    // it. Her halo is violet, not gold, for the keen-eyed.
    blots: [{ x: 560, y: 430, mode: 'mimic', revealRadius: 120, axis: 'x', range: 40, speed: 35 }],
  },
  {
    khan: 'V',
    name: 'Olad',
    story: 'The sun is captive and the stars are lassoed!',
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
    blots: [],
    // Olad shows the way: dashed gold lines mark the ramps to draw.
    guide: [
      { x1: 200, y1: 520, x2: 240, y2: 440 },
      { x1: 400, y1: 440, x2: 440, y2: 360 },
      { x1: 600, y1: 360, x2: 640, y2: 280 },
      { x1: 800, y1: 280, x2: 840, y2: 280 },
    ],
  },
  {
    khan: 'VI',
    name: 'Arzhang',
    story: "He shouted in the middle of the host;\nThou wouldst have said: 'The hills and seas are rent!'",
    start: { x: 80, y: 470 },
    goal: { x: 920, y: 494 },
    ink: 170,
    platforms: [
      { x1: 0, y1: 520, x2: 240, y2: 520 },
      { x1: 340, y1: 520, x2: 480, y2: 520 },
      { x1: 580, y1: 520, x2: 720, y2: 520 },
      { x1: 820, y1: 520, x2: 960, y2: 520 },
    ],
    stars: [
      { x: 290, y: 430, line: 'A star, mid-battle! Brave or silly? Both.' },
      { x: 530, y: 430, line: 'The chief is watching. The star is coming along.' },
      { x: 770, y: 430, line: 'One page left. Ember polishes the star. For luck.' },
    ],
    // Arzhang, chief of the divs: big, red, fast — and a lieutenant beside
    // him. Both patrol over gaps, never over islands Ember must cross, and
    // their patrols are narrow enough that a good arc clears them.
    blots: [
      { x: 530, y: 505, axis: 'x', range: 25, speed: 50, radius: 22, tint: '#ef4444' },
      { x: 770, y: 505, axis: 'x', range: 25, speed: 44 },
    ],
  },
  {
    khan: 'VII',
    name: 'The White Div',
    story: "Now Rustam hasted not to slay the div\nAsleep, but roused him with a leopard's roar.",
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
      { x: 260, y: 440, line: 'The White Div is behind. The star is ahead. Priorities.' },
      { x: 460, y: 440, line: 'Last star ever. Ember saves it for the door.' },
      { x: 660, y: 440, line: 'Ember does a tiny dance. The Div does not.' },
    ],
    // The White Div: pale as the moon, horned, and hunting. It sleeps 2.5
    // seconds (time to draw the first bridges), then hunts Ember at 112
    // px/s — slower than Ember's roll, so a clear road outruns it. It eats
    // the road behind Ember; only gold ink survives it. It lurks above the
    // start, clear of Ember, until it wakes.
    blots: [{ x: 40, y: 400, mode: 'chase', speed: 112, radius: 30, maw: true, pale: true, wake: 2.5 }],
  },
];

export function levelCount() {
  return LEVELS.length;
}
