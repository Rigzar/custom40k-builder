import type { Armory, Archetype, Legacy, Trait, Power } from '../vendor/src/types/data';

export interface FactionExtras {
  armoryGeneral: Armory;
  /** Keyed by mark/legion/clan/dynasty/etc. label */
  armoryFaction: Record<string, Armory>;
  archetypes: Archetype[];
  legacies: Legacy[];
  traits: Trait[];
  /** Actual warp-based psychic disciplines only — no prayers, no pacts. */
  disciplines: Record<string, Power[]>;
  /** Litanies / prayers said by non-psyker units (Dark Apostle, Chaplain, etc.). NOT psychic powers. */
  prayers?: Power[];
  /** Daemonic pacts — CSM only. NOT psychic powers. */
  pacts?: Power[];
  /** Mark animosity table: mark name → list of compatible marks. Present for CSM and CD. */
  animosity?: Record<string, string[]>;
  /** Canticles of the Omnissiah — base and legacy-granted. Present for AdMech. */
  canticles?: Array<{ name: string; effect: string; type: string; grantedByLegacy?: string }>;
}

type Mod<T> = { default: T };
const d = <T,>(m: Mod<T>) => m.default;

interface ArchData { archetypes?: Archetype[]; legacies?: Legacy[]; traits?: Trait[] }
interface AnimosityData { animosity: Record<string, string[]>; allied: Record<string, unknown> }
interface CanticleEntry { name: string; effect: string; type: string; grantedByLegacy?: string }

function assemble(
  general: Armory,
  archdata: ArchData | undefined,
  armoryFaction: Record<string, Armory>,
  disciplines: Record<string, Power[]>,
  prayers?: Power[],
  pacts?: Power[],
  animosityRaw?: AnimosityData,
  canticlesRaw?: CanticleEntry[],
): FactionExtras {
  return {
    armoryGeneral: general,
    armoryFaction,
    archetypes: archdata?.archetypes ?? [],
    legacies: archdata?.legacies ?? [],
    traits: archdata?.traits ?? [],
    disciplines,
    prayers: prayers && prayers.length > 0 ? prayers : undefined,
    pacts: pacts && pacts.length > 0 ? pacts : undefined,
    animosity: animosityRaw?.animosity,
    canticles: canticlesRaw,
  };
}

const LOADERS: Record<string, () => Promise<FactionExtras>> = {
  chaos_space_marines: async () => {
    const [g, kh, nu, sl, tz, iron, word, alpha, night, black, arch, pacts, prayers, discs, anim] = await Promise.all([
      import('../vendor/data/parsed/chaos_space_marines/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_space_marines/armory/mark_khorne.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_space_marines/armory/mark_nurgle.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_space_marines/armory/mark_slaanesh.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_space_marines/armory/mark_tzeentch.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_space_marines/armory/legion_iron_warriors.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_space_marines/armory/legion_word_bearers.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_space_marines/armory/legion_alpha_legion.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_space_marines/armory/legion_night_lords.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_space_marines/armory/legion_black_legion.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_space_marines/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/chaos_space_marines/psychic/pacts.json') as unknown as Promise<Mod<Power[]>>,
      import('../vendor/data/parsed/chaos_space_marines/psychic/prayers.json') as unknown as Promise<Mod<Power[]>>,
      import('../vendor/data/parsed/chaos_space_marines/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
      import('../vendor/data/parsed/chaos_space_marines/animosity.json') as unknown as Promise<Mod<AnimosityData>>,
    ]);
    return assemble(d(g), d(arch), {
      Khorne: d(kh), Nurgle: d(nu), Slaanesh: d(sl), Tzeentch: d(tz),
      'Iron Warriors': d(iron), 'Word Bearers': d(word), 'Alpha Legion': d(alpha), 'Night Lords': d(night), 'Black Legion': d(black),
    }, d(discs), d(prayers), d(pacts), d(anim));
  },
  chaos_daemons: async () => {
    const [g, tz, arch, discs, anim] = await Promise.all([
      import('../vendor/data/parsed/chaos_daemons/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_daemons/armory/mark_tzeentch.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/chaos_daemons/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/chaos_daemons/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
      import('../vendor/data/parsed/chaos_daemons/animosity.json') as unknown as Promise<Mod<AnimosityData>>,
    ]);
    return assemble(d(g), d(arch), { Tzeentch: d(tz) }, d(discs), undefined, undefined, d(anim));
  },
  space_marines: async () => {
    const [g, arch, prayers, discs, rel, dw, da, ws, sw, fi, bt, ba, br] = await Promise.all([
      import('../vendor/data/parsed/space_marines/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/space_marines/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/space_marines/psychic/prayers.json') as unknown as Promise<Mod<Power[]>>,
      import('../vendor/data/parsed/space_marines/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
      import('../vendor/data/parsed/space_marines/armory/legion_relictors.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/space_marines/armory/legion_death_watch.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/space_marines/armory/legion_dark_angels.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/space_marines/armory/legion_white_scars.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/space_marines/armory/legion_space_wolves.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/space_marines/armory/legion_imperial_fists.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/space_marines/armory/legion_black_templars.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/space_marines/armory/legion_blood_angels.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/space_marines/armory/legion_blood_ravens.json') as unknown as Promise<Mod<Armory>>,
    ]);
    return assemble(d(g), d(arch), {
      Relictors: d(rel), 'Death Watch': d(dw), 'Dark Angels': d(da), 'White Scars': d(ws),
      'Space Wolves': d(sw), 'Imperial Fists': d(fi), 'Black Templars': d(bt), 'Blood Angels': d(ba), 'Blood Ravens': d(br),
    }, d(discs), d(prayers));
  },
  imperial_guard: async () => {
    const [g, arch, discs, prayers] = await Promise.all([
      import('../vendor/data/parsed/imperial_guard/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/imperial_guard/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/imperial_guard/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
      import('../vendor/data/parsed/imperial_guard/psychic/prayers.json') as unknown as Promise<Mod<Power[]>>,
    ]);
    return assemble(d(g), d(arch), {}, d(discs), d(prayers));
  },
  adeptus_mechanicus: async () => {
    const [g, arch, leg, cant] = await Promise.all([
      import('../vendor/data/parsed/adeptus_mechanicus/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/adeptus_mechanicus/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/adeptus_mechanicus/armory/legion_forge_world.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/adeptus_mechanicus/canticles.json') as unknown as Promise<Mod<CanticleEntry[]>>,
    ]);
    return assemble(d(g), d(arch), { 'Forge World': d(leg) }, {}, undefined, undefined, undefined, d(cant));
  },
  adeptus_custodes: async () => {
    const [g, arch, leg] = await Promise.all([
      import('../vendor/data/parsed/adeptus_custodes/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/adeptus_custodes/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/adeptus_custodes/armory/legion_shield_host.json') as unknown as Promise<Mod<Armory>>,
    ]);
    return assemble(d(g), d(arch), { 'Shield Host': d(leg) }, {});
  },
  adeptus_sororitas: async () => {
    const [g, arch, leg, prayers] = await Promise.all([
      import('../vendor/data/parsed/adeptus_sororitas/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/adeptus_sororitas/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/adeptus_sororitas/armory/legion_order.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/adeptus_sororitas/psychic/prayers.json') as unknown as Promise<Mod<Power[]>>,
    ]);
    return assemble(d(g), d(arch), { Order: d(leg) }, {}, d(prayers));
  },
  grey_knights: async () => {
    const [g, arch, prayers, discs] = await Promise.all([
      import('../vendor/data/parsed/grey_knights/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/grey_knights/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/grey_knights/psychic/prayers.json') as unknown as Promise<Mod<Power[]>>,
      import('../vendor/data/parsed/grey_knights/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
    ]);
    return assemble(d(g), d(arch), {}, d(discs), d(prayers));
  },
  inquisition: async () => {
    const [g, arch, discs, prayers] = await Promise.all([
      import('../vendor/data/parsed/inquisition/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/inquisition/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/inquisition/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
      import('../vendor/data/parsed/inquisition/psychic/prayers.json') as unknown as Promise<Mod<Power[]>>,
    ]);
    return assemble(d(g), d(arch), {}, d(discs), d(prayers));
  },
  assassins: async () => {
    const [g] = await Promise.all([
      import('../vendor/data/parsed/assassins/armory/general.json') as unknown as Promise<Mod<Armory>>,
    ]);
    return assemble(d(g), undefined, {}, {});
  },
  tau_empire: async () => {
    const [g, arch, leg, prayers] = await Promise.all([
      import('../vendor/data/parsed/tau_empire/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/tau_empire/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/tau_empire/armory/legion_sept.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/tau_empire/psychic/prayers.json') as unknown as Promise<Mod<Power[]>>,
    ]);
    return assemble(d(g), d(arch), { Sept: d(leg) }, {}, d(prayers));
  },
  necrons: async () => {
    const [g, arch, leg, discs] = await Promise.all([
      import('../vendor/data/parsed/necrons/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/necrons/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/necrons/armory/legion_dynasty.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/necrons/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
    ]);
    return assemble(d(g), d(arch), { Dynasty: d(leg) }, d(discs));
  },
  orks: async () => {
    const [g, arch, leg, discs] = await Promise.all([
      import('../vendor/data/parsed/orks/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/orks/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/orks/armory/legion_clan.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/orks/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
    ]);
    return assemble(d(g), d(arch), { Klan: d(leg) }, d(discs));
  },
  eldar: async () => {
    const [g, arch, cw, yn, discs] = await Promise.all([
      import('../vendor/data/parsed/eldar/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/eldar/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/eldar/armory/legion_craftworld.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/eldar/armory/legion_ynnari.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/eldar/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
    ]);
    return assemble(d(g), d(arch), { Craftworld: d(cw), Ynnari: d(yn) }, d(discs));
  },
  dark_eldar: async () => {
    const [g, arch, kabal, wych, coven] = await Promise.all([
      import('../vendor/data/parsed/dark_eldar/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/dark_eldar/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/dark_eldar/armory/legion_kabal.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/dark_eldar/armory/legion_wych.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/dark_eldar/armory/legion_coven.json') as unknown as Promise<Mod<Armory>>,
    ]);
    return assemble(d(g), d(arch), { Kabal: d(kabal), Wych: d(wych), Coven: d(coven) }, {});
  },
  genestealer_cults: async () => {
    const [g, arch, discs] = await Promise.all([
      import('../vendor/data/parsed/genestealer_cults/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/genestealer_cults/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/genestealer_cults/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
    ]);
    return assemble(d(g), d(arch), {}, d(discs));
  },
  harlequins: async () => {
    const [g, discs] = await Promise.all([
      import('../vendor/data/parsed/harlequins/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/harlequins/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
    ]);
    return assemble(d(g), undefined, {}, d(discs));
  },
  leagues_of_votann: async () => {
    const [g, arch, leg, discs] = await Promise.all([
      import('../vendor/data/parsed/leagues_of_votann/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/leagues_of_votann/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/leagues_of_votann/armory/legion_league.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/leagues_of_votann/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
    ]);
    return assemble(d(g), d(arch), { League: d(leg) }, d(discs));
  },
  tyranids: async () => {
    const [g, arch, leg, discs] = await Promise.all([
      import('../vendor/data/parsed/tyranids/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/tyranids/archetypes.json') as unknown as Promise<Mod<ArchData>>,
      import('../vendor/data/parsed/tyranids/armory/legion_hive_fleet.json') as unknown as Promise<Mod<Armory>>,
      import('../vendor/data/parsed/tyranids/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
    ]);
    return assemble(d(g), d(arch), { 'Hive Fleet': d(leg) }, d(discs));
  },
  horus_heresy: async () => {
    const mod = await import('../vendor/data/parsed/_supplements/horus_heresy.json');
    const data = ((mod as unknown as { default: unknown }).default ?? mod) as Record<string, unknown>;
    const armoryFaction: Record<string, Armory> = {};
    if (data.armory_legions && typeof data.armory_legions === 'object') {
      Object.assign(armoryFaction, data.armory_legions as Record<string, Armory>);
    }
    if (data.armory_marks && typeof data.armory_marks === 'object') {
      Object.assign(armoryFaction, data.armory_marks as Record<string, Armory>);
    }
    return assemble(
      (data.armory_general ?? []) as Armory,
      { archetypes: data.archetypes as Archetype[], legacies: data.legacies as Legacy[], traits: data.traits as Trait[] },
      armoryFaction,
      (data.disciplines ?? {}) as Record<string, Power[]>,
      data.prayers as Power[] | undefined,
      data.pacts as Power[] | undefined,
      data.animosity ? { animosity: data.animosity as Record<string, string[]>, allied: {} } : undefined,
    );
  },
  escalation: async () => assemble({ name: 'Escalation', weapons: [], equipment: [] } as unknown as Armory, undefined, {}, {}),
};

export function getFactionExtras(factionKey: string): Promise<FactionExtras> {
  return LOADERS[factionKey]();
}
