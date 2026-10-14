/**
 * Legendary Retinue (Imperial Navy 1.1 and Inquisition 1.3, HQ).
 *
 * Sheet text, verbatim:
 *   "You may select up to 4 models chosen from the HQ section of the following armies: Adeptus
 *    Mechanicus, Adeptus Sororitas, Imperial Guard, Space Marines.
 *    You can't select more than one unit from each faction and none of the models may be unique
 *    per army. The model must start out with the "Infantry" type, though it may change its type
 *    from purchased equipment. The chosen units may only purchase equipment from their own
 *    respective armories and may not select any unique equipment."
 * Army Customisation (both codices): Heretic adds Chaos Daemons, Chaos Space Marines and Genestealer
 * Cults; Iconoclast adds Dark Eldar, Eldar, Leagues of Votann, Orks and T'au Empire.
 *
 * The Retinue is one HQ choice, so its members share ONE HQ slot (computeRetinueFreeSlots). Each member
 * is an ordinary roster entry of its own codex (`factionSource`, flagged `retinue`), so it prices, resolves
 * and shops in its own armoury exactly like any other native ally.
 */
import type { Unit, FactionData } from '../types/data';
import type { RosterEntry } from '../types/army';

export const RETINUE_MAX_MODELS = 4;
export const RETINUE_FACTIONS = ['Imperial Navy', 'Inquisition'] as const;
const BASE = ['adeptus_mechanicus', 'adeptus_sororitas', 'imperial_guard', 'space_marines'];
const BY_ARCHETYPE: Record<string, string[]> = {
  Heretic: ['chaos_daemons', 'chaos_space_marines', 'genestealer_cults'],
  Iconoclast: ['dark_eldar', 'eldar', 'leagues_of_votann', 'orks', 'tau_empire'],
};

/** The codex keys whose HQ models this army's Legendary Retinue may draw from ([] for any other army). */
export function retinueFactionKeys(faction: string | undefined | null, archetype: string | null | undefined): string[] {
  if (!faction || !(RETINUE_FACTIONS as readonly string[]).includes(faction)) return [];
  return [...BASE, ...(archetype ? BY_ARCHETYPE[archetype] ?? [] : [])];
}

/** "none of the models may be unique per army" - a unit whose own sheet says only one may be taken. */
export function isUniquePerArmy(u: Pick<Unit, 'option_groups'>): boolean {
  return (u.option_groups ?? []).some(g => !g.variant_link && (
    (g.is_unique_per_army && g.constraint?.type === 'unique_upgrade') || /\bonly one\b.*\bper army\b/i.test(g.header ?? '')));
}

/** "The model must start out with the 'Infantry' type". */
export function startsAsInfantry(u: Pick<Unit, 'unit_type'>): boolean {
  return (u.unit_type ?? '').split(',').map(s => s.trim().toLowerCase()).includes('infantry');
}

/** Whether a datasheet of a permitted codex may be taken as a Retinue model (it must also sit in that codex's HQ). */
export function retinueEligible(u: Unit): boolean {
  return !u.is_vehicle && startsAsInfantry(u) && !isUniquePerArmy(u);
}

/** "may not select any unique equipment" - armoury items whose own text says Unique. */
export function isUniqueEquipment(desc: string | undefined | null): boolean {
  return /\bunique\b/i.test(desc ?? '');
}

export const isRetinueEntry = (e: Pick<RosterEntry, 'retinue'>) => !!e.retinue;

/** One HQ slot for the whole Retinue: every member beyond the first is exempt. */
export function computeRetinueFreeSlots(army: RosterEntry[], data: FactionData): { hq: number; notes: string[] } {
  if (!(RETINUE_FACTIONS as readonly string[]).includes(data.faction)) return { hq: 0, notes: [] };
  const members = army.filter(isRetinueEntry).length;
  if (members <= 1) return { hq: 0, notes: [] };
  return { hq: members - 1, notes: [`Legendary Retinue: ${members} models share one HQ slot.`] };
}
