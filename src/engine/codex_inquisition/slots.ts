/**
 * codex_inquisition/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted programmatically from `data/parsed/inquisition/units/<slot>/*.ts`
 * (combined-extraction pass — `name`+`unit_type` co-locate in the same file, the same cheaper
 * variant first validated for SM Pasos 1-2: see [[project_space_marines_codex_migration]]).
 * Migrated from `rules-model/inquisition.md` — VALIDATED, digest fully audited+fixed v0.56.
 *
 * Inquisition is the SMALLEST faction migrated so far: 5 slots / 13 units (vs CSM 8/62,
 * CD 6/37, SM 8/74) — no Fast Attack, no Fortifications, no Flyers slot (the 2 Flyer-typed
 * units — Corvus Blackstar, Valkyrie — are catalogued under Dedicated Transport, their actual
 * slot; "Flyer" lives in their `unit_type`, not as a separate slot. Cross-checked 13/13 against
 * the digest's roster mentions (§5 Ordo Warbands, Inquisitor, Deathcult Assassins, Land Raider
 * Prometheus) — zero drift, no typos (clean run, mirrors SM's Pasos 1-2 outcome).
 */

export interface InqSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Heavy Support' | 'Dedicated Transport';
}

// Source: data/parsed/inquisition/units/<slot>/*.ts (production, canonical for roster shape).
export const INQ_SLOTS: InqSlotEntry[] = [
  // --- HQ (1) ---
  { name: 'Inquisitor', slot: 'HQ' },

  // --- Troops (3) — "Henchman Warband" replaces the 3 old Ordo Warbands (v0.66): a single
  //     optional unit (max 6 specialist models, 12 if attached Inquisitor is an Inquisitor
  //     Lord), no Ordo gating on individual specialists (digest §12) ---
  { name: 'Arbites', slot: 'Troops' },
  { name: 'Henchman Warband', slot: 'Troops' },
  { name: 'Stormtroopers', slot: 'Troops' },

  // --- Elites (1) ---
  { name: 'Deathcult Assassins', slot: 'Elites' },

  // --- Heavy Support (1) ---
  { name: 'Land Raider Prometheus', slot: 'Heavy Support' },

  // --- Dedicated Transport (5) — incl. 2 Flyer-typed vehicles (see header note) ---
  { name: 'Chimera', slot: 'Dedicated Transport' },
  { name: 'Corvus Blackstar', slot: 'Dedicated Transport' },
  { name: 'Rhino', slot: 'Dedicated Transport' },
  { name: 'Taurox', slot: 'Dedicated Transport' },
  { name: 'Valkyrie', slot: 'Dedicated Transport' },
];
