# Open questions & help wanted

This is a living list of things the project needs help with. Two kinds:

- **Rules questions** — a rule that can be read more than one way. We need someone who knows the game
  to decide the canonical interpretation before it can be implemented correctly. **You don't need to
  code to help here — just answer.**
- **Code issues** — a bug or limitation in the engine/UI that a developer can fix.

**How to help:**
- To **answer a rules question** or **claim a code issue**, open a GitHub issue using the matching
  template (New issue → *Rules question* or *Code issue*), or comment on an existing one.
- Maintainers move items from here to "resolved" once an answer lands or a PR merges.
- New questions discovered during development are added here and/or filed as issues.

> The app's in-app **Known Issues** panel (`src/data/known-issues.ts`) is the user-facing tracker;
> this file is the contributor-facing one and additionally holds the *unanswered rules questions*.

---

## Rules questions (need a canonical answer)

> Answer any of these via the **Rules question** issue template — that unblocks the implementation.

- **Standalone "Jump pack" as a unit-type in datasheets.** A few factions list "Jump pack" in the
  unit_type field as if it were a type. Core Rules define the TYPE "Jump Pack Infantry" (gives Deep
  Strike) and a separate "Jump pack" RULE (no Deep Strike). Per-faction: is each occurrence meant to
  be the type or the rule?

---

## Code issues (developers welcome)

> Claim any of these via the **Code issue** template. See `CONTRIBUTING.md` for engine structure.

*(All faction audits are complete — all 19 factions plus the Escalation and Horus Heresy
supplements have been through a full line-by-line `.ods` audit. Remaining code issues are
deliberate, larger engine work rather than data fixes — see the in-app **Known Issues** panel,
`src/data/known-issues.ts`, for the current list. Two examples worth a developer's attention:)*

- **Cross-faction sub-model purchases.** Several units (T'au Drones via "Drone controller", Eldar's
  "Paragon of war"/"Paragon of fate" Exarch-power grant) need a UI concept that doesn't exist yet:
  picking N priced/profiled sub-items attached to a roster entry. See `ki-tau-empire-drones-
  unmodelled-01` and `ki-eldar-paragon-of-war-partial-stats-01` in Known Issues.

- **Talos / Carnifex Brood weapon-copy counting.** Both units have 2 weapon copies per model (not 2
  alternative swaps for 1 copy), but the engine's `replaces`-accumulation mechanism counts models,
  not weapon copies — adding `replaces` to their swap groups would cause incorrect early-hiding on
  multi-model squads. See `ki-replaces-swap-manual-review-01`.
