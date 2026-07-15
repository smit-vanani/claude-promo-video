#!/bin/bash
# frames.sh — exact-frame verification stills + hit bursts from a render.
#
# Usage: scripts/frames.sh <video.mp4> <out_dir> <spec> [<spec> ...]
#   spec = N         → single exact frame N            (f<N>.jpg)
#   spec = burst:N   → 12 frames N-2 .. N+9            (b<N>_<i>.jpg)
#
# Example: scripts/frames.sh out/x.mp4 /tmp/fr 40 160 500 burst:740
set -euo pipefail
VIDEO="$1"; OUT="$2"; shift 2
mkdir -p "$OUT"
for spec in "$@"; do
  if [[ "$spec" == burst:* ]]; then
    N="${spec#burst:}"
    A=$((N - 2)); B=$((N + 9))
    ffmpeg -loglevel error -i "$VIDEO" -vf "select='between(n,$A,$B)',scale=480:-1" -vsync 0 "$OUT/b${N}_%02d.jpg"
  else
    ffmpeg -loglevel error -i "$VIDEO" -vf "select='eq(n,$spec)',scale=640:-1" -vsync 0 -frames:v 1 "$OUT/f${spec}.jpg"
  fi
done
ls "$OUT"
