import { useState } from 'react';
import { useArmyStore } from '../store/army';
import {
  getAlliableWith,
  getRelationship,
  RELATIONSHIP_COLORS,
  type Relationship,
} from '../data/alliedMatrix';
import { useT, type TranslationKey } from '../i18n';

const REL_LABEL_KEY: Record<Relationship, TranslationKey> = {
  G: 'relBattleBrothers', Y: 'relAlliesOfConvenience', R: 'relDesperateAllies',
};
const REL_DESC_KEY: Record<Relationship, TranslationKey> = {
  G: 'relBattleBrothersDesc', Y: 'relAlliesOfConvenienceDesc', R: 'relDesperateAlliesDesc',
};

const FACTION_NAMES: Record<string, string> = {
  chaos_space_marines:  'Chaos Space Marines',
  chaos_daemons:        'Chaos Daemons',
  space_marines:        'Space Marines',
  imperial_guard:       'Imperial Guard',
  adeptus_mechanicus:   'Adeptus Mechanicus',
  adeptus_custodes:     'Adeptus Custodes',
  adeptus_sororitas:    'Adeptus Sororitas',
  grey_knights:         'Grey Knights',
  inquisition:          'Inquisition',
  assassins:            'Assassins',
  tau_empire:           'Tau Empire',
  necrons:              'Necrons',
  orks:                 'Orks',
  eldar:                'Eldar',
  dark_eldar:           'Dark Eldar',
  genestealer_cults:    'Genestealer Cults',
  harlequins:           'Harlequins',
  leagues_of_votann:    'Leagues of Votann',
  tyranids:             'Tyranids',
  horus_heresy:         'Horus Heresy Space Marines',
};

function RelationshipBadge({ rel }: { rel: Relationship }) {
  const t = useT();
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide ${RELATIONSHIP_COLORS[rel]}`}>
      {t(REL_LABEL_KEY[rel])}
    </span>
  );
}

function FactionPicker({
  primaryFaction,
  onSelect,
  onCancel,
}: {
  primaryFaction: string;
  onSelect: (key: string) => void;
  onCancel: () => void;
}) {
  const t = useT();
  const options = getAlliableWith(primaryFaction);
  const groups: Relationship[] = ['G', 'Y', 'R'];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[11px] text-zinc-400">{t('selectAlliedFaction')}</span>
        <button
          onClick={onCancel}
          className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {t('cancel')}
        </button>
      </div>
      {groups.map(rel => {
        const inGroup = options.filter(o => o.relationship === rel);
        if (inGroup.length === 0) return null;
        return (
          <div key={rel}>
            <div className={`text-[10px] uppercase tracking-widest mb-1 ${RELATIONSHIP_COLORS[rel]}`}>
              {t(REL_LABEL_KEY[rel])}
            </div>
            <div className="space-y-0.5">
              {inGroup.map(({ key }) => (
                <button
                  key={key}
                  onClick={() => onSelect(key)}
                  className="w-full flex justify-between items-center px-2 py-1.5 text-left text-[12px] border border-zinc-700/50 hover:border-amber-800 hover:bg-zinc-700 hover:text-amber-400 transition-colors group"
                >
                  <span className="text-zinc-200 group-hover:text-amber-400">
                    {FACTION_NAMES[key] ?? key}
                  </span>
                  <RelationshipBadge rel={rel} />
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Allied Detachment's unit catalogue is rendered by the shared `SlotPanel` component with
 * `scope="allied"` (see App.tsx's Allied tab) — that component reads data.allied[alliedFaction]
 * directly, so this file no longer needs its own duplicate slot/catalogue implementation.
 */

/**
 * Allied Detachment's OWN Army Customisation is rendered by the shared `ArmyConfig` component
 * with `scope="allied"` (see App.tsx's Allied tab) — that component reads alliedData/
 * alliedArchetype/alliedLegacy/alliedTraitPool directly, so this file no longer needs its own
 * duplicate Archetype/Legacy/Traits implementation.
 */

/**
 * Sidebar widget: lets the player attach/detach the allied detachment and shows the relationship
 * at a glance. Once attached, its own Army Customisation and unit catalogue live in the dedicated
 * "Allied: <faction>" tab (App.tsx) — not here — so the two armies stay visually separate.
 */
export function AlliedDetachmentPanel({ primaryFaction, tabOpen, onOpenTab }: {
  primaryFaction: string | null;
  /** Whether the "Allied: X" tab is currently open — closing it (×) only hides the tab, it
   * never deletes the ally's roster, so this widget needs a way back in. */
  tabOpen?: boolean;
  onOpenTab?: () => void;
}) {
  const t = useT();
  const { alliedFaction, setAlliedFaction, engagement } = useArmyStore();
  const [showPicker, setShowPicker] = useState(false);

  if (!primaryFaction) return null;

  // Missions.txt (Skirmish): "No allies may be included. No Archetypes may be selected."
  if (engagement === 'skirmish') {
    return (
      <div className="text-[11px] text-zinc-500 italic border border-zinc-800 px-3 py-2 bg-zinc-950/50 text-center">
        {t('alliedNotInSkirmish')}
      </div>
    );
  }

  // ── No allied faction selected ───────────────────────────────────────────
  if (!alliedFaction) {
    if (showPicker) {
      return (
        <FactionPicker
          primaryFaction={primaryFaction}
          onSelect={key => {
            setAlliedFaction(key);
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
        />
      );
    }

    return (
      <button
        onClick={() => setShowPicker(true)}
        className="w-full text-[12px] text-zinc-400 hover:text-amber-400 border border-dashed border-zinc-600 hover:border-amber-800 py-2 transition-colors text-center"
      >
        {t('addAlliedDetachment')}
      </button>
    );
  }

  // ── Allied faction selected ──────────────────────────────────────────────
  const rel = getRelationship(primaryFaction, alliedFaction);
  const factionLabel = FACTION_NAMES[alliedFaction] ?? alliedFaction;

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex items-center gap-1.5">
          <span className="text-[12px]">🤝</span>
          <div>
            <div className="text-[12px] text-zinc-200 font-medium truncate">{factionLabel}</div>
            {rel && <RelationshipBadge rel={rel} />}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {!tabOpen && onOpenTab && (
            <button
              onClick={onOpenTab}
              title={t('reopenAlliedTab')}
              className="text-[11px] text-emerald-500 hover:text-emerald-300 border border-emerald-800 hover:border-emerald-600 px-2 py-0.5 transition-colors"
            >
              {t('openLabel')}
            </button>
          )}
          <button
            onClick={() => { if (confirm(`${t('removeAlliedConfirmPart1')} ${factionLabel} ${t('removeAlliedConfirmPart2')}`)) setAlliedFaction(null); }}
            title={t('removeAlliedTitle')}
            className="text-[11px] text-zinc-500 hover:text-red-400 border border-zinc-700 hover:border-red-800 px-2 py-0.5 transition-colors"
          >
            {t('removeUnit')}
          </button>
        </div>
      </div>

      {/* Relationship description */}
      {rel && (
        <p className="text-[11px] text-zinc-500 leading-snug">
          {t(REL_DESC_KEY[rel])}
        </p>
      )}

      <p className="text-[11px] text-emerald-500/80 leading-snug border-l-2 border-emerald-800 pl-2">
        {t('alliedInfoIntro')} <span className="font-semibold">🤝 {t('tabAllied')}: {factionLabel}</span>{tabOpen ? t('alliedInfoStatusOpen') : t('alliedInfoStatusClosed')}{t('alliedInfoIndependentPrefix')} {FACTION_NAMES[primaryFaction] ?? primaryFaction}{t('alliedInfoPossessiveSuffix')}
      </p>
    </div>
  );
}
