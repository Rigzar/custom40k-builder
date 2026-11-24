/**
 * Items and options that change the bearer's profile: what their TEXT says against what the parsers read.
 *   npx tsx scripts/check_stat_items.ts
 * Found by buying every Armory item and every option and reading the resolved profile (2026-11-24): the bonus of an item with an aura
 * phrase anywhere in its text was dropped (Shard of the Monolith, the banners), "once per game" bonuses showed as permanent (Shield
 * Bearer, Moment Shackle), vehicle Movement upgrades never showed, and 15 option upgrades paid for a stat they never gave.
 */
import { parseEquipMods, parseOptionText } from '../src/engine/equipMods';
import { applyEquipDeltas } from '../src/utils/statMods';
let failed = 0;
const check = (ok: boolean, msg: string) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) failed++; };
const eq = (name: string, desc: string) => parseEquipMods([{ name, desc }]);

// bearer's own sentence counts even when another sentence names enemies / an attached unit
let m = eq('Shard of the Monolith', 'The model gains +1 Strength and +1 Initiative. It may never use a "Stand & Shoot" order voluntarily and must always move closer to the nearest enemy unit, if possible.');
check(m.statDeltas.S === 1 && m.statDeltas.I === 1, 'Shard of the Monolith: +1 S and +1 I');
m = eq('Crusade of Wrath', 'The model and its attached unit gain +1 Strength. Unique.');
check(m.statDeltas.S === 1, 'model and its attached unit: the bearer gets +1 S');
m = eq('Enhanced data-tether', 'The model and its attached unit gains a +1 Leadership.');
check(m.statDeltas.LD === 1, 'data-tether: +1 LD');
m = eq('Chapter banner', 'The unit gains a bonus of +1 to Leadership and Combat resolutions. As long as the banner bearer is alive, Mission objectives that are held by this unit can not be contested by enemy units. Additionally, all models in the unit gain +1 Attack. Unique.');
check(m.statDeltas.LD === 1 && m.statDeltas.A === 1, 'banner: +1 LD and +1 A');
m = eq('Lord of Death', 'The model gains +1 Strength and +1 Toughness. If you pass a Leadership test during your activation, all melee attacks against one single enemy model in direct base contact may re-roll.');
check(m.statDeltas.S === 1 && m.statDeltas.T === 1, 'Lord of Death: +1 S +1 T');

// not the bearer's, or not permanent
m = eq('Atomic Energy Manipulator', 'Once per game, the model can boost a friendly <Canoptek> or <Necron> creature unit within 3" range. Roll 1D3:\n1 - The unit gains +1 Strength.\n2 - The unit gains +1 Toughness.\n3 - The unit gets +1 BS and +1 WS.\nCharacter models cannot be upgraded. Unique.');
check(Object.keys(m.statDeltas).length === 0, 'Atomic Energy Manipulator: nothing for its bearer');
m = eq('Moment Shackle', 'Once per battle, the model gains +2 Attacks and may reroll 1s for their ward saves until the end of the battle round. Unique.');
check(m.statDeltas.A === undefined, 'Moment Shackle: the once-per-battle +2 Attacks is not permanent');
m = eq('Shield Bearer', 'Once per game, the model may gain a 3+ ward save until the start of its next activation. Unique.');
check(m.invulnSave === null, 'Shield Bearer: no permanent ward');
m = eq('Auric Aquila', 'The model gains a 4+ ward save. Additionally, once per game, the model may gain a 3+ ward save until the start of its next activation. Unique.');
check(m.invulnSave === 4, 'Auric Aquila: 4+ ward, not the once-per-game 3+');
m = eq('Gyrotemporal vault', 'If the model successfully manifested a psychic power during its activation, it gains +1 Initiative until the beginning of its next activation. Unique.');
check(m.statDeltas.I === undefined, 'Gyrotemporal vault: conditional +1 I not permanent');
m = eq('Charismatic leadership', 'The model gains +1 Leadership, but loses this bonus if it ever flees.');
check(m.statDeltas.LD === 1, 'Charismatic leadership: the bonus comes first, the "if" is a later loss');
m = eq('Korvidine Pattern Jump Pack', 'The model gains +1" Movement when equipped with a Jump pack.');
check(m.statDeltas.M === 1, 'Korvidine: "when equipped with" names gear, not a moment');
m = eq('Aura of Fervor', 'The model and its attached unit gain +1 Attack until the end of the current battle round, when they perform a Charge command.');
check(m.statDeltas.A === undefined, 'Aura of Fervor: temporary');

// vehicles take Movement (and BS / WS), nothing else
const v = applyEquipDeltas({ M: '12"', S: '7', A: '1' }, { statDeltas: { M: 2, S: 1, A: 1 }, statSets: {}, armorSave: null, invulnSave: null, grantedAbilities: [] }, true);
check(v.M === '14"' && v.S === '7' && v.A === '1', 'vehicle: +2" Movement applies, +1 S / +1 A do not');

// options that state their change only as text
let o = parseOptionText('The model gains +2 Attacks.', new Set());
check(o.statDeltas.A === 2, 'Grasping Pseudopods: +2 A');
o = parseOptionText('The model gains a 5+ armor save.', new Set());
check(o.armorSave === 5, 'Subcutaneous Armor: 5+ save');
o = parseOptionText('The model gains +1 Strength and +1 Toughness.', new Set(['T']));
check(o.statDeltas.S === 1 && o.statDeltas.T === undefined, 'a stat the option already declares is not added twice');

console.log(failed ? `\n${failed} failure(s)` : '\nall ok');
process.exit(failed ? 1 : 0);
