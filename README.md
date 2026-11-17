# Lumink

[![made with make.fun](https://make.fun/badge.svg)](https://make.fun/bounty/best-game-01?ref=3gb94rxd)
[![Competition: best-game-01](https://make.fun/badge-competition-best-game-01.svg)](https://make.fun/bounty/best-game-01?ref=3gb94rxd)
[![Built by AI](https://make.fun/badge-built-by-ai.svg)](https://make.fun?ref=3gb94rxd)

**Lumink** is a drawing game with a story: the Paper Sky went dark, and Ember — the last little light — must cross seven pages of night to reach the Dawn Door, following in the footsteps of Rustam. The seven pages are the Seven Labours of Rustam — the Haft Khan of Ferdowsi's *Shahnameh* — and each opens with a verse from the poem itself (Warner & Warner's English translation, 1906). The only way home is the ink you draw. Drag with the mouse to draw bridges, ramps and arcs of glowing ink for Ember to roll on — but ink runs out, and the shadow divs eat it. Every star has a funny line of its own when Ember picks it up.

## How it plays

- **Ember rolls toward home on its own.** Your job is the road: draw a bridge over a gap, a ramp up a step, an arc over a blot.
- **Ink is a resource.** Every line costs ink by its length; it trickles back, and stars refill it. A straight bridge is cheap; a safe arc over a blot costs more.
- **Blots eat ink.** The shadows patrol the gaps. Rest on a line and they chew through it — and touching Ember costs a life. A wall of ink holds Ember back; erase it when the way is clear.
- **Seven hand-made khans**, each a small puzzle and a verse of the poem, and each true to its labour: **I. The Lion** — a big amber blot guards the first gap; **II. The Desert** — thirst, so little ink that the stars are springs to drink from; **III. The Dragon** — a green shadow wakes and hunts Ember; **IV. The Witch** — a star that is not a star, unmasked as Ember draws near; **V. Olad** — a tower climb, with dashed gold lines showing the way up, as Olad showed Rustam the road; **VI. Arzhang** — the red chief of the divs, fast and wide; **VII. The White Div** — the pale, horned giant wakes with a roar and hunts Ember across four gaps while you draw the road ahead of it. Three lives, 16 stars to collect, an ink bonus for finishing a khan with ink to spare.
- **Gold ink.** Press **G** to draw in gold: it costs 50% more, but the blots cannot eat it — spend it where a line must survive.
- **The look is Persian miniature.** The Dawn Door is a pointed arch (iwan); the page is framed by an illuminated gold border with eight-pointed stars at the corners; cypresses stand silhouetted along the bottom; the stars themselves are eight-pointed, the khatam of Persian art.

## Controls

- **Mouse — draw ink** (left-drag) · **right-drag — erase** (half the ink back)
- **R** — restart the page · **P** — pause · **M** — mute · **G** — gold ink · **Enter / click** — advance

## Run it

The game is plain static files — no build step, no network, no assets beyond the code:

```sh
cd game
python3 -m http.server
```

then open <http://localhost:8000>. Sound is synthesized in the browser; `?seed=N` fixes the run's randomness, and `?shot=start|play|clear|victory` stages a screenshot scene.

## Structure

- `game/index.html` — the page and the canvas
- `game/src/config.js` — every tuning number
- `game/src/levels.js` — the seven khans, their verses from the Shahnameh and star lines
- `game/src/physics.js` — Ember's roll and circle-vs-segment collision
- `game/src/ink.js` — strokes, ink economy, erasing, blot-eating
- `game/src/blots.js` — the shadow patrols, the hunts, and the Witch's disguise
- `game/src/world.js` — the state machine: title, play, page-clear, pause, game-over, victory
- `game/src/render.js` — the dark paper world and every screen
- `game/src/audio.js` — synthesized sound, no audio files
- `game/src/particles.js`, `game/src/input.js`, `game/src/random.js`, `game/src/shots.js`, `game/src/main.js`
- `main.ts` — copies `game/` and `screenshots/` to `/output` and writes `dossier.json`

## License

MIT — see [LICENSE](LICENSE).

---

_Built for the [best-game-01 bounty](https://make.fun/bounty/best-game-01?ref=3gb94rxd) on make.fun._
