#!/usr/bin/env bash
# promo-video — zero-config setup.
# Installs system deps (ffmpeg, node) and bootstraps the Remotion studio at
# ~/promo-video-studio, then copies this skill's scripts into it.
# Safe to re-run: it skips anything already present.
set -euo pipefail

STUDIO="${PROMO_VIDEO_STUDIO:-$HOME/promo-video-studio}"
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"   # …/skills/promo-video/scripts

say()  { printf "\033[1;36m▸ %s\033[0m\n" "$*"; }
ok()   { printf "\033[1;32m✓ %s\033[0m\n" "$*"; }
warn() { printf "\033[1;33m! %s\033[0m\n" "$*"; }

# ── package manager detection ────────────────────────────────────────────────
PM=""
if   command -v brew    >/dev/null 2>&1; then PM="brew"
elif command -v apt-get >/dev/null 2>&1; then PM="apt"
elif command -v dnf     >/dev/null 2>&1; then PM="dnf"
elif command -v pacman  >/dev/null 2>&1; then PM="pacman"
elif command -v choco   >/dev/null 2>&1; then PM="choco"
fi

pkg_install() {
  local pkg="$1"
  case "$PM" in
    brew)   brew install "$pkg" ;;
    apt)    sudo apt-get update -qq && sudo apt-get install -y "$pkg" ;;
    dnf)    sudo dnf install -y "$pkg" ;;
    pacman) sudo pacman -S --noconfirm "$pkg" ;;
    choco)  choco install -y "$pkg" ;;
    *)      warn "No supported package manager found — install '$pkg' manually."; return 1 ;;
  esac
}

# ── ffmpeg ───────────────────────────────────────────────────────────────────
if command -v ffmpeg >/dev/null 2>&1; then
  ok "ffmpeg already installed"
else
  say "Installing ffmpeg…"
  pkg_install ffmpeg && ok "ffmpeg installed" || warn "Install ffmpeg manually, then re-run."
fi

# ── node ─────────────────────────────────────────────────────────────────────
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -v | sed 's/v\([0-9]*\).*/\1/')"
  if [ "$NODE_MAJOR" -ge 18 ]; then ok "node $(node -v) OK"; else warn "node $(node -v) is <18 — upgrade recommended."; fi
else
  say "Installing node…"
  case "$PM" in
    brew) pkg_install node ;;
    *)    pkg_install nodejs || pkg_install node ;;
  esac
  command -v node >/dev/null 2>&1 && ok "node $(node -v) installed" || warn "Install Node 18+ manually, then re-run."
fi

# ── Remotion studio ──────────────────────────────────────────────────────────
if [ -f "$STUDIO/package.json" ]; then
  ok "Studio already exists at $STUDIO"
else
  say "Bootstrapping Remotion studio at $STUDIO (blank template)…"
  # Non-interactive scaffold of a blank Remotion project.
  npx --yes create-video@latest "$STUDIO" --template blank || {
    warn "Automatic scaffold failed. Run this once, pick the Blank template + TypeScript:"
    warn "  npx create-video@latest \"$STUDIO\""
    exit 1
  }
  ok "Studio created"
fi

# ── copy helper scripts into the studio ──────────────────────────────────────
mkdir -p "$STUDIO/scripts"
cp "$SKILL_DIR/beatmap.mjs" "$SKILL_DIR/frames.sh" "$STUDIO/scripts/" 2>/dev/null || true
chmod +x "$STUDIO/scripts/frames.sh" 2>/dev/null || true
ok "Helper scripts copied to $STUDIO/scripts"

printf "\n\033[1;32m✔ promo-video is ready.\033[0m  Studio: %s\n" "$STUDIO"
printf "In Claude Code, run:  \033[1m/promo-video https://your-product.com\033[0m\n"
