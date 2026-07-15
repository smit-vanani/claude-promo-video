#!/usr/bin/env node
/*
 * beatmap.mjs — analyze any music track into a promo-video beat grid.
 *
 * Detects onsets via RMS-jump analysis, finds the biggest hit, picks the best
 * window of the requested duration so the biggest hit lands at the payoff
 * position (default 740/992 ≈ 74.6%), snaps the 10-slot scene grid to real
 * onsets, and prints the BEATS durations + an ffmpeg trim command.
 *
 * Usage:
 *   node scripts/beatmap.mjs <track.mp3> [--duration 33.07] [--fps 30]
 *                            [--hit-fraction 0.746] [--no-window]
 *
 *   --no-window   analyze the file as-is (already trimmed) instead of
 *                 searching for the best window inside a longer track.
 *
 * Output: <track>.beatmap.json next to the input + a human summary on stdout.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { basename } from "node:path";

const args = process.argv.slice(2);
if (!args.length || args[0].startsWith("--")) {
  console.error("usage: node scripts/beatmap.mjs <track> [--duration s] [--fps n] [--hit-fraction f] [--no-window]");
  process.exit(1);
}
const input = args[0];
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? parseFloat(args[i + 1]) : def;
};
const DURATION = opt("duration", 992 / 30); // seconds of final cut
const FPS = opt("fps", 30);
const HIT_FRACTION = opt("hit-fraction", 740 / 992);
const NO_WINDOW = args.includes("--no-window");

// Reference 10-slot grid (fractions of total) — content-free, music-shaped.
const REF_BOUNDS = [0, 66, 188, 297, 432, 543, 600, 740, 836, 900, 992].map((f) => f / 992);

/* ── decode to mono 16k PCM ── */
const ff = spawnSync("ffmpeg", ["-i", input, "-ac", "1", "-ar", "16000", "-f", "s16le", "-v", "error", "-"], {
  maxBuffer: 1 << 30,
});
if (ff.status !== 0 || !ff.stdout?.length) {
  console.error("ffmpeg decode failed:", ff.stderr?.toString().slice(0, 400));
  process.exit(1);
}
const pcm = new Int16Array(ff.stdout.buffer, ff.stdout.byteOffset, Math.floor(ff.stdout.byteLength / 2));
const SR = 16000;
const WIN = Math.round(SR * 0.05); // 50ms windows
const nWin = Math.floor(pcm.length / WIN);
const totalDur = pcm.length / SR;

/* ── RMS per window ── */
const rms = new Float64Array(nWin);
for (let w = 0; w < nWin; w++) {
  let acc = 0;
  for (let i = w * WIN; i < (w + 1) * WIN; i++) acc += pcm[i] * pcm[i];
  rms[w] = Math.sqrt(acc / WIN) / 32768;
}

/* ── onsets: jump > 1.6× trailing 4-window mean, ≥0.35s apart ── */
const onsets = [];
const MIN_GAP = 0.35;
for (let w = 4; w < nWin; w++) {
  const trail = (rms[w - 1] + rms[w - 2] + rms[w - 3] + rms[w - 4]) / 4;
  if (trail < 1e-4) continue;
  const ratio = rms[w] / trail;
  if (ratio > 1.6 && rms[w] > 0.02) {
    const t = (w * WIN) / SR;
    if (t < 0.5) continue; // ignore the track's cold start
    // cap the ratio so jumps-from-silence don't dwarf genuinely loud hits
    const strength = Math.min(ratio, 5) * rms[w];
    const last = onsets[onsets.length - 1];
    if (last && t - last.t < MIN_GAP) {
      if (strength > last.strength) onsets[onsets.length - 1] = { t, strength, rms: rms[w] };
    } else {
      onsets.push({ t, strength, rms: rms[w] });
    }
  }
}
if (!onsets.length) {
  console.error("no onsets detected — track may be too quiet/ambient for beat-locking");
  process.exit(1);
}

/* dropScore: a "biggest hit" is LOUD and SUSTAINS (build-ups make its jump
   ratio small, so ratio alone picks intro transients instead of the drop) */
for (const o of onsets) {
  const w = Math.round((o.t * SR) / WIN);
  let acc = 0, cnt = 0;
  for (let k = w; k < Math.min(nWin, w + 30); k++) { acc += rms[k]; cnt++; } // 1.5s follow-through
  o.dropScore = o.rms * (cnt ? acc / cnt : 0);
}

/* ── pick window so the strongest available hit sits at HIT_FRACTION ── */
let winStart = 0;
let winDur = Math.min(DURATION, totalDur);
let hit;
if (NO_WINDOW || totalDur <= DURATION + 0.5) {
  hit = onsets.reduce((a, b) => (b.dropScore > a.dropScore ? b : a));
} else {
  // try strongest onsets first; keep the first whose window fits in the track
  const ranked = [...onsets].sort((a, b) => b.dropScore - a.dropScore);
  for (const cand of ranked.slice(0, 12)) {
    const s = cand.t - HIT_FRACTION * DURATION;
    if (s >= 0 && s + DURATION <= totalDur + 0.05) { winStart = s; hit = cand; break; }
  }
  if (!hit) { hit = ranked[0]; winStart = Math.max(0, Math.min(totalDur - DURATION, hit.t - HIT_FRACTION * DURATION)); }
  winDur = DURATION;
}
const inWindow = onsets.filter((o) => o.t >= winStart && o.t <= winStart + winDur);

/* ── snap the reference grid to onsets (±0.4s), hit boundary is exact ── */
const totalFrames = Math.round(winDur * FPS);
const hitFrame = Math.round((hit.t - winStart) * FPS);
const bounds = REF_BOUNDS.map((f, i) => {
  if (i === 0) return 0;
  if (i === REF_BOUNDS.length - 1) return totalFrames;
  const nominal = f * winDur; // seconds, window-relative
  if (Math.abs(f - HIT_FRACTION) < 0.02) return hitFrame; // payoff boundary = the hit
  let best = null;
  for (const o of inWindow) {
    const rel = o.t - winStart;
    const d = Math.abs(rel - nominal);
    if (d <= 0.4 && (!best || d < Math.abs(best - nominal))) best = rel;
  }
  return Math.round((best ?? nominal) * FPS);
});
for (let i = 1; i < bounds.length; i++) if (bounds[i] <= bounds[i - 1]) bounds[i] = bounds[i - 1] + 1; // monotonic
const durations = bounds.slice(1).map((b, i) => b - bounds[i]);

/* ── report ── */
const out = {
  input: basename(input),
  trackDuration: +totalDur.toFixed(2),
  window: { start: +winStart.toFixed(2), duration: +winDur.toFixed(2) },
  fps: FPS,
  totalFrames,
  biggestHit: { t: +hit.t.toFixed(2), frame: hitFrame, strength: +hit.strength.toFixed(3) },
  sceneBounds: bounds,
  sceneDurations: durations,
  onsetFrames: inWindow.map((o) => ({ frame: Math.round((o.t - winStart) * FPS), strength: +o.strength.toFixed(2) })),
};
const jsonPath = input.replace(/\.[a-z0-9]+$/i, "") + ".beatmap.json";
writeFileSync(jsonPath, JSON.stringify(out, null, 2));

console.log(`track: ${basename(input)} (${totalDur.toFixed(1)}s), window: ${winStart.toFixed(2)}s → ${(winStart + winDur).toFixed(2)}s`);
console.log(`BIGGEST HIT at ${hit.t.toFixed(2)}s → frame ${hitFrame} of ${totalFrames} (payoff scene starts here)`);
console.log(`scene durations (frames): [${durations.join(", ")}]  — total ${totalFrames}`);
console.log(`onsets in window (frames): ${out.onsetFrames.map((o) => o.frame).join(" ")}`);
console.log(`wrote ${jsonPath}`);
if (winStart > 0.01 || winDur < totalDur - 0.5) {
  const fout = input.replace(/\.[a-z0-9]+$/i, "") + `.cut${Math.round(winDur)}s.mp3`;
  console.log(`trim: ffmpeg -i "${input}" -ss ${winStart.toFixed(2)} -t ${winDur.toFixed(2)} -af "afade=t=in:d=0.25,afade=t=out:st=${(winDur - 0.6).toFixed(2)}:d=0.6" -y "${fout}"`);
}
