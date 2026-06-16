import { useState } from 'react';
import { CHANGELOG, type IssueStatus, type I18nString, type I18nStringArray } from '../data/changelog';
import { TAB_FACTIONS, FACTION_CHANGES, FACTION_ISSUES, LATEST_FACTIONS, GENERAL } from '../data/changelogFactions';
import { useLanguage, type Language } from '../i18n';

interface Props { onClose: () => void; }

/** Resolve an I18nString to a plain string for the given language (falls back to 'en'). */
function ts(field: I18nString, lang: Language): string {
  if (typeof field === 'string') return field;
  const rec = field as Partial<Record<Language, string>>;
  return rec[lang] ?? rec['en'] ?? '';
}

/** Resolve an I18nStringArray to a plain string[] for the given language (falls back to 'en'). */
function ta(field: I18nStringArray, lang: Language): string[] {
  if (Array.isArray(field)) return field;
  const rec = field as Partial<Record<Language, string[]>>;
  return rec[lang] ?? rec['en'] ?? [];
}

const STATUS_LABEL: Record<Language, Record<IssueStatus, string>> = {
  en: { known: 'Known', investigating: 'Investigating', fixed: 'Fixed', by_design: 'By Design', planned: 'Planned' },
  de: { known: 'Bekannt', investigating: 'Untersucht', fixed: 'Behoben', by_design: 'Absicht', planned: 'Geplant' },
  es: { known: 'Conocido', investigating: 'Investigando', fixed: 'Corregido', by_design: 'Diseño', planned: 'Planificado' },
};

const STATUS_COLOR: Record<IssueStatus, string> = {
  known:         'text-amber-400 border-amber-700',
  investigating: 'text-blue-400 border-blue-700',
  fixed:         'text-green-500 border-green-700',
  by_design:     'text-zinc-400 border-zinc-600',
  planned:       'text-purple-400 border-purple-700',
};

const UI: Record<Language, {
  tabChangelog: string; tabIssues: string;
  todayBadge: string; relativeDayToday: string; relativeDayYesterday: string;
  bugHint: string; sectionOpen: string; sectionPipeline: string; sectionFixed: string;
  close: string; general: string; noChanges: string; noIssues: string;
}> = {
  en: {
    tabChangelog: 'Changelog', tabIssues: 'Known Issues',
    todayBadge: 'New', relativeDayToday: 'Today', relativeDayYesterday: 'Yesterday',
    bugHint: "Check here before reporting a bug — if it's listed we already have it covered.",
    sectionOpen: 'Open', sectionPipeline: 'In the Pipeline', sectionFixed: 'Already Fixed',
    close: 'Close', general: 'General', noChanges: 'No changes recorded for this section yet.', noIssues: 'No known issues for this section.',
  },
  de: {
    tabChangelog: 'Änderungsprotokoll', tabIssues: 'Bekannte Probleme',
    todayBadge: 'Neu', relativeDayToday: 'Heute', relativeDayYesterday: 'Gestern',
    bugHint: 'Vor dem Melden eines Fehlers hier prüfen — wenn er aufgelistet ist, sind wir bereits informiert.',
    sectionOpen: 'Offen', sectionPipeline: 'In Bearbeitung', sectionFixed: 'Bereits behoben',
    close: 'Schließen', general: 'Allgemein', noChanges: 'Für diesen Bereich sind noch keine Änderungen verzeichnet.', noIssues: 'Keine bekannten Probleme für diesen Bereich.',
  },
  es: {
    tabChangelog: 'Registro de cambios', tabIssues: 'Problemas conocidos',
    todayBadge: 'Nuevo', relativeDayToday: 'Hoy', relativeDayYesterday: 'Ayer',
    bugHint: 'Consulta aquí antes de reportar un error — si está en la lista ya lo tenemos cubierto.',
    sectionOpen: 'Abiertos', sectionPipeline: 'En desarrollo', sectionFixed: 'Ya corregidos',
    close: 'Cerrar', general: 'General', noChanges: 'Todavía no hay cambios registrados para esta sección.', noIssues: 'No hay problemas conocidos para esta sección.',
  },
};

export function ChangelogModal({ onClose }: Props) {
  const { language } = useLanguage();
  const u = UI[language];
  const [tab, setTab] = useState<'changelog' | 'issues'>('changelog');
  const [faction, setFaction] = useState<string>(GENERAL);
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const latestVersion = CHANGELOG[0]?.version;

  function relDate(d: string) {
    if (d === today) return u.relativeDayToday;
    if (d === yesterday) return u.relativeDayYesterday;
    return d;
  }

  function factionLabel(f: string) {
    return f === GENERAL ? u.general : f;
  }

  const changeRefs = FACTION_CHANGES[faction] ?? [];
  const groupedChanges = CHANGELOG
    .map(entry => ({ entry, bullets: changeRefs.filter(r => r.entry === entry).map(r => r.bulletIndex) }))
    .filter(g => g.bullets.length > 0);

  const facIssues     = FACTION_ISSUES[faction] ?? [];
  const openIssues    = facIssues.filter(i => i.status !== 'fixed' && i.status !== 'planned');
  const plannedIssues = facIssues.filter(i => i.status === 'planned');
  const fixedIssues   = facIssues.filter(i => i.status === 'fixed');

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border-2 border-amber-800 w-full max-w-xl my-4">
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-800 border-b border-amber-800">
          <div className="flex gap-1">
            <button
              onClick={() => setTab('changelog')}
              className={`text-xs uppercase tracking-widest px-3 py-1 transition-colors ${
                tab === 'changelog'
                  ? 'text-amber-400 bg-zinc-700 border border-amber-800'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {u.tabChangelog}
            </button>
            <button
              onClick={() => setTab('issues')}
              className={`text-xs uppercase tracking-widest px-3 py-1 transition-colors ${
                tab === 'issues'
                  ? 'text-amber-400 bg-zinc-700 border border-amber-800'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {u.tabIssues}
            </button>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="flex gap-1 px-4 py-2 border-b border-zinc-800 overflow-x-auto">
          {TAB_FACTIONS.map(f => (
            <button
              key={f}
              onClick={() => setFaction(f)}
              className={`relative text-[11px] px-2 py-1 whitespace-nowrap transition-colors ${
                faction === f
                  ? 'text-amber-400 bg-zinc-700 border border-amber-800'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}
            >
              {factionLabel(f)}
              {LATEST_FACTIONS.has(f) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border border-zinc-900" />
              )}
            </button>
          ))}
        </div>

        {tab === 'changelog' && (
          <div className="p-4 space-y-6">
            {groupedChanges.length === 0 && (
              <p className="text-zinc-500 text-[12px]">{u.noChanges}</p>
            )}
            {groupedChanges.map(({ entry, bullets }) => {
              const isLatest = entry.version === latestVersion;
              const title = ts(entry.title, language);
              const changes = ta(entry.changes, language);
              return (
                <div key={entry.version}>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-amber-500 font-bold text-sm">v{entry.version}</span>
                    {isLatest && (
                      <span className="text-[10px] uppercase tracking-wide bg-amber-700/30 text-amber-400 border border-amber-700/50 px-1.5 py-0.5 leading-none">
                        {u.todayBadge}
                      </span>
                    )}
                    <span className="text-zinc-100 text-sm font-semibold">{title}</span>
                    <span className="text-zinc-600 text-[11px] ml-auto">{relDate(entry.date)}</span>
                  </div>
                  <ul className="space-y-1 pl-3 border-l border-zinc-700">
                    {bullets.map(i => {
                      const c = changes[i];
                      const isAdded   = c.startsWith('Added:') || c.startsWith('Hinzugefügt:') || c.startsWith('Añadido:');
                      const isRemoved = c.startsWith('Removed:') || c.startsWith('Entfernt:') || c.startsWith('Eliminado:');
                      const isFixed   = c.startsWith('Fixed:') || c.startsWith('Behoben:') || c.startsWith('Corregido');
                      const color = isAdded ? 'text-green-500' : isRemoved ? 'text-red-500' : isFixed ? 'text-blue-400' : 'text-amber-800';
                      return (
                        <li key={i} className="text-[12px] text-zinc-400 leading-snug">
                          <span className={`${color} mr-1`}>—</span>{c}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'issues' && (
          <div className="p-4 space-y-4">
            <p className="text-zinc-500 text-[12px]">{u.bugHint}</p>

            {facIssues.length === 0 && (
              <p className="text-zinc-500 text-[12px]">{u.noIssues}</p>
            )}

            {/* Open & By Design */}
            {openIssues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-widest text-zinc-600 border-b border-zinc-800 pb-1">{u.sectionOpen}</h4>
              {openIssues.map(issue => (
                <div key={issue.id} className="bg-zinc-800 border border-zinc-700 p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-zinc-200 text-sm font-semibold leading-snug">{ts(issue.title, language)}</span>
                    <span className={`text-[10px] uppercase tracking-wide border px-1.5 py-0.5 shrink-0 ${STATUS_COLOR[issue.status]}`}>
                      {STATUS_LABEL[language][issue.status]}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-[12px] leading-snug">{ts(issue.description, language)}</p>
                </div>
              ))}
            </div>
            )}

            {/* Planned */}
            {plannedIssues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-widest text-zinc-600 border-b border-zinc-800 pb-1">{u.sectionPipeline}</h4>
                {plannedIssues.map(issue => (
                  <div key={issue.id} className="bg-zinc-900 border border-zinc-800 border-l-2 border-l-purple-800 p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-zinc-300 text-sm font-semibold leading-snug">{ts(issue.title, language)}</span>
                      <span className={`text-[10px] uppercase tracking-wide border px-1.5 py-0.5 shrink-0 ${STATUS_COLOR[issue.status]}`}>
                        {STATUS_LABEL[language][issue.status]}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-[12px] leading-snug">{ts(issue.description, language)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Fixed */}
            {fixedIssues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-widest text-zinc-600 border-b border-zinc-800 pb-1">{u.sectionFixed}</h4>
              {fixedIssues.map(issue => (
                <div key={issue.id} className="bg-zinc-900 border border-zinc-800 p-3 opacity-70">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-zinc-400 text-sm font-semibold leading-snug line-through">{ts(issue.title, language)}</span>
                    <span className={`text-[10px] uppercase tracking-wide border px-1.5 py-0.5 shrink-0 ${STATUS_COLOR[issue.status]}`}>
                      {STATUS_LABEL[language][issue.status]}
                    </span>
                  </div>
                  <p className="text-zinc-600 text-[12px] leading-snug">{ts(issue.description, language)}</p>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        <div className="px-4 py-3 border-t border-zinc-700 flex justify-end bg-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-600 uppercase tracking-wide"
          >
            {u.close}
          </button>
        </div>
      </div>
    </div>
  );
}
