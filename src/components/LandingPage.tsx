import { useState } from 'react';
import { useArmyStore } from '../store/army';
import { ArmyConfig } from './ArmyConfig';
import { ChangelogModal } from './ChangelogModal';
import { LegalFooter } from './LegalModal';
import { LanguageSelector } from './LanguageSelector';
import { SupplementModal, type SupplementKey } from './SupplementModal';
import { useT, useLanguage, type Language, type TranslationKey } from '../i18n';
import type { SavedArmy } from '../hooks/useSavedArmies';
import { CHANGELOG } from '../data/changelog';

const ANNOUNCEMENT_KEY = 'c40k_announcement_v5_dismissed';

type AnnouncementLang = { title: string; intro: string; engine: string; csm: string; cd: string; sm: string; legacyfix: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: 'Developer Update — from rigzar',
    intro: "Hello everyone! I'm rigzar. This is a major engine update — the builder has been rebuilt from the ground up with a new data architecture. Every faction now has its own folder with separate files for units, armory, psychic disciplines, archetypes and rules. This makes the data easier to audit, fix and contribute to.",
    engine: '⚙ New engine — per-faction data folders, typed unit types, typed keyword constants, canonical rule text embedded alongside every engine rule as a reference. Legacy armory tabs are now properly linked to the legacy you select for all 19 factions.',
    csm: '✓ Chaos Space Marines — Beta. Armory, legacies, traits, archetypes, Black Crusade all wired. Canonical rule text verified in engine.',
    cd:  '✓ Chaos Daemons — Beta. God disciplines, armory, mark rules, Daemonkin archetypes. Canonical rule text verified.',
    sm:  '✓ Space Marines — Beta. Chapter legacies with disciplines and prayers, 8 archetypes, 19 traits, Gravis/Terminator armory gating. Canonical rule text verified.',
    legacyfix: '🔧 Bug fix — legacy armory tabs were not showing for Space Marines and several other factions. Fixed in this update. If you had a saved list with a Legacy selected, re-open the armory to see the chapter items.',
    contrib: '👷 Want to help? New contributor guides at CONTRIBUTING.md — translation guide, empty file templates, issue templates on GitHub for rules questions and code fixes. No coding required to contribute data or answer rules questions!',
  },
  de: {
    title: 'Entwickler-Update — von rigzar',
    intro: 'Hallo zusammen! Ich bin rigzar. Dies ist ein großes Engine-Update — der Builder wurde von Grund auf mit einer neuen Datenarchitektur neu aufgebaut. Jede Fraktion hat jetzt einen eigenen Ordner mit separaten Dateien für Einheiten, Rüstkammer, Disziplinen, Archetypen und Regeln.',
    engine: '⚙ Neue Engine — fraktionseigene Datenordner, typisierte Einheitentypen und Keywords, kanonischer Regeltext neben jedem Engine-Regelcode. Legacy-Rüstkammer-Tabs sind jetzt für alle 19 Fraktionen korrekt verknüpft.',
    csm: '✓ Chaos Space Marines — Beta. Rüstkammer, Vermächtnisse, Eigenschaften, Archetypen, Schwarzer Kreuzzug vollständig verkabelt.',
    cd:  '✓ Chaos-Dämonen — Beta. Götterdisziplinen, Rüstkammer, Mal-Regeln, Daemonkin-Archetypen.',
    sm:  '✓ Space Marines — Beta. Kapitel-Vermächtnisse mit Disziplinen und Gebeten, 8 Archetypen, 19 Eigenschaften, Gravis/Terminator-Rüstkammer-Gating.',
    legacyfix: '🔧 Bugfix — Legacy-Rüstkammer-Tabs wurden für Space Marines und andere Fraktionen nicht angezeigt. In diesem Update behoben.',
    contrib: '👷 Mitmachen? Neue Beitragsanleitungen unter CONTRIBUTING.de.md — Übersetzungsleitfaden, leere Dateivorlagen, GitHub Issue-Vorlagen.',
  },
  es: {
    title: 'Actualización del desarrollador — de rigzar',
    intro: '¡Hola a todos! Soy rigzar. Esta es una actualización mayor del motor — el builder fue reconstruido desde cero con una nueva arquitectura de datos. Cada facción tiene ahora su propia carpeta con archivos separados para unidades, armería, disciplinas, arquetipos y reglas.',
    engine: '⚙ Motor nuevo — carpetas de datos por facción, tipos de unidad tipados, constantes de keywords tipadas, texto canónico de reglas junto a cada regla del motor. Las pestañas de armería de Legacy ahora están correctamente vinculadas en las 19 facciones.',
    csm: '✓ Chaos Space Marines — Beta. Armería, legados, rasgos, arquetipos, Cruzada Negra totalmente cableados.',
    cd:  '✓ Demonios del Caos — Beta. Disciplinas divinas, armería, reglas de marca, arquetipos Daemonkin.',
    sm:  '✓ Space Marines — Beta. Legados de capítulo con disciplinas y plegarias, 8 arquetipos, 19 rasgos, gating de armería Gravis/Terminator.',
    legacyfix: '🔧 Corrección — las pestañas de armería de Legacy no se mostraban para Space Marines y otras facciones. Corregido en esta actualización.',
    contrib: '👷 ¿Quieres ayudar? Nuevas guías en CONTRIBUTING.es.md — guía de traducción, plantillas de archivos vacíos, plantillas de issues en GitHub.',
  },
};

function CommunityAnnouncement() {
  const { language } = useLanguage();
  const tx = ANNOUNCEMENT_TEXT[language];
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(ANNOUNCEMENT_KEY) === 'true'
  );
  if (dismissed) return null;
  return (
    <div className="bg-zinc-900 border-l-4 border-amber-700 border border-zinc-700 px-5 py-4 mb-6">
      <div className="flex justify-between items-start gap-4">
        <div className="text-[11px] text-amber-600 uppercase tracking-widest font-semibold mb-2">
          {tx.title}
        </div>
        <button
          onClick={() => { localStorage.setItem(ANNOUNCEMENT_KEY, 'true'); setDismissed(true); }}
          className="text-zinc-600 hover:text-zinc-300 text-lg leading-none shrink-0"
          title="Dismiss"
        >
          ×
        </button>
      </div>
      <div className="text-[12px] text-zinc-300 leading-relaxed space-y-2">
        <p>{tx.intro}</p>
        <p className="text-amber-300/80">{tx.engine}</p>
        <p><strong className="text-emerald-400">{tx.csm.split(' — ')[0]}</strong> — {tx.csm.split(' — ').slice(1).join(' — ')}</p>
        <p><strong className="text-emerald-400">{tx.cd.split(' — ')[0]}</strong> — {tx.cd.split(' — ').slice(1).join(' — ')}</p>
        <p><strong className="text-emerald-400">{tx.sm.split(' — ')[0]}</strong> — {tx.sm.split(' — ').slice(1).join(' — ')}</p>
        <p className="text-orange-300/80">{tx.legacyfix}</p>
        <p className="text-zinc-400">{tx.contrib}</p>
      </div>
    </div>
  );
}

type FactionStatus = 'complete' | 'testing' | 'inreview' | 'unreviewed';

interface FactionDef {
  key: string;
  name: string;
  available: boolean;
  status: FactionStatus;
}

interface Category {
  name: string;
  borderColor: string;
  labelColor: string;
  factions: FactionDef[];
}

const STATUS_BADGE: Record<FactionStatus, { dot: string; label: string }> = {
  complete:   { dot: 'bg-green-500',   label: 'text-green-400'  },
  testing:    { dot: 'bg-amber-400',   label: 'text-amber-400'  },
  inreview:   { dot: 'bg-orange-500',  label: 'text-orange-400' },
  unreviewed: { dot: 'bg-red-500',     label: 'text-red-500'    },
};

const STATUS_I18N_KEY: Record<FactionStatus, TranslationKey> = {
  complete:   'fullyReviewed',
  testing:    'needsTesting',
  inreview:   'inReview',
  unreviewed: 'notReviewed',
};

const CATEGORIES: Category[] = [
  {
    name: 'Chaos',
    borderColor: 'border-red-800',
    labelColor: 'text-red-400',
    factions: [
      { key: 'chaos_space_marines', name: 'Chaos Space Marines', available: true, status: 'complete' },
      { key: 'chaos_daemons',       name: 'Chaos Daemons',       available: true, status: 'complete' },
    ],
  },
  {
    name: 'Imperium',
    borderColor: 'border-yellow-700',
    labelColor: 'text-yellow-500',
    factions: [
      { key: 'space_marines',      name: 'Space Marines',      available: true, status: 'complete' },
      { key: 'imperial_guard',     name: 'Imperial Guard',     available: true, status: 'testing' },
      { key: 'adeptus_mechanicus', name: 'Adeptus Mechanicus', available: true, status: 'inreview' },
      { key: 'adeptus_custodes',   name: 'Adeptus Custodes',   available: true, status: 'inreview' },
      { key: 'adeptus_sororitas',  name: 'Adeptus Sororitas',  available: true, status: 'inreview' },
      { key: 'grey_knights',       name: 'Grey Knights',       available: true, status: 'inreview' },
      { key: 'inquisition',        name: 'Inquisition',        available: true, status: 'inreview' },
    ],
  },
  {
    name: 'Xenos',
    borderColor: 'border-green-800',
    labelColor: 'text-green-500',
    factions: [
      { key: 'tau_empire',        name: 'Tau Empire',         available: true, status: 'inreview' },
      { key: 'necrons',           name: 'Necrons',            available: true, status: 'inreview' },
      { key: 'orks',              name: 'Orks',               available: true, status: 'inreview' },
      { key: 'eldar',             name: 'Eldar',              available: true, status: 'inreview' },
      { key: 'dark_eldar',        name: 'Dark Eldar',         available: true, status: 'inreview' },
      { key: 'genestealer_cults', name: 'Genestealer Cults',  available: true, status: 'inreview' },
      { key: 'harlequins',        name: 'Harlequins',         available: true, status: 'inreview' },
      { key: 'leagues_of_votann', name: 'Leagues of Votann',  available: true, status: 'inreview' },
      { key: 'tyranids',          name: 'Tyranids',           available: true, status: 'inreview' },
    ],
  },
];

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

interface Props {
  selectedFaction: string | null;
  loading: boolean;
  saves: SavedArmy[];
  onSelectFaction: (key: string) => void;
  onBuild: () => void;
  onLoadArmy: (save: SavedArmy) => void;
  onDeleteArmy: (id: string) => void;
}

export function LandingPage({
  selectedFaction, loading, saves,
  onSelectFaction, onBuild, onLoadArmy, onDeleteArmy,
}: Props) {
  const { data } = useArmyStore();
  const [showChangelog, setShowChangelog] = useState(false);
  const [openSupplement, setOpenSupplement] = useState<SupplementKey | null>(null);
  const latestVersion = CHANGELOG[0]?.version ?? '';
  const t = useT();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="bg-zinc-900 border-b-2 border-amber-900/60 px-6 py-5">
        <div className="flex items-center justify-between max-w-screen-lg mx-auto">
          <LanguageSelector />
          <div className="flex-1 text-center">
            <h1 className="text-amber-500 font-bold uppercase tracking-widest text-2xl mb-1">
              {t('appTitle')}
            </h1>
            <p className="text-zinc-500 text-sm">
              {t('appSubtitle')}
            </p>
          </div>
          <button
            onClick={() => setShowChangelog(true)}
            className="shrink-0 ml-4 text-[11px] uppercase tracking-wide border border-zinc-700 hover:border-amber-800 text-zinc-400 hover:text-amber-400 px-3 py-1.5 transition-colors"
          >
            {t('updates')} <span className="text-amber-700">v{latestVersion}</span>
          </button>
        </div>
      </header>

      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
      {openSupplement && <SupplementModal supplement={openSupplement} onClose={() => setOpenSupplement(null)} />}

      <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-10">

        <CommunityAnnouncement />

        {/* ── Saved armies ── */}
        {saves.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">
              {t('savedArmies')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {saves.map(save => (
                <div
                  key={save.id}
                  className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800 p-3 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-100 truncate">{save.name}</div>
                      <div className="text-[10px] text-amber-700 uppercase tracking-wide mt-0.5">{save.factionLabel}</div>
                    </div>
                    <button
                      onClick={() => onDeleteArmy(save.id)}
                      className="text-zinc-600 hover:text-red-400 text-lg leading-none shrink-0 transition-colors"
                      title="Delete save"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <span>{save.unitCount} units</span>
                    <span>·</span>
                    <span>{save.totalPts} pts</span>
                    <span>·</span>
                    <span>{formatDate(save.savedAt)}</span>
                  </div>

                  <button
                    onClick={() => onLoadArmy(save)}
                    className="mt-1 w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-amber-900/30 border border-amber-800/60 text-amber-400 hover:bg-amber-800/40 transition-colors"
                  >
                    {t('loadArmy')}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Faction selection ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700">{t('selectFaction')}</h2>
            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> {t('fullyReviewed')}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> {t('needsTesting')}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> {t('inReview')}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> {t('notReviewed')}</span>
            </div>
          </div>
          <div className="space-y-6">
            {CATEGORIES.map(cat => (
              <div key={cat.name}>
                <div className={`text-[10px] uppercase tracking-widest mb-2 font-semibold ${cat.labelColor}`}>
                  {cat.name}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.factions.map(f => {
                    const isSelected = selectedFaction === f.key;
                    const badge = STATUS_BADGE[f.status];
                    return (
                      <button
                        key={f.key}
                        onClick={() => f.available && onSelectFaction(f.key)}
                        disabled={!f.available}
                        className={`
                          relative px-4 py-3 border-2 text-sm transition-all text-left min-w-[160px]
                          ${!f.available
                            ? 'border-zinc-700 bg-zinc-900 text-zinc-600 cursor-not-allowed'
                            : isSelected
                              ? `${cat.borderColor} bg-zinc-800 text-amber-400 ring-1 ring-amber-700`
                              : `${cat.borderColor} bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100`
                          }
                        `}
                      >
                        {/* Status badge */}
                        {f.available && (
                          <div
                            className="absolute top-1.5 right-1.5 flex items-center gap-1"
                            title={t(STATUS_I18N_KEY[f.status])}
                          >
                            <div className={`w-2 h-2 rounded-full ${badge.dot}`} />
                          </div>
                        )}
                        <div className="font-semibold">{f.name}</div>
                        {!f.available && (
                          <div className="text-[10px] text-zinc-600 mt-0.5">Coming soon</div>
                        )}
                        {f.available && isSelected && (
                          <div className="text-[10px] text-amber-600 mt-0.5">Selected</div>
                        )}
                        {f.available && !isSelected && (
                          <div className={`text-[10px] mt-0.5 ${badge.label}`}>{t(STATUS_I18N_KEY[f.status])}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Army configuration — shown after faction selected ── */}
        {selectedFaction && (
          <section>
            <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-4">
              Army Configuration
            </h2>

            {loading || !data ? (
              <div className="flex items-center gap-3 text-zinc-500 py-8">
                <div className="w-5 h-5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading faction data…</span>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-700 border-l-4 border-l-amber-800 p-4">
                <ArmyConfig />
              </div>
            )}
          </section>
        )}

        {/* ── Build button ── */}
        {data && selectedFaction && (
          <div className="flex justify-center pt-2">
            <button
              onClick={onBuild}
              className="px-10 py-3 bg-amber-800 border-2 border-amber-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-700 transition-colors"
            >
              {t('buildArmy')}
            </button>
          </div>
        )}

        {/* ── Supplements ── */}
        <section>
          <h2 className="text-[11px] uppercase tracking-widest text-amber-700 mb-1">Supplements</h2>
          <p className="text-zinc-600 text-[11px] mb-4">
            Expansion rule sets that add new units and options to the core game.
          </p>
          <div className="flex flex-wrap gap-3">

            {/* Horus Heresy */}
            <div className="bg-zinc-900 border-2 border-zinc-700 border-l-4 border-l-red-900 p-4 min-w-[220px] flex-1 max-w-xs flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-zinc-100 font-bold text-sm uppercase tracking-wide">Horus Heresy</div>
                  <div className="text-red-700 text-[10px] uppercase tracking-widest mt-0.5">Space Marines</div>
                </div>
                <span className="text-[10px] border border-amber-700 text-amber-500 px-1.5 py-0.5 uppercase tracking-wide shrink-0" title="Functional — injectable roster, armory and disciplines. Some edge cases still under review.">Beta</span>
              </div>
              <p className="text-zinc-500 text-[12px] leading-snug">
                Legiones Astartes at the dawn of the Heresy. Full unit roster, Legion armory, and psychic disciplines.
              </p>
              <button
                onClick={() => setOpenSupplement('horus_heresy')}
                className="mt-auto w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-red-900/20 border border-red-900/50 text-red-400 hover:bg-red-900/40 transition-colors"
              >
                View Catalog ▶
              </button>
            </div>

            {/* Escalation — Lords of War */}
            <div className="bg-zinc-900 border-2 border-zinc-700 border-l-4 border-l-amber-800 p-4 min-w-[220px] flex-1 max-w-xs flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-zinc-100 font-bold text-sm uppercase tracking-wide">Escalation</div>
                  <div className="text-amber-700 text-[10px] uppercase tracking-widest mt-0.5">Lords of War</div>
                </div>
                <span className="text-[10px] border border-amber-700 text-amber-500 px-1.5 py-0.5 uppercase tracking-wide shrink-0" title="Functional — Lords of War rosters in for all 9 supported factions. Some edge cases still under review.">Beta</span>
              </div>
              <p className="text-zinc-500 text-[12px] leading-snug">
                Super-heavy vehicles, Knights and Titans. Unlocked by the Epic Battle engagement, capped at 33% of points. Available for all factions.
              </p>
              <button
                onClick={() => setOpenSupplement('escalation')}
                className="mt-auto w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-amber-900/20 border border-amber-900/50 text-amber-400 hover:bg-amber-900/40 transition-colors"
              >
                View Catalog ▶
              </button>
            </div>

            {/* Assassins — Execution Force */}
            <div className="bg-zinc-900 border-2 border-zinc-700 border-l-4 border-l-zinc-500 p-4 min-w-[220px] flex-1 max-w-xs flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-zinc-100 font-bold text-sm uppercase tracking-wide">Assassins</div>
                  <div className="text-zinc-500 text-[10px] uppercase tracking-widest mt-0.5">Execution Force</div>
                </div>
                <span className="text-[10px] border border-zinc-600 text-zinc-400 px-1.5 py-0.5 uppercase tracking-wide shrink-0" title="Granted natively to Grey Knights and Adeptus Sororitas via their codex rules — not a standalone faction.">Grey Knights · Sororitas</span>
              </div>
              <p className="text-zinc-500 text-[12px] leading-snug">
                Callidus, Culexus, Eversor, Vindicare. A single Assassin or one of each — counts as a single Elite slot. Granted natively by Demon Hunters / Witch hunters.
              </p>
              <button
                onClick={() => setOpenSupplement('assassins')}
                className="mt-auto w-full text-center text-[11px] uppercase tracking-wide py-1.5 bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors"
              >
                View Catalog ▶
              </button>
            </div>

          </div>
        </section>
      </div>

      <LegalFooter />
    </div>
  );
}
