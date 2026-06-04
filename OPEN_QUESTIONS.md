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

- **Mixed-model squads — which model is an "extra"?** Units that mix a base troop with a premium
  optional model (e.g. CSM Traitor Guard = Guardsman 8 pts + Chaos Ogryn 28 pts; SM Bike Squad =
  Biker 65 + Attack Bike 137; Eldar Guardian Defenders; GSC Atalan Jackals; Tau Kroot Farstalkers).
  When the squad-size slider adds a model, it should add the **base troop** — but the premium model
  is its own datasheet entry that often has **no separate "may include 1 X" cost line**. What's the
  intended way to add and price the premium model? (See code issue `mixed-model pricing` below — the
  fix needs this answer.)

- **Jet Bike vs "Jetbike" spelling, "Super-heavy" casing.** Several factions use one-word "Jetbike"
  where Core Rules say "Jet Bike", and "Super-Heavy" vs "Super-heavy". Pure spelling — confirm the
  canonical form so we normalize once.

- **Standalone "Jump pack" as a unit-type in datasheets.** A few factions list "Jump pack" in the
  unit_type field as if it were a type. Core Rules define the TYPE "Jump Pack Infantry" (gives Deep
  Strike) and a separate "Jump pack" RULE (no Deep Strike). Per-faction: is each occurrence meant to
  be the type or the rule?

---

## Code issues (developers welcome)

> Claim any of these via the **Code issue** template. See `CONTRIBUTING.md` for engine structure.

- **Mixed-model pricing (`points.ts`).** The per-extra-model cost picks the first `min:0` model,
  which is often the premium specialist (Ogryn/Attack Bike/Invader-Quad/weapon platform), so extra
  models are overcharged. A naive fix (use the base troop) makes the specialist *free*, because most
  of these specialists have no dedicated charging option. Correct fix = price size-extras at the base
  troop **and** give each specialist its own charged option, excluded from the size fill. Needs the
  rules answer above + per-unit datasheet grounding. Affects CSM, SM and (engine-shared) Eldar, Dark
  Eldar, GSC, Tau.

- **Residual unit-type data quality.** A typo "Montrous Creature" (should be "Monstrous Creature"),
  literal `KEYWORD` placeholder text in some Necron/Kroot `unit_type` fields, and the Jetbike/
  Super-heavy casing above. Display-only; fix when each faction is audited.

- **War Dog dual-swap display (cosmetic).** Swapping both Reaper chaintalons leaves the base profile
  on the card because the displayed-weapon model lists profiles, not per-instance counts. Points are
  correct. Needs per-instance weapon counting in the resolver.

- **The 14 unaudited factions.** Adeptus Mechanicus, Sororitas, Custodes, Eldar, Dark Eldar,
  Harlequins, Grey Knights (partial), Imperial Guard (partial), Inquisition, Necrons, Orks, Tau,
  Tyranids, Leagues of Votann, Assassins, Genestealer Cults still carry original-parser data — not
  yet cross-checked against the source files item-by-item like CSM/SM/CD. Picking one faction and
  auditing its armory/traits/archetypes against the source (see `src/data/rules-model/_TEMPLATE.md`)
  is the highest-impact contribution.
