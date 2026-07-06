/**
 * Army-wide special rules per faction, sourced from rules-model digests
 * (which are validated against the canonical .ods files).
 * These are rules that apply to the whole army or every unit in it.
 */

export type RuleTag = 'signature' | 'ally' | 'deployment' | 'weapon' | 'universal';

export interface ArmyRule {
  name: string;
  description: string;
  tag?: RuleTag;
}

export const ARMY_RULES: Record<string, ArmyRule[]> = {

  // ── CHAOS ──────────────────────────────────────────────────────────────────

  chaos_space_marines: [
    {
      name: 'Animosity of the Gods',
      description: 'The army\'s most expensive HQ\'s Mark of Chaos determines which other marks and units may join it — a 5×5 compatibility matrix governs which marks can coexist in the same squad. Suspended army-wide while the Black Crusade trait is active.',
      tag: 'signature',
    },
    {
      name: 'Black Crusade',
      description: 'One designated HQ becomes the Black Crusade champion, bearing all four Chaos god marks simultaneously. While active, the Animosity of the Gods rule does not apply for the army. The champion must not have a locked mark, and exactly one champion is required.',
      tag: 'signature',
    },
    {
      name: 'Marks Count as Veteran Abilities',
      description: 'For all units, Marks of Chaos (Khorne, Nurgle, Slaanesh, Tzeentch) count as veteran ability selections. A unit\'s mark slot fills one of its veteran ability slots.',
      tag: 'universal',
    },
  ],

  chaos_daemons: [
    {
      name: 'Daemonic Instability',
      description: 'All Daemon units (except Greater Daemons) have a 5+ invulnerability save. Greater Daemons have a 4+ invulnerability save. Daemons that fail Battleshock tests suffer additional casualties from the Daemonic Instability rule.',
      tag: 'universal',
    },
    {
      name: 'Favored Units',
      description: 'A unit with a Mark of Chaos that starts the game with a model count exactly equal to the deity\'s sacred number (or a multiple thereof) is Favored: its squad leader gains +1 Attack and a personal icon. Sacred numbers: Khorne 8 · Nurgle 7 · Slaanesh 6 · Tzeentch 9.',
      tag: 'signature',
    },
  ],

  // ── IMPERIUM ───────────────────────────────────────────────────────────────

  space_marines: [
    {
      name: 'They Shall Know No Fear',
      description: 'A pinned or fleeing unit automatically regroups at the start of its turn or upon reaching the board edge. Units with this rule can never use the "Take Cover" Defensive reaction.',
      tag: 'universal',
    },
  ],

  imperial_guard: [
    {
      name: 'Orders',
      description: 'Each officer issues one or more orders each Reinforcement phase. Any friendly unit within 12" of an officer at the start of its activation may use one of those orders — orders are not consumed and any number of units can use the same order in a turn. 9 Infantry Orders and 3 Vehicle Orders are always available; 6 Legacy Orders are unlocked by specific Legacies.',
      tag: 'signature',
    },
    {
      name: 'Hymns of Battle',
      description: 'Preacher and Dogmata units know Hymns of Battle (a prayer system, not psychic powers). 5 base Hymns: Catechism of Repugnance, Chorus of Spiritual Fortitude, Psalm of Righteous Smiting, Refrain of Blazing Piety, War Hymn.',
    },
  ],

  adeptus_mechanicus: [
    {
      name: 'Canticles of the Omnissiah',
      description: 'At the start of the Command phase, choose one Canticle. All units with this rule partially within 9" of a Choir Master model roll a D6 — on a 4+ they gain the chosen Canticle until end of Battle Round. Choir Master units automatically pass this roll. 6 base Canticles are always available; 7 Legacy Canticles are unlocked by Forge World Legacies.',
      tag: 'signature',
    },
    {
      name: 'Choir Master',
      description: 'Units containing a Choir Master model automatically pass their Canticle roll and always benefit from the active Canticle.',
      tag: 'universal',
    },
    {
      name: 'Monotask',
      description: 'Tech-Thralls, Kataphron Breachers, Kataphron Destroyers, Servitors, and Kastelan Robots do not benefit from Canticles unless accompanied by a character with Choir Master.',
      tag: 'universal',
    },
  ],

  adeptus_custodes: [
    {
      name: 'Shield Host',
      description: 'Custodes contest objectives by table quarter as well as by proximity. All models within 12" of an objective count for control. All attacks from Shield Host models gain Precision(5+). Battleshock tokens are capped: two incoming tokens become one.',
      tag: 'signature',
    },
    {
      name: 'Lightning Strike',
      description: 'For each started 1,000 points of game size, one Infantry or Walker unit (including attached characters) may be set up using Deep Strike for +1/+4 point(s) per Wound/Hull Point.',
      tag: 'deployment',
    },
  ],

  adeptus_sororitas: [
    {
      name: 'Acts of Faith',
      description: 'The army generates Faith Points from Pious units and martyrs. Units may spend Faith Points to perform Acts of Faith — special miraculous effects that last until end of phase. Each unit can benefit from as many Acts of Faith per battle round as the army has Faith Points, but only one effect at a time.',
      tag: 'signature',
    },
    {
      name: 'Shield of Faith',
      description: 'All Sisters of Battle models receive a 6+ invulnerability save.',
      tag: 'universal',
    },
    {
      name: 'Witch Hunters',
      description: 'The army has access to Inquisition units (Inquisitors must select Ordo Hereticus) and Assassin units.',
      tag: 'ally',
    },
    {
      name: 'Hymns of Battle',
      description: 'Preacher and Dogmata units know Hymns of Battle (a prayer system, not psychic powers).',
    },
  ],

  grey_knights: [
    {
      name: 'They Shall Know No Fear',
      description: 'A pinned or fleeing unit automatically regroups at the start of its turn or upon reaching the board edge.',
      tag: 'universal',
    },
    {
      name: 'Shrouding',
      description: 'While at 12" or more from a Grey Knights model, all enemy ranged attacks against that model gain the cumulative Deflect ability.',
      tag: 'universal',
    },
    {
      name: 'True Grit',
      description: 'All ranged weapons are treated as Assault weapons. Additionally, if the model made both a ranged and melee attack in the same activation, it gains +1 Attack until end of the Fight phase.',
      tag: 'universal',
    },
    {
      name: 'Teleport Strike',
      description: 'For every 2,500 points in the army, it gains 3 Teleport tokens. These tokens can be spent to redeploy units using the rules for Deep Strike.',
      tag: 'deployment',
    },
    {
      name: 'Nemesis Warding Stave',
      description: 'If at least one model in the unit is equipped with a Nemesis warding stave, all models in the unit gain the Parry ability.',
    },
    {
      name: 'Daemon Hunters',
      description: 'The army has access to Inquisition units (Inquisitors must select Ordo Malleus) and Assassin units.',
      tag: 'ally',
    },
  ],

  inquisition: [
    {
      name: 'Ordo Specialisation',
      description: 'Each Inquisitor belongs to one of three Ordos: Ordo Hereticus, Ordo Malleus, or Ordo Xenos. The Inquisitor\'s Ordo determines which equipment and relics are available to them from the faction armory.',
      tag: 'signature',
    },
  ],

  // ── XENOS ─────────────────────────────────────────────────────────────────

  tau_empire: [
    {
      name: 'Markerlight',
      description: 'Units place Markerlight tokens on enemy units. Tokens are spent (1–3 each) for combat benefits: auto-hit Seeker missiles, –Leadership, Sunder, reduced Defensive Fire penalty, re-roll 1s to hit, Battleshock tests, and off-board Seeker missile hits. Maximum 4 tokens per enemy unit at any time.',
      tag: 'signature',
    },
    {
      name: 'Supporting Fire',
      description: 'A friendly unit within 6" of a unit being charged may also use Defensive Fire against the charging unit, using its own order token.',
      tag: 'universal',
    },
    {
      name: 'Tactical Philosophy',
      description: 'At deployment, the army must choose one of four Tactical Philosophies: Kauyon (patient hunter), Mont\'ka (killing blow), Rinyon, or Rip\'yka. Costs 10 points per started 500 points of game size. The choice is Unique — only one per army.',
      tag: 'signature',
    },
  ],

  necrons: [
    {
      name: 'Reanimation Protocols',
      description: 'The army gains 3 Reanimation Points (RPoints) per 500 points of game size. In each Reinforcement phase, units are allocated RPoints to heal lost wounds or revive slain models: roll 4+ per RPoint to restore a wound. Models killed by a weapon with Strength ≥ 2× their Toughness cannot use Reanimation Protocols.',
      tag: 'signature',
    },
    {
      name: 'Gauss',
      description: 'To wound rolls of 5+ against creatures always succeed. Armor penetration rolls of 5+ against vehicles gain cumulative +1 AT and always inflict at least a Glancing Hit.',
      tag: 'weapon',
    },
    {
      name: 'Tesla',
      description: 'To hit rolls of 5+ always succeed and generate 2 additional automatic hits.',
      tag: 'weapon',
    },
  ],

  orks: [
    {
      name: "Waaagh!",
      description: 'Declare a Waaagh! once per game at the start of the Command phase, lasting two battle rounds (one in Skirmish). Infantry and Walkers with the Waaagh! rule gain +D6" Movement. Other vehicles, Bikes, and Jump-pack infantry gain Deflect instead if they moved their maximum distance (≥8").',
      tag: 'signature',
    },
    {
      name: 'Mob Rule',
      description: 'Ork squads gain +1 Leadership per 5 models in the unit. Units at 20+ models are Fearless. Depleted Mob units may merge with another Mob unit.',
      tag: 'universal',
    },
    {
      name: 'Dakka Dakka Dakka',
      description: "Reduce the army's total ranged to-hit penalty by –1 (minimum 0). Does not apply to Barrage or Explosive weapons.",
      tag: 'universal',
    },
    {
      name: 'Tellyporta',
      description: 'For every 1,000 points in the army, one unit may Deep Strike for +1/+4 points per Wound/Hull Point. This rule applies to all Ork units.',
      tag: 'deployment',
    },
  ],

  eldar: [
    {
      name: 'Battle Focus',
      description: 'Assault, Grenade, and Pistol weapons ignore the to-hit penalty from Advance and Charge orders. Heavy weapons can be used without penalty with Move & Shoot, and at –1 with Advance/Charge. All psychic powers are treated as Basic.',
      tag: 'signature',
    },
    {
      name: 'Shuriken',
      description: 'To wound rolls of 5+ gain an additional –2 AP.',
      tag: 'weapon',
    },
    {
      name: 'Webway Strike',
      description: 'For each started 1,000 points, one infantry unit may be set up using Infiltrators for +1 point per Wound.',
      tag: 'deployment',
    },
    {
      name: 'Visitors of the Black Library',
      description: 'The army has access to Harlequin units. Harlequins cannot be the mandatory HQ selection.',
      tag: 'ally',
    },
  ],

  dark_eldar: [
    {
      name: 'Power Through Pain',
      description: 'Each time an enemy unit is destroyed, the army gains a Power Through Pain token. Tokens are assigned special rules distributed to any friendly PtP unit. 6 bonuses: Aegis(4+), Berserk(4+), Furious Charge, +1 Initiative, +1 Leadership, +1 Strength.',
      tag: 'signature',
    },
    {
      name: 'Combat Drugs',
      description: 'After all units have been set up, pick one combat drug for each eligible unit. Its effect lasts for the remainder of the battle. 6 drugs are available.',
      tag: 'signature',
    },
    {
      name: 'Webway Raid',
      description: 'For each started 1,000 points, one infantry unit may be set up using Infiltrators for +1 point per Wound.',
      tag: 'deployment',
    },
    {
      name: 'Visitors of the Black Library',
      description: 'The army has access to Harlequin units. Harlequins cannot be the mandatory HQ selection.',
      tag: 'ally',
    },
  ],

  genestealer_cults: [
    {
      name: 'Ambush',
      description: 'For each started 500 points, one Ambush marker may be placed after all Infiltrators deploy: at least 12" from any enemy and 6" from a mission objective or other Ambush marker. Units with the Ambush rule may set up within 3" of a marker with any order, or embark into a marker and re-enter from reserves next round. If an enemy unit is within 3" of an Ambush marker during the Reinforcement phase, that marker is removed.',
      tag: 'signature',
    },
  ],

  harlequins: [
    {
      name: 'Shuriken',
      description: 'To wound rolls of 5+ gain an additional –2 AP.',
      tag: 'weapon',
    },
    {
      name: 'Webway Strike',
      description: 'For each started 1,000 points, one infantry unit may be set up using Infiltrators for +1 point per Wound.',
      tag: 'deployment',
    },
  ],

  leagues_of_votann: [
    {
      name: 'Eye of the Ancestors',
      description: 'Each time a friendly unit is removed, place a Judgement token on the enemy unit that caused the last wound (maximum 2). Friendly units attacking a target with 1+ token gain cumulative benefits: 1 token = re-roll 1 hit per activation; 2 tokens = re-roll 1 wound per activation.',
      tag: 'signature',
    },
    {
      name: 'Steady Advance',
      description: 'Kin units can never receive an Advance order but gain Move Through Cover. The Frontier Momentum trait re-enables Advance.',
      tag: 'universal',
    },
    {
      name: 'Void Armour',
      description: 'Enemy attacks reduce their AT and AP values by –1 each (minimum 0).',
      tag: 'universal',
    },
  ],

  tyranids: [
    {
      name: 'Synapse',
      description: 'Units within 12" of a Synapse model ignore Leadership modifiers, count as full strength, convert failed Leadership tests into Mortal Wounds instead of Battleshock tokens, and clear Battleshock at Rally. Synapse models explode like vehicles on death.',
      tag: 'signature',
    },
    {
      name: 'Instinctive Behaviour',
      description: 'A unit outside Synapse range gains a Battleshock marker removable only by re-entering Synapse range. Fleeing units move toward the nearest Synapse unit. Units starting the battle round in reserves count as within Synapse range during that Rally phase.',
      tag: 'universal',
    },
    {
      name: 'Shadow in the Warp',
      description: 'Enemy psykers suffer –1 to manifest and deny psychic powers in rounds 2–3, and –2 in rounds 4–5.',
      tag: 'universal',
    },
    {
      name: 'Psychic Feedback',
      description: 'Instead of rolling for Perils of the Warp, the affected Tyranid psyker model suffers 1 Mortal Wound.',
      tag: 'universal',
    },
  ],

  // ── SUPPLEMENTS ───────────────────────────────────────────────────────────

  escalation: [
    {
      name: 'Lords of War — Epic Battle Only',
      description: 'Lords of War units are only available in Epic Battle engagements. They are absent from Skirmish and Pitched Battle. Allied detachments cannot include Lords of War.',
      tag: 'universal',
    },
    {
      name: '33% Points Cap',
      description: 'A maximum of 33% of the total army point limit may be spent on Lords of War units.',
      tag: 'universal',
    },
  ],

  horus_heresy: [
    {
      name: 'Host Codex Required',
      description: 'The Horus Heresy supplement can only be used in conjunction with a Space Marines or Chaos Space Marines codex. It is injected by the host army\'s Legion archetype — it cannot field a standalone army.',
      tag: 'universal',
    },
    {
      name: 'Troops Limitation',
      description: 'Only Horus Heresy Troops units count toward the host army\'s mandatory 25% Troops minimum (the AOP Troops floor). HH non-Troops units do not satisfy that requirement.',
      tag: 'universal',
    },
    {
      name: 'Legiones Astartes',
      description: 'All Horus Heresy units carry the Legion keyword. Models wearing Cataphractii or Terminator armour may only receive equipment marked with the Terminator glyph (ᵀ).',
      tag: 'universal',
    },
  ],

  assassins: [
    {
      name: 'Execution Force',
      description: 'Assassins are not a standalone army — they are added to Imperial armies that have access to the Officio Assassinorum (via Witch Hunters, Daemon Hunters, or the universal access rule). Each Temple produces a unique operative with a radically different specialisation.',
      tag: 'universal',
    },
  ],
};
