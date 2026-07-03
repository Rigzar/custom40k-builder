import { useState } from 'react';
import type { RosterEntry } from '../types/army';
import type { Unit, Power } from '../types/data';
import { useArmyStore } from '../store/army';
import { getArchetypeRule } from '../engine/archetypes';
import { GENERAL_DISCIPLINES } from '../data/generalDisciplines';
import { SM_LEGACY_DISC_MAP, SM_CRUSADER_PRAYERS } from '../engine/codex_space_marines/legacies';
import { getLegacyExtraPower } from '../engine/legacies';
import { useT } from '../i18n';

interface Props { item: RosterEntry; unit: Unit; onClose: () => void; }

type ModalTab = 'powers' | 'prayers' | 'pacts';

const MARK_NAMES = ['khorne', 'tzeentch', 'nurgle', 'slaanesh'] as const;

function isMarkOnlyDisc(name: string): boolean {
  const lc = name.toLowerCase();
  return MARK_NAMES.some(m => lc.includes(m) && lc.includes('only'));
}

function isCultOnlyDisc(name: string): boolean {
  const lc = name.toLowerCase();
  return lc.includes('cult') && lc.includes('only');
}

function isLegacyDisc(name: string): boolean {
  return name.includes('(Legacy)');
}

export function PsychicModal({ item, unit, onClose }: Props) {
  const t = useT();
  const store = useArmyStore();
  const {
    data: primaryData, alliedData, archetype: primaryArchetype, legacy: primaryLegacy, legacy2: primaryLegacy2,
    addPower, removePower, addPrayer, removePrayer, addPact, removePact,
  } = store;
  // An Allied Detachment's psyker/priest/cultist sees ITS OWN faction's disciplines/prayers/
  // pacts and its OWN archetype/legacy — this used to always read the PRIMARY's, so e.g. an
  // Eldar Allied Detachment's psyker would be shown Chaos Space Marines' psychic disciplines.
  const isAllied = !!item.factionSource && item.factionSource === store.alliedFaction;
  const data = isAllied ? alliedData : primaryData;
  const archetype = isAllied ? (store.alliedArchetype ?? '') : primaryArchetype;
  const legacy = isAllied ? (store.alliedLegacy ?? '') : primaryLegacy;
  const legacy2 = isAllied ? '' : primaryLegacy2; // ally has only one Legacy slot, no legacy2
  if (!data) return null;

  const rule = getArchetypeRule(archetype);
  const effectiveMark = unit.locked_mark ?? (rule?.forcedMark ?? null) ?? item.mark;
  const hasActiveLegacy = !!(legacy || legacy2);

  // Yngir (Necrons): "The range for each C'tan power is increased by 6"" (ods-verbatim) — only
  // for the one flagged C'tan Shard, mirrors the HQ/stat/save mods applied in resolver.ts.
  const ctanYngirActive = archetype === 'Yngir' && !!item.ctanYngirUpgrade && /^C'tan Shard/.test(unit.name);
  const bumpRange = (range: string | undefined): string | undefined => {
    if (!ctanYngirActive || !range) return range;
    const m = range.match(/^(\d+)"$/);
    return m ? `${parseInt(m[1], 10) + 6}"` : range;
  };

  // GK legacy power: each legacy grants all psykers one fixed always-known power.
  // Same display pattern as Smite ("Always known" badge). Null for all other factions.
  const legacyPower = getLegacyExtraPower(data.faction, legacy ?? legacy2 ?? '');

  const isSMFaction = data.faction === 'Space Marines';
  const hasCrusaderLegacy = legacy === 'Legacy of the Crusader' || legacy2 === 'Legacy of the Crusader';

  const filteredPrayers = (data.prayers ?? []).filter(p => {
    if (isSMFaction && SM_CRUSADER_PRAYERS.has(p.name)) return hasCrusaderLegacy;
    return true;
  });

  const hasPowers = unit.is_psyker;
  const hasPrayers = unit.is_priest && filteredPrayers.length > 0;
  const hasPacts = !!(unit.uses_pacts) && (data.pacts ?? []).length > 0;
  // SOURCE: Cult initiate armory item — "The model may exchange one psychic power it knows
  // with one from the list of 'Cult Powers'." pU:0 pC:0 (free). Grants cult power access
  // when purchased, even if the unit's datasheet doesn't have is_cult_initiate set.
  const hasCultInitiateItem = item.armory.some(a => a.itemName === 'Cult initiate');
  const isCultInitiate = !!(unit.is_cult_initiate) || hasCultInitiateItem;

  const defaultTab: ModalTab = hasPowers ? 'powers' : hasPrayers ? 'prayers' : 'pacts';
  const [tab, setTab] = useState<ModalTab>(defaultTab);

  // ── Discipline filtering ──────────────────────────────────────────────────
  // Cult initiates (Dark Commune) see ONLY Cult Powers — no General, no other faction discs
  // All other psykers see General + faction discs EXCLUDING cult-only ones
  const factionDiscs = Object.entries(data.disciplines ?? {}).filter(([name]) => {
    if (isCultOnlyDisc(name)) return isCultInitiate;  // Cult Powers only for cult initiates
    if (isCultInitiate) return false;                 // Cult initiates see ONLY Cult Powers
    if (isMarkOnlyDisc(name)) {
      if (!effectiveMark || effectiveMark === 'Undivided') return false;
      const lc = name.toLowerCase();
      return MARK_NAMES.some(m => lc.includes(m) && effectiveMark.toLowerCase() === m);
    }
    if (isLegacyDisc(name)) {
      if (isSMFaction) {
        const required = SM_LEGACY_DISC_MAP[name];
        if (!required) return hasActiveLegacy;
        return legacy === required || legacy2 === required;
      }
      return hasActiveLegacy;
    }
    return true;
  });

  const generalDiscs = isCultInitiate ? [] : Object.entries(GENERAL_DISCIPLINES);
  let allowedDiscs = [...generalDiscs, ...factionDiscs];

  // CD: per-unit discipline access derived from psyker ability text.
  // Each unit lists exactly which disciplines it knows — enforce that here.
  if (data.faction === 'Chaos Daemons' && hasPowers) {
    const psykerLine = (unit.abilities ?? []).find(a => /^psyker:/i.test(a)) ?? '';
    const lc = psykerLine.toLowerCase();
    // "chosen discipline" (Daemon Prince) = no restriction — can pick any
    if (!lc.includes('chosen discipline')) {
      const allowsGenerals = lc.includes('all general disciplines');
      allowedDiscs = allowedDiscs.filter(([discName]) => {
        // Is it a general discipline?
        if (Object.prototype.hasOwnProperty.call(GENERAL_DISCIPLINES, discName)) return allowsGenerals;
        // Faction (god-specific) discipline — check unit ability mentions it
        const dn = discName.toLowerCase();
        if (dn.includes('change')) return lc.includes('discipline of change');
        if (dn.includes('decay'))  return lc.includes('discipline of decay');
        if (dn.includes('excess')) return lc.includes('discipline of excess');
        return true;
      });
    }
  }

  // Necrons: every is_psyker unit (C'tan Shards + named variants, Dynasty Phaeron, Tesseract
  // Vault) is explicitly "Powers of the C'tan: ... knows all the powers from the list of C'tan
  // powers" (ods-verbatim) — there is no generic-discipline-access wording for any of them, so
  // unlike every other faction they never see GENERAL_DISCIPLINES at all, only their own "Powers".
  if (data.faction === 'Necrons' && hasPowers) {
    allowedDiscs = allowedDiscs.filter(([discName]) => !Object.prototype.hasOwnProperty.call(GENERAL_DISCIPLINES, discName));
  }

  // Eldar: each faction discipline is tagged "(X only)" in its key — enforce unit-identity
  // restrictions so e.g. the Wraithseer only sees "Wraith (Wraithseer only)" and the Warlocks
  // only see "Battle (Warlocks only)". Units with no matching tag (Spiritseer, Yncarne without
  // Ynnari archetype) see only general disciplines, which is correct per the .ods.
  if (data.faction === 'Eldar' && hasPowers) {
    allowedDiscs = allowedDiscs.filter(([discName]) => {
      const lc = discName.toLowerCase();
      if (lc.includes('warlocks only')) return unit.name === 'Warlocks';
      if (lc.includes('farseers only')) return unit.name === 'Farseer';
      if (lc.includes('wraithseer only')) return unit.name === 'Wraithseer';
      if (lc.includes('ynnari only')) return archetype === 'Ynnari';
      return true;
    });
  }

  // ── Psyker mechanic from ability text ────────────────────────────────────────
  // SOURCE: core_rules_text.txt L1009-1012 — "If a psyker is limited in the number
  // of powers it knows, they must be selected when creating the army list."
  // The ability text on the datasheet defines:
  //   "all powers from a chosen discipline"  → mode:'all_from_one'  (pick 1 disc, get all 6)
  //   "one psychic power of a chosen discipline" → mode:'one_from_one' (pick 1 disc, pick 1)
  //   "N powers from chosen disciplines"     → mode:'n_from_any', limit N (pick N from any)
  //   "knows Smite" always means Smite is a fixed known power, not selected by the player.
  const psykerAbilityText = (unit.abilities ?? [])
    .find(a => /^psyker:/i.test(a))?.toLowerCase() ?? '';

  type PsykerMode = 'all_from_one' | 'one_from_one' | 'n_from_any' | 'unlimited';
  function parsePsykerMode(): { mode: PsykerMode; limit: number; knowsSmite: boolean } {
    const knowsSmite = psykerAbilityText.includes('smite');
    // "all powers from a chosen discipline" (CSM/generic) OR "all powers from the discipline of X"
    // (CD god-specific) OR "all powers from the X discipline" (unit-specific, e.g. Wraithseer)
    if (psykerAbilityText.includes('all powers from a chosen discipline') ||
        psykerAbilityText.includes('all powers from the discipline') ||
        /all powers from the \w+ discipline/.test(psykerAbilityText))
      return { mode: 'all_from_one', limit: 999, knowsSmite };
    // "one power of a chosen discipline" (CSM/generic) OR "one power from the discipline of X" (CD)
    if (psykerAbilityText.match(/one (psychic )?power (of a chosen|from the) discipline/))
      return { mode: 'one_from_one', limit: 1, knowsSmite };
    const nMatch = psykerAbilityText.match(/(\d+)\s+powers?\s+from/);
    if (nMatch) return { mode: 'n_from_any', limit: parseInt(nMatch[1]), knowsSmite };
    return { mode: 'unlimited', limit: 999, knowsSmite };
  }
  const { mode: psykerMode, limit: powerLimit, knowsSmite } = parsePsykerMode();

  // "Psychic training" equipment: each copy adds +1 power slot.
  // SOURCE: "The model knows one additional psychic power from one of their chosen disciplines.
  //          Can be taken multiple times."
  const psychicTrainingCount = item.armory.filter(a => a.itemName === 'Psychic training').length;
  // "Baleful tome" (General armoury): "select a psychic power from the general psychic powers or
  // the Chaos psychic powers" — a separate once-per-game pick, same shape as Psychic training for
  // list-building purposes (the once-per-game/1D6-activation flavour is a procedural in-game rule,
  // not enforced here, matching how the rest of the engine treats procedural-only text).
  const balefulTomeCount = item.armory.filter(a => a.itemName === 'Baleful tome').length;
  const bonusPowerSlots = psychicTrainingCount + balefulTomeCount;
  const effectivePowerLimit = psykerMode === 'all_from_one'
    ? powerLimit  // all_from_one unlocks the whole discipline, training/tome add extra picks
    : powerLimit + bonusPowerSlots;

  // Chosen discipline: in 'all_from_one' mode, the player picks ONE discipline and
  // knows ALL its powers. We store the chosen discipline as the first power's disciplineName
  // with the special name '__discipline__' so it persists in the roster.
  // For other modes, any power can be freely added up to the limit.
  const chosenDisc = psykerMode === 'all_from_one'
    ? item.powers.find(p => p.powerName === '__discipline__')?.disciplineName ?? null
    : null;

  function isPowerSelected(disc: string, power: string) {
    if (psykerMode === 'all_from_one') {
      // Powers are "known" implicitly when the discipline is chosen — not stored individually
      return chosenDisc === disc;
    }
    return item.powers.some(p => p.disciplineName === disc && p.powerName === power);
  }

  function chooseAllFromDisc(discName: string) {
    // Remove any existing discipline choice, then set the new one
    const existing = item.powers.find(p => p.powerName === '__discipline__');
    if (existing) removePower(item.id, existing.disciplineName, '__discipline__');
    if (chosenDisc !== discName) addPower(item.id, discName, '__discipline__');
  }

  function togglePower(disc: string, power: string) {
    if (psykerMode === 'all_from_one') {
      chooseAllFromDisc(disc);
      return;
    }
    if (isPowerSelected(disc, power)) {
      removePower(item.id, disc, power);
    } else {
      // Enforce per-selection limit for 'one_from_one' and 'n_from_any'
      const selectedCount = item.powers.filter(p => p.powerName !== '__discipline__').length;
      if (psykerMode !== 'unlimited' && selectedCount >= effectivePowerLimit) return; // already at limit
      addPower(item.id, disc, power);
    }
  }

  function isPrayerSelected(prayerName: string) {
    return item.prayers.includes(prayerName);
  }
  function togglePrayer(prayerName: string) {
    if (isPrayerSelected(prayerName)) removePrayer(item.id, prayerName);
    else addPrayer(item.id, prayerName);
  }

  function isPactSelected(pactName: string) {
    return (item.pacts ?? []).includes(pactName);
  }
  function togglePact(pactName: string) {
    if (isPactSelected(pactName)) removePact(item.id, pactName);
    else addPact(item.id, pactName);
  }

  const tabCount = [hasPowers, hasPrayers, hasPacts].filter(Boolean).length;

  // Power count display (excluding the discipline marker)
  const selectedPowersCount = item.powers.filter(p => p.powerName !== '__discipline__').length;
  // Label for the powers button
  const powersLabel = isCultInitiate ? t('cultPowersLabel') : t('psychicPowersLabel');

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-6 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <h3 className="text-amber-400 uppercase tracking-widest text-sm">
            {hasPowers && hasPrayers ? `${powersLabel} ${t('andPrayersSuffix')}`
              : hasPowers && hasPacts ? `${powersLabel} ${t('andPactsSuffix')}`
              : hasPrayers && hasPacts ? t('prayersAndPactsLabel')
              : hasPrayers ? t('prayersLabel')
              : hasPacts ? t('infernalPactsLabel')
              : powersLabel} — {unit.name}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Tab selector — shown when the unit has more than one type */}
        {tabCount > 1 && (
          <div className="flex border-b border-zinc-700">
            {hasPowers && (
              <button
                onClick={() => setTab('powers')}
                className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                  ${tab === 'powers' ? 'border-amber-600 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                {powersLabel} {psykerMode === 'all_from_one'
                  ? `(${chosenDisc ? chosenDisc : t('noDisciplineChosenWord')})`
                  : `(${selectedPowersCount}${psykerMode !== 'unlimited' ? '/' + effectivePowerLimit : ''})`}
              </button>
            )}
            {hasPrayers && (
              <button
                onClick={() => setTab('prayers')}
                className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                  ${tab === 'prayers' ? 'border-amber-600 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                {t('prayersLabel')} ({item.prayers.length})
              </button>
            )}
            {hasPacts && (
              <button
                onClick={() => setTab('pacts')}
                className={`px-4 py-2 text-[11px] uppercase tracking-wide border-b-2 transition-colors
                  ${tab === 'pacts' ? 'border-amber-600 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                {t('infernalPactsLabel')} ({(item.pacts ?? []).length})
              </button>
            )}
          </div>
        )}

        <div className="overflow-y-auto flex-1 p-3 space-y-4">
          {/* ── Psychic / Cult Powers ── */}
          {tab === 'powers' && hasPowers && (
          <div className="space-y-4">

            {/* Smite — always known, fixed, not selectable (SOURCE: "It knows Smite") */}
            {knowsSmite && (
              <div className="px-3 py-2 bg-amber-900/20 border border-amber-800/60 rounded-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-amber-800 text-amber-200 px-1.5 py-px uppercase tracking-wide font-bold">{t('alwaysKnownBadge')}</span>
                  <span className="text-amber-300 font-semibold text-sm">Smite</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{t('smiteCastLine')}</div>
              </div>
            )}

            {/* Legacy power — always known, granted by active legacy (GK only) */}
            {legacyPower && (
              <div className="px-3 py-2 bg-amber-900/20 border border-amber-800/60 rounded-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-amber-800 text-amber-200 px-1.5 py-px uppercase tracking-wide font-bold">{t('alwaysKnownBadge')}</span>
                  <span className="text-amber-300 font-semibold text-sm">{legacyPower.name}</span>
                  <span className="text-[9px] text-zinc-500 ml-auto">{t('legacyTag')}</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  {t('castLabel')} {legacyPower.details.cast_value} · {legacyPower.details.type} · {legacyPower.details.duration} — {legacyPower.details.effect}
                </div>
              </div>
            )}

            {/* Mode indicator — explains the selection rule from the psyker ability */}
            {psykerMode === 'all_from_one' && (
              <div className="text-[11px] text-zinc-400 border-l-2 border-amber-800 pl-2 italic">
                {t('chooseWord')} <strong className="text-amber-400 not-italic">{t('oneDisciplineLabel')}</strong> {t('modeAllFromOneMid')} <strong className="text-amber-400 not-italic">{t('allItsPowersLabel')}</strong>.
                {chosenDisc
                  ? <span className="text-amber-300 not-italic ml-1">{t('selectedPrefix')} <strong>{chosenDisc}</strong></span>
                  : <span className="text-zinc-500 not-italic ml-1">{t('noneChosenYet')}</span>}
              </div>
            )}
            {psykerMode === 'one_from_one' && (
              <div className="text-[11px] text-zinc-400 border-l-2 border-amber-800 pl-2 italic">
                {t('chooseWord')} <strong className="text-amber-400 not-italic">{t('onePowerLabel')}</strong> {t('fromWord')} <strong className="text-amber-400 not-italic">{t('oneDisciplineLabel')}</strong>.
                <span className="text-zinc-500 not-italic ml-1">({selectedPowersCount}/{powerLimit} {t('selectedCountSuffix')})</span>
              </div>
            )}
            {psykerMode === 'n_from_any' && (
              <div className="text-[11px] text-zinc-400 border-l-2 border-amber-800 pl-2 italic">
                {t('modeNFromAnyPart1')} <strong className="text-amber-400 not-italic">{powerLimit} {t('powersWord')}</strong> {t('modeNFromAnyPart2')}.
                <span className={`not-italic ml-1 ${selectedPowersCount >= effectivePowerLimit ? 'text-amber-500' : 'text-zinc-500'}`}>({selectedPowersCount}/{effectivePowerLimit} {t('selectedCountSuffix')})</span>
              </div>
            )}

            {/* Disciplines */}
            {allowedDiscs.length === 0 ? (
              <div className="text-zinc-500 italic text-sm text-center py-8">
                {t('noDisciplinesAvailable')}
              </div>
            ) : (
              allowedDiscs.map(([discName, powers]) => {
                const isChosen = psykerMode === 'all_from_one' && chosenDisc === discName;
                const atLimit = psykerMode !== 'unlimited' && psykerMode !== 'all_from_one'
                  && selectedPowersCount >= effectivePowerLimit;
                return (
                  <div key={discName}>
                    {/* Discipline header — clickable in all_from_one mode */}
                    <div
                      className={`flex items-center justify-between text-[11px] uppercase tracking-widest border-b pb-1 mb-2
                        ${psykerMode === 'all_from_one'
                          ? `cursor-pointer ${isChosen ? 'border-amber-600 text-amber-400' : 'border-zinc-700 text-zinc-500 hover:text-amber-600 hover:border-amber-800'}`
                          : 'border-zinc-700 text-amber-700 cursor-default'}`}
                      onClick={() => psykerMode === 'all_from_one' && chooseAllFromDisc(discName)}
                    >
                      <span>{discName}</span>
                      {psykerMode === 'all_from_one' && (
                        <span className={`text-[9px] px-1.5 py-px border font-bold normal-case tracking-normal ${isChosen ? 'bg-amber-800 border-amber-600 text-amber-200' : 'border-zinc-700 text-zinc-600'}`}>
                          {isChosen ? t('chosenBadge') : t('chooseWord')}
                        </span>
                      )}
                    </div>

                    {/* Powers list — in all_from_one: shown as "all included when discipline chosen".
                        Smite is filtered out here — it's already shown as "Always known" above. */}
                    <div className="space-y-1">
                      {(powers as Power[]).filter(p => !(knowsSmite && p.name === 'Smite')).map(p => {
                        const sel = psykerMode === 'all_from_one' ? isChosen : isPowerSelected(discName, p.name);
                        const disabled = !sel && atLimit;
                        return (
                          <button
                            key={p.name}
                            disabled={disabled}
                            onClick={() => psykerMode !== 'all_from_one' && togglePower(discName, p.name)}
                            className={`w-full text-left px-3 py-2 border transition-colors
                              ${sel
                                ? 'bg-amber-900/30 border-amber-700 text-amber-300'
                                : disabled
                                  ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                                  : psykerMode === 'all_from_one'
                                    ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-default'
                                    : 'bg-zinc-800 border-zinc-700 hover:border-amber-700 hover:bg-zinc-700 text-zinc-200'
                              }`}
                          >
                            <div className="text-sm font-medium flex items-center gap-1.5">
                              {p.name}
                              {psykerMode === 'all_from_one' && isChosen && (
                                <span className="text-[8px] text-amber-600 uppercase tracking-wide">{t('includedBadge')}</span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">
                              {[p.type, bumpRange(p.range), p.cast_value ? `Cast: ${p.cast_value}` : null]
                                .filter(Boolean).join(' · ')}
                            </div>
                            {p.effect && (
                              <div className="text-[11px] text-zinc-400 mt-1">{p.effect}</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>)}

          {/* ── Prayers ── */}
          {tab === 'prayers' && hasPrayers && (
            <div className="space-y-1">
              {(filteredPrayers as Power[]).map(p => {
                const sel = isPrayerSelected(p.name);
                return (
                  <button
                    key={p.name}
                    onClick={() => togglePrayer(p.name)}
                    className={`w-full text-left px-3 py-2 border transition-colors
                      ${sel
                        ? 'bg-amber-900/30 border-amber-700 text-amber-300'
                        : 'bg-zinc-800 border-zinc-700 hover:border-amber-700 hover:bg-zinc-700 text-zinc-200'
                      }`}
                  >
                    <div className="text-sm font-medium">{p.name}</div>
                    {p.effect && (
                      <div className="text-[11px] text-zinc-400 mt-1">{p.effect}</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Infernal Pacts ── */}
          {tab === 'pacts' && hasPacts && (
            <div className="space-y-1">
              {(data.pacts as Power[]).map(p => {
                const sel = isPactSelected(p.name);
                return (
                  <button
                    key={p.name}
                    onClick={() => togglePact(p.name)}
                    className={`w-full text-left px-3 py-2 border transition-colors
                      ${sel
                        ? 'bg-amber-900/30 border-amber-700 text-amber-300'
                        : 'bg-zinc-800 border-zinc-700 hover:border-amber-700 hover:bg-zinc-700 text-zinc-200'
                      }`}
                  >
                    <div className="text-sm font-medium">{p.name}</div>
                    {p.effect && (
                      <div className="text-[11px] text-zinc-400 mt-1">{p.effect}</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-end bg-zinc-800">
          <button onClick={onClose} className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
