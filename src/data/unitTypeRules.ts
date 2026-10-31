import { lookupRuleGeneric } from './coreRules';

/**
 * Core Rules "Unit Types" in short form, for the hover / tap tip on a unit card's type line.
 * Wording follows Custom40k Core Rules (Unit Types section); a type with no section there has no entry.
 */
export interface UnitTypeRule { name: string; description: string }

const HEAVY_FIRE = 'May fire "Heavy" weapons with a Move & Shoot order. Can always fire "Rapid Fire" weapons up to full range. May fire all weapon types during a Charge order with a -1 hit penalty.';
const FAST = 'Automatically advances 6" when given an Advance order. ' + HEAVY_FIRE;

const RULES: Record<string, UnitTypeRule> = {
  'infantry': { name: 'Infantry', description: 'Treated as a "creature". Follows all general rules without exceptions.' },
  'bike': { name: 'Bike', description: 'Acts like Infantry, except: cannot move vertically on terrain. ' + FAST },
  'character model': { name: 'Character Model', description: 'Acts like Infantry, except: rallies automatically if not attached; always uses its own armour and ward save; can join a creature unit (not Monstrous Creatures or Vehicles) from within 2" in the Command Phase, one Character per unit; fires one weapon or two pistols per activation unless equipment grants more. While attached it cannot be assigned wounds until the unit is destroyed, and is targeted separately in melee.' },
  'jet bike': { name: 'Jet Bike', description: 'Acts like Infantry, except: can move over (enemy) units and terrain, ignoring terrain and vertical movement costs. ' + FAST },
  'jump pack infantry': { name: 'Jump Pack Infantry', description: 'Acts like Infantry, except: can move over (enemy) units and terrain, ignoring terrain and vertical movement costs, and gains Deep Strike.' },
  'monstrous creature': { name: 'Monstrous Creature', description: 'Acts like Infantry, except: cannot be joined by a Character Model, cannot enter transports, +3 on Armor penetration rolls in melee. ' + HEAVY_FIRE },
  'monstrous infantry': { name: 'Monstrous Infantry', description: 'Acts like Infantry, except: cannot be joined by a Character Model, cannot enter transports, +2 on Armor penetration rolls in melee. ' + HEAVY_FIRE },
  'walker': { name: 'Walker', description: 'Acts like a Vehicle, except: bound by enemy units in melee like Infantry, and may change facing in its own initiative step. ' + HEAVY_FIRE },
  'vehicle': { name: 'Vehicle', description: 'Uses Armor Values and Hull Points, passes Leadership tests automatically, and is wounded by Armor penetration rolls. Charging performs a Tank Shock. Not locked in melee, but cannot shoot with an enemy in base contact.' },
  'flyer': { name: 'Flyer', description: 'Follows the creature or vehicle rules, but begins in reserve (arrives in the second Reinforcement phase), sets its Speed with order tokens, cannot benefit from cover, and cannot engage, be engaged, or hold objectives unless landed.' },
};
const KEYS = Object.keys(RULES).sort((a, b) => b.length - a.length);

/** The rule for one unit-type word group ("Jump pack Infantry", "Bike (Khymaerae only)"), or null when the Core Rules have none. */
export function lookupUnitType(part: string): UnitTypeRule | null {
  const s = part.toLowerCase().replace(/\(.*?\)/g, '').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  if (s === 'jetbike') return RULES['jet bike'];
  for (const k of KEYS) if (s === k) return RULES[k];
  // Types whose text lives in the rules glossary (Escalation supplement, the Squadron special rule), not in this table.
  if (s === 'super heavy vehicle' || s === 'gargantuan creature' || s === 'squadron') {
    const g = lookupRuleGeneric(s === 'super heavy vehicle' ? 'super-heavy vehicle' : s);
    return g ? { name: g.displayName, description: g.description } : null;
  }
  return null;
}
