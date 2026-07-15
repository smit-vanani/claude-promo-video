---
name: promo-video
description: Design and render a premium, beat-locked product video with Remotion — an ORIGINAL template every time, themed to the product. Intake-first — ask for the website URL, research it, then ask a question batch (duration, theme, scenes, focus, audience…) so the requester never has to explain their product. Use when the user asks to "make a promo video", a use-case video, a modules/feature tour, or a launch video.
argument-hint: "<website URL> (everything else is gathered by the intake questions)"
---

# /promo-video — website URL + a few answers → finished premium video

**Core promise: every video gets an ORIGINAL template — no exceptions for
"just the bones".** Never reuse a previous product's design system, and never
start by copying an old composition file as scaffolding. Research the brand,
then design a new visual world for it — new stage, new palette, new hero
objects, new motion language.

**Anti-fingerprint checklist** (learned the hard way: a user instantly
recognized their "new" video as a re-skin of an earlier product's template
even though every color and object had changed). Structural DNA leaks through
these five channels — ALL of them must differ from previous videos:
1. **Type treatment** — e.g. tracked-uppercase letterspacing-collapse reads as
   the same video even in a new font/color. Pick a different signature
   (typewriter+caret, inverted pills, serif contrast, mask slides…).
2. **Layout archetype** — kicker + hairline rule + centered headline is a
   fingerprint. Vary the grid: corner captions, left-anchored, split-screen.
3. **Payoff physics** — shockwave rings + rising particles = same video.
   Other verbs: full-screen invert flash, list reorder slam, split-wipe,
   letterpress stamp, build-out from a single pixel.
4. **Scene-wrapper motion** — the in/out transition style (zoom-through blur
   vs lateral sway vs vertical roll) is felt more than seen; change it.
5. **Recurring stage prop** — dust + radial spotlight vs grain + ghost object.

**The reliable way to be original: derive the world from the product's CORE
INTERACTION, not from a generic "premium dark stage".** A search product →
the film lives inside typed queries and result rows; a jeweller → a showroom;
a courier → parcels and routes. When a draft feels derivative, this is the fix.

Two exceptions:
1. The user explicitly asks for a series/sequel cut matching an earlier video
   of THEIR OWN product (then import that video's exported primitives).
2. **Reference-clone mode** — the user provides a reference video and says
   "make it exactly like this" / "same video as reference". Then DON'T design
   original: extract frames with ffmpeg (or a video-watching skill if you have
   one), READ the frames, and map its shot grammar — beat list, type treatment
   (size/weight/two-tone/pills), stage, hero-shot types, transition style,
   dark→light shifts, outro pattern. Clone that grammar shot-for-shot, adapted
   to the product's brand + real features. "Inspired by" is NOT what they
   asked for — match the structure literally. (Learned the hard way: several
   rejected "inspired" drafts before realizing the user wanted a literal
   clone.)

**STUDIO HOME: `~/promo-video-studio` — everything happens there, regardless
of the current working directory.** If it doesn't exist, bootstrap it:
`npx create-video@latest ~/promo-video-studio` (pick the blank/Hello World
template, TypeScript), then copy the `scripts/` folder from THIS SKILL's base
directory (beatmap.mjs, frames.sh) into `~/promo-video-studio/scripts/`.
When done, always copy the final MP4 to the user's working directory too.

## Step 0 — Intake (ALWAYS run this first)

The requester should NOT have to explain their product. The flow is:

1. **Get the website URL.** If it wasn't provided, ask for it (plus logo image
   if they have one) and wait. No website → ask for a 2-3 sentence description.
2. **Research before asking.** WebFetch the homepage AND its /pricing,
   /features, /products/* pages. Also pull brand hex colors from the site's CSS
   (`curl` the stylesheet chunks and grep for hex codes / brand CSS variables).
   Extract: what the product truly does, exact taglines, feature/module list,
   pricing model, CTA, palette, audience, and any REAL published metrics
   (conversion lifts, uptime, turnaround times — these are citable; invented
   numbers are not). NEVER ask a question the website already answers.
3. **Ask ONE batch of questions** (use AskUserQuestion, 4 per call, up to 3
   calls, most-important first; put your best research-informed guess as the
   recommended first option so "all defaults" still yields a great video).

   **Question quality bar** — generic questions waste the batch:
   - Every option must be CONCRETE and product-specific, built from the
     research: name the actual stage/palette/hero-object, quote the actual
     tagline, propose the actual example scenario — never "premium / bold /
     playful" adjectives the user can't picture.
   - Ask about the things that cause re-renders: exact end-card copy, the
     opening scenario verbatim, claim aggressiveness, words to avoid.
     Concrete beats abstract: "should the hook type 'therapist in boston' or
     'emergency plumber near me'?" is a good question; "what tone?" is not.
   - Use the `preview` field to show mini-mockups (ASCII scene sketches, the
     proposed storyboard row, sample on-screen copy) when options are visual.
   - Skip anything the site or conversation already answered — asking it
     anyway signals the research wasn't done.

   Draw from this bank, skipping any the site or conversation already answered:

   **Content questions**
   1. **Duration** — 15s (tight teaser) / 30–33s (standard launch, default) /
      45–60s (deep tour)? Longer ≠ better; scenes must stay one-idea-per-beat.
   2. **Features or outcomes?** — Should scenes show what the product DOES
      (modules, tools, screens-as-objects) or what the customer GETS (time
      saved, sales made, stress gone)? This flips every scene's framing.
   3. **Scene wishlist** — any specific scenes/moments the user already wants?
      Offer your proposed scene list as the recommended option so they can
      just approve it.
   4. **Audience** — the ONE audience this cut targets (a video per audience
      beats one video for everyone).
   5. **Hero moment** — the single feature/outcome the biggest music hit lands
      on.
   6. **Goal + CTA** — signups, waitlist, demo bookings, app installs, "visit
      site"?
   7. **Real numbers** — which published metrics are safe to show on screen?
   8. **What must NOT be claimed** — features that don't exist, metrics they
      don't measure (feeds the honesty rule).
   8b. **Claim aggressiveness** — stick to site-quoted numbers only, or is
      aspirational outcome copy OK ("#1", "ranked everywhere")? Users often
      WANT bolder claims than the site makes — ask instead of guessing
      conservative. Note their choice in the final report.
   8c. **Exact end-card wording** — the tagline under the wordmark and the CTA
      text, verbatim — not your paraphrase of their positioning. Also: the
      opening-scene scenario if the hook depicts a customer moment (the exact
      example search query / message / order, not a generic one).
   8d. **Words to avoid** — industry jargon the user dislikes next to their
      brand. One question here saves a re-render.

   **Look & feel questions**
   9. **Theme / visual direction** — offer 3–4 CONCRETE art directions derived
      from the brand, not generic adjectives. Name the stage, palette, and hero
      object in each option. Recommend the one that best fits the brand.
   10. **Tone** — premium-minimal / bold-energetic / playful / warm-human.
   11. **Placement** — X/LinkedIn/site hero → 16:9; Reels/Shorts/TikTok → also
       cut 9:16.
   12. **Brand look** — confirm detected colors/logo or take overrides.
   13. **Music** — the user must supply or approve the track (see Getting
       music below). Never score a deliverable with an unlicensed track.

4. **Play back a 3-line brief** (product · audience · duration · theme · hero
   moment · CTA) in the same message you start building — don't wait for
   approval; they can course-correct on the draft.

## Template policy — original, premium, every time

Design a **new design system per video** before writing code. Write it down in
the file header comment. A design system = answers to:

- **Stage**: the world the video lives in (velvet dark? paper white? gradient
  dawn?). Include ambient life — drifting particles, breathing glow, vignette.
  A static background reads cheap.
- **Palette**: 2 brand colors + ink + dim ink, pulled from the site's real CSS.
  One "hot" accent for hit moments.
- **Type treatment**: how headlines behave (tracked uppercase? tight lowercase?
  serif contrast?) and ONE signature text effect (shimmer gradient, mask
  reveal, tracking collapse, typewriter+caret, inverted pills). Big type, few
  words.
- **Hero objects**: 2–3 drawn/animated objects from the audience's world
  (a ring, a rate ticker, a parcel, a waveform, a search bar). **NEVER app-UI
  mockups or browser-window screenshots** — repeatedly rejected. Line-drawn
  SVG objects (stroke-dash draw-in via `pathLength={100}`) read premium.
- **Motion language**: pick 2–3 primitives and use them consistently. Don't
  mix every trick in one video.
- **Payoff effect**: what happens on the biggest hit — embers, confetti,
  shockwave rings, invert flash, constellation lock. Match the tone.

**Premium bar**: one idea per beat; generous negative space; hairline rules
over heavy boxes; nothing overlaps; any text the viewer must READ holds ≥2s;
decorative word-swaps may be faster. Kicker labels (small tracked mono
captions) + big display headline is a reliable premium layout.

**Cinematic-motion rules (non-negotiable — "it feels static" is the #1
rejection):**
- **Never pop-in-then-freeze.** Every scene gets continuous motion for its
  ENTIRE duration: a slow forward push (~6–11% scale over the scene) + gentle
  sinusoidal drift (±6–9px), applied at the scene-wrapper level so it's free
  for all scenes. Subtle values read as "still" — err visible.
- **Stagger text vs UI/object reveals.** Caption/headline lands FIRST; the
  card/object swoops in ~14–16 frames later with a perspective tilt
  (rotateX ~9–14° → 0), large travel (150–280px), and an overshoot scale pop
  (spring damping ~13–15). Simultaneous reveals read flat.
- **Cuts must "hit".** Zoom-through cross-dissolve: outgoing scene scales up
  (→ ~1.15–1.2×) + blurs + fades over ~9–11 overlapping frames while the next
  springs in from ~1.1–1.22× with blur→sharp. Reads as one camera flying
  through the film.
- Prefer syncing the hardest cuts to musical hits (beatmap grid).
- **The payoff must READ within ~6 frames of the musical hit.** A cut-to-flash
  ON the hit is fine (boom); a still-dark frame 8+ frames later is a timing
  bug. Scene-wrapper fade-ins delay visibility — give the payoff scene an
  instant full-screen flash or slam so the impact lands even mid-fade.

**Structure that works** (adapt, don't copy): cold-open hook or thesis →
problem/differentiator → 2–4 feature/outcome scenes → rapid-fire "and the
rest" beat → tension build → BIGGEST-HIT payoff scene → 3-verb triptych →
logo/CTA end card. A **cold-open bookend** (tease the payoff scene calmly at
0s, full-fireworks version on the drop) is a proven upgrade — the calm version
must drop the slam/particles so the drop still earns them.

**Reusable engineering pattern**: export the design primitives (Stage, scene
wrapper, text components, palette consts) from the composition file so sequel
cuts for the same brand can import them unchanged.

## Beats & music

Scene durations and internal beat frames are LOCKED to the track — the music's
grid, not the template's. Generate the grid with `scripts/beatmap.mjs`:

```bash
node scripts/beatmap.mjs <track.mp3> [--duration 33.07] [--fps 30] [--no-window]
```

It detects onsets (50ms RMS windows, jump >1.6× trailing mean), scores each by
`loudness × 1.5s follow-through` (a drop is LOUD and SUSTAINS — jump ratio
alone picks intro transients), picks the best window inside a longer track so
the biggest hit lands at the payoff fraction, snaps a 10-slot scene grid to
real onsets, and writes `<track>.beatmap.json` + prints the BEATS durations
and an ffmpeg trim command. Use its `sceneDurations` as the composition's
BEATS and its `onsetFrames` for internal beats. `--no-window` for pre-trimmed
tracks. A proven 10-slot shape for ~33s @30fps: hook ~66f → build ~122f →
3 feature beats ~110-135f each → rapid-fire ~57f → tension ~140f → payoff
~96f (biggest hit at its first frame) → triptych ~64f → end card ~92f.

**Window confirmation (mandatory for tracks longer than the video):** the
scorer's "best" window can be a section the user doesn't recognize as their
song (it once picked the final 33s of a 3:47 track and the user asked "where
is my music?"). Before building, cut the chosen window PLUS 1–2 alternates
as short preview MP3s, tell the user the timestamps, and let them pick — or
at minimum say clearly which section you used.

**Audio verification (mandatory, both times):**
- After ANY ffmpeg trim: `ffmpeg -i cut.mp3 -af volumedetect -f null -` —
  a mean_volume near -91 dB is digital silence. This exact failure shipped
  once: an output-side seek (`-i file -ss …`) produced a silent file that
  rendered into the video unnoticed. Always put `-ss` BEFORE `-i`.
- After the final render: volumedetect the MP4 too (healthy ≈ -12 to -20 dB
  mean). A quiet mix (≈ -45 dB or lower) means the music never made it in.

**Getting music** — the track must come from the user; never score a
deliverable with an unlicensed/ripped track, and never deliver a "placeholder"
score. In order of preference:
1. **User-supplied licensed track** → beatmap it. Safest for publishing.
2. **Suno (manual, ~1 min of user time)** — no official API. Give the user a
   copy-paste Suno prompt: instrumental only, genre/mood matched to brand,
   steady BPM, minimal clean intro, "one massive drop about 3/4 in". They
   drop the MP3 in `public/`; beatmap it. Paid Suno = commercial rights.
3. **A generation MCP tool** (if connected, e.g. Higgsfield `generate_audio`)
   — fully automatic in-session generation.

## Workflow

1. **Brief** from Step 0 (true capabilities only; derive a lighter/warmer
   sibling accent from the brand color).
2. **Storyboard FIRST — get approval before building.** Present in chat:
   (a) the design system (stage · palette · type · hero objects · motion ·
   payoff effect) in 3-4 lines, and (b) a 10-row storyboard table
   (slot · seconds · scene concept · on-screen copy · beat moment). Ask for
   one approval/redline pass. This is the cheapest point to change direction.
3. **Write the composition** in `~/promo-video-studio/src/<Brand>Promo.tsx`
   with the design system in the header comment. Register in `src/Root.tsx`
   at 1920×1080 @30fps **and ALWAYS also register the 1080×1920 sibling**
   (`<Id>Mobile`, same component — scenes should branch on
   `portrait = height > width`), even if 9:16 wasn't requested. Typecheck:
   `npx tsc --noEmit`.
4. **Key stills before any video render** — render the 3 make-or-break frames
   and READ them (hook, hero scene, payoff):
   ```bash
   npx remotion still <CompId> /tmp/still.jpg --frame <F>
   ```
5. **DRAFT render for verification** (~4× faster than final):
   ```bash
   npx remotion render <CompId> out/<slug>-draft.mp4 --scale 0.5 --crf 30
   ```
6. **Verify** with `scripts/frames.sh` (exact frames — never `-ss` fast seek):
   ```bash
   scripts/frames.sh out/<slug>-draft.mp4 <outdir> 40 160 240 360 500 570 680 870 960 burst:<hitframe>
   ```
   ~1 still per scene + a 12-frame burst around the biggest hit. READ every
   image. Stills: claims true, text readable, nothing clipped, no collisions,
   gradients visible. Burst: the payoff's visual peak must land within ~6
   frames after the musical hit. Fix → re-render draft → re-verify only the
   fixed frames.
7. **Final render** (full res, only once verification passes):
   ```bash
   npx remotion render <CompId> out/<slug>.mp4
   ```
   Spot-check 2-3 frames AND volumedetect the MP4.
8. **Deliver**: copy the MP4 to the user's working directory and open it —
   but **QuickTime caches**: `open` on a video whose window is already open
   just re-focuses the STALE window. Always deliver with a fresh timestamped
   copy:
   ```bash
   killall "QuickTime Player" 2>/dev/null; sleep 1
   cp out/<slug>.mp4 "out/<slug>-$(date +%H%M%S).mp4" && open "out/<slug>-$(date +%H%M%S).mp4"
   ```
   Report a scene-by-scene table with timings, honesty judgment calls, and
   any licensing caveats.
9. **After approval, deliver the bundle proactively** — don't wait to be
   asked for each piece: (a) render the 9:16 vertical (verify 2-3 portrait
   stills first, portrait layouts break silently); (b) render thumbnails
   (below). Present all files in one delivery message.
10. **Offer burned-in captions** for social cuts — most feed video plays
   muted. Implement as a caption track in the composition (array of
   `{text, from, to}` synced to the beat grid, rendered as a bottom-third
   mono strip in the design system's style), behind a `captions` prop so
   both variants render from one comp. Offer a VO variant too when the
   product needs explanation.
11. **Offer a YouTube thumbnail** after the final render is approved. Pattern:
   a `Thumbnail.tsx` component (1280×720, `durationInFrames={1}`) using the
   video's exact design system, with a `variant` prop for 3 concepts —
   (a) split: big 3-word hook left + hero object/pill + floating chips right,
   (b) centered statement + product pill, (c) full brand-color background with
   white type for max feed contrast. Register `Thumb-<variant>` comps, render
   each with `remotion still`, READ them (check clipping — headline blocks
   need explicit `top:` positions, not flex-center), then copy the PNGs to
   the user's Desktop. Text must be huge enough to read at ~120px-wide
   preview size.

## Hard-won gotchas (each cost a render — don't relearn them)

- **`background-clip: text` needs typography on the SAME span as the
  gradient.** A gradient span whose font styles are inherited from a parent
  renders near-black/clipped in headless Chrome. Build one style object:
  `{...typoStyles, ...gradientStyles}` on a single span.
- **Remotion's `AbsoluteFill` lays out as a COLUMN** — set
  `flexDirection: "row"` explicitly for horizontal layouts.
- **Absolutely-positioned children of a zero-size anchor**: nodes positioned
  with raw `left/top` px inside a 0×0 container land relative to its corner,
  not its center — while a sibling SVG's viewBox centers itself. Give the
  container an explicit width/height and position children with
  `calc(50% + Xpx)`.
- **Scrolling/overlapping stacks need viewport masks bigger than you think** —
  rows scrolling up WILL cross the headline; mask from y=0 with a solid-to-
  transparent gradient that fully covers the text zone.
- **Collision-check orbiting/converging elements against center text**: chips
  that drift inward WILL cross headlines.
- **Segmented bars clip labels in narrow segments** — only render inline
  values when the segment is >14% of the total.
- **Wide two-part headlines overflow 1920px** when both halves are tracked
  uppercase ≥70px — stack them or drop to ≤62px.
- **Deterministic pseudo-randomness only** (`(i * 137) % 100` style) — no
  `Math.random()` in compositions.
- Long strings in pills/chips are the most common overflow — keep chip copy
  ≤3 words and `whiteSpace: "nowrap"` so breakage is visible, not subtle.
- **Never run multiple `npx remotion still` in parallel** — the npx bootstrap
  races. Render stills sequentially in one loop.
- **Shell cwd can drift/reset between Bash calls** — use absolute paths or
  re-`cd` from the project root in every command.

## Honesty rule

Every claim must be literally true of the product, OR explicitly authorized
by the user as aspirational (ask via intake question 8b and note it in the
final report). Metrics shown on screen must exist on the product's own site
(cite-able), never invented. Example prices/rates may be illustrative but
must be plausible and current. When in doubt, describe speed and visibility,
not automation.

## Iteration protocol

- Ship a full draft fast, then iterate per-scene on feedback.
- "Too fast" → more hold time within the scene (never resize scenes).
- "Doesn't feel like <audience>" → swap the visual OBJECTS, not just words.
- "Change the template" → design a genuinely new system (stage, motion, type,
  payoff) — recoloring the old one does not count, and neither does keeping
  the old structure (see the anti-fingerprint checklist).
- "I love scene X" → treat it as protected: reuse it verbatim in later cuts
  (slot durations permitting), and mine its pattern for other scenes.
- Keep the music/scene grid untouched while iterating content.
- Always run the full intake batch on a NEW video request (skip only what's
  already decided in-conversation).
