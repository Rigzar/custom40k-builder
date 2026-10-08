/**
 * battleProfile.ts — what a unit ACTUALLY has, once the options you did not take are dropped.
 *
 * Unwise, on using the app at the table: *"when I am in a game, I do not care about what I did not
 * pick — acid maw, adrenal glands, etc."* The Print View already worked this out, in sixty lines
 * of filtering that had been corrected several times. The play view needs exactly the same answer,
 * so it is extracted here and both read it: two copies of this would drift, and a card that
 * disagrees with the printout about what you are carrying is worse than either on its own.
 *
 * Everything here is derived from the RESOLVED profile, never re-derived from the datasheet.
 */
import type { FactionData, Model, Unit, Weapon } from '../types/data';
import type { RosterEntry } from '../types/army';

/** The subset of `resolveUnitProfile`'s result this module needs. */
export interface BattleProfileInput {
  weaponsToShow: Weapon[];
  weaponGroups: Array<{
    label?: string;
    count?: number | null;
    countOverrides?: Map<string, number>;
    weapons: Weapon[];
    traitMap?: Map<string, string[]>;
  }>;
  weaponTraitMap: Map<string, string[]>;
  injectedAbilities: string[];
  optionAbilities: string[];
  equipMods: { grantedAbilities: string[] };
  effectivePsyker: boolean;
  psykerGroupIdx: number;
}

/** An ability's NAME — the part before the colon, lower-cased, used for de-duping and matching. */
const abilityKey = (ab: string): string => {
  const i = ab.indexOf(':');
  return (i > 0 ? ab.slice(0, i) : ab).trim().toLowerCase();
};

/**
 * The abilities this unit actually has: its datasheet abilities minus the ones that only come
 * with an option nobody bought, plus everything its wargear, options and upgrades granted.
 *
 * Three things get filtered out, and each is a real case rather than a precaution:
 *  - an ability NAMED AFTER an optional weapon the unit did not take (the datasheet lists the
 *    weapon's rule whether or not you bought the weapon);
 *  - an ability that exists only as a choice's own text and was not chosen — the Tyranid
 *    biomorphs Unwise is complaining about;
 *  - an ability NAMED after an option that was not taken. The datasheet often states an
 *    upgrade's effect as a plain ability in DIFFERENT words from the choice that grants it
 *    ("Winged: If this Biomorph is taken, the unit counts as a Fast Attack selection" against
 *    the choice's "Winged: The unit gains Anti-Grav and Deep Strike"), so matching on text
 *    alone let it through and the battle view showed Winged on a brood that never took it.
 *    Swept first: 134 such abilities on 61 units across the game, and every one is an upgrade's
 *    effect (Trygon Prime, Hive Commander, XV22-2 Stalker...), so hiding them while unbought is
 *    right. Scoped to UNSELECTED choices, so taking the option keeps both texts;
 *  - "Psyker" on a unit whose psyker upgrade is optional and unbought.
 */
export function selectedAbilities(u: Unit, item: RosterEntry, rp: BattleProfileInput): string[] {
  const shownWeaponBases = new Set(rp.weaponsToShow.map(w => w.name.split(' - ')[0]));
  const unselectedOptionalWeapons = new Set<string>();
  const allChoiceAbilityTexts = new Set<string>();

  for (const g of u.option_groups ?? []) {
    for (const c of g.choices ?? []) {
      const parts = c.name.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
      for (const part of (parts.length > 1 ? parts : [c.name])) {
        if ((u.weapons ?? []).some(w => w.name.split(' - ')[0] === part) && !shownWeaponBases.has(part)) {
          unselectedOptionalWeapons.add(part.toLowerCase());
        }
      }
      for (const ab of (c.abilities ?? [])) allChoiceAbilityTexts.add(ab.toLowerCase());
    }
  }

  // Choice names this unit offers but has NOT bought.
  const unselectedChoiceNames = new Set<string>();
  (u.option_groups ?? []).forEach((g, gi) => {
    (g.choices ?? []).forEach((c, ci) => {
      if (!(item.optionQty?.[gi]?.[ci] ?? 0)) unselectedChoiceNames.add(c.name.trim().toLowerCase());
    });
  });

  // An INLINE upgrade ("One Captain per army can be upgraded to a Colonel for +15") has no
  // choices, so nothing above knew its rule text belonged to something not bought: the datasheet
  // printed "Colonel: ..." under every plain Captain. Its group-level effect abilities are hidden
  // until the upgrade is taken, which is when `optionAbilities` adds them back.
  const unboughtInlineTexts = new Set<string>();
  (u.option_groups ?? []).forEach((g, gi) => {
    if (g.inline_pts == null || (g.choices ?? []).length > 0) return;
    if ((item.optionQty?.[gi] as Record<string, number> | undefined)?.__inline) return;
    for (const ab of (g.effect?.grants_abilities ?? [])) unboughtInlineTexts.add(ab.toLowerCase());
  });

  const selectedChoiceAbilityTexts = new Set(rp.injectedAbilities.map(a => a.toLowerCase()));
  const hasUnboughtPsykerOption = rp.psykerGroupIdx >= 0 && !rp.effectivePsyker;

  const base = (u.abilities ?? []).filter(ab => {
    if (/^\d+$/.test(ab.trim())) return false;           // a stray number in the sheet's cell
    const label = abilityKey(ab);
    if (unselectedOptionalWeapons.has(label)) return false;
    if (allChoiceAbilityTexts.has(ab.toLowerCase()) && !selectedChoiceAbilityTexts.has(ab.toLowerCase())) return false;
    if (unselectedChoiceNames.has(label)) return false;
    if (unboughtInlineTexts.has(ab.toLowerCase())) return false;
    if (hasUnboughtPsykerOption && label === 'psyker') return false;
    return true;
  });

  const notAlreadyListed = (ab: string) =>
    !(u.abilities ?? []).some(a => a.toLowerCase().includes(ab.toLowerCase()));

  const all = [
    ...base,
    ...rp.injectedAbilities.filter(notAlreadyListed),
    ...rp.equipMods.grantedAbilities.filter(
      ab => !(u.abilities ?? []).some(a => abilityKey(a) === ab.toLowerCase())),
    ...rp.optionAbilities.filter(notAlreadyListed),
  ];

  // De-dupe by NAME: an item-granted "Tank hunter" and a datasheet "Tank Hunter" are one ability.
  const seen = new Set<string>();
  return all.filter(ab => {
    const k = abilityKey(ab);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export interface BattleWeaponGroup {
  label?: string;
  /** "3x Boneswords" — the count already folded into the name, as the printed card does it. */
  ranged: Weapon[];
  melee: Weapon[];
}

/**
 * The weapons the unit is carrying, split into ranged and melee, with the trait-granted abilities
 * (Sunder from a Pan spectral scanner, a trait's weapon ability) merged onto each row — the same
 * two filters the printed card uses, including dropping any row whose count has fallen to zero.
 */
export function battleWeapons(rp: BattleProfileInput): BattleWeaponGroup[] {
  return rp.weaponGroups.map(g => {
    const traits = g.traitMap ?? rp.weaponTraitMap;
    const countOf = (w: Weapon) => g.countOverrides?.get(w.name) ?? g.count;
    const merge = (w: Weapon): Weapon => {
      const extra = traits.get(w.name) ?? [];
      const n = countOf(w);
      const name = n != null ? `${n}x ${w.name}` : w.name;
      if (!extra.length) return { ...w, name };
      const had = (w.abilities && w.abilities !== '-') ? w.abilities : '';
      return { ...w, name, abilities: [had, ...extra].filter(Boolean).join(', ') };
    };
    const isMelee = (w: Weapon) => w.range === 'Melee' || w.type === 'Melee' || w.range === '-';
    const live = g.weapons.filter(w => countOf(w) !== 0);
    return {
      label: g.label,
      ranged: live.filter(w => !isMelee(w) && !!w.range && w.range !== '').map(merge),
      melee: live.filter(isMelee).map(merge),
    };
  }).filter(g => g.ranged.length || g.melee.length);
}

/**
 * An attendant of a lone character: the Company Hero's Animal Companion, the Engineseer's Servitors, an
 * Iron-master's E-COGs, a Grimnyr's CORVs. The datasheet gives the Armory to the character ("The Company
 * Hero has access to weapons and gear from the Armory"), so Plate armor or Swordsman honours change the
 * character's row alone, never the animal's (GH#219: the companion read WS 2+ / SV 4+ as well).
 * Shape: a character whose first model is fixed at 1 and every other model is optional (min 0).
 */
export function isAttendantModel(u: Unit, m: Model): boolean {
  const ms = u.models;
  if (!u.is_character || ms.length < 2 || !(ms[0].min === 1 && ms[0].max === 1)) return false;
  if (!ms.slice(1).every(x => x.min === 0)) return false;
  return m !== ms[0];
}

/**
 * Does THIS model row take the Armory's stat changes (a save, WS, T...)? When Armory access belongs
 * to one model -- a squad's built-in Leader/Champion, or a promoted variant -- the purchase changes
 * that model alone: a Platoon Lieutenant in Plate armor is 4+ while his Guardsmen stay 5+; a Gang
 * Champion with Swordsman honours is WS 3+ and the Gangers stay 4+ (GitHub #208). The unit card has
 * always scoped this (the Nob / Rough Rider fix), but the printed card, the simple printout and the
 * battle view each applied the change to EVERY row, so the same list read differently on screen
 * and on paper. This is the unit card's own rule, moved here so all four read one answer.
 * Unit-wide Armory access (`has_armory_access`) still changes every row.
 */
export function equipTargetsModel(u: Unit, m: Model, variant?: Model | null): boolean {
  if (isAttendantModel(u, m)) return false;
  if (u.has_armory_access) return true;
  const gatedByVariant = u.option_groups.some(g =>
    g.variant_link && (/armory/i.test(g.header) || u.champion_has_armory));
  const champion = u.models.length > 1 && u.models[1].min === 1 && u.models[1].max === 1 ? u.models[1] : null;
  const scoped = (!!champion && u.champion_has_armory && !gatedByVariant) || gatedByVariant;
  if (!scoped) return true;
  return (!!variant && m === variant) || m === champion;
}

/** Traits, psychic powers and prayers the player chose — named, ready to print in a list. */
export function selectedExtras(item: RosterEntry, _data?: FactionData) {
  return {
    traits: item.traits.map(t => t.name),
    powers: item.powers.filter(p => p.powerName !== '__discipline__').map(p => `${p.powerName} (${p.disciplineName})`),
    prayers: [...item.prayers],
  };
}
