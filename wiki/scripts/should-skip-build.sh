#!/bin/sh
# Vercel's "Ignored Build Step" for this project. Root Directory is set to wiki/, so Vercel's
# own default skip-detection only looks at files changed inside wiki/ — but every page here is
# generated from data vendored out of the SIBLING repo root (data/parsed/<faction>,
# src/types/data.ts, src/data/coreRules.ts; see scripts/vendor.mjs). A commit that only touches
# those — a stat fix, a new faction rule, a codex version bump — never touches anything under
# wiki/, so the default heuristic silently skipped the rebuild and the live site drifted out of
# date (caught 2026-08-21: the deployed site still read "Tyranids Codex v1.02" days after the
# canonical data had moved well past it).
#
# Vercel's ignoreCommand convention: exit 0 means SKIP the build, non-zero means proceed.
# `git diff --quiet` already does exactly that (0 = no differences) — no inversion needed.
#
# Run from the wiki/ directory (Vercel's default cwd for this command, matching Root Directory).
ROOT=$(git rev-parse --show-toplevel)
git diff --quiet HEAD^ HEAD -- \
  "$ROOT/data/parsed" \
  "$ROOT/src/types/data.ts" \
  "$ROOT/src/data/coreRules.ts" \
  .
