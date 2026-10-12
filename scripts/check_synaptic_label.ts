/**
 * GH (Discord, Russian): the Tyranid biomorph "Synaptic Disruption Organ" grants a LONG unlabeled sentence, and a line with no
 * "Name: " is read as a comma list of rule names, so it showed as six "option" rows in Russian. Now it carries its own name.
 *   npx tsx scripts/check_synaptic_label.ts
 */
type Any = any;
(async () => {
  const cr: Any = await import('../src/data/coreRules');
  const g: Any = (await import('../data/parsed/tyranids/armory/general.json')).default;
  const items: Any[] = [...(g.weapons ?? []), ...(g.equipment ?? [])];
  const item = items.find(i => i.name === 'Synaptic Disruption Organ');
  let bad = 0;
  const ok = (c: boolean, m: string) => { if (!c) { bad++; console.log('FAIL', m); } else console.log('ok  ', m); };
  const line: string = item.effect.grants_abilities[0];
  ok(line.startsWith('Synaptic Disruption Organ: '), 'the granted ability carries its own name');
  for (const lang of ['en', 'de', 'es', 'ru', 'ja']) {
    cr.setRuleLanguage?.(lang);
    const parts = cr.parseAbility(line);
    ok(parts.length === 1 && !!parts[0].description, `${lang}: one ability row with its description (got ${parts.length})`);
  }
  console.log(bad ? `${bad} FAILED` : 'ok');
  process.exit(bad ? 1 : 0);
})();
