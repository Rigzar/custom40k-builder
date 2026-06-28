import type { Armory, Archetype, Legacy, Trait, Power } from '../../../src/types/data';

export interface FactionExtras {
  armoryGeneral: Armory;
  /** Keyed by armory label, e.g. Orks: { Klan: ... }, Necrons: { Dynasty: ... }. */
  armoryFaction: Record<string, Armory>;
  archetypes: Archetype[];
  legacies: Legacy[];
  traits: Trait[];
  disciplines: Record<string, Power[]>;
}

type Mod<T> = { default: T };
const d = <T,>(m: Mod<T>) => m.default;

const LOADERS: Record<string, () => Promise<FactionExtras>> = {
  orks: async () => {
    const [g, arch, leg, discs] = await Promise.all([
      import('../../../data/parsed/orks/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../../../data/parsed/orks/archetypes.json') as unknown as Promise<Mod<{ archetypes: Archetype[]; legacies: Legacy[]; traits: Trait[] }>>,
      import('../../../data/parsed/orks/armory/legion_clan.json') as unknown as Promise<Mod<Armory>>,
      import('../../../data/parsed/orks/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
    ]);
    const a = d(arch);
    return {
      armoryGeneral: d(g),
      armoryFaction: { Klan: d(leg) },
      archetypes: a.archetypes ?? [],
      legacies: a.legacies ?? [],
      traits: a.traits ?? [],
      disciplines: d(discs) ?? {},
    };
  },
  necrons: async () => {
    const [g, arch, leg, discs] = await Promise.all([
      import('../../../data/parsed/necrons/armory/general.json') as unknown as Promise<Mod<Armory>>,
      import('../../../data/parsed/necrons/archetypes.json') as unknown as Promise<Mod<{ archetypes: Archetype[]; legacies: Legacy[]; traits: Trait[] }>>,
      import('../../../data/parsed/necrons/armory/legion_dynasty.json') as unknown as Promise<Mod<Armory>>,
      import('../../../data/parsed/necrons/psychic/disciplines.json') as unknown as Promise<Mod<Record<string, Power[]>>>,
    ]);
    const a = d(arch);
    return {
      armoryGeneral: d(g),
      armoryFaction: { Dynasty: d(leg) },
      archetypes: a.archetypes ?? [],
      legacies: a.legacies ?? [],
      traits: a.traits ?? [],
      disciplines: d(discs) ?? {},
    };
  },
};

export function getFactionExtras(factionKey: string): Promise<FactionExtras> {
  return LOADERS[factionKey]();
}
