import type { KnownIssue } from './changelog';

export const KNOWN_ISSUES: KnownIssue[] = [
  // ── In progress ───────────────────────────────────────────────────────────
  {
    id: 'ki-skirmish-equip-caps-01',
    status: 'fixed',
    title: 'Skirmish: equipment stat/save caps and Unique armory limit not enforced',
    description: 'The Missions supplement Skirmish restrictions (L26-31) forbid gaining 2+ armour save, 4+ or better invulnerable save, T8+, weapon Damage 3+, or equipping more than one Unique armory item across the army. These were not enforced — a Skirmish list could include e.g. Terminator armor (2+ save) or Thunder hammer (D3) without any error. Fixed v0.51: validators.ts checks all armory items whenever the Skirmish engagement is selected. Uses parseEquipMods to detect the gained save/stat (not the unit\'s base stats, only what equipment adds) and inspects bought weapon profiles for D3+. Each violation is a hard error (list is marked illegal). The "one Unique item" rule (Core Rules L868 + Missions L17) now counts Unique armory items army-wide and blocks more than one. Grounded in missions_text.txt L17-31 and core_rules_text.txt L868.',
  },
  {
    id: 'ki-csm-armory-type-items-01',
    status: 'fixed',
    title: 'CSM armoury: type-changing items (bike, stature) showed type as an "ability" and lacked dedup',
    description: 'Items like "Chaos Space Marine bike" (gains Bike type) and "Daemonic stature" (gains Monstrous Infantry type) were showing the unit type as a quoted "ability" on the card (since equipMods extracts all quoted strings from desc) rather than updating the actual type line. Additionally, granted abilities were not deduplicated against what the model already had — an item granting "Deepstrike" on a unit that already has it would show it twice. Fixed v0.51: (1) Added ArmoryItem.effect — bike carries adds_unit_types:["Bike"], stature adds_unit_types:["Monstrous Infantry"]; the resolver applies armory-item effects through the same applyEffect path as option effects, with dedup (only adds what the model lacks). (2) equipMods skips unit-type words ("Bike", "Monstrous Infantry", etc.) when extracting grantedAbilities from quoted strings, so they no longer appear as abilities. (3) equipMods deduplicates granted abilities against the model\'s base abilities. "Daemonic flight / jump pack" intentionally has no effect — it grants the "Jump pack" ABILITY (+6" M, already shown via desc), not the "Jump Pack Infantry" UNIT TYPE (which gives Deep Strike); only the type gives Deep Strike, as grounded in core_rules_text.txt L503-507.',
  },
  {
    id: 'ki-bug-idcollision-01',
    status: 'fixed',
    title: 'Changing one unit\'s size (or removing an item) could affect another unit',
    description: 'Reported via the in-app bug form ("Changing Tactical Squad size sets Dreadnought to same size"). Root cause: the army is persisted to localStorage, but the unique-id counter (newId / selId) reset to 1 on every page load while the saved roster kept ids 1,2,3… — so a unit added after a reload could reuse a saved unit\'s id, and any id-keyed mutation (updateUnit/size, removeUnit, removeArmoryItem) then hit BOTH entries. Affected any two units in any faction (Tactical Squad ↔ Dreadnought was just one example). Fixed v0.51: ids are now generated with crypto.randomUUID() (with a random fallback for non-secure contexts), which can never collide across reloads.',
  },
  {
    id: 'ki-bug-permodel-inline-01',
    status: 'fixed',
    title: 'Per-model upgrades worded "for +X points per model" were charged only once',
    description: 'Reported via the in-app bug form ("Bloodletter armor upgrade isn\'t multiplied by unit size"). Inline on/off upgrades whose datasheet says "…for +X points per model" were added to the total a single time, ignoring unit size. Grounded against each datasheet (verb "per model"). Fixed v0.51: added an OptionGroup.per_model flag; the points engine multiplies inline_pts × unit size when set. Tagged the 6 affected units across the audited factions — Chaos Daemons: Bloodletters (brass armor +11), Bloodcrushers (brass armor +41); Space Marines: Death Company (jump packs +9), Scout Squad & Wolf Scout Squad (camo cloaks +11), Reiver Squad (grav-chutes +2). (Mark-of-Chaos "per model" options were already multiplied separately; choice-based "every model" swaps already multiply via their per-model quantity.)',
  },
  {
    id: 'ki-bug-veteran-perwound-01',
    status: 'fixed',
    title: 'Veteran ability costs not multiplied by wounds/hull points',
    description: 'Reported via the in-app bug form (production v0.46). On Monstrous Creatures & Vehicles, veteran abilities cost per Wound / Hull point. Verified already correct in v0.51: ArmoryModal computes a veteran item\'s cost as p_veh × wound(or HP) count × unit size and stores that total, and the points engine sums it. Characters pay the flat character-column cost and normal infantry pay p_unit × size, matching the Armory rules. No code change needed — resolves for users on the next deploy.',
  },
  {
    id: 'ki-bug-mixedmodel-pricing-01',
    status: 'known',
    title: 'Mixed-model units: extra models from the size slider use a premium specialist\'s price',
    description: 'Reported via the in-app bug form ("Traitor Guard points for additional models are for the Ogryn"). For units that mix a base troop with a premium optional model, the points engine\'s "extra model" cost picks the first model with min:0 (the heuristic in points.ts), which is often the expensive specialist rather than the base troop. An exhaustive scan of all factions found this overcharge in: Traitor Guard (extra = Chaos Ogryn 28 not Guardsman 8), Space Marines Bike Squad (Attack Bike 137 not Biker 65) and Outrider Bikes (Invader-Quad 143 not Outrider 69); plus Eldar Guardian Defenders & Storm Guardians, Genestealer Cults Atalan Jackals, Dark Eldar Corsair Voidscarred, and (inverted, an undercharge) Tau Kroot Farstalkers. NOT a one-line fix: the displaced specialist is NOT charged by any dedicated option in 7 of these units, so simply pointing "extra" at the base troop would make the specialist FREE. The correct fix is a mixed-model pricing pass — price size-extras at the base troop AND give each specialist its own charging option (and exclude it from the size fill). Scoped as its own task; needs each unit\'s datasheet grounded (the unaudited factions especially). Jakhals diverges in name only (same 7 pts, no cost impact).',
  },
  {
    id: 'ki-sm-gravisgate-01',
    status: 'fixed',
    title: 'Space Marines — Gravis (ᴳ) armory gate is not enforced (display badge only)',
    description: 'Per the SM Armory.html rule "Models wearing Gravis armor can only receive equipment with ᴳ", a Gravis-armoured model should be restricted to the ᴳ-tagged subset of the armory (mirroring the ᵀ/Terminator gate). Previously the ᵀ gate was enforced but there was no equivalent Gravis filter: gravis_compat was consumed only as a display badge, never as a filter, and no SM unit carried an innate Gravis keyword — so native-Gravis units could buy non-ᴳ wargear. Fixed v0.51: added modelRestrictsToGravisSubset (engine/keywords.ts) — fires on an innate Gravis armourKeyword, a bought "Gravis armor" equipment item, or the baked "Gravis armor" ability — and filterGravisCompat in ArmoryModal, composed into all three armory tabs (general / mark / legion) exactly like filterTermCompat. The 4 native-Gravis units (Heavy Intercessor, Aggressor, Inceptor, Eradicator) were tagged armourKeyword:"Gravis". Already-bought items stay visible so they remain removable. Gravis and Terminator are mutually exclusive ("not combinable"), so at most one subset gate applies. (The earlier ki-46d note that the tag "restricts to Gravis models only" is now actually true.)',
  },
  {
    id: 'ki-escalation-wardog-dualswap-display-01',
    status: 'known',
    title: 'Escalation — War Dog "swap both Reaper chaintalons" leaves the base profile on the card',
    description: 'The War Dog carries two Reaper chaintalons, each swappable independently (modelled as two choose-one groups, no replaces). The displayed-weapon list shows weapon profiles, not per-instance counts, so the base "Reaper chaintalon" profile is always shown while either chaintalon remains, and a swapped-in weapon is added alongside. If BOTH chaintalons are swapped, the Reaper chaintalon profile still lingers on the card (cosmetic only — points are always correct). A faithful fix needs per-instance weapon counting in the resolver, which the current profile-list model does not support.',
  },
  {
    id: 'ki-csm-traitorguard-swap-01',
    status: 'fixed',
    title: 'CSM — Traitor Guard "Lasgun → Chainsword + Laspistol" swap has empty choices',
    description: 'The Traitor Guard option group "Each model\'s Lasgun may be replaced by a Chainsword and a Laspistol" carries an empty choices[] in the production JSON, so there is nothing to select in the UI to trigger the swap. The replaces tag is set (Lasgun would drop) but it never fires without a selectable choice. Fixed v0.51: added a single combined choice "Chainsword and Laspistol" at +0 (the swap is free per the datasheet); replaces:["Lasgun"] was already set so the Lasgun drops on selection.',
  },
  {
    id: 'ki-csm-noisemarine-boltpistol-01',
    status: 'fixed',
    title: 'CSM — Noise Marines "Bolt pistol" swap references a weapon absent from weapons[]',
    description: 'The Noise Marines option group "Each model\'s Bolt pistol may be replaced with" names Bolt pistol, but no Bolt pistol profile existed in the unit\'s weapons[]. The replaces drop was therefore a no-op and the datasheet weapon was missing from the profile. Fixed v0.51: grounded the profile against the CSM general armory (Bolt pistol 12" Pistol 1 S4 AP-1 D1) — its cost is already baked into the unit — and inserted it into weapons[] after Astartes Chainsword, so the three "Bolt pistol may be replaced" swaps now drop a real profile.',
  },
  {
    id: 'ki-hh-hostcond-01',
    status: 'fixed',
    title: 'Horus Heresy — host-conditional option groups not resolved per host codex',
    description: 'Every HH datasheet carries two host-dependent branches on the same sheet: a "+1/model They Shall Know No Fear" group that applies only under a Space Marines host, and a "Mark of Chaos" group (+ god) that applies only under a Chaos Space Marines host. The engine currently shows/charges both regardless of which codex unlocked the supplement. Needs a host-conditional primitive that selects the correct branch from the host army. The #1 HH-specific gap. Fixed v0.51: the BSData condition primitive (available_if) now supports scope:\'force\', evaluated against the host army faction; all 20 host-conditional groups were tagged (12 Mark-of-Chaos → instanceOf Chaos Space Marines, 8 TSKNF → instanceOf Space Marines), and UnitCard hides the wrong-host branch while validators reject a selected branch that fails its host condition.',
  },
  {
    id: 'ki-archetype-injection-allied-01',
    status: 'fixed',
    title: 'Archetype-injected units (HH via Legion, daemons via Daemonkin/Plaguehost/cults) were mislabelled as allied',
    description: 'Per the CSM Army Customisation rules and the core Allies section, archetype-injected units are NOT allies: they become OWN units of the primary army (share the army AOP, count toward the army slot limits / 25% Troops, take the army Mark for daemon archetypes). v0.51 part 1 fixed the armory ACCESS half: the Legion archetype now grants the whole army the Horus Heresy armory as a legion-style tab (sharedSupplementArmory on ArchetypeRule), mirroring Legacy armory grants; daemon archetypes deliberately get no shared armory (daemons keep their own CD armory, no cross-access). v0.51 part 2 (Paso 2) audit finding: the heavy "own unit" semantics ALREADY worked, because the archetype path never sets state.alliedFaction (only the manual allied-detachment panel does) and the engine keys allied behaviour off state.alliedFaction, not off factionSource alone — slot counting (SlotPanel.ts:26, validators.ts:29-30,648) and AOP (getAopRequirement) already count injected units as own; forcedMark already applies regardless of factionSource (ArmoryModal.tsx:108); CSM traits already skip them because applyArmyTraits gates on unitName in data.units + the Chaos Space Marine keyword (army.ts:71,78); Objective Secured is not modelled in the builder (informational only). The single real defect was cosmetic: SlotPanel painted a "[Allied]" badge on every factionSource entry. Fixed by tagging archetype-injected entries with injected:true and showing "[Allied]" only for true allies (base_allied / manual detachment). factionSource stays as the data-source pointer (armory lookup, Daemonkin per-codex HQ check) — it does not imply allied semantics.',
  },
  {
    id: 'ki-hh-tcollision-01',
    status: 'fixed',
    title: 'Horus Heresy — ᵀ superscript collides with the Mark-of-Tzeentch glyph',
    description: 'In the HH armory the ᵀ superscript marks Terminator-compatible wargear (term_compat); in the CD/CSM armory the same ᵀ glyph marks Mark-of-Tzeentch items. Because HH is injected into a CSM host where Tzeentch marks coexist, the engine must scope the superscript per source so an HH terminator-ᵀ item is never read as Tzeentch-gated (or vice-versa). FIXED (v0.51): ArmoryModal scopes mark-reading per source via a markless flag — isMarklessFaction (active armory data is the HH supplement) and legMarkless(legName) (the archetype-granted HH legion tab). markless threads through EquipmentGroups → ArmoryItemRow so getRequiredMark / mark-badge / name-glyph-strip are suppressed, and isMarkBlocked early-returns false. HH items are treated as mark-less, so no HH item can be gated by or badged with a Chaos Mark. Empirically the collision was already unreachable (no HH armory item name ends in a mark glyph; HH carries no armory_marks/armory_legions; term_compat is a boolean field, not a name suffix) — this is a rules-faithful, future-proof guard.',
  },
  {
    id: 'ki-hh-armourslot-01',
    status: 'known',
    title: 'Horus Heresy — innate-armour units bake the profile differently than CSM (no innate armourKeyword tagged)',
    description: 'The CSM innate-armour swap fix (ki-csm-armourslot-01, v0.51) tags units whose base profile already bakes in the armour bonuses (+1 T/+1 A/2+). The HH Legion Terminator Cataphractii Squad instead lists T4/A2/2+ with a 4+ invuln ability — i.e. the +1 T/+1 A is NOT baked into T/A the way CSM Terminators are. Because the baked semantics differ and the rules source for HH armour bonuses needs a separate check, no innate armourKeyword was set on HH units yet; if an HH innate-armour unit can buy a conflicting armour, the same double-count could occur. Needs a rules pass on HH armour profiles before tagging.',
  },
  {
    id: 'ki-cd-slotshift-01',
    status: 'known',
    title: 'Chaos Daemons — Ascended Daemon Prince upgrade does not shift slot (HS→HQ) or force warlord',
    description: 'The Daemon prince (Heavy Support) has a unique +90 "Ascended Daemon Prince" upgrade that, per the sheet, moves the model to an HQ slot, makes it the army\'s forced Animosity warlord, and swaps to a 289-pt Greater-Daemon profile. The engine applies the points/variant correctly but does not perform the HS→HQ slot move nor the forced-warlord assignment. Needs a slot-shift primitive (same class of gap as the planned roster-slot work).',
  },
  {
    id: 'ki-cd-condunlock-01',
    status: 'fixed',
    title: 'Chaos Daemons — Daemon prince psyker upgrade is not gated on mark choice ("if no Mark of Khorne")',
    description: 'Fixed in v0.51 — added a structured keyword condition (OptionGroup.available_if, BSData instanceOf/notInstanceOf primitive). The psyker upgrade now carries { type: notInstanceOf, scope: unit, keyword: Khorne } in both the CD and CSM Daemon Prince. The engine helper isOptionAvailable() gates it: the validator flags a Khorne-marked selection as invalid and the unit card disables the checkbox. Replaces the previous hard-coded "no mark of khorne" header regex in validators.ts and UnitCard.tsx. Same primitive is the foundation for ki-hh-hostcond-01 (scope: force).',
  },
  {
    id: 'ki-csm-armourslot-01',
    status: 'fixed',
    title: 'CSM — single-slot armour does not override a unit\'s INNATE armour profile',
    description: 'The single-slot primitive (v0.50) prevents two BOUGHT armours from stacking, but a unit whose datasheet already bakes in an armour (e.g. a Terminator with 2+/5+ and +1 T/+1 A in its base profile) that then BUYS a different armour (Cataphractii) gets the bought item applied additively — its +1 Toughness/+1 Attack double on top of the innate ones, and the result is not a clean swap (only the invulnerable should change 5+ → 4+). A correct fix requires the unit to carry its innate armourKeyword so the bought armour replaces the innate profile rather than adding to it. Part of the unit→armour keyword mapping (see ki-csm-tgate-01). Fixed v0.51: added Unit.armourKeyword (innate) and tagged the 5 innately-armoured CSM units (Chaos + Scarab Occult Terminators = Terminator; Blightlord + Deathshroud + Red Butcher Terminators = Cataphractii). parseEquipMods now takes the innate armour and treats a bought armour as a SWAP — its shared stat deltas (+1 T/+1 A) are suppressed while the save/invuln still apply. NOTE (verified 2026-06-03): the Cataphractii-on-Terminator path is NOT reachable in data — Cataphractii lives only in the Nurgle armory as a character-only item (p_unit null / p_char 76) and no innately-Terminator unit is a character; the datasheets give these squads no Cataphractii option. So the fix\'s real trigger is buying Terminator armor (general armory, p_unit 23) on an already-Terminator squad, which previously double-added +1 T/+1 A. Squads correctly cannot take Cataphractii (faithful to the rules).',
  },
  {
    id: 'ki-csm-tgate-01',
    status: 'fixed',
    title: 'CSM — Terminator armory gate misses Crux Terminatus units (Chaos / Scarab Occult Terminators)',
    description: 'The armory only restricted a unit to Terminator-compatible wargear when one of its abilities literally started with "Cataphractii armor" (ArmoryModal.tsx). Chaos Terminators and Scarab Occult Terminators wear Terminator armour but their save ability is named "Crux Terminatus" (5+ invulnerable), so the gate was skipped and their Champion could buy non-Terminator gear it should not equip. Fixed v0.51: grounded in the CSM Armory.html rule "Models wearing Cataphractii or Terminator armor can only receive equipment with ᵀ" (both keywords gate identically to the ᵀ subset — they differ only in the invulnerable save). modelRestrictsToTermSubset (engine/keywords.ts) now fires on the innate armour keyword (unit.armourKeyword Terminator/Cataphractii — captures the 5 innately-armoured units) AND on a dynamically-bought Terminator armor / Cataphractii armor equipment item (the rule applies whether the keyword is innate or purchased). ArmoryModal passes the bought-armour names and keeps already-bought items visible so the non-ᵀ armour item itself stays removable. Remaining minor edge (pre-existing display-gate design, no validator): if non-ᵀ gear is bought BEFORE the armour, it stays in the loadout (visible/removable) rather than being auto-flagged illegal.',
  },
  {
    id: 'ki-parser-02',
    status: 'fixed',
    title: 'Parser — options that change unit_type are not reflected in engine logic',
    description: 'Some units can change their unit type via an upgrade (e.g. Daemon Prince gains "Jump pack infantry" with wings). The parser stored unit_type statically from the UNIT TYPE section, so a selected upgrade applied no rules. Fixed v0.51: added an option-effect primitive (OptionEffect in types/data.ts) carried on a Choice or OptionGroup — grants_abilities, stat_mod, and adds_unit_types. Unit types are ADDITIVE (Core Rules: a model may have "one or more unit types"; the verb is "gain"), so adds_unit_types appends to the base type, never replaces it. The resolver collects effects from selected options (group-level for inline toggles, choice-level for named choices) into optionStatMods / optionAddedUnitTypes / optionAbilities; UnitCard and PrintView show the stacked stat (e.g. M 6"→12"), the composite type label ("Monstrous Creature, Jump pack infantry"), and the granted ability with an "Option" badge. Tagged: Daemon Prince wings (+6" M, gains Jump pack infantry). Canon follow-up v0.51 (grounded in datasheet VERBS, not memory): added set_unit_type for the verb "change unit type TO X" (replacement, vs additive "gain") — Blood Claws jump packs → "Jump Pack Infantry" (+6" M), Assault Squad remove-jump-pack → "Infantry" (−6" M); the 3 innate SM jump-pack units (Assault Squad, Inceptor, Suppressor) relabelled from the "Infantry, Jump pack" shorthand to the canonical core type "Jump Pack Infantry"; the CD Daemon Prince wings effect was added (it had the header but no effect, so it was unmodelled). Possessed jump-pack effect REMOVED — the datasheet states only the points (no Deep strike, no type change); the earlier Deep-strike/type grant was not grounded in the sheet. UnitCard renders set_unit_type as a struck-through "old → new" like the slot-change display.',
  },
  {
    id: 'ki-jumppack-otherfactions-01',
    status: 'fixed',
    title: 'Grey Knights Teleporter effect + cross-faction unit-type casing',
    description: 'Both done v0.51. (1) Grey Knights Teleporter: the option on Captain in Nemesis Armor (+54) and Nemesis Dreadknight (+36) now carries an OptionEffect granting the "Jump pack" ability + 6" Movement (grants_abilities + stat_mod — it grants the Jump pack RULE, not the "Jump Pack Infantry" TYPE; both units stay Monstrous Creature). "Shunt" is not re-granted because each unit already lists it (with its full "24 inch once per game" description) as a base ability, and grants_abilities carries names only — re-granting would duplicate it on the card. (2) Casing: a one-off pass (scripts/_normalize_unit_types.cjs, dry-run reviewed then applied) normalized the unit_type field to the Core-Rules title-case vocabulary — Monstrous Creature, Jump Pack Infantry, Monstrous Infantry, Character Model, Jet Bike — across 154 fields in 18 production factions. Display-only (no logic keys off the string; is_vehicle/is_monster are separate booleans). Touched only unit_type values via a line-level replace (option-header text and *_html*.json parser-scratch left untouched). Residual non-casing data-quality findings logged separately (ki-unittype-residuals-01).',
  },
  {
    id: 'ki-unittype-residuals-01',
    status: 'known',
    title: 'Residual unit-type data-quality issues surfaced by the casing pass (display only)',
    description: 'The v0.51 casing normalization deliberately stayed in scope (title-case only) and surfaced separate issues to address per-faction later, none of which affect points or legality (display only): (a) "Montrous Creature" — a misspelling of "Monstrous Creature" in at least one faction; (b) "Jetbike" (one word) coexists with the canonical "Jet Bike" (two words) — a spacing/spelling inconsistency, not casing; (c) standalone "Jump pack" used as a pseudo-type in some factions\' unit_type (e.g. "Jump pack, Monstrous Creature") — same shorthand SM carried; resolving whether it means the Jump-pack RULE or the "Jump Pack Infantry" TYPE needs per-faction source grounding (Golden Rule); (d) "Super-Heavy Vehicle" vs "Super-heavy Vehicle" casing split (Escalation/LoW types); (e) literal "KEYWORD" placeholder text left in some unit_type fields (Necrons, Kroot/Tau) — a parser artifact. Each should be fixed when its faction is audited.',
  },
  {
    id: 'ki-parser-01',
    status: 'fixed',
    title: 'CSM — Daemon Prince not flagged as character (is_character: false)',
    description: 'Daemon Prince unit type is "Monstrous Creature", not "Character model", so inferFlags() left is_character false. Fixed v0.51: the datasheet is an HQ single-model character (it is the army warlord / can take legacies and traits), so is_character was hand-set to true in the production JSON — a rules correction the static unit_type parser could not derive.',
  },
  {
    id: 'ki-46d',
    status: 'fixed',
    title: 'Space Marines — Imperial Fists Gravis armory items had a stray "`3" suffix and missing Gravis tag',
    description: 'Fixed in v0.47 — Gravis item names corrected (parser artefact removed) and Gravis keyword tag added to restrict them to Gravis models only.',
  },
  {
    id: 'ki-46c',
    status: 'fixed',
    title: 'Space Marines — "Bolter Drill" trait not applied to vehicles',
    description: 'Fixed in v0.47 — applies_to field updated systematically across 14 SM traits; Bolter Drill now correctly applies to vehicles with bolt weapons.',
  },
  {
    id: 'ki-46b',
    status: 'fixed',
    title: 'Space Marines — vehicles saw general armory items instead of vehicle equipment',
    description: 'Fixed in v0.47 — SM vehicle units now correctly access the vehicle equipment category. Five chapter armory vehicle upgrades also corrected.',
  },
  {
    id: 'ki-46a',
    status: 'fixed',
    title: 'Space Marines — Wolf Companions unit confirmed valid',
    description: 'Fixed in v0.47 — Wolf Companions is a valid Space Wolves unit (Fast Attack, 1–4 models, 6 pts, Bike type, Claws & Teeth melee weapon). Confirmed from source document.',
  },
  {
    id: 'ki-22a',
    status: 'planned',
    title: {
      en: 'Trait stat and ability effects shown as text only for most factions',
      de: 'Eigenschaft-Effekte für die meisten Fraktionen nur als Text angezeigt',
      es: 'Los efectos de rasgos se muestran solo como texto para la mayoría de facciones',
    },
    description: {
      en: 'Chaos Space Marines and Space Marines have their traits fully wired into the engine — stat changes, ability injections, weapon bonuses and invulnerable saves all calculate live and show on the unit card. For the remaining factions traits are displayed and priced correctly, but their in-game effects (e.g. +1 Strength, gaining Furious Charge) are shown as description text rather than applied automatically. This is being rolled out faction by faction.',
      de: 'Chaos Space Marines und Space Marines haben ihre Eigenschaften vollständig in die Engine integriert — Statuswertänderungen, Fähigkeitsinjektionen, Waffenboni und Rettungswürfe gegen alles werden live berechnet und auf der Einheitenkarte angezeigt. Für die übrigen Fraktionen werden Eigenschaften korrekt angezeigt und bewertet, aber ihre spielerischen Effekte (z.B. +1 Stärke, Furious Charge) werden nur als Beschreibungstext angezeigt statt automatisch angewendet. Dies wird Fraktion für Fraktion umgesetzt.',
      es: 'Los Chaos Space Marines y los Space Marines tienen sus rasgos totalmente integrados en el motor: cambios de características, habilidades, bonificaciones de armas y salvaciones invulnerables se calculan en tiempo real y se ven en la tarjeta de unidad. Para el resto de facciones, los rasgos se muestran y valoran correctamente, pero sus efectos en juego (por ejemplo, +1 a la Fuerza, obtener Ataque Furioso) aparecen solo como texto descriptivo, no se aplican automáticamente. Se implementará facción por facción.',
    },
  },
  {
    id: 'ki-26a',
    status: 'planned',
    title: {
      en: 'Veteran Abilities and Vehicle Upgrades only fully supported for CSM',
      de: 'Veteranenfähigkeiten und Fahrzeug-Upgrades nur vollständig für CSM unterstützt',
      es: 'Habilidades de veterano y mejoras de vehículo solo totalmente compatibles para CSM',
    },
    description: {
      en: 'Standard Veteran Abilities (Counter-attack, Favoured enemy, Furious charge, Infiltrator, Outflank, Tank hunter, Terrain expert, Vanguard) and Vehicle Upgrades are built into the CSM armory and priced correctly. Other factions can select veteran and vehicle upgrades from their own armories, but the underlying ability logic (e.g. granting the Infiltrator rule to the unit) is not yet wired up.',
      de: 'Veteranenfähigkeiten (Gegenangriff, Begünstigter Feind, Wutangriff, Infiltrator, Flankenmanöver, Panzerjäger, Geländeexperte, Vorhut) und Fahrzeug-Upgrades sind vollständig für CSM implementiert. Andere Fraktionen können zwar Veteranen- und Fahrzeug-Upgrades aus ihren Rüstkammern auswählen, aber die zugrunde liegende Regellogik (z.B. das Verleihen der Infiltrator-Regel) ist noch nicht vollständig verdrahtet.',
      es: 'Las Habilidades de Veterano estándar (Contraataque, Enemigo favorito, Carga furiosa, Infiltrador, Flanqueo, Cazacarros, Experto en terreno, Vanguardia) y las Mejoras de Vehículo están completamente integradas en la armería CSM. Las demás facciones pueden seleccionarlas desde sus propias armerías, pero la lógica interna (por ejemplo, conceder la regla Infiltrador a la unidad) aún no está completamente programada.',
    },
  },
  {
    id: 'ki-40a',
    status: 'known',
    title: {
      en: 'Archetypes show their rules but not all restrictions are enforced',
      de: 'Archetypen zeigen ihre Regeln, aber nicht alle Einschränkungen werden durchgesetzt',
      es: 'Los arquetipos muestran sus reglas pero no todas las restricciones se aplican',
    },
    description: {
      en: 'Archetypes, Legacies and Traits are now active for all factions and their descriptions are shown. However, some archetype-specific restrictions (e.g. "all units must start inside a transport", mandatory unit compositions, keyword filters) are only enforced for Chaos Space Marines, Chaos Daemons and Space Marines. For other factions the archetype notes are informational — the builder will not currently block you from breaking them.',
      de: 'Archetypen, Vermächtnisse und Eigenschaften sind jetzt für alle Fraktionen aktiv und ihre Beschreibungen werden angezeigt. Einige archetyp-spezifische Einschränkungen (z.B. "alle Einheiten müssen in einem Transport beginnen", Pflicht-Einheitenzusammensetzungen, Schlüsselwortfilter) werden jedoch nur für Chaos Space Marines, Chaos Dämonen und Space Marines durchgesetzt. Für andere Fraktionen sind die Archetyp-Hinweise informativer Natur — der Builder blockiert aktuell keine Regelverstöße.',
      es: 'Los arquetipos, legados y rasgos están activos para todas las facciones y sus descripciones se muestran. Sin embargo, algunas restricciones específicas de arquetipo (por ejemplo, "todas las unidades deben comenzar dentro de un transporte", composiciones de unidades obligatorias, filtros de palabras clave) solo se aplican para Chaos Space Marines, Chaos Demonios y Space Marines. Para el resto de facciones, las notas de arquetipo son informativas — el constructor no bloqueará actualmente que las incumplas.',
    },
  },
  {
    id: 'ki-26b',
    status: 'fixed',
    title: 'Psychic power access rules not yet enforced per psyker',
    description: 'Fixed in v0.32 — Chaos Daemons psyker discipline access enforced per unit from ability text. CSM/other factions enforce mark-based discipline filtering (only see god discipline when matching mark is active). General factions: discipline tabs already filtered by mark and legacy.',
  },
  // ── Planned (v0.22+) ──────────────────────────────────────────────────────
  {
    id: 'ki-21a',
    status: 'planned',
    title: {
      en: 'Dark Eldar keyword archetypes (Bloodbrides, Haemoxytes, Trueborn) and trait keyword filters not yet implemented',
      de: 'Dark Eldar Schlüsselwort-Archetypen (Blutbräute, Hämoxyten, Trueborn) und Eigenschaft-Schlüsselwortfilter noch nicht implementiert',
      es: 'Arquetipos de palabras clave Dark Eldar (Novias de Sangre, Hemóxitos, Trueborn) y filtros de palabras clave de rasgos aún no implementados',
    },
    description: {
      en: 'These archetypes restrict the army to units with specific keywords (<Cult>, <Coven>, <Kabal>). Trait superscripts (ᶜᵒ, ᶜᵘ, ᴷ) mark traits that apply only to those keyword groups. The builder does not yet filter units or traits by keyword.',
      de: 'Diese Archetypen schränken die Armee auf Einheiten mit bestimmten Schlüsselwörtern (<Kult>, <Zirkel>, <Kabal>) ein. Hochgestellte Zeichen bei Eigenschaften (ᶜᵒ, ᶜᵘ, ᴷ) markieren Eigenschaften, die nur für diese Schlüsselwortgruppen gelten. Der Builder filtert Einheiten und Eigenschaften noch nicht nach Schlüsselwort.',
      es: 'Estos arquetipos restringen el ejército a unidades con palabras clave específicas (<Culto>, <Covén>, <Kabal>). Los superíndices de rasgos (ᶜᵒ, ᶜᵘ, ᴷ) marcan rasgos que solo se aplican a esos grupos de palabras clave. El constructor aún no filtra unidades ni rasgos por palabra clave.',
    },
  },
  {
    id: 'ki-21b',
    status: 'fixed',
    title: 'CSM traits should only apply to units with the "Chaos Space Marine" keyword',
    description: 'Fixed in v0.22 — CSM traits now only apply to units carrying the "Chaos Space Marine" keyword. Cultists, Chaos Spawn, World Eaters, Death Guard, Thousand Sons, and daemon engines are excluded.',
  },
  {
    id: 'ki-21c',
    status: 'planned',
    title: {
      en: 'Coordinated Raid (Dark Eldar): 3-HQ requirement with specific roles and 3 keyword-based traits not yet enforced',
      de: 'Koordinierter Überfall (Dark Eldar): 3-HQ-Anforderung und schlüsselwortbasierte Eigenschaften noch nicht durchgesetzt',
      es: 'Ataque Coordinado (Dark Eldar): requisito de 3 HQ con roles específicos y 3 rasgos por palabra clave aún sin aplicar',
    },
    description: {
      en: 'Coordinated Raid grants a 3rd HQ slot and requires one Dracon, one Haemoncolus and one Succubus. It also grants a 3rd trait, one per keyword group. These mechanics require new engine support.',
      de: 'Koordinierter Überfall gewährt einen 3. HQ-Slot und erfordert einen Dracon, einen Hämonkolus und eine Sukkubus. Es gewährt auch eine 3. Eigenschaft, eine pro Schlüsselwortgruppe. Diese Mechaniken erfordern neue Engine-Unterstützung.',
      es: 'El Ataque Coordinado concede un 3.er slot de HQ y requiere un Dracon, un Haemoncolus y una Súcubo. También concede un 3.er rasgo, uno por grupo de palabras clave. Estas mecánicas requieren nuevo soporte del motor.',
    },
  },
  {
    id: 'ki-21d',
    status: 'fixed',
    title: 'Mechanised Company: max 1 Heavy Support selection not enforced',
    description: 'Fixed in v0.22 — a validator now raises an error if more than 1 Heavy Support unit is added under the Mechanised Company archetype.',
  },
  // ── Known ─────────────────────────────────────────────────────────────────
  {
    id: 'ki-45a',
    status: 'known',
    title: {
      en: 'Trait costs not applied for Imperial Guard (and other non-CSM factions with traits)',
      de: 'Eigenschaftskosten für die Imperiale Garde (und weitere Nicht-CSM-Fraktionen) nicht angewendet',
      es: 'Costes de rasgos no aplicados en Guardia Imperial (y otras facciones no-CSM con rasgos)',
    },
    description: {
      en: 'Selecting traits for Imperial Guard units does not add any points to the unit total. Affects all non-CSM factions that have a trait system. Under investigation.',
      de: 'Das Auswählen von Eigenschaften für Imperiale Garde-Einheiten addiert keine Punkte zum Einheitentotal. Betrifft alle Nicht-CSM-Fraktionen mit einem Eigenschaftssystem. Wird untersucht.',
      es: 'Seleccionar rasgos para unidades de la Guardia Imperial no añade puntos al total de la unidad. Afecta a todas las facciones no-CSM que tienen sistema de rasgos. En investigación.',
    },
  },
  {
    id: 'ki-45b',
    status: 'known',
    title: {
      en: 'Platoon Command Squad (Imperial Guard) counts as a Troops slot',
      de: 'Zugsquadkommando (Imperiale Garde) zählt als Troops-Slot',
      es: 'El Escuadrón de Mando de Pelotón (Guardia Imperial) cuenta como slot de Tropas',
    },
    description: {
      en: 'The Platoon Command Squad occupies a Troops slot. Per the rules it should not — the full Platoon group (PCS + Infantry Squads) counts as a single slot.',
      de: 'Das Zugsquadkommando belegt einen Troops-Slot. Gemäß den Regeln sollte es das nicht — die gesamte Zuggruppe (ZSK + Infanterietrupps) zählt als ein einziger Slot.',
      es: 'El Escuadrón de Mando de Pelotón ocupa un slot de Tropas. Según las reglas no debería — todo el grupo de pelotón (EMP + Escuadrones de Infantería) cuenta como un único slot.',
    },
  },
  // ── Fixed (v0.20) ─────────────────────────────────────────────────────────
  {
    id: 'ki-20a',
    status: 'fixed',
    title: 'Space Marines armory: Gravis-compatible items showed a raw "ᴳ" character instead of a keyword badge',
    description: 'Fixed in v0.20 — items available to Gravis-armored models now show a "Gravis" keyword badge, matching the existing "Term" badge for Terminator-compatible items.',
  },
  {
    id: 'ki-20b',
    status: 'fixed',
    title: 'Adeptus Sororitas — "The Holy Trinity" legacy applied no traits and added no points',
    description: 'Fixed in v0.20 — selecting The Holy Trinity now automatically grants Raging Fervour, Rites of Fire and Unshakable Vengeance to all eligible units at a combined cost of 10 pts per non-character unit.',
  },
  // ── Fixed (v0.19) ─────────────────────────────────────────────────────────
  {
    id: 'ki-19a',
    status: 'fixed',
    title: '20+ faction rules showed name only with no description',
    description: 'Fixed in v0.19 — Supporting Fire (Tau), Dakka Dakka Dakka / Waaagh! / Mob (Orks), Battle Focus (Eldar), Acts of Faith / Shield of Faith (Sororitas), Ambush (GSC), Canticles of the Omnissiah (AdMech), Instinctive Behaviour / Synapse (Tyranids), Void Armor / Eye of the Ancestors / Steady Advance (LoV), Shield Host (Custodes), Power Through Pain / Combat Drugs (Dark Eldar), Reanimation Protocols (Necrons), and all four Chaos Marks now show their full descriptions.',
  },
  {
    id: 'ki-19b',
    status: 'fixed',
    title: 'Orks vehicles — Ramshackle table results and Shokk Attack Gun scatter table were missing',
    description: 'Fixed in v0.19 — the Ramshackle table results (Kaboom! / Kareen! / Kerrunch!) and the full Shokk Attack Gun doubles table are now shown in unit cards.',
  },
  {
    id: 'ki-19c',
    status: 'fixed',
    title: 'Students of Vaul, Interplanetary Invasors and Big Red Button vehicle traits had no points cost',
    description: 'Fixed in v0.19 — these three vehicle-only traits were showing a +0 pts cost due to a data import miss. All now correctly apply +5 pts per vehicle.',
  },
  // ── Fixed (v0.18) ─────────────────────────────────────────────────────────
  {
    id: 'ki-18a',
    status: 'fixed',
    title: 'Junk text entries appeared in ability list for several Grey Knights, Eldar and Sororitas units',
    description: 'Fixed in v0.18 — "Name:", "Range:", "Cast value:", "Effect:", "Duration:", "Complexity:", "When:", "Cost:" were showing up as fake abilities on GK vehicles (Dreadnought, Land Raiders, Razorback, Rhino, Stormraven), the Eldar Spiritseer, and the Sororitas Living Saint.',
  },
  {
    id: 'ki-18b',
    status: 'fixed',
    title: 'Equipment options missing on Blood Claws, Assault Squad, Tankbustas, Deffkoptaz, Big\'ed Bossbunka',
    description: 'Fixed in v0.18 — Jump pack for Blood Claws, jump pack removal and Heavy bolt pistol for Assault Squad, Bomb squig for Tankbustas, Big bomb for Deffkoptaz, and Big shoota for Big\'ed Bossbunka were not showing up in the unit card. All options now appear with the correct points cost.',
  },
  {
    id: 'ki-18c',
    status: 'fixed',
    title: 'Incorrect ability entries on Orks vehicles and several other factions',
    description: 'Fixed in v0.18 — minor bug fix affecting 10+ factions: various incorrect, duplicate, or corrupted ability entries were showing up in unit cards and the printed summary (e.g. date strings, dice notation, typos, placeholder text). All cleaned up.',
  },
  // ── Fixed (v0.17) ─────────────────────────────────────────────────────────
  {
    id: 'ki-17a',
    status: 'fixed',
    title: 'Armory shows CSM-only tabs (Mark, Legion, Daemon Weapons) for all factions',
    description: 'Fixed in v0.17 — Mark Armoury tab is now hidden for factions with no marks; Daemon Weapons section is hidden when the faction has none; the legacy/clan tab uses the faction\'s own key name (e.g. "Clan Armoury" for Orks instead of "Legion Armoury").',
  },
  {
    id: 'ki-17b',
    status: 'fixed',
    title: 'Grey Knights — Shrouding, They Shall Know No Fear, True Grit show no description',
    description: 'Fixed in v0.17 — these three Grey Knights special rules were stored as bare names in the unit data and had no entry in the core rules glossary. Full descriptions added.',
  },
  // ── Fixed (v0.16) ─────────────────────────────────────────────────────────
  {
    id: 'ki-16c',
    status: 'fixed',
    title: '"Jury-rigged repairs" trait not applying cost to vehicles',
    description: 'Fixed in v0.16 — the trait\'s pts_veh field was null due to a parser miss, so vehicles (including Chimera) did not receive the +5 pts cost. Fixed to 5 pts per vehicle.',
  },
  {
    id: 'ki-16a',
    status: 'fixed',
    title: 'Bullgryns equipment swap options were invisible',
    description: 'Fixed in v0.16 — the Plate shield and Grenadier gauntlet swap options now appear as numeric inputs on the Bullgryns unit card. Previously the parser produced empty choices lists, so the options were not rendered.',
  },
  {
    id: 'ki-16b',
    status: 'fixed',
    title: 'Mechanised Company — transports not counted toward 25% Troops',
    description: 'Fixed in v0.16 — when the Mechanised Company archetype is active, Dedicated Transports now contribute 50% of their points toward the 25% Troops requirement, matching the archetype rules.',
  },
  // ── Open ──────────────────────────────────────────────────────────────────
  {
    id: 'ki-1',
    status: 'fixed',
    title: 'Some units are missing from certain factions',
    description: 'Unit coverage has been verified for Chaos Space Marines — all Daemon Engines and subfaction units are now present. Other factions have been audited progressively. Report a specific missing unit with the Bug button if you find a gap.',
  },
  {
    id: 'ki-2',
    status: 'known',
    title: {
      en: 'Army data saves only in this browser',
      de: 'Armeeedaten werden nur in diesem Browser gespeichert',
      es: 'Los datos del ejército se guardan solo en este navegador',
    },
    description: {
      en: 'Armies are stored in your browser\'s local storage. Clearing browser data or switching devices will lose your saves. Use Export JSON to back up rosters. A full account/cloud system is being considered for a future update.',
      de: 'Armeen werden im lokalen Speicher deines Browsers gespeichert. Das Löschen von Browserdaten oder der Gerätewechsel führt zum Datenverlust. Nutze Export JSON, um Armeelisten zu sichern. Ein vollständiges Konto-/Cloud-System wird für eine zukünftige Aktualisierung in Betracht gezogen.',
      es: 'Los ejércitos se almacenan en el almacenamiento local del navegador. Borrar los datos del navegador o cambiar de dispositivo hará que pierdas tus guardados. Usa Exportar JSON para hacer copias de seguridad. Se está considerando un sistema completo de cuenta/nube para una actualización futura.',
    },
  },
  {
    id: 'ki-3',
    status: 'known',
    title: {
      en: 'Print layout and app not optimised for mobile or non-Chrome browsers',
      de: 'Drucklayout und App nicht für Mobilgeräte oder Nicht-Chrome-Browser optimiert',
      es: 'El diseño de impresión y la app no están optimizados para móviles ni navegadores que no sean Chrome',
    },
    description: {
      en: 'The app is currently built and tested on desktop Chrome/Edge. Mobile layout and Firefox/Safari support will be improved once the core feature set is stable.',
      de: 'Die App wird derzeit für Desktop Chrome/Edge entwickelt und getestet. Das mobile Layout und die Unterstützung für Firefox/Safari werden verbessert, sobald der Kernfunktionsumfang stabil ist.',
      es: 'La app está actualmente desarrollada y probada en Chrome/Edge de escritorio. El diseño móvil y el soporte para Firefox/Safari se mejorarán una vez que el conjunto de funciones principal sea estable.',
    },
  },
  // ── Open / Investigating ──────────────────────────────────────────────────
  {
    id: 'ki-10',
    status: 'fixed',
    title: 'Grey Knights could not select Inquisition units',
    description: 'Fixed in v0.10 — all 13 Inquisition units now appear in the Grey Knights unit catalogue under their respective slots, with [Allied] label.',
  },
  {
    id: 'ki-11',
    status: 'fixed',
    title: 'Special rule descriptions show name only — no rules text',
    description: 'Fixed in v0.12 — a Core Rules glossary now covers all standard weapon abilities (AT, Barrage, Poison, etc.) and model special rules (Fearless, Deep Strike, Daemon, etc.). Each rule in the unit abilities list now shows its full description.',
  },
  {
    id: 'ki-12',
    status: 'fixed',
    title: 'Trait costs marked with * were not calculated per Wound',
    description: 'Fixed in v0.11 — all trait costs now multiply by unit size (a 5-pt trait on 5 models = 25 pts). Traits marked with * additionally multiply by Wounds per model (e.g. "Iron Within, Iron Without" CSM: 2* = 2 × W × size).',
  },
  // ── Planned ───────────────────────────────────────────────────────────────
  {
    id: 'ki-p3',
    status: 'fixed',
    title: 'Allied detachment — add a second faction as allies in the same list',
    description: 'Implemented in v0.13 — a full Allied Detachment panel lets you pick a second faction as allies, shows their relationship (Battle Brothers / Allies of Convenience / Desperate Allies), and provides a mini force org (0–1 HQ, 1–2 Troops, 0–1 Elites/FA/HS). Allied units are validated separately from the main force org.',
  },
  {
    id: 'ki-p1',
    status: 'planned',
    title: {
      en: 'Account system & cloud army storage',
      de: 'Kontosystem & Cloud-Armeespeicher',
      es: 'Sistema de cuentas y almacenamiento de ejércitos en la nube',
    },
    description: {
      en: 'A login/account system that lets you save armies in the cloud and access them from any device. Currently being designed — no release date yet.',
      de: 'Ein Anmelde-/Kontosystem, mit dem du Armeen in der Cloud speichern und von jedem Gerät aus darauf zugreifen kannst. Wird derzeit entwickelt — noch kein Veröffentlichungsdatum.',
      es: 'Un sistema de inicio de sesión/cuenta que te permite guardar ejércitos en la nube y acceder a ellos desde cualquier dispositivo. Actualmente en diseño — sin fecha de lanzamiento.',
    },
  },
  {
    id: 'ki-p2',
    status: 'planned',
    title: {
      en: 'Escalation supplement — Lords of War',
      de: 'Eskalations-Supplement — Kriegsherren',
      es: 'Suplemento de Escalada — Señores de la Guerra',
    },
    description: {
      en: 'A supplement adding Lords of War, super-heavy vehicles and Titans. The dedicated slot, the Epic Battle engagement and the 33% points cap shipped in v0.51, along with the first units (Chaos) and a browsable catalog on the home screen. Remaining factions\' super-heavies are still being added.',
      de: 'Ein Supplement, das Kriegsherren, überschwere Fahrzeuge und Titanen hinzufügt. Der eigene Slot, das Engagement "Epische Schlacht" und die 33%-Punktegrenze kamen in v0.51, zusammen mit den ersten Einheiten (Chaos) und einem durchsuchbaren Katalog auf dem Startbildschirm. Die Superschweren der übrigen Fraktionen werden noch hinzugefügt.',
      es: 'Un suplemento que añade Señores de la Guerra, vehículos superpesados y Titanes. El slot dedicado, el engagement Batalla Épica y el límite del 33% de puntos llegaron en v0.51, junto con las primeras unidades (Caos) y un catálogo navegable en la pantalla de inicio. Los superpesados de las facciones restantes aún se están añadiendo.',
    },
  },
  // ── Fixed ─────────────────────────────────────────────────────────────────
  {
    id: 'ki-13',
    status: 'fixed',
    title: 'Chaos Daemons archetype dropdown showed footnote constraints as selectable entries',
    description: 'Fixed in v0.11 — the four footnote lines ("ᴷ Only for models with Mark of Khorne", etc.) that annotate mark-locked archetypes in the source data were being parsed as archetypes. They have been removed from the archetype list.',
  },
  {
    id: 'ki-f7',
    status: 'fixed',
    title: 'No visual feedback when adding an item in the Armory',
    description: 'Fixed in v0.7 — the row now flashes green and shows ✓ Added when an item is selected.',
  },
  {
    id: 'ki-f8',
    status: 'fixed',
    title: 'Unit print card showed all possible weapons, not just equipped ones',
    description: 'Fixed in v0.7 — cards now show only default equipment plus whatever optional weapons were selected.',
  },
  {
    id: 'ki-f9',
    status: 'fixed',
    title: 'Print view showed "pitched" instead of "Pitched Battle"',
    description: 'Fixed in v0.7 — Engagement Type now shows the full display name for all engagement types.',
  },
  {
    id: 'ki-f3',
    status: 'fixed',
    title: 'Pitched Battle default was 3000 pts instead of 2500',
    description: 'Fixed in v0.7 — a store migration corrects saved rosters that still had 3000 pts stored in the browser.',
  },
  {
    id: 'ki-f1',
    status: 'fixed',
    title: 'Print view showed a blank page',
    description: 'Fixed in v0.6 — the roster now opens in a new window and prints correctly.',
  },
  {
    id: 'ki-f2',
    status: 'fixed',
    title: 'Refreshing the page sent you back to the home screen',
    description: 'Fixed in v0.6 — refreshing now returns you to the builder with your faction and army intact.',
  },
  {
    id: 'ki-f4',
    status: 'fixed',
    title: 'Army name from previous faction appeared in new faction',
    description: 'Fixed in v0.6 — switching factions now clears the army name.',
  },
  {
    id: 'ki-f5',
    status: 'fixed',
    title: 'Troops slot showed "Raptors/Legionnaires" for non-CSM factions',
    description: 'Fixed in v0.6 — the label now only appears for Chaos Space Marines.',
  },
  {
    id: 'ki-f6',
    status: 'fixed',
    title: 'Daemon ability numbers (1–6) appeared as unit abilities in print',
    description: 'Fixed in v0.6 — standalone dice-result numbers are filtered out from the ability list.',
  },
];
