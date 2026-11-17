// Sound: every effect is synthesized with the Web Audio API — no audio files,
// so the game stays offline and self-contained. The context starts on the first
// user gesture, as browsers require; M toggles mute, persisted in localStorage.

import { MUTE_KEY } from './config.js';

function readMuted() {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function createAudio() {
  let ctx = null;
  let master = null;
  let noiseBuffer = null;
  let muted = readMuted();

  function ensure() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    }
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return false;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    return true;
  }

  function tone({ freq, end = freq, type = 'sine', dur = 0.15, vol = 0.3, at = 0 }) {
    if (!ensure() || muted) return;
    const t0 = ctx.currentTime + at;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, end), t0 + dur);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function noise({ dur = 0.2, vol = 0.25, from = 3000, to = 300, at = 0 }) {
    if (!ensure() || muted) return;
    const t0 = ctx.currentTime + at;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(from, t0);
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(t0);
    src.stop(t0 + dur + 0.05);
  }

  return {
    get muted() {
      return muted;
    },
    resume() {
      ensure();
    },
    setMuted(value) {
      muted = value;
      try {
        window.localStorage.setItem(MUTE_KEY, value ? '1' : '0');
      } catch {
        // Storage can be off: mute then lasts this visit only.
      }
      if (master) master.gain.value = value ? 0 : 0.5;
    },
    click() {
      tone({ freq: 660, dur: 0.07, vol: 0.18, type: 'triangle' });
    },
    // Switching to gold ink: a bright two-note chime.
    gold() {
      tone({ freq: 880, dur: 0.1, vol: 0.16, type: 'triangle' });
      tone({ freq: 1318, dur: 0.14, vol: 0.14, type: 'triangle', at: 0.07 });
    },
    // The pencil: a soft tick as the line grows.
    drawTick() {
      noise({ dur: 0.05, vol: 0.06, from: 5000, to: 3500 });
    },
    erase() {
      tone({ freq: 500, end: 300, dur: 0.1, vol: 0.12, type: 'sine' });
    },
    // A star: the chime climbs with each star of the level.
    star(count) {
      const base = 740 * Math.pow(1.122, count);
      tone({ freq: base, dur: 0.18, vol: 0.22, type: 'sine' });
      tone({ freq: base * 1.5, dur: 0.22, vol: 0.12, type: 'sine', at: 0.05 });
    },
    hit() {
      tone({ freq: 150, end: 45, dur: 0.3, vol: 0.35, type: 'sawtooth' });
      noise({ dur: 0.2, vol: 0.18, from: 700, to: 120 });
    },
    // The Witch unmasked: a short, dissonant sting.
    reveal() {
      tone({ freq: 880, end: 220, dur: 0.25, vol: 0.25, type: 'sawtooth' });
      tone({ freq: 932, end: 233, dur: 0.25, vol: 0.18, type: 'sawtooth', at: 0.02 });
    },
    // The White Div wakes: a low, rising growl.
    roar() {
      tone({ freq: 55, end: 110, dur: 0.7, vol: 0.4, type: 'sawtooth' });
      tone({ freq: 82, end: 55, dur: 0.7, vol: 0.25, type: 'square', at: 0.05 });
      noise({ dur: 0.6, vol: 0.2, from: 300, to: 60 });
    },
    fall() {
      tone({ freq: 500, end: 120, dur: 0.4, vol: 0.2, type: 'sine' });
    },
    levelClear() {
      [523, 659, 784, 1047].forEach((freq, i) => {
        tone({ freq, dur: 0.18, vol: 0.2, type: 'triangle', at: i * 0.09 });
      });
    },
    victory() {
      [523, 659, 784, 1047, 784, 1047, 1319].forEach((freq, i) => {
        tone({ freq, dur: 0.22, vol: 0.2, type: 'triangle', at: i * 0.13 });
      });
    },
    gameOver() {
      [392, 330, 262, 196].forEach((freq, i) => {
        tone({ freq, dur: 0.32, vol: 0.22, type: 'triangle', at: i * 0.18 });
      });
    },
  };
}
