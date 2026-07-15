# /promo-video — a Claude Code skill for premium product videos

Turn a website URL + a few answers into a finished, beat-locked promo video —
rendered with [Remotion](https://www.remotion.dev/), scored to a real music
track's onsets, with an **original design system for every product** (no
template re-skins).

Built and battle-tested across real product launches; the skill file encodes
every lesson that cost a render — silent-audio bugs, template fingerprinting,
payoff-timing rules, headless-Chrome gradient quirks, and more.

## What it does

1. **Intake-first**: you give it a URL; it researches the site (copy, real
   metrics, brand CSS colors) and asks one batch of concrete,
   research-informed questions — duration, visual direction, hero moment,
   exact end-card copy, claims policy.
2. **Original template every time**: it designs a new visual world derived
   from your product's core interaction (a search product lives inside typed
   queries and result rows; a jeweller gets a showroom), with an
   anti-fingerprint checklist so video #2 never looks like video #1 re-skinned.
3. **Beat-locked**: `scripts/beatmap.mjs` detects onsets in your music track,
   finds the best window, and locks every scene duration and internal beat to
   real hits — the biggest drop lands on the payoff scene.
4. **Self-verifying**: renders key stills and frame bursts and actually reads
   them before showing you anything; checks audio loudness so a silent track
   can't ship.
5. **Full bundle**: 16:9 + 9:16 vertical, YouTube thumbnails, optional
   burned-in captions.

## Install

```bash
# 1. Copy the skill into Claude Code's skills directory
git clone https://github.com/<you>/promo-video-skill
cp -r promo-video-skill/promo-video ~/.claude/skills/

# 2. Bootstrap the studio (one time)
npx create-video@latest ~/promo-video-studio   # blank template, TypeScript
cp -r promo-video-skill/scripts ~/promo-video-studio/scripts
```

Requirements: Claude Code, Node 18+, ffmpeg.

## Use

In Claude Code, in any directory:

```
/promo-video https://your-product.com
```

Answer the intake questions (or accept all the recommended defaults), approve
the storyboard, and you'll get a draft to redline and a final MP4 delivered to
your working directory.

Supply your own licensed music track when asked — the skill refuses to ship
unlicensed audio.

## What's in this repo

```
promo-video/SKILL.md    the skill itself (copy to ~/.claude/skills/)
scripts/beatmap.mjs     onset detection → scene grid, hit placement, trim cmd
scripts/frames.sh       exact-frame still extraction for verification
```

## License

MIT — see [LICENSE](LICENSE).
