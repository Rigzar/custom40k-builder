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
export const KT_MAX_OPERATIVES = 9;

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
];

/**
 * How many operatives this team fields: the budget divided by its cheapest operative, held
 * inside the 6-9 band. The band is what keeps the counts comparable — without it the Imperial
 * Guard, whose bare Veteran is worth 7.0, would be told to bring forty-three.
 */
export function ktTeamSize(team: KtTeam): number {
  const base = Math.min(...team.operatives.filter(o => !o.leader).map(o => o.value));
  return Math.max(KT_MIN_OPERATIVES, Math.min(KT_MAX_OPERATIVES, Math.round(KT_BUDGET / base)));
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
  return op.value > (KT_BUDGET / ktTeamSize(team)) * KT_UNIQUE_MULTIPLIER;
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
    title: '6. Still to write',
    body: [
      'The board and its terrain.',
      'Missions and how the game is scored.',
      'Whether an operative that loses its last wound is simply removed, or gets something in between.',
      'Command points and a short list of things to spend them on.',
    ],
  },
];
