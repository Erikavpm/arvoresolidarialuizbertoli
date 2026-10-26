/**
 * Trilha instrumental natalina sintetizada no próprio navegador (Web Audio).
 *
 * Nenhum arquivo externo é baixado: o som é gerado no dispositivo do visitante.
 * As melodias são arranjos de músicas em domínio público:
 *   - Jingle Bells (J. Pierpont, 1857)
 *   - Noite Feliz / Stille Nacht (F. Gruber, 1818)
 *   - Hino da Alegria (L. van Beethoven, 1824)
 *
 * O módulo só usa AudioContext dentro de funções, então pode ser carregado
 * no servidor sem efeito colateral (é importado dinamicamente no clique).
 */

type Quality = "maj" | "min" | "dom7";

const INTERVALS: Record<Quality, number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dom7: [0, 4, 7, 10],
};

const SEMITONES: Record<string, number> = {
  C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
};

function midiOf(name: string): number {
  const m = /^([A-G]#?)(-?\d)$/.exec(name);
  if (!m) throw new Error(`Nota inválida: ${name}`);
  return (Number(m[2]) + 1) * 12 + SEMITONES[m[1]];
}

function hz(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

type MelodyEvent = [string, number];
type ChordEvent = [string, Quality, number];

type Section = {
  title: string;
  bpm: number;
  beatsPerBar: number;
  sleigh?: boolean;
  melody: MelodyEvent[];
  chords: ChordEvent[];
};

type Planned = {
  t: number;
  section: number;
  voice: "bell" | "pad" | "bass" | "sleigh";
  freq: number;
  dur: number;
  vel: number;
};

const JINGLE_A: MelodyEvent[] = [
  ["E4", 1], ["E4", 1], ["E4", 2],
  ["E4", 1], ["E4", 1], ["E4", 2],
  ["E4", 1], ["G4", 1], ["C4", 1], ["D4", 1],
  ["E4", 2], ["-", 2],
];

const JINGLE_B: MelodyEvent[] = [
  ["F4", 1], ["F4", 1], ["F4", 2],
  ["F4", 1], ["F4", 1], ["E4", 1], ["E4", 1],
  ["E4", 1], ["E4", 1], ["G4", 1], ["G4", 1],
  ["F4", 1], ["D4", 1], ["C4", 2],
];

const SECTIONS: Section[] = [
  {
    title: "Jingle Bells",
    bpm: 132,
    beatsPerBar: 4,
    sleigh: true,
    melody: [
      ...JINGLE_A,
      ...JINGLE_A,
      ...JINGLE_B,
      ...JINGLE_A,
      ["C4", 2], ["-", 2],
    ],
    chords: [
      ["C3", "maj", 4], ["C3", "maj", 4], ["C3", "maj", 4], ["C3", "maj", 4],
      ["C3", "maj", 4], ["C3", "maj", 4], ["C3", "maj", 4], ["C3", "maj", 4],
      ["F3", "maj", 4], ["C3", "maj", 4], ["C3", "maj", 4], ["G3", "dom7", 4],
      ["C3", "maj", 4], ["C3", "maj", 4], ["C3", "maj", 4], ["C3", "maj", 4],
      ["C3", "maj", 4],
    ],
  },
  {
    title: "Noite Feliz",
    bpm: 84,
    beatsPerBar: 3,
    melody: [
      ["G4", 1], ["A4", 1], ["G4", 1], ["E5", 3],
      ["G4", 1], ["A4", 1], ["G4", 1], ["E5", 3],
      ["D5", 1], ["D5", 1], ["B4", 1], ["C5", 1], ["C5", 1], ["G4", 1],
      ["A4", 1], ["A4", 1], ["C5", 1], ["B4", 1], ["A4", 1], ["G4", 1],
      ["A4", 1], ["G4", 1], ["E5", 3],
      ["D5", 1], ["D5", 1], ["F5", 1], ["D5", 1], ["B4", 1], ["C5", 3],
      ["C5", 1], ["G4", 1], ["E5", 1], ["G4", 1], ["F4", 1], ["D4", 1], ["C4", 3],
    ],
    chords: [
      ["C3", "maj", 3], ["C3", "maj", 3], ["C3", "maj", 3], ["C3", "maj", 3],
      ["G3", "dom7", 3], ["C3", "maj", 3], ["F3", "maj", 3], ["G3", "dom7", 3],
      ["C3", "maj", 3], ["C3", "maj", 3], ["G3", "dom7", 3], ["C3", "maj", 3],
      ["C3", "maj", 3], ["G3", "dom7", 3], ["C3", "maj", 3],
    ],
  },
  {
    title: "Hino da Alegria",
    bpm: 116,
    beatsPerBar: 4,
    sleigh: true,
    melody: [
      ["E4", 1], ["E4", 1], ["F4", 1], ["G4", 1],
      ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1],
      ["C4", 1], ["C4", 1], ["D4", 1], ["E4", 1],
      ["E4", 2], ["D4", 2],
      ["E4", 1], ["E4", 1], ["F4", 1], ["G4", 1],
      ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1],
      ["C4", 1], ["C4", 1], ["D4", 1], ["E4", 1],
      ["D4", 2], ["C4", 2],
      ["E4", 1], ["E4", 1], ["F4", 1], ["G4", 1],
      ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1],
      ["C4", 1], ["C4", 1], ["D4", 1], ["E4", 1],
      ["E4", 2], ["D4", 2],
      ["E4", 1], ["E4", 1], ["F4", 1], ["G4", 1],
      ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1],
      ["C4", 1], ["C4", 1], ["D4", 1], ["E4", 1],
      ["D4", 2], ["C4", 2],
    ],
    chords: [
      ["C3", "maj", 4], ["G3", "dom7", 4], ["C3", "maj", 4], ["G3", "dom7", 4],
      ["C3", "maj", 4], ["G3", "dom7", 4], ["C3", "maj", 4], ["G3", "dom7", 4],
      ["C3", "maj", 4], ["G3", "dom7", 4], ["C3", "maj", 4], ["G3", "dom7", 4],
      ["C3", "maj", 4], ["G3", "dom7", 4], ["C3", "maj", 4], ["C3", "maj", 4],
    ],
  },
];

const GAP = 1.4; // respiro entre as músicas (segundos)
const TAIL = 2.6; // cauda de reverberação no fim do ciclo
const VOLUME = 0.42;
const LOOKAHEAD = 0.35;
const TICK = 50;

/** Monta a linha do tempo de uma seção: melodia, acordes, baixo e sinos. */
function planSection(section: Section, index: number): Planned[] {
  const spb = 60 / section.bpm;
  const out: Planned[] = [];

  let t = 0;
  for (const [name, beats] of section.melody) {
    const dur = beats * spb;
    if (name !== "-") {
      out.push({ t, section: index, voice: "bell", freq: hz(midiOf(name)), dur, vel: 0.42 });
    }
    t += dur;
  }

  let tc = 0;
  for (const [root, quality, beats] of section.chords) {
    const dur = beats * spb;
    const rootMidi = midiOf(root);
    for (const interval of INTERVALS[quality]) {
      out.push({
        t: tc,
        section: index,
        voice: "pad",
        freq: hz(rootMidi + 12 + interval),
        dur: dur * 0.9,
        vel: 0.05,
      });
    }
    const halfBar = section.beatsPerBar === 3 ? 2 : section.beatsPerBar / 2;
    for (const at of [0, halfBar]) {
      out.push({
        t: tc + at * spb,
        section: index,
        voice: "bass",
        freq: hz(rootMidi),
        dur: Math.min(1.2, dur * 0.45),
        vel: 0.22,
      });
    }
    tc += dur;
  }

  if (section.sleigh) {
    for (let beat = 0; beat * spb < tc; beat++) {
      out.push({
        t: beat * spb,
        section: index,
        voice: "sleigh",
        freq: 5200,
        dur: 0.12,
        vel: beat % 2 === 0 ? 0.09 : 0.05,
      });
    }
  }

  return out;
}

function planMedley(): { events: Planned[]; length: number; marks: { t: number; title: string }[] } {
  const events: Planned[] = [];
  const marks: { t: number; title: string }[] = [];
  let offset = 0;

  SECTIONS.forEach((section, index) => {
    const planned = planSection(section, index);
    const end = planned.reduce((max, e) => Math.max(max, e.t + e.dur), 0);
    marks.push({ t: offset, title: section.title });
    for (const e of planned) events.push({ ...e, t: e.t + offset });
    offset += end + GAP;
  });

  events.sort((a, b) => a.t - b.t);
  return { events, length: offset + TAIL, marks };
}

function impulseResponse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const frames = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, frames, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < frames; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / frames, decay);
    }
  }
  return buffer;
}

function noiseBuffer(ctx: AudioContext): AudioBuffer {
  const frames = Math.floor(ctx.sampleRate * 0.5);
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Campainha de caixinha de música: harmônicos senoidais que somem rápido. */
function bell(ctx: AudioContext, dest: AudioNode, freq: number, t: number, dur: number, vel: number) {
  const partials: [number, number, number][] = [
    [1, 1, 1],
    [2, 0.34, 0.55],
    [3.01, 0.16, 0.34],
    [4.7, 0.08, 0.2],
    [6.4, 0.04, 0.12],
  ];
  const decay = Math.min(3.4, 0.55 + dur * 1.2);
  const wobble = 1 + (Math.random() - 0.5) * 0.0015;

  for (const [ratio, amp, life] of partials) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * ratio * wobble;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(amp * vel, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + decay * life);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + decay * life + 0.05);
  }
}

/** Colchão suave de cordas para sustentar os acordes. */
function pad(ctx: AudioContext, dest: AudioNode, freq: number, t: number, dur: number, vel: number) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;
  filter.Q.value = 0.4;

  const gain = ctx.createGain();
  const attack = 0.16;
  const hold = Math.max(attack + 0.05, dur);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vel, t + attack);
  gain.gain.setValueAtTime(vel, hold);
  gain.gain.exponentialRampToValueAtTime(0.0001, hold + 0.45);

  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = freq;
  osc.connect(filter);

  const soft = ctx.createOscillator();
  soft.type = "sine";
  soft.frequency.value = freq * 2;
  const softGain = ctx.createGain();
  softGain.gain.value = 0.3;
  soft.connect(softGain);
  softGain.connect(filter);

  filter.connect(gain);
  gain.connect(dest);
  osc.start(t);
  osc.stop(hold + 0.5);
  soft.start(t);
  soft.stop(hold + 0.5);
}

/** Contrabaixo redondo, marcando o tempo. */
function bass(ctx: AudioContext, dest: AudioNode, freq: number, t: number, dur: number, vel: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vel, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;

  const warm = ctx.createOscillator();
  warm.type = "triangle";
  warm.frequency.value = freq * 2;
  const warmGain = ctx.createGain();
  warmGain.gain.value = 0.18;

  osc.connect(gain);
  warm.connect(warmGain);
  warmGain.connect(gain);
  gain.connect(dest);

  osc.start(t);
  osc.stop(t + dur + 0.05);
  warm.start(t);
  warm.stop(t + dur + 0.05);
}

/** Sinos de trenó: ruído filtrado em rajadas curtas. */
function sleigh(
  ctx: AudioContext,
  dest: AudioNode,
  noise: AudioBuffer,
  t: number,
  vel: number,
) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 5200;
  band.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vel, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  src.connect(band);
  band.connect(gain);
  gain.connect(dest);
  src.start(t, Math.random() * 0.3);
  src.stop(t + 0.16);
}

export type MusicController = {
  start: () => Promise<void>;
  stop: () => void;
  isPlaying: () => boolean;
};

export type MusicOptions = { onTitle?: (title: string) => void };

export function createChristmasMusic(options: MusicOptions = {}): MusicController {
  const { events, length, marks } = planMedley();

  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let bus: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let loopAt = 0;
  let index = 0;
  let playing = false;
  let title = "";

  function titleAt(t: number): string {
    let current = marks[0]?.title ?? "";
    for (const mark of marks) {
      if (mark.t <= t) current = mark.title;
      else break;
    }
    return current;
  }

  function emitTitle(t: number) {
    const next = titleAt(t);
    if (next !== title) {
      title = next;
      options.onTitle?.(next);
    }
  }

  function ensure() {
    if (ctx) return;
    const Ctor: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audio = new Ctor();

    const out = audio.createGain();
    out.gain.value = 0;

    const compressor = audio.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.knee.value = 24;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.25;

    const tilt = audio.createBiquadFilter();
    tilt.type = "lowpass";
    tilt.frequency.value = 6200;

    const reverb = audio.createConvolver();
    reverb.buffer = impulseResponse(audio, 2.4, 2.4);
    const wet = audio.createGain();
    wet.gain.value = 0.45;

    const mix = audio.createGain();
    mix.gain.value = 1;

    mix.connect(out);
    mix.connect(reverb);
    reverb.connect(wet);
    wet.connect(out);
    out.connect(tilt);
    tilt.connect(compressor);
    compressor.connect(audio.destination);

    ctx = audio;
    master = out;
    bus = mix;
    noise = noiseBuffer(audio);
  }

  function schedule(e: Planned, at: number) {
    const audio = ctx!;
    const dest = bus!;
    const when = Math.max(at, audio.currentTime + 0.01);
    if (e.voice === "bell") bell(audio, dest, e.freq, when, e.dur, e.vel);
    else if (e.voice === "pad") pad(audio, dest, e.freq, when, e.dur, e.vel);
    else if (e.voice === "bass") bass(audio, dest, e.freq, when, e.dur, e.vel);
    else sleigh(audio, dest, noise!, when, e.vel);
  }

  function tick() {
    const audio = ctx;
    if (!audio || audio.state !== "running") return;
    const horizon = audio.currentTime + LOOKAHEAD;
    while (events[index].t + loopAt < horizon) {
      const e = events[index];
      emitTitle(e.t);
      schedule(e, e.t + loopAt);
      index += 1;
      if (index >= events.length) {
        index = 0;
        loopAt += length;
      }
    }
  }

  async function start() {
    ensure();
    const audio = ctx!;
    await audio.resume();
    master!.gain.cancelScheduledValues(audio.currentTime);
    master!.gain.setValueAtTime(Math.max(master!.gain.value, 0.0001), audio.currentTime);
    master!.gain.linearRampToValueAtTime(VOLUME, audio.currentTime + 0.9);
    if (timer === null) {
      loopAt = audio.currentTime + 0.2;
      timer = setInterval(tick, TICK);
      tick();
    }
    playing = true;
  }

  function stop() {
    const audio = ctx;
    if (!audio || !master) return;
    master.gain.cancelScheduledValues(audio.currentTime);
    master.gain.setValueAtTime(master.gain.value, audio.currentTime);
    master.gain.linearRampToValueAtTime(0, audio.currentTime + 0.35);
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    playing = false;
    window.setTimeout(() => {
      if (!playing && ctx && ctx.state === "running") void ctx.suspend();
    }, 400);
  }

  return { start, stop, isPlaying: () => playing };
}
