# Rules-model digest — Escalation (Lords of War supplement)

> Cross-faction supplement, **not a faction**. Adds super-heavy vehicles and gargantuan
> creatures that occupy the **Lords of War** Army Organisation slot. Each unit is integrated
> as a **native unit inside its own faction's JSON** with `slot: 'Lords of War'` (Route 2).
> Validated against the canonical files — never filled from training memory.

**Sources read to build this digest:**
- `Informacion/missions_text.txt` — Lords of War slot (Epic only, 33% pts cap), Warlord rule.
- `Informacion/core_rules_text.txt` (lines ~1090–1189) — Escalation reference, FAQ #5 (Codex > Core), FAQ #11 (Barrage/Explosive built-in re-roll).
- `data/source/Escalation/Index.html` — cross-faction unit index + verbatim special rules.
- `data/source/Escalation/Baneblade.html` — datasheet mapping template.

---

## 1. The Lords of War slot

- **Availability:** the Lords of War slot exists **only in Epic Battle**. It is absent from
  Skirmish and Pitched Battle (`missions_text.txt`: "0+ Lords of War" appears only under Epic).
- **Count limit:** none — "0+" (any number of LoW units).
- **Points cap:** "A total of 33% of the point limit may be spent on Lord of War units."
  Enforced as `Math.floor(total * 0.33)`.
- **Allies:** allied detachments **cannot** bring Lords of War.
- **Warlord interaction:** Warlord is still the highest-cost **HQ**, not the LoW (a LoW is
  typically the most expensive unit but is not an HQ, so it is not the warlord by default).

### Engine wiring (Phase 0, shipped local)
- `SLOT_ORDER` (engagements.ts) ends with `'Lords of War'` — every consumer that iterates
  `SLOT_ORDER` (SlotPanel, ArmyList, AlliedDetachmentPanel, validators, PrintView) picks it up.
- **Every AOP map must contain the slot** or destructuring `eng.aop[slot]` crashes:
  - `skirmish.aop['Lords of War'] = [0,0]`
  - `pitched.aop['Lords of War']  = [0,0]`
  - `epic.aop['Lords of War']     = [0, LOW_UNLIMITED]` where `LOW_UNLIMITED = 99` (sentinel)
  - `ALLIED_AOP['Lords of War']   = [0,0]` (allies never get LoW)
- LoW is **special-cased out** of the generic count-based AOP min/max loops in validators.ts;
  a dedicated block enforces Epic-only + 33% pts cap.
- SlotPanel hides the LoW panel outside Epic or when the faction has no LoW units, and shows
  "≤33% pts" instead of the `/99` sentinel.

## 2. Unit type / keyword model

Each Escalation datasheet carries explicit **UNIT TYPE** and **KEYWORDS** rows — clean for the
keyword model (no pre-baked flags needed).

- **UNIT TYPE:** `Super-heavy Vehicle` or `Gargantuan Creature`.
- **KEYWORDS:** always includes `Lord of War` (this is the slot-gating keyword).
- Super-heavies use the **vehicle stat profile**: M / WS / BS / S / Front / Side / Rear / I / A / HP.
- Gargantuan creatures use the **creature profile**: M / WS / BS / S / T / W / I / A / Ld / Save.

## 3. Special rules (verbatim from Index.html → coreRules glossary)

Added to `src/data/coreRules.ts` RULES:
- **Gargantuan Creature** — follows Monstrous Creature rules with exceptions.
- **Super-heavy Vehicle** — follows vehicle rules with exceptions; own super-heavy damage
  chart; on losing its last Hull Point, on a 4+ it explodes (2D6" radius, S7 AP-2 D2).
- **Strength "D"** — a to-wound roll of 2+ always wounds a creature or penetrates a vehicle.
- **Colossal Blast** — up to eight wound rolls; cannot exceed models in the target unit;
  first unsuccessful hit roll can be re-rolled, up to four wound rolls.

(FAQ #11: Barrage / Explosive weapons have the built-in re-roll already accounted for.)

## 4. Cross-faction unit index (from Index.html)

| Faction column | Lords of War units |
|---|---|
| Adeptus Sororitas | Triumphant Procession |
| Chaos (CSM) | Chaos Spartan, Chaos Warhound, Knight Desecrator, Knight Rampager, Lord of Skulls, War Dog (+ Chaos Fellblade) |
| Eldar | Lynx, Vampire, Warp Hunter, Wraithknight |
| Imperial Guard | Baneblade, Gorgon Heavy Transport, Stormlord |
| Imperium (Space Marines / Knights) | Armiger, Knight Castellan, Knight Paladin, Warhound |
| Inquisition | Massive Orbital Strike |
| Necrons | Dynasty Phaeron, Tesseract Vault |
| Orks | Battle Fortress, Orkanaut, Stompa |
| Space Marines | Fellblade, Spartan |
| Tau Empire | Stormsurge |

> Name note: the Chaos knight is **Knight Desecrator** (not "Destructor").

## 5. Datasheet → JSON mapping template (from Baneblade.html)

Stat header: `No / Name / M / WS / BS / S / Front / Side / Rear / I / A / HP / Points`.
Example — **Baneblade**: M6" / WS– / BS4+ / S8 / Front14 / Side13 / Rear12 / I3 / A1 / HP5 / **1031 pts**.

- **Default loadout:** Autocannon; Baneblade cannon; Demolisher cannon; Twin heavy bolter.
- **WEAPON table cols:** RANGE / TYPE / S / AP / D / ABILITIES (e.g. AT(x), Colossal blast,
  Tank hunter, Barrage, Suppression).
- **OPTIONS:** (a) one of Storm bolter +8 / Heavy stubber +11 → constraint *one*;
  (b) add 2 Lascannons + 2 Twin heavy bolter +158 → constraint *fixed*.
- **ABILITIES:** Lumbering Behemoth.
- **KEYWORDS:** Lord of War.

## 6. Integration plan

- **Phase 0 (DONE, local):** Lords of War slot foundation — engine, all UI consumers,
  validator, glossary entries, this digest.
- **Phase 1 (NEXT):** Imperial Guard sample — add Baneblade, Gorgon Heavy Transport, Stormlord
  to `data/parsed/imperial_guard.json` as `slot: 'Lords of War'` units; verify end-to-end.
- **Phase 2:** batch the remaining 9 faction columns.

## 7. Open questions / discrepancies

- Per-datasheet weapon ability values (AT(x) ratings, exact D-weapon flags) to be confirmed
  against each unit's HTML when entering Phase 1/2 — do not infer from memory.
- Gorgon Heavy Transport and Stormlord datasheets not yet read; read their HTML before Phase 1.
