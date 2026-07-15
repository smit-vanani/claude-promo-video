# /promo-video — give Claude the ability to make launch videos

Turn a website URL + a few answers into a finished, beat-locked product promo
video — rendered with [Remotion](https://www.remotion.dev/), scored to your
music track's real onsets, with an **original design system for every
product** (no template re-skins, ever).

```
/promo-video https://your-product.com
```

Claude researches your site, asks a handful of concrete questions, shows you a
storyboard, then designs, renders, verifies, and delivers the video — 16:9,
9:16 vertical, and YouTube thumbnails.

## Why it's good

- **Intake-first.** You never explain your product. It reads your homepage,
  pricing, and features pages, pulls your real brand colors from your CSS, and
  quotes your real published metrics (invented numbers are banned by the
  skill's honesty rule).
- **Original template every time.** The design system is derived from your
  product's *core interaction* — a search product lives inside typed queries
  and reordering result rows; a jeweller gets a velvet showroom. A 5-point
  anti-fingerprint checklist stops video #2 from looking like video #1
  re-skinned.
- **Beat-locked.** `beatmap.mjs` detects onsets in your track, finds the best
  window, and locks all 10 scene durations + every internal beat to real
  musical hits. The biggest drop lands on the payoff scene, within 6 frames,
  verified.
- **Self-verifying.** Claude renders key stills and frame bursts and actually
  *reads* them before you see anything; it volume-checks the audio so a silent
  track can't ship (yes, that happened once — the skill remembers).
- **Battle-tested gotchas baked in.** Headless-Chrome gradient-text bugs,
  QuickTime's stale-window cache, layout collisions, overflow traps — each one
  cost a render once so it never costs you one.

## Install

**Claude Code (recommended):**

```
/plugin marketplace add smit-vanani/claude-promo-video
/plugin install promo-video@claude-promo-video
```

**Manual (any setup with a skills directory):**

```bash
git clone https://github.com/smit-vanani/claude-promo-video
cp -r claude-promo-video/skills/promo-video ~/.claude/skills/
```

**One-time studio bootstrap** (Claude does this automatically on first run,
or do it yourself):

```bash
npx create-video@latest ~/promo-video-studio    # blank template, TypeScript
cp -r ~/.claude/skills/promo-video/scripts ~/promo-video-studio/scripts
```

Requirements: Node 18+, ffmpeg.

## Use

```
/promo-video https://your-product.com
```

1. Answer the intake batch (or accept the research-informed defaults —
   "all defaults" is designed to still produce a great video).
2. Approve or redline the storyboard (the cheapest moment to change course).
3. Get a draft, give per-scene feedback, receive the final bundle.

Bring your own licensed music track when asked — the skill refuses to ship
unlicensed audio. No track? It hands you a tuned Suno prompt (one massive
drop about ¾ in) and beatmaps whatever comes back.

## What's in this repo

```
skills/promo-video/SKILL.md            the skill — every rule and lesson
skills/promo-video/scripts/beatmap.mjs onset detection → scene grid + hit placement
skills/promo-video/scripts/frames.sh   exact-frame still extraction for verification
.claude-plugin/                        Claude Code plugin + marketplace manifests
```

## License

MIT — see [LICENSE](LICENSE).
