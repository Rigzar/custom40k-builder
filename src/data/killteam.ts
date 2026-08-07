/**
 * CUSTOM40K KILL TEAM — ALPHA. Admin-only.
 *
 * PRIVATE, like the Boarding draft before it: rendered only inside the admin panel, and
 * deliberately NOT wired into the builder. No engagement, no faction entry, nothing a player can
 * reach. When the rules settle, the teams become real data and this file goes to the wiki.
 *
 * WHERE THE NUMBERS COME FROM: every value below was computed with the author's own points
 * calculator (Codex/Points calculator_v5.4.xlsx) against our own datasheets, at kill-team scale —
 * that is, with every weapon range halved. Nothing here is invented or eyeballed. The calculator
 * reproduces his printed points closely enough to trust (Cultists 5.0 vs 5, Chaos Space Marine
 * 36.8 vs 37, Legionnaire 38.1 vs 38), so the same formula pricing an operative is the same
 * formula that priced the army list it came from.
 *
 * WHY THE PLAYER NEVER SEES A POINT: a kill team is chosen as a number of operatives, the way
 * Kill Team does it. The points live back here, deciding how many operatives each faction gets
 * and which of them may be taken more than once. That is the one job they do.
 */

export const KT_ALPHA = 'alpha 0.1 — 2026-08-06';

/** The whole balance of the mode, in three numbers. */
export const KT_BUDGET = 300;
export const KT_MIN_OPERATIVES = 6;
export const KT_MAX_OPERATIVES = 14;

/**
 * An operative worth more than this multiple of its team's basic operative may only be taken
 * once. Derived, not chosen: at 1.25 it puts the Death Guard Gunner and Heavy Gunner behind a
 * one-per-team limit and leaves the Warrior, Blademaster and Belcher repeatable — which is the
 * same shape Games Workshop arrived at by hand for their own Death Guard team.
 */
export const KT_UNIQUE_MULTIPLIER = 1.25;

export interface KtOperative {
  name: string;
  weapon: string;
  profile: string;
  /** Calculator value at kill-team scale: the model's body plus its main weapon. */
  value: number;
  leader?: boolean;
  note?: string;
}

export interface KtTeam {
  key: string;
  name: string;
  subtitle: string;
  /** Faction whose Armory the leader reaches, and the Mark armoury on top of it, if any. */
  faction: string;
  mark?: string;
  /** Datasheet the operatives are built from, and the body cost the calculator gives it. */
  source: string;
  body: number;
  stats: string;
  abilities: string[];
  equipment: string[];
  operatives: KtOperative[];
}

export const KT_TEAMS: KtTeam[] = [
  {
    key: 'death_guard',
    faction: 'chaos_space_marines',
    mark: 'Nurgle',
    name: 'Death Guard',
    subtitle: 'Plague Marines',
    source: 'Chaos Space Marines — Plague Marines',
    body: 45.0,
    stats: 'M 6" · WS 3+ · BS 3+ · S 4 · T 5 · W 3 · I 4 · A 2 · LD 8 · SV 3+',
    abilities: [
      'Mark of Nurgle',
      'Every operative carries Blight grenades, Krak grenades and a Plague knife in addition to its listed weapon.',
    ],
    equipment: [
      'Cloud of flies — the operative gains "Deflect".',
      'Plague ammunition — all of the operative\'s ranged weapons gain "Poison(3+)".',
      'Revoltingly Resilient — the operative gains "Regeneration(1)".',
      'Nurgling infestation — 4 automatic hits each activation in melee, S2 AP0 D1, Poison(4+).',
      'Bionics — the operative gains a 6+ ward save.',
      'Marksman honours — +1 Ballistic skill.',
      'Swordsman honours — +1 Weapon skill.',
      'Trophy — the operative gains "Terrifying(-1)".',
    ],
    operatives: [
      { name: 'Plague Champion', weapon: 'Bolter', profile: '24" Rapid Fire 1 · S4 AP-1 D1 · Poison(4+)', value: 49.0, leader: true, note: 'May take any weapon from this list instead. Has access to the Armory.' },
      { name: 'Warrior', weapon: 'Bolter', profile: '24" Rapid Fire 1 · S4 AP-1 D1 · Poison(4+)', value: 49.0 },
      { name: 'Blademaster', weapon: 'Light plague weapon', profile: 'Melee · S+1 AP-2 D1 · Flurry(2), Poison(4+)', value: 49.0 },
      { name: 'Plague Belcher', weapon: 'Plague belcher', profile: '9" Assault 4 · S4 AP0 D1 · Flames, Poison(4+)', value: 49.0 },
      { name: 'Plasma Gunner', weapon: 'Plasma gun', profile: '24" Rapid Fire 1 · S7 AP-3 D1 · AT(1) · overcharges', value: 53.7 },
      { name: 'Fighter', weapon: 'Heavy plague weapon', profile: 'Melee · S+2 AP-3 D2 · Poison(4+), Slow(-1), Unwieldy', value: 55.7 },
      { name: 'Spewer', weapon: 'Plague spewer', profile: '9" Assault 4 · S5 AP-1 D1 · Flames, Poison(4+)', value: 57.0 },
      { name: 'Gunner', weapon: 'Meltagun', profile: '12" Assault 1 · S8 AP-5 D1 · AT(1), Melta', value: 61.3 },
      { name: 'Heavy Gunner', weapon: 'Blight launcher', profile: '24" Assault 2 · S6 AP-2 D2 · Poison(4+)', value: 71.7 },
    ],
  },
  {
    key: 'emperors_children',
    faction: 'chaos_space_marines',
    mark: 'Slaanesh',
    name: "Emperor's Children",
    subtitle: 'Noise Marines',
    source: 'Chaos Space Marines — Noise Marines',
    body: 31.8,
    stats: 'M 6" · WS 3+ · BS 3+ · S 4 · T 4 · W 1 · I 4 · A 2 · LD 8 · SV 3+',
    abilities: [
      'Mark of Slaanesh',
      'Every operative carries a Bolt pistol and Frag grenades in addition to its listed weapon.',
    ],
    equipment: [
      'Bionics — the operative gains a 6+ ward save.',
      'Marksman honours — +1 Ballistic skill.',
      'Swordsman honours — +1 Weapon skill.',
      'Spikey bits — re-roll one to-wound roll in melee per activation.',
      'Master-crafted weapon — re-roll one to-hit roll per activation.',
      'Daemonic swiftness — "Move Through Cover", and may re-roll Advance rolls.',
      'Trophy — the operative gains "Terrifying(-1)".',
      'Counter-attack · Furious charge · Infiltrator · Terrain expert · Vanguard.',
    ],
    operatives: [
      { name: 'Noise Champion', weapon: 'Bolter', profile: '24" Rapid Fire 1 · S4 AP-1 D1', value: 35.8, leader: true, note: 'May take any weapon from this list instead. Has access to the Armory.' },
      { name: 'Warrior', weapon: 'Bolter', profile: '24" Rapid Fire 1 · S4 AP-1 D1', value: 35.8 },
      { name: 'Duellist', weapon: 'Duelling sabre', profile: 'Melee · S+1 AP-1 D1 · Quick(+1)', value: 35.1 },
      { name: 'Blademaster', weapon: 'Astartes Chainsword', profile: 'Melee · SU AP-1 D1', value: 34.4 },
      { name: 'Sonic Gunner', weapon: 'Sonic blaster', profile: '24" Assault 2 · S4 AP-1 D1 · Soundquake', value: 39.8 },
      { name: 'Plasma Gunner', weapon: 'Plasma gun', profile: '24" Rapid Fire 1 · S7 AP-3 D1 · AT(1) · overcharges', value: 40.4 },
      { name: 'Blastmaster', weapon: 'Blastmaster (varied)', profile: '36" Assault 3 · S5 AP-1 D1 · Soundquake', value: 44.6 },
      { name: 'Gunner', weapon: 'Meltagun', profile: '12" Assault 1 · S8 AP-5 D1 · AT(1), Melta', value: 48.1 },
      { name: 'Heavy Gunner', weapon: 'Blastmaster (single)', profile: '36" Heavy 1 · S8 AP-3 D2 · Soundquake', value: 59.1 },
    ],
  },
  {
    key: 'space_marines',
    faction: 'space_marines',
    name: 'Space Marines',
    subtitle: 'Tactical Squad',
    source: 'Space Marines — Tactical Squad',
    body: 27.8,
    stats: 'M 6" · WS 3+ · BS 3+ · S 4 · T 4 · W 1 · I 4 · A 2 · LD 8 · SV 3+',
    abilities: [
      'They Shall Know No Fear',
      'Every operative carries a Bolt pistol, Frag grenades and Krak grenades in addition to its listed weapon.',
    ],
    equipment: [
      'Bionics — the operative gains a 6+ ward save.',
      'Marksman honours — +1 Ballistic skill.',
      'Swordsman honours — +1 Weapon skill.',
      'Master-crafted weapon — re-roll one to-hit roll per activation.',
      'Auspex — the operative ignores the to-hit penalty for Advance orders.',
      'Combat shield — the operative gains "Parry".',
      'Counter-attack · Furious charge · Infiltrator · Terrain expert · Vanguard.',
    ],
    operatives: [
      { name: 'Sergeant', weapon: 'Boltgun', profile: '24" Rapid Fire 1 · S4 AP-1 D1', value: 31.8, leader: true, note: 'May take any weapon from this list instead. Has access to the Armory.' },
      { name: 'Warrior', weapon: 'Boltgun', profile: '24" Rapid Fire 1 · S4 AP-1 D1', value: 31.8 },
      { name: 'Grav Gunner', weapon: 'Grav gun', profile: '18" Rapid Fire 1 · Grav', value: 35.1 },
      { name: 'Plasma Gunner', weapon: 'Plasma gun', profile: '24" Rapid Fire 1 · S7 AP-3 D1 · AT(1) · overcharges', value: 36.4 },
      { name: 'Flamer', weapon: 'Heavy flamer', profile: '9" Assault 4 · S5 AP-1 D1 · Flames', value: 39.8 },
      { name: 'Heavy Gunner', weapon: 'Heavy bolter', profile: '36" Heavy 3 · S5 AP-2 D1', value: 41.1 },
      { name: 'Gunner', weapon: 'Meltagun', profile: '12" Assault 1 · S8 AP-5 D1 · AT(1), Melta', value: 44.1 },
      { name: 'Missile Launcher', weapon: 'Missile launcher', profile: '48" Heavy 1 · Frag or Krak', value: 59.1 },
    ],
  },
  {
    key: 'imperial_guard',
    faction: 'imperial_guard',
    name: 'Imperial Guard',
    subtitle: 'Veterans',
    source: 'Imperial Guard — Veterans',
    body: 5.7,
    stats: 'M 6" · WS 3+ · BS 3+ · S 3 · T 3 · W 1 · I 3 · A 1 · LD 7 · SV 5+',
    abilities: [
      'Every operative carries Frag grenades in addition to its listed weapon.',
      'A Veteran body is worth 5.7 and a Lasgun 1.3, so a bare Veteran is 7.0 — a seventh of a Plague Marine. The team fills its 300 with EQUIPMENT, not with bodies: nine Veterans leave 237 to spend, about 26 a model. That is why this list is a squad of specialists rather than a wall of lasguns, and it is the calculator saying so, not a design choice.',
    ],
    equipment: [
      'Carapace armour — 4+ armour save.',
      'Bionics — the operative gains a 6+ ward save.',
      'Marksman honours — +1 Ballistic skill.',
      'Vox-caster — the operative may re-roll one Leadership test per battle round.',
      'Medi-pack — once per game, an operative within ● regains 1 wound.',
      'Counter-attack · Furious charge · Infiltrator · Terrain expert · Vanguard.',
    ],
    operatives: [
      { name: 'Veteran Sergeant', weapon: 'Lasgun', profile: '24" Rapid Fire 1 · S3 AP0 D1', value: 7.0, leader: true, note: 'May take any weapon from this list instead. Has access to the Armory.' },
      { name: 'Veteran', weapon: 'Lasgun', profile: '24" Rapid Fire 1 · S3 AP0 D1', value: 7.0 },
      { name: 'Flamer', weapon: 'Flamer', profile: '9" Assault 4 · S4 AP0 D1 · Flames', value: 9.7 },
      { name: 'Plasma Gunner', weapon: 'Plasma gun', profile: '24" Rapid Fire 1 · S7 AP-3 D1 · AT(1) · overcharges', value: 14.3 },
      { name: 'Mortar', weapon: 'Mortar', profile: '48" Heavy 1 · Barrage', value: 14.8 },
      { name: 'Heavy Flamer', weapon: 'Heavy flamer', profile: '9" Assault 4 · S5 AP-1 D1 · Flames', value: 17.7 },
      { name: 'Sniper', weapon: 'Sniper rifle', profile: '36" Heavy 1 · Precision', value: 19.0 },
      { name: 'Heavy Gunner', weapon: 'Heavy bolter', profile: '36" Heavy 3 · S5 AP-2 D1', value: 19.0 },
      { name: 'Gunner', weapon: 'Meltagun', profile: '12" Assault 1 · S8 AP-5 D1 · AT(1), Melta', value: 22.0 },
      { name: 'Autocannon', weapon: 'Autocannon', profile: '48" Heavy 2 · S7 AP-2 D2', value: 23.0 },
      { name: 'Lascannon', weapon: 'Lascannon', profile: '48" Heavy 1 · S9 AP-5 D3 · AT(3)', value: 60.7 },
      { name: 'Demolitions', weapon: 'Demolition charge', profile: '6" Grenade 1 · Barrage · Ammo(1)', value: 100.4 },
    ],
  },
  // ── Derived teams ───────────────────────────────────────────────────────────────────────
  // Generated by scripts/gen_killteams.ts from each faction’s own datasheet, with the
  // author’s formulas at kill-team scale — same method as the four above, no hand-tuning.
  // Their equipment lists are empty on purpose: writing flavour rules for thirteen factions
  // would be inventing game text. Until the designer writes them, upgrades come from the
  // leader’s Armory.
  {
    key: "necrons",
    faction: "necrons",
    name: "Necrons",
    subtitle: "Necron Warriors",
    source: "Necrons — Warriors",
    body: 10.4,
    stats: "M 6\" · WS 4+ · BS 4+ · S 4 · T 4 · W 1 · I 2 · A 1 · LD 10 · SV 4+",
    abilities: [
      "Every model is equipped with: Gauss flayer.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Warrior — Disruptor field", weapon: "Disruptor field", profile: "- Melee · SU AP-1 D1", value: 12.4 },
      { name: "Warrior — Gauss flayer", weapon: "Gauss flayer", profile: "12\" Rapid Fire 1 · S4 AP-1 D1 · Gauss", value: 14.9 },
      { name: "Warrior — Gauss reaper", weapon: "Gauss reaper", profile: "6\" Assault 2 · S5 AP-2 D1 · Gauss", value: 18.4 },
    ],
  },
  {
    key: "orks",
    faction: "orks",
    name: "Orks",
    subtitle: "Ork Boyz",
    source: "Orks — Boyz",
    body: 3,
    stats: "M 6\" · WS 3+ · BS 5+ · S 4 · T 4 · W 1 · I 3 · A 2 · LD 5 · SV 6+",
    abilities: [
      "Every model is equipped with: Choppa; Slugga; Stikkbombz.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Boy — Stikkbombz", weapon: "Stikkbombz", profile: "3\" Grenade 1 · S3 AP0 D1 · Explosive", value: 3.3 },
      { name: "Boy — Slugga", weapon: "Slugga", profile: "6\" Pistol 1 · S4 AP0 D1", value: 3.6 },
      { name: "Boy — Shoota", weapon: "Shoota", profile: "9\" Assault 3 · S4 AP0 D1", value: 5.5 },
      { name: "Boy — Choppa", weapon: "Choppa", profile: "- Melee · SU AP-1 D1", value: 5.6 },
      { name: "Boy — Big shoota", weapon: "Big shoota", profile: "18\" Assault 3 · S5 AP-1 D1", value: 11 },
      { name: "Boy — Rokkit launcha", weapon: "Rokkit launcha", profile: "12\" Assault 1 · S8 AP-3 D2 · AT(2), Anti-air", value: 17.3 },
    ],
  },
  {
    key: "eldar",
    faction: "eldar",
    name: "Eldar",
    subtitle: "Guardian Defenders",
    source: "Eldar — Guardian Defenders",
    body: 9.5,
    stats: "M 6\" · WS 3+ · BS 3+ · S 3 · T 3 · W 1 · I 5 · A 1 · LD 7 · SV 4+",
    abilities: [
      "Every Guardian Defender is equipped with: Plasma grenade; Shuriken catapult.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Heavy weapon platform", weapon: "Shuriken catapult", profile: "9\" Assault 2 · S4 AP0 D1 · Shuriken", value: 12.8, leader: true, note: "May swap this weapon for one from the Armory, and buy equipment." },
      { name: "Guardian Defender — Aeldari missile launcher - Sunburst", weapon: "Aeldari missile launcher - Sunburst", profile: "24\" Heavy 1 · S4 AP-1 D1 · Explosive", value: 14.8 },
      { name: "Guardian Defender — Scatter laser", weapon: "Scatter laser", profile: "18\" Heavy 3 · S6 AP0 D1 · Suppression", value: 21.5 },
      { name: "Guardian Defender — Shuriken cannon", weapon: "Shuriken cannon", profile: "12\" Heavy 3 · S6 AP-1 D1 · Shuriken", value: 25.5 },
      { name: "Guardian Defender — Aeldari missile launcher - Starshot", weapon: "Aeldari missile launcher - Starshot", profile: "24\" Heavy 1 · S8 AP-3 D2 · Anti-Air, AT(2)", value: 40.8 },
      { name: "Guardian Defender — Starcannon", weapon: "Starcannon", profile: "18\" Heavy 2 · S6 AP-4 D2 · AT(1)", value: 49.5 },
      { name: "Guardian Defender — Bright lance", weapon: "Bright lance", profile: "18\" Heavy 1 · S8 AP-4 D3 · AT(3), Lance(+2)", value: 58.5 },
    ],
  },
  {
    key: "dark_eldar",
    faction: "dark_eldar",
    name: "Dark Eldar",
    subtitle: "Kabalite Warriors",
    source: "Dark Eldar — Kabalite Warriors",
    body: 9.5,
    stats: "M 6\" · WS 3+ · BS 3+ · S 3 · T 3 · W 1 · I 5 · A 1 · LD 7 · SV 4+",
    abilities: [
      "Every model is equipped with: Splinter rifle.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Kabalite — Splinter rifle", weapon: "Splinter rifle", profile: "12\" Rapid Fire 1 · S2 AP0 D1 · Poison(3+)", value: 10.5 },
      { name: "Kabalite — Shredder", weapon: "Shredder", profile: "9\" Assault 1 · S6 AP-1 D1 · Explosive, Suppression", value: 14.5 },
      { name: "Kabalite — Splinter cannon", weapon: "Splinter cannon", profile: "18\" Assault 4 · S3 AP0 D1 · Poison(3+)", value: 17.5 },
      { name: "Kabalite — Blaster", weapon: "Blaster", profile: "9\" Assault 1 · S8 AP-4 D2 · AT(2), Lance(+1)", value: 40.2 },
      { name: "Kabalite — Dark lance", weapon: "Dark lance", profile: "18\" Heavy 1 · S8 AP-4 D3 · AT(3), Lance(+2)", value: 58.5 },
    ],
  },
  {
    key: "tyranids",
    faction: "tyranids",
    name: "Tyranids",
    subtitle: "Termagants",
    source: "Tyranids — Termagant Brood",
    body: 2.7,
    stats: "M 6\" · WS 4+ · BS 4+ · S 3 · T 3 · W 1 · I 4 · A 1 · LD 5 · SV 6+",
    abilities: [
      "Every model is equipped with: Spinefists.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Termagants — Strangleweb", weapon: "Strangleweb", profile: "5\" Assault 4 · S2 AP0 D1 · Flames, Monofilament", value: 2.7 },
      { name: "Termagants — Shardlauncher", weapon: "Shardlauncher", profile: "9\" Assault 1 · S5 AP0 D1 · Explosive", value: 4.4 },
      { name: "Termagants — Lesser devourer", weapon: "Lesser devourer", profile: "9\" Rapid Fire 1 · SU AP0 D1", value: 4.5 },
      { name: "Termagants — Spinefists", weapon: "Spinefists", profile: "6\" Pistol 2 · SU AP0 D1", value: 4.7 },
      { name: "Termagants — Fleshborer", weapon: "Fleshborer", profile: "6\" Assault 1 · S4 AP-1 D1", value: 5.2 },
      { name: "Termagants — Spike rifle", weapon: "Spike rifle", profile: "12\" Assault 1 · S5 AP-2 D2 · Armor piercing(5+)", value: 11.7 },
    ],
  },
  {
    key: "adeptus_sororitas",
    faction: "adeptus_sororitas",
    name: "Adeptus Sororitas",
    subtitle: "Battle Sisters",
    source: "Adeptus Sororitas — Battle Sisters Squad",
    body: 11.3,
    stats: "M 6\" · WS 3+ · BS 3+ · S 3 · T 3 · W 1 · I 3 · A 1 · LD 7 · SV 3+",
    abilities: [
      "Every model is equipped with: Bolt pistol; Boltgun; Frag grenades; Krak grenades.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Sister Superior", weapon: "Bolt pistol", profile: "6\" Pistol 1 · S4 AP-1 D1", value: 14.7, leader: true, note: "May swap this weapon for one from the Armory, and buy equipment." },
      { name: "Battle Sister — Flamer", weapon: "Flamer", profile: "5\" Assault 4 · S4 AP0 D1 · Flames", value: 16.7 },
      { name: "Battle Sister — Boltgun", weapon: "Boltgun", profile: "12\" Rapid Fire 1 · S4 AP-1 D1", value: 17.3 },
      { name: "Battle Sister — Storm bolter", weapon: "Storm bolter", profile: "12\" Rapid Fire 2 · S4 AP-1 D1", value: 23.3 },
      { name: "Battle Sister — Heavy flamer", weapon: "Heavy flamer", profile: "5\" Assault 4 · S5 AP-1 D1 · Flames", value: 27.3 },
      { name: "Battle Sister — Melta", weapon: "Melta", profile: "6\" Assault 1 · S8 AP-5 D1 · AT(1), Melta", value: 27.7 },
      { name: "Battle Sister — Heavy bolter", weapon: "Heavy bolter", profile: "18\" Rapid Fire 2 · S5 AP-2 D1", value: 31.3 },
      { name: "Battle Sister — Multi-melta", weapon: "Multi-melta", profile: "12\" Assault 1 · S8 AP-5 D2 · AT(2), Melta", value: 45.3 },
    ],
  },
  {
    key: "grey_knights",
    faction: "grey_knights",
    name: "Grey Knights",
    subtitle: "Strike Squad",
    source: "Grey Knights — Strike Squad",
    body: 29.1,
    stats: "M 6\" · WS 3+ · BS 3+ · S 4 · T 4 · W 2 · I 4 · A 2 · LD 8 · SV 3+",
    abilities: [
      "Every model is equipped with: Nemesis force weapon; Storm bolter; Frag grenade; Krak grenade.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Justicar", weapon: "Nemesis warding stave", profile: "- Melee · S+3 AP-1 D1 · AT(1), Force weapon, Shield breaker(-1)", value: 33.8, leader: true, note: "May swap this weapon for one from the Armory, and buy equipment." },
      { name: "Grey Knight — Nemesis force weapon", weapon: "Nemesis force weapon", profile: "- Melee · S+2 AP-3 D1 · Force weapon, Shield breaker(-1)", value: 34.4 },
      { name: "Grey Knight — Storm bolter", weapon: "Storm bolter", profile: "12\" Rapid Fire 2 · S4 AP-1 D1", value: 41.1 },
      { name: "Grey Knight — Nemesis daemon hammer", weapon: "Nemesis daemon hammer", profile: "- Melee · Sx2 AP-3 D3 · AT(3), Force weapon, Shield breaker(-1), Slow(-3)", value: 49.1 },
      { name: "Grey Knight — Psilencer", weapon: "Psilencer", profile: "12\" Rapid Fire 3 · S5 AP-1 D1 · Shield breaker(-1), Suppression", value: 50.1 },
      { name: "Grey Knight — Incinerator", weapon: "Incinerator", profile: "5\" Assault 4 · S5 AP-2 D1 · Flames, Shield breaker(-1)", value: 50.4 },
      { name: "Grey Knight — Psycannon", weapon: "Psycannon", profile: "12\" Heavy 2 · S7 AP-2 D2 · Armor piercing(5+), AT(1), Shield breaker(-1)", value: 58.4 },
    ],
  },
  {
    key: "adeptus_custodes",
    faction: "adeptus_custodes",
    name: "Adeptus Custodes",
    subtitle: "Custodian Guard",
    source: "Adeptus Custodes — Custodian Guard",
    body: 42.5,
    stats: "M 6\" · WS 2+ · BS 2+ · S 5 · T 5 · W 2 · I 4 · A 3 · LD 9 · SV 2+",
    abilities: [
      "All models are equipped with: Bolt caster; Guardian spear.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Custodian Guard — Guardian spear", weapon: "Guardian spear", profile: "- Melee · S+1 AP-2 D1 · Quick(+1)", value: 48.3 },
      { name: "Custodian Guard — Sentinel blade", weapon: "Sentinel blade", profile: "- Melee · S+1 AP-3 D1", value: 49.2 },
      { name: "Custodian Guard — Bolt caster", weapon: "Bolt caster", profile: "6\" Pistol 2 · S4 AP-1 D1", value: 50.8 },
      { name: "Custodian Guard — Adrathic destructor", weapon: "Adrathic destructor", profile: "9\" Pistol 1 · S5 AP-3 D2", value: 60 },
      { name: "Custodian Guard — Melta beam", weapon: "Melta beam", profile: "6\" Pistol 1 · S8 AP-5 D1 · AT(1), Beam, Melta", value: 62.9 },
    ],
  },
  {
    key: "adeptus_mechanicus",
    faction: "adeptus_mechanicus",
    name: "Adeptus Mechanicus",
    subtitle: "Skitarii Rangers",
    source: "Adeptus Mechanicus — Skitarii Rangers",
    body: 8,
    stats: "M 6\" · WS 4+ · BS 3+ · S 3 · T 3 · W 1 · I 3 · A 1 · LD 6 · SV 4+",
    abilities: [
      "Every model is equipped with: Bionics; Galvanic rifle.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Ranger Alpha", weapon: "Galvanic rifle", profile: "15\" Rapid Fire 1 · S4 AP-1 D1", value: 14.5, leader: true, note: "May swap this weapon for one from the Armory, and buy equipment." },
      { name: "Ranger — Grav serpenta", weapon: "Grav serpenta", profile: "9\" Assault 1 · S5 AP-3 D1 · Explosive, Grav", value: 15 },
      { name: "Ranger — Arc rifle", weapon: "Arc rifle", profile: "12\" Assault 2 · S6 AP-1 D1 · Haywire", value: 18.7 },
      { name: "Ranger — Transuranic arquebus", weapon: "Transuranic arquebus", profile: "30\" Heavy 1 · S7 AP-4 D2 · Armorbane, AT(1), Deadly(5+)", value: 32 },
      { name: "Ranger — Plasma caliver - Standard", weapon: "Plasma caliver - Standard", profile: "9\" Rapid Fire 2 · S7 AP-3 D1 · AT(1)", value: 33 },
      { name: "Ranger — Plasma caliver - Overheating", weapon: "Plasma caliver - Overheating", profile: "9\" Rapid Fire 2 · S8 AP-4 D2 · AT(2), Overheating", value: 100 },
    ],
  },
  {
    key: "genestealer_cults",
    faction: "genestealer_cults",
    name: "Genestealer Cults",
    subtitle: "Neophyte Hybrids",
    source: "Genestealer Cults — Neophyte Hybrids",
    body: 5.3,
    stats: "M 6\" · WS 4+ · BS 4+ · S 3 · T 3 · W 1 · I 3 · A 1 · LD 6 · SV 5+",
    abilities: [
      "Every model is equipped with: Autogun; Autopistol; Blasting charges; Frag grenade.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Neophyte Hybrid — Webber", weapon: "Webber", profile: "9\" Assault 2 · S1 AP0 D1 · Monofilament", value: 4.8 },
      { name: "Neophyte Hybrid — Autopistol", weapon: "Autopistol", profile: "6\" Pistol 1 · S3 AP0 D1", value: 5.8 },
      { name: "Neophyte Hybrid — Autogun", weapon: "Autogun", profile: "12\" Rapid Fire 1 · S3 AP0 D1", value: 6.8 },
      { name: "Neophyte Hybrid — Shotgun", weapon: "Shotgun", profile: "9\" Assault 2 · S3 AP0 D1", value: 6.8 },
      { name: "Neophyte Hybrid — Blasting charges", weapon: "Blasting charges", profile: "3\" Grenade 1 · S5 AP-1 D1", value: 8.3 },
      { name: "Neophyte Hybrid — Flamer", weapon: "Flamer", profile: "5\" Assault 4 · S4 AP0 D1 · Flames", value: 9.3 },
      { name: "Neophyte Hybrid — Heavy stubber", weapon: "Heavy stubber", profile: "18\" Heavy 3 · S4 AP0 D1 · Suppression", value: 11.3 },
      { name: "Neophyte Hybrid — Seismic cannon - Short wave", weapon: "Seismic cannon - Short wave", profile: "12\" Heavy 2 · S6 AP-2 D1 · Suppression", value: 15.3 },
      { name: "Neophyte Hybrid — Seismic cannon - Long wave", weapon: "Seismic cannon - Long wave", profile: "12\" Heavy 4 · S4 AP-1 D1 · Suppression", value: 17.3 },
      { name: "Neophyte Hybrid — Mining laser", weapon: "Mining laser", profile: "12\" Heavy 1 · S9 AP-3 D3 · AT(3), Explosive", value: 40.6 },
    ],
  },
  {
    key: "harlequins",
    faction: "harlequins",
    name: "Harlequins",
    subtitle: "Harlequin Troupe",
    source: "Harlequins — Troupe",
    body: 3.7,
    stats: "M 8\" · WS 2+ · BS 3+ · S 3 · T 3 · W 1 · I 5 · A 2 · LD 8 · SV 6+",
    abilities: [
      "Every model is equipped with: Harlequin weapons; Plasma grenade; Shuriken pistol.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Player — Neuro disruptor", weapon: "Neuro disruptor", profile: "6\" Pistol 1 · S* AP* D* · Neuro disruptor", value: 5 },
      { name: "Player — Shuriken pistol", weapon: "Shuriken pistol", profile: "6\" Assault 1 · S4 AP-1 D1 · Shuriken", value: 7 },
      { name: "Player — Harlequin weapons", weapon: "Harlequin weapons", profile: "- Melee · S+1 AP-4 D1 · Precision(5+)", value: 9.5 },
      { name: "Player — Fusion pistol", weapon: "Fusion pistol", profile: "3\" Assault 1 · S8 AP-5 D1 · AT(1), Melta", value: 20 },
    ],
  },
  {
    key: "leagues_of_votann",
    faction: "leagues_of_votann",
    name: "Leagues of Votann",
    subtitle: "Hearthkyn Warriors",
    source: "Leagues of Votann — Hearthkyn Warriors",
    body: 12.6,
    stats: "M 6\" · WS 3+ · BS 3+ · S 4 · T 4 · W 1 · I 3 · A 1 · LD 7 · SV 3+",
    abilities: [
      "Every model is equipped with: Autoch-pattern bolter; Autoch-pattern bolt pistol; Gravitic concussion grenade.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Hearthkyn Warriors — Autoch-pattern bolt pistol", weapon: "Autoch-pattern bolt pistol", profile: "6\" Pistol 1 · S5 AP-1 D1", value: 16.6 },
      { name: "Hearthkyn Warriors — Plasma axe", weapon: "Plasma axe", profile: "- Melee · S+2 AP-2 D1", value: 17.2 },
      { name: "Hearthkyn Warriors — Plasma sword", weapon: "Plasma sword", profile: "- Melee · S+1 AP-3 D1", value: 17.2 },
      { name: "Hearthkyn Warriors — Ion blaster", weapon: "Ion blaster", profile: "9\" Assault 1 · S5 AP-2 D1", value: 18.2 },
      { name: "Hearthkyn Warriors — Autoch-pattern bolter", weapon: "Autoch-pattern bolter", profile: "12\" Rapid Fire 1 · S5 AP-1 D1", value: 19.6 },
      { name: "Hearthkyn Warriors — Concussion weapon", weapon: "Concussion weapon", profile: "- Melee · Sx2 AP-3 D2 · AT(2), Slow(-2)", value: 25.9 },
      { name: "Hearthkyn Warriors — HYLas auto rifle", weapon: "HYLas auto rifle", profile: "12\" Assault 3 · S6 AP-2 D1", value: 32.6 },
      { name: "Hearthkyn Warriors — MPL7 missile launcher", weapon: "MPL7 missile launcher", profile: "15\" Assault 7 · S4 AP-1 D1", value: 42.9 },
      { name: "Hearthkyn Warriors — EtaCarn plasma beamer", weapon: "EtaCarn plasma beamer", profile: "9\" Assault 1 · S8 AP-4 D2 · Beam", value: 43.2 },
      { name: "Hearthkyn Warriors — Magna-rail rifle", weapon: "Magna-rail rifle", profile: "12\" Heavy 1 · S9 AP-4 D3 · AT(3), Beam, Decimate, Tank hunter", value: 63.6 },
    ],
  },
  {
    key: "chaos_daemons",
    faction: "chaos_daemons",
    name: "Chaos Daemons",
    subtitle: "Bloodletters of Khorne",
    source: "Chaos Daemons — Bloodletters",
    body: 3.8,
    stats: "M 6\" · WS 3+ · BS 3+ · S 4 · T 4 · W 1 · I 4 · A 3 · LD 8 · SV 6+",
    abilities: [
      "Every model is equipped with: Hellblade.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Bloodreaper", weapon: "Hellblade", profile: "- Melee · S+1 AP-3 D1 · Deadly(5+)", value: 8.5, leader: true, note: "May swap this weapon for one from the Armory, and buy equipment." },
    ],
  },
  {
    key: "inquisition",
    faction: "inquisition",
    name: "Inquisition",
    subtitle: "Henchman Warband",
    source: "Inquisition — Henchman Warband",
    body: 11.3,
    stats: "M 6\" · WS 4+ · BS 4+ · S 3 · T 3 · W 2 · I 3 · A 1 · LD 7 · SV 5+",
    abilities: [
      "Acolyte/Penitent/Sage/Psyker/Alien World Scout/Archaeotech Researcher/Xenologist/Chirurgeon: Las pistol. Missionary/Mystic/Exorcist: Chainsword, Las pistol. Servitor: Paired shock chargers. Arco-flagellant: Arco flail. Daemonhost: Runic chains. Jokaero Weaponsmith: Jokaero digital weapons. Crusader: Power sword, Storm shield. Ranger: Ranger long rifle, Shuriken pistol.",
    ],
    // Left empty on purpose: the four hand-built teams have equipment lists written by hand, and
    // inventing flavour rules for thirteen more would be making up game text. Until the designer
    // writes them, this team's upgrades come from its leader's Armory.
    equipment: [],
    operatives: [
      { name: "Servitor", weapon: "Las pistol", profile: "6\" Pistol 1 · S3 AP0 D1", value: 11.8, leader: true, note: "May swap this weapon for one from the Armory, and buy equipment." },
      { name: "Acolyte — Chainsword", weapon: "Chainsword", profile: "- Melee · SU AP-1 D1", value: 12.8 },
      { name: "Acolyte — Runic chains", weapon: "Runic chains", profile: "- Melee · SU AP-1 D1 · Soul Burn(6+)", value: 12.8 },
      { name: "Acolyte — Arco flail", weapon: "Arco flail", profile: "- Melee · S+1 AP-1 D1", value: 13.3 },
      { name: "Acolyte — Paired shock chargers", weapon: "Paired shock chargers", profile: "- Melee · SU AP-3 D1 · Flurry(1)", value: 13.8 },
      { name: "Acolyte — Shock charger", weapon: "Shock charger", profile: "- Melee · SU AP-3 D1", value: 13.8 },
      { name: "Acolyte — Shuriken pistol", weapon: "Shuriken pistol", profile: "6\" Assault 1 · S4 AP-1 D1 · Shuriken", value: 13.8 },
      { name: "Acolyte — Jokaero digital weapons - Strike", weapon: "Jokaero digital weapons - Strike", profile: "- Melee · SU AP-4 D1 · Hits automatically wound", value: 14.3 },
      { name: "Acolyte — Power sword", weapon: "Power sword", profile: "- Melee · S+1 AP-3 D1", value: 14.3 },
      { name: "Acolyte — Plasma cannon - Standard", weapon: "Plasma cannon - Standard", profile: "18\" Heavy 1 · S7 AP-3 D1 · AT(1), Explosive", value: 18.3 },
      { name: "Acolyte — Eviscerator", weapon: "Eviscerator", profile: "- Melee · Sx2 AP-3 D2 · Armorbane, AT(2), Slow(-2), Unwieldy", value: 19.3 },
      { name: "Acolyte — Ranger long rifle", weapon: "Ranger long rifle", profile: "18\" Heavy 1 · S5 AP-2 D2 · Armor piercing(5+), Suppression", value: 21.3 },
      { name: "Acolyte — Jokaero digital weapons - Flames", weapon: "Jokaero digital weapons - Flames", profile: "5\" Assault 4 · S5 AP-1 D1 · Flames", value: 23.3 },
      { name: "Acolyte — Heavy bolter", weapon: "Heavy bolter", profile: "18\" Rapid Fire 2 · S5 AP-2 D1", value: 26.3 },
      { name: "Acolyte — Plasma cannon - Supercharge", weapon: "Plasma cannon - Supercharge", profile: "18\" Heavy 1 · S8 AP-4 D2 · AT(2), Explosive, Overheating", value: 35.8 },
      { name: "Acolyte — Multi-melta", weapon: "Multi-melta", profile: "12\" Assault 1 · S8 AP-5 D2 · AT(2), Melta", value: 36.8 },
      { name: "Acolyte — Jokaero digital weapons - Beams", weapon: "Jokaero digital weapons - Beams", profile: "12\" Assault 1 · S8 AP-5 D2 · AT(2), Melta", value: 36.8 },
      { name: "Acolyte — Jokaero digital weapons - Bolts", weapon: "Jokaero digital weapons - Bolts", profile: "24\" Assault 1 · S9 AP-4 D3 · AT(2)", value: 52.6 },
    ],
  },
];

/**
 * How many operatives this team fields: the budget divided by its cheapest operative, held
 * inside the 6-9 band. The band is what keeps the counts comparable — without it the Imperial
 * Guard, whose bare Veteran is worth 7.0, would be told to bring forty-three.
 */
export function ktTeamSize(team: KtTeam): number {
  return Math.max(KT_MIN_OPERATIVES, Math.min(KT_MAX_OPERATIVES, Math.round(KT_BUDGET / ktTypical(team))));
}

/**
 * What one operative in this team is actually worth: the MEDIAN of its list, not the cheapest
 * entry.
 *
 * The cheapest was wrong and the author said so — an Imperial Guard team came out the same size
 * as a Space Marine one, when a Stormtrooper is about half a Boltgun Marine and the Guard should
 * clearly field more bodies. The reason is that a bare Veteran at 7.0 is not an operative anyone
 * would take; a Guard kill team is Veterans carrying meltaguns and autocannons, and the median of
 * the list is what one of those costs. Dividing the budget by THAT gives the Guard fourteen and
 * the Death Guard six, which is the shape the game should have.
 */
export function ktTypical(team: KtTeam): number {
  const v = team.operatives.filter(o => !o.leader).map(o => o.value).sort((a, b) => a - b);
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

/**
 * True when this operative may only be taken once.
 *
 * Measured against what ONE operative in this team is allowed to be worth — the budget split
 * across the team's size — not against its cheapest model. Those are the same thing for a team of
 * marines and wildly different for the Guard: a bare Veteran is 7.0, so a multiple of THAT would
 * put ten of its twelve operatives behind a one-per-team limit and leave the player with nothing
 * to build. Against its fair share of 33 it is the Lascannon and the demolition charge that are
 * limited, which is the right answer and the one the numbers give.
 */
export function ktIsUnique(team: KtTeam, op: KtOperative): boolean {
  if (op.leader) return true;
  return op.value > ktTypical(team) * KT_UNIQUE_MULTIPLIER;
}

/* ── Armoury pricing at kill-team scale ─────────────────────────────────────────────────────── */

/**
 * The author's own cost tables, read straight out of `Codex/Points calculator_v5.4.xlsx`
 * (sheet "Punkterechner v5", rows 47-72). His ranged formula is
 *
 *     (Range + Strength + AP) x Shots x Damage x SkillMultiplier
 *
 * and only the first bracket depends on the range.
 */
const KT_RANGE_COST: [number, number][] = [
  [6, 0.5], [9, 1], [12, 1.5], [15, 2], [18, 2.5], [21, 3], [24, 3.5], [27, 4], [30, 4.5],
  [33, 5], [36, 6], [39, 7], [42, 8], [45, 9], [48, 10.5], [51, 12], [54, 13.5], [57, 15],
  [60, 16.5], [63, 18], [66, 19.5], [69, 21], [72, 22.5],
];
const KT_S_COST: Record<number, number> = { 1: 0.5, 2: 1.5, 3: 2.5, 4: 3.5, 5: 4.5, 6: 5.5, 7: 6.5, 8: 15, 9: 17, 10: 19 };
const KT_AP_COST: Record<number, number> = { 0: -2, 1: 1, 2: 3, 3: 5, 4: 7, 5: 9, 6: 11 };

function rangeCost(inches: number): number {
  if (inches >= 72) return 24;
  let last = 0.5;
  for (const [v, c] of KT_RANGE_COST) { if (inches <= v) return c; last = c; }
  return last;
}

/**
 * What an Armory item costs an operative in this mode.
 *
 * Equipment, and any melee weapon, costs exactly what the author printed: his melee formula has no
 * range term, so halving the board changes nothing about a power fist. A RANGED weapon does change,
 * because every operative's own weapon was priced at half range and mixing the two scales would
 * quietly make the leader's plasma pistol the most overpriced thing on the table.
 *
 * So a ranged weapon is scaled by the only part of his formula that moved — the (Range + S + AP)
 * bracket, at half range over full range. Shots, Damage and the skill multiplier are identical in
 * both, so they cancel and we never have to guess them.
 *
 * A multi-profile weapon is scaled on its MOST EXPENSIVE profile, because that is the one his sheet
 * priced (his own note: only the dearest mode is paid for). Ranking by bracket x damage is enough
 * to pick it — a Plasma pistol's Overcharged mode wins on S8/AP-4/D2 over the Standard S7/AP-3/D1,
 * and it is the mode that set the printed 10 points.
 */
export function ktArmoryValue(item: {
  p_unit?: number | null; range?: string; s?: string; ap?: string; d?: string;
  profiles?: { range?: string; s?: string; ap?: string; d?: string }[];
}): number {
  const base = item.p_unit ?? 0;
  const modes = item.profiles?.length ? item.profiles : [item];
  let best: { r: number; flat: number } | null = null;
  let bestWorth = -Infinity;
  for (const m of modes) {
    const r = parseFloat(String(m.range ?? '').replace(/[^\d.]/g, ''));
    if (!r) continue;                                  // melee, or no range printed
    const s = parseInt(String(m.s ?? ''), 10);
    const ap = Math.abs(parseInt(String(m.ap ?? ''), 10) || 0);
    const dmg = parseFloat(String(m.d ?? '1').replace(/[^\d.]/g, '')) || 1;
    const flat = (KT_S_COST[Number.isFinite(s) ? s : 4] ?? 3.5) + (KT_AP_COST[ap] ?? 0);
    const worth = (rangeCost(r) + flat) * dmg;
    if (worth > bestWorth) { bestWorth = worth; best = { r, flat }; }
  }
  if (!best) return base;
  const full = rangeCost(best.r) + best.flat;
  const half = rangeCost(best.r / 2) + best.flat;
  if (full <= 0) return base;
  return Math.round(base * (half / full) * 10) / 10;
}

/** Halve a printed range for display, so the card matches the price. */
export function ktRange(range?: string): string {
  const n = parseFloat(String(range ?? '').replace(/[^\d.]/g, ''));
  return n ? `${Math.round(n / 2)}"` : (range ?? '-');
}

export interface KtBlock { title: string; body: string[] }

export const KT_RULES: KtBlock[] = [
  {
    title: '1. What this is',
    body: [
      'A kill team is a handful of operatives fighting over a small board. It uses the Custom40k Core Rules unchanged — the same orders, the same to-hit, to-wound and save sequence, the same AP and AT, the same glossary. Everything below is only what is DIFFERENT. If it is not written here, play it as the Core Rules say.',
      'The codices stay the base. There are no kill-team datasheets and no kill-team points: an operative is a model from an ordinary Custom40k datasheet, carrying one of the weapons that datasheet already offers.',
    ],
  },
  {
    title: '2. Choosing a kill team',
    body: [
      'Choose one team. Take between 6 and 9 operatives from its list. One of them may be the Leader; taking one is optional.',
      'Each operative may be taken once only, except those the list marks as repeatable.',
      'You never count points. The list already tells you how many operatives your team gets — that number was worked out so that two different teams meet on even terms.',
      'Each operative may take ONE piece of equipment from its team\'s list, and no two operatives may take the same one.',
    ],
  },
  {
    title: '3. Measuring',
    body: [
      'Distances use the gauge: ▲ = 1", ● = 2", ■ = 3", ⬟ = 6". Longer ones are multiples — 12" is 2⬟, 9" is ■ + ⬟.',
      'EVERY WEAPON RANGE IS HALVED. A 24" bolter reaches 12" (2⬟), a 12" meltagun reaches 6" (⬟), a 9" flamer reaches 4" (● ●). Nothing else about the weapon changes.',
      'Halving the ranges costs a shooting operative about 3–4% of its value and a melee one nothing at all, so it tilts the game very slightly towards close combat — which is what a game fought at this range should do.',
    ],
  },
  {
    title: '4. Every model is its own unit',
    body: [
      'Each operative is a unit of one model. It receives its own order, activates on its own, and takes its own Leadership tests. Casualties are not allocated, because there is no squad to allocate them in.',
      'Players alternate, activating one operative at a time. When one player has no operatives left to activate, the other activates the rest.',
      'Rules that only make sense for a squad do nothing here: Command squad, Bodyguard, Squadron, Combat Squads, and anything that refers to "the unit this model is attached to".',
    ],
  },
  {
    title: '5. What is switched off',
    body: [
      'No vehicles and no monstrous creatures.',
      'No Archetypes, Legacies or Army Traits.',
      'Psychic powers are out of the alpha. They come back once the rest has been played.',
      '"Indirect" weapons may not be used — there is no sky to fire into at this range.',
    ],
  },
  {
    title: '6. Where this comes from',
    body: [
      'A fan project. Custom40k is written and maintained by its author; this mode is not, and he has no hand in it. Nothing here should be taken as official, and any oddity in it is ours and not his.',
      'His own caution about the calculator, and it is the right one: the formula does not judge a model on its own. Feed it invented stats and it will happily price a creature with 1s everywhere, Toughness 10 and a 4+ ward save at under twelve points, and that model would be the worst roadblock in the game. We only ever run it over datasheets he has already written and priced himself, which is a different thing — we are checking that two teams built from HIS units come out even, not making up new ones.',
    ],
  },
  {
    title: '7. Still to write',
    body: [
      'The board and its terrain.',
      'Missions and how the game is scored.',
      'Whether an operative that loses its last wound is simply removed, or gets something in between.',
      'Command points and a short list of things to spend them on.',
    ],
  },
];
