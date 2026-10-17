/**
 * Two Necron slot bugs from the same report batch, both caused by reading a field too literally.
 *
 * GH#131 "Infantry units do not provide a Dedicated Transport slot." Missions: "A dedicated
 * transport vehicle may be chosen for each 'Infantry' type selection", and the check required
 * `unit_type` to equal the string "Infantry" exactly. The Necrons sheet prints UNIT TYPE and
 * KEYWORD on separate rows — "Infantry" and "Necron" — but our data folded the keyword into the
 * type field, so every Necron datasheet reads "Infantry, Necron" and NONE of them qualified. A
 * Necron army was granted no transport slots at all. Now compared token by token, ignoring tokens
 * that are not unit types; the ones that ARE (Bike, Jump Pack Infantry, Character Model…) still
 * disqualify, which is the designer clarification the check exists for.
 *
 * GH#130 "Scarabs taken as Troops do not count towards the minimum points for Troops." Their
 * printed slot is Fast Attack and the codex lets them opt in: "For each 'Warriors' unit, one
 * 'Canoptek Scarabs' unit may be selected as Troops. Can't be a mandatory unit selection." The 25%
 * check read the PRINTED slot, so an opted-in unit counted for nothing. The "not mandatory" half is
 * a separate rule about the AOP minimum and is enforced elsewhere.
 *
 *   npx tsx scripts/check_necron_slots_gh130_131.ts
 */
import { countInfantrySelections, validateArmy } from '../src/engine/validators';
type Any = any;

(async () => {
  const mod: Any = await import('../data/parsed/necrons/units/index');
  const data: Any = {
    faction: mod.faction, units: mod.units, slot_to_units: mod.slot_to_units,
    armory_general: { weapons: [], equipment: [] }, armory_marks: {}, armory_legions: {},
    archetypes: [], legacies: [], traits: [], disciplines: {}, prayers: [], pacts: {},
    animosity: {}, unit_versions: {},
  };
  const e = (n: string, id: string, optionQty: Any = {}): Any => ({
    id, unitName: n, slot: mod.units[n]?.slot ?? 'Troops',
    size: mod.units[n]?.default_size ?? 1, optionQty, armory: [], traits: [], powers: [],
  });
  const state = (army: Any[]): Any => ({
    army, data, faction: mod.faction, archetype: '', legacy: '', legacy2: '',
    engagement: 'pitched', pointLimit: 2000, traitPool: [], alliedFaction: null,
    alliedArchetype: '', alliedLegacy: '', alliedTraitPool: [], campaignTraitBonus: 0,
  });

  const fails: string[] = [];

  // GH#131 — three Necron Infantry units are three Infantry selections.
  {
    const army: Any[] = [e('Warriors', 't1'), e('Immortals', 't2'), e('Flayed Ones', 't3')];
    const n = countInfantrySelections(state(army), data, false);
    if (n !== 3) fails.push(`three Necron Infantry units count as ${n} Infantry selections, want 3`);
    if (!/^Infantry/.test(mod.units['Warriors'].unit_type)) {
      fails.push('Warriors no longer read as Infantry — this check is stale, re-read the data');
    }
  }
  // …and a Jet Bike still does not, keyword or no keyword.
  {
    const army: Any[] = [e('Tomb Blades', 'f1')];
    const n = countInfantrySelections(state(army), data, false);
    if (n !== 0) fails.push(`Tomb Blades (Jet Bike, Necron) count as ${n} Infantry selections, want 0`);
  }

  // GH#130 — a Scarab unit opted into Troops contributes its points to the 25%.
  {
    const gi = (mod.units['Canoptek Scarabs'].option_groups ?? [])
      .findIndex((g: Any) => /may be selected as Troops/i.test(g.header));
    if (gi < 0) { fails.push('the Scarabs "selected as Troops" group is gone — this check is stale'); }
    else {
      const optedIn: Any[] = [e('Warriors', 't1'), e('Warriors', 't2'), e('Canoptek Scarabs', 's1', { [gi]: { __inline: 1 } })];
      const plain: Any[] = [e('Warriors', 't1'), e('Warriors', 't2'), e('Canoptek Scarabs', 's1')];
      const troopsErr = (army: Any[]) => validateArmy(state(army), data)
        .filter((i: Any) => i.type === 'error' && /troops/i.test(i.text))
        .map((i: Any) => i.text);
      const withOptIn = troopsErr(optedIn);
      const without = troopsErr(plain);
      // Both lists are short of 25% at 2000pts, so compare the numbers the message carries: the
      // opted-in list must be credited MORE Troops points than the same list without the tick.
      const pts = (msgs: string[]) => Number(msgs.join(' ').match(/(\d+)\s*(?:\/|of)/)?.[1] ?? -1);
      if (withOptIn.length && without.length && pts(withOptIn) <= pts(without)) {
        fails.push(`opting the Scarabs into Troops did not raise the Troops points (${pts(without)} -> ${pts(withOptIn)})`);
      }
      if (!withOptIn.length && !without.length) {
        fails.push('neither list reports a Troops shortfall — this check can no longer tell them apart');
      }
    }
  }

  for (const f of fails) console.log('  ' + f);
  if (fails.length) { console.error(`\nFAIL: ${fails.length} problem(s).`); process.exit(1); }
  console.log('OK — Necron Infantry grant transport slots, a Jet Bike still does not, and opted-in Scarabs count as Troops points.');
})();
