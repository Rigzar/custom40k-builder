import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useLanguage, setTranslationOverrides, allTranslationKeys, defaultString, sourceStrings, type Language } from '../i18n';
import { runDataHealth, type HealthFinding } from '../engine/dataHealth';
import { compareFaction, coverageGaps, ignoreKey, type SourceFinding, type SourceGap, type FixOwner } from '../engine/sourceCompare';
import { overrideKey } from '../engine/dataOverrides';
import { CHANGELOG } from '../data/changelog';
import { refreshDataOverrides } from '../data/loaders';
import { FACTION_LOADERS } from '../data/loaders';
import { ALL_FACTIONS } from './LandingPage';
import { useAuth } from '../hooks/useAuth';

// Languages a translator edits (English is the source, shown read-only).
const TRANS_LANGS: Exclude<Language, 'en'>[] = ['de', 'es'];

/** Default source spreadsheets by faction (creator's live Google Sheets). Admin can add/override. */
const DEFAULT_SOURCE_IDS: Record<string, string> = {
  chaos_space_marines: '1Tj4zAtpprqI2W5VeIoV_HsuzhX_3XGhDMMgM2axOiBw',
};

/**
 * A Google Sheet id is only these characters. Mirrors the server-side check — never interpolate an
 * unvalidated id into a URL, and don't offer a link for one we haven't validated.
 */
const SHEET_ID_RE = /^[A-Za-z0-9_-]+$/;

/**
 * Everything the source check can compare — driven by FACTION_LOADERS, not by the landing page's
 * ALL_FACTIONS. The two differ: Assassins and the Horus Heresy supplement have loadable datasets
 * but appear on the landing page as supplements rather than faction cards, so keying off
 * ALL_FACTIONS silently left them out of both the picker and "Compare all". (Escalation has no
 * dataset of its own — its Lords of War live inside each faction's data and are checked there.)
 */
const SOURCE_FACTIONS: { key: string; name: string }[] = Object.keys(FACTION_LOADERS).map(key => ({
  key,
  name: ALL_FACTIONS.find(f => f.key === key)?.name
    ?? key.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
}));

/** Where a faction's SECOND workbook id is stored in the same source_sheets map — the supplement
 *  (Escalation, Horus Heresy) that holds datasheets for units the army can field but whose tabs
 *  are not in the army's own spreadsheet. */
const supplementKey = (factionKey: string) => `${factionKey}#supplement`;

/**
 * Escalation, used as the default second workbook for every faction. Its Lords of War (Fellblade,
 * Spartan, Warhound, the Knights, War Dog, Armiger, Lord of Skulls…) appear in many armies' unit
 * lists but their datasheets live only here, so without it those units are never compared at all.
 * A per-faction id saved in the second field overrides this.
 */
const DEFAULT_SUPPLEMENT_ID = '1i9o9KowRslsN4e1UXjzqME5OzcH5A9nR78LjvTVwXRY';

/** One faction's source-check result: what differs, what couldn't be checked, and how much loaded. */
interface SourceRun {
  findings: SourceFinding[];
  gaps: SourceGap[];
  coverage: { fetched: number; total: number };
  /** set instead of results when that faction's fetch threw, so one failure doesn't stop the sweep */
  error?: string;
}
/** Accept a pasted full sheet URL as well as a bare id. */
function toSheetId(input: string): string {
  const s = input.trim();
  const m = s.match(/\/spreadsheets\/d\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : s;
}

type AdminTab = 'overview' | 'users' | 'health' | 'audit' | 'announce' | 'factions' | 'i18n' | 'source';

const EDIT_LANGS: Language[] = ['en', 'de', 'es'];
type AnnFields = { title: string; intro: string; lines: string; contrib: string };
const emptyAnnFields = (): AnnFields => ({ title: '', intro: '', lines: '', contrib: '' });
/** Read one language's fields out of a stored announcement setting (lines array → textarea text). */
function annFieldsFrom(ann: api.AnnouncementSetting, lang: Language): AnnFields {
  const t = ann.text?.[lang];
  if (!t) return emptyAnnFields();
  return { title: t.title ?? '', intro: t.intro ?? '', lines: (t.lines ?? []).join('\n'), contrib: t.contrib ?? '' };
}

interface Props { onClose: () => void }

function fmt(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

type SortKey = 'username' | 'created_at' | 'last_seen_at' | 'roster_count';
const daysAgo = (n: number) => Date.now() - n * 86_400_000;
const seenWithin = (iso: string | null, days: number) => iso != null && new Date(iso).getTime() >= daysAgo(days);

function usersToCsv(users: api.AdminUserRow[]): string {
  const esc = (v: string | number | boolean) => `"${String(v).replace(/"/g, '""')}"`;
  const head = ['id', 'username', 'is_admin', 'roster_count', 'created_at', 'last_seen_at', 'last_login_at'];
  const rows = users.map(u => [u.id, u.username, u.is_admin, u.roster_count, u.created_at, u.last_seen_at ?? '', u.last_login_at].map(esc).join(','));
  return [head.join(','), ...rows].join('\r\n');
}

function downloadText(filename: string, text: string, mime = 'text/csv') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Local, admin-only translations (kept out of the global TranslationKey union). */
interface AdminTx {
  title: string;
  usersSaved: (u: number, r: number) => string;
  loading: string;
  reload: string;
  recoveryTitle: string;
  pending: (n: number) => string;
  noRequests: string;
  resolve: string;
  resolveConfirm: (u: string) => string;
  statusPending: string; statusResolved: string; statusCollected: string;
  active7: string; active30: string; admins: string; noArmies: string;
  searchPlaceholder: string;
  exportCsv: string;
  colUser: string; colRegistered: string; colLastSeen: string; colArmies: string; colActions: string;
  resetPw: string; makeAdmin: string; revokeAdmin: string; del: string;
  resetPwConfirm: (u: string) => string;
  deleteConfirm: (u: string) => string;
  promoteConfirm: (grant: boolean, u: string) => string;
  tempPw: string; recovery: string; hide: string;
  dataHealthTitle: string; dataHealthDesc: string; check: string; checking: string;
  noFindings: string; findings: (n: number) => string;
  exportDb: string;
  auditTitle: string; auditEmpty: string;
  armies: string; hideArmies: string; userNoArmies: string; publicBadge: string;
  delRoster: string; delRosterConfirm: (name: string) => string;
  helpReload: string; helpDataHealth: string; helpExportCsv: string; helpExportDb: string; exportDbConfirm: string;
  annSectionTitle: string; annEnabled: string; annVersion: string; annVersionHint: string;
  annFieldTitle: string; annFieldIntro: string; annFieldLines: string; annFieldContrib: string;
  save: string; saving: string; saved: string;
  factionSectionTitle: string; factionAvailHint: string;
  transSectionTitle: string; transHint: string; transSearch: string; transSource: string;
  transOnlyUntranslated: string; transBoth: string;
  annTranslate: string; annTranslating: string;
  backToApp: string;
  tabOverview: string; tabUsers: string; tabHealth: string; tabAudit: string; tabAnnounce: string; tabFactions: string; tabI18n: string; tabSource: string;
  helpTabOverview: string; helpTabUsers: string; helpTabHealth: string; helpTabAudit: string; helpTabAnnounce: string; helpTabFactions: string; helpTabI18n: string; helpTabSource: string;
  srcHint: string; srcSpreadsheetId: string; srcCompare: string; srcComparing: string; srcNoDiff: string; srcCol: (unit: string, model: string) => string;
  srcCoverage: (fetched: number, total: number) => string;
  srcWhereSheet: string; srcWhereReview: string; srcWhereReviewHint: string;
  fixSheet: string; fixCode: string; fixUnknown: string;
  srcIgnore: string; srcUnignore: string; srcIgnoreHint: string; srcUnignoreHint: string;
  srcShowIgnored: (n: number) => string; srcHideIgnored: (n: number) => string;
  srcSupplementId: string; srcSupplementHint: string;
  fixSheetHint: string; fixCodeHint: string; fixUnknownHint: string; srcOpenSheet: string; srcTabHint: (tab: string) => string;
  srcApply: string; srcApplying: string; srcUndo: string; srcAppliedTag: string;
  srcApplyHint: string; srcApplied: (unit: string, field: string, value: string) => string; srcUndone: string;
  srcExport: string; srcExportHint: string;
  srcCompareAll: string; srcAllTitle: string; srcAllFailed: string; srcNoSheetIds: string;
  srcAllProgress: (done: number, total: number, current: string) => string;
  srcAllDiffs: (n: number) => string; srcAllGaps: (n: number) => string;
  srcGapsNone: string; srcGapsCount: (n: number) => string; srcGapsHint: string;
  srcOverridesActive: (n: number) => string;
}

/** Small "?" badge — native tooltip on hover, language-aware text. */
function Help({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="ml-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-zinc-600 text-zinc-500 text-[8px] leading-none cursor-help select-none"
    >?</span>
  );
}

const ADMIN_I18N: Record<Language, AdminTx> = {
  en: {
    title: 'Inquisitor Panel',
    usersSaved: (u, r) => `${u} users · ${r} saved armies`,
    loading: 'Loading…',
    reload: 'Reload',
    recoveryTitle: 'Recovery requests',
    pending: n => `${n} pending`,
    noRequests: 'No requests.',
    resolve: 'Resolve',
    resolveConfirm: u => `Resolve request from "${u}"? New credentials will be generated.`,
    statusPending: 'pending', statusResolved: 'resolved', statusCollected: 'collected',
    active7: 'Active 7d', active30: 'Active 30d', admins: 'Inquisitors', noArmies: 'No armies',
    searchPlaceholder: 'Search user…',
    exportCsv: 'export CSV',
    colUser: 'User', colRegistered: 'Registered', colLastSeen: 'Last seen', colArmies: 'Armies', colActions: 'Actions',
    resetPw: 'reset pw', makeAdmin: '+inqui', revokeAdmin: '−inqui', del: 'del',
    resetPwConfirm: u => `Reset password for "${u}"?`,
    deleteConfirm: u => `DELETE account "${u}" and all their saves? This cannot be undone.`,
    promoteConfirm: (grant, u) => `${grant ? 'Grant' : 'Revoke'} Inquisitor for "${u}"?`,
    tempPw: 'Temp pw: ', recovery: 'Recovery: ', hide: 'hide',
    dataHealthTitle: 'Data health',
    dataHealthDesc: 'Checks structural consistency across all factions (empty groups, ghost weapons, dangling references…). Read-only; does not validate rules.',
    check: 'Check', checking: 'Checking…',
    noFindings: 'no findings', findings: n => `${n} finding${n > 1 ? 's' : ''}`,
    exportDb: 'export DB (JSON)',
    auditTitle: 'Audit log', auditEmpty: 'No actions logged yet.',
    armies: 'armies', hideArmies: 'hide', userNoArmies: 'This user has no saved armies.', publicBadge: 'public',
    delRoster: 'del', delRosterConfirm: name => `Delete the army "${name}"? This cannot be undone.`,
    helpReload: 'Reload the panel data (users, requests, audit log) from the server.',
    helpDataHealth: 'Scan all faction data for structural problems (empty option groups, ghost weapons, dangling references). Read-only; results show here.',
    helpExportCsv: 'Download the user list as a CSV spreadsheet (id, username, admin, army count, dates). Opens in Excel / Google Sheets.',
    helpExportDb: 'Download a FULL JSON backup of the database — every table, every column, including password hashes and recovery codes, so accounts can actually be restored. The file is credential material: store it securely and never share it.',
    exportDbConfirm: 'This downloads a FULL backup of the database.\n\nIt includes password hashes and recovery codes for every account — treat the file like a password: store it somewhere safe and never share or upload it.\n\nContinue?',
    annSectionTitle: 'Announcement banner', annEnabled: 'Show the banner',
    annVersion: 'Version (dismiss key)', annVersionHint: 'Change this to re-show the banner to users who already dismissed the previous one.',
    annFieldTitle: 'Title', annFieldIntro: 'Intro', annFieldLines: 'Lines (one per line; text before " — " is bold)', annFieldContrib: 'Footer',
    save: 'Save', saving: 'Saving…', saved: 'Saved ✓',
    factionSectionTitle: 'Faction availability', factionAvailHint: 'Unchecked factions are greyed out and cannot be selected in the builder.',
    transSectionTitle: 'UI translations',
    transHint: 'Edit the German / Spanish text of any interface string. English is the source. Fields left empty or unchanged keep the built-in text. Saved changes go live for everyone.',
    transSearch: 'Filter strings (key or English text)…', transSource: 'EN (source)',
    transOnlyUntranslated: 'only untranslated', transBoth: 'DE + ES',
    annTranslate: 'auto-translate the others from this', annTranslating: 'translating…',
    backToApp: '← Back to app',
    tabOverview: 'Overview', tabUsers: 'Users', tabHealth: 'Data health', tabAudit: 'Audit log', tabAnnounce: 'Announcement', tabFactions: 'Factions', tabI18n: 'Translations',
    helpTabOverview: 'Site activity, account-recovery requests, and full database backup.',
    helpTabUsers: 'Search users; reset passwords, grant/revoke admin, view or delete their armies, export the list as CSV.',
    helpTabHealth: 'Scan all faction data for structural problems (empty groups, ghost weapons, dangling references). Read-only.',
    helpTabAudit: 'Log of every privileged admin action (who did what, when).',
    helpTabAnnounce: 'Write and enable the landing announcement banner; auto-translate it to the other languages.',
    helpTabFactions: 'Turn each faction on or off in the builder.',
    helpTabI18n: 'Edit the German / Spanish text of any interface string.',
    tabSource: 'Source check',
    helpTabSource: 'Compare unit points in the app against the creator\'s live Google Sheet and flag any differences.',
    srcHint: 'Pick a faction and paste its Google Sheet ID (from the sheet URL). "Compare" fetches every unit tab and lists point differences vs the app. Read-only — nothing is changed automatically.',
    srcSpreadsheetId: 'Google Sheet ID', srcCompare: 'Compare', srcComparing: 'Comparing…', srcNoDiff: 'No point differences — the app matches the sheet.',
    srcCol: (unit, model) => `${unit} · ${model}`,
    srcCoverage: (f, t) => f < t
      ? `Read ${f}/${t} unit tabs — ${t - f} could not be read (renamed tab, or the sheet rate-limited us). Those units were NOT checked.`
      : `Read all ${t} unit tabs.`,
    srcWhereSheet: 'sheet', srcWhereReview: 'review',
    fixSheet: 'sheet', fixCode: 'code', fixUnknown: 'check',
    srcIgnore: 'ignore', srcUnignore: 'restore',
    srcIgnoreHint: 'Mark as known and accepted so it stops appearing on every run. Nothing is deleted — ignored rows stay counted and can be brought back.',
    srcUnignoreHint: 'Show this row again on every run.',
    srcShowIgnored: n => `show ${n} ignored`, srcHideIgnored: n => `hide ${n} ignored`,
    srcSupplementId: 'Supplement sheet ID (optional)',
    srcSupplementHint: 'A second workbook to look in for units this army can field whose tabs are not in its own spreadsheet — the Escalation Lords of War, the Horus Heresy datasheets. Only the units missing from the main workbook are looked up here.',
    fixSheetHint: 'The evidence points at the spreadsheet. Nothing for us to change — the line below says which tab and cell.',
    fixCodeHint: 'Ours to fix: the app data or the comparison itself is wrong. Nothing to do on the spreadsheet.',
    fixUnknownHint: 'Neither side is proven wrong. The line below says what to look at to decide.',
    srcWhereReviewHint: 'The app and the sheet simply disagree — nothing here proves which side is wrong. Open the unit tab to decide: fix the sheet there, or Apply to take the sheet value into the app.',
    srcOpenSheet: 'Open the spreadsheet ↗',
    srcTabHint: tab => `In the spreadsheet: tab "${tab}". In the app: this faction's unit of the same name.`,
    srcApply: 'Apply', srcApplying: '…', srcUndo: 'Undo', srcAppliedTag: 'applied',
    srcApplyHint: 'Apply writes the sheet value into the live app for everyone, straight away, without a redeploy. Only points, stats and weapon fields can be patched; Undo restores the built-in value.',
    srcApplied: (unit, field, value) => `Applied: ${unit} · ${field} → ${value}. Live for all players.`,
    srcUndone: 'Correction removed — the built-in value is used again.',
    srcOverridesActive: n => `${n} correction${n === 1 ? '' : 's'} active for this faction.`,
    srcExport: 'Export .json',
    srcExportHint: 'Download the whole check as one file — every faction, what differs and what could not be compared — instead of copying rows out by hand.',
    srcCompareAll: 'Compare all',
    srcAllTitle: 'All factions — click one to see its findings',
    srcAllFailed: 'fetch failed',
    srcNoSheetIds: 'No spreadsheet ids stored yet. Compare a faction once to save its id, then "Compare all" will include it.',
    srcAllProgress: (done, total, current) => `Comparing ${done + 1}/${total} — ${current}…`,
    srcAllDiffs: n => `${n} diff${n === 1 ? '' : 's'}`,
    srcAllGaps: n => `${n} unchecked`,
    srcGapsNone: 'Everything was checked — every tab loaded and every name lines up.',
    srcGapsCount: n => `${n} thing${n === 1 ? '' : 's'} could NOT be checked`,
    srcGapsHint: 'These were skipped by the comparison, so they can hide real problems. "sheet-weapon" / "sheet-model" = it is on the sheet but missing from the app; "tab" / "block" = nothing was read for that unit at all.',
  },
  de: {
    title: 'Inquisitor-Panel',
    usersSaved: (u, r) => `${u} Nutzer · ${r} gespeicherte Armeen`,
    loading: 'Lädt…',
    reload: 'Neu laden',
    recoveryTitle: 'Wiederherstellungsanfragen',
    pending: n => `${n} ausstehend`,
    noRequests: 'Keine Anfragen.',
    resolve: 'Bearbeiten',
    resolveConfirm: u => `Anfrage von "${u}" bearbeiten? Es werden neue Zugangsdaten erzeugt.`,
    statusPending: 'ausstehend', statusResolved: 'erledigt', statusCollected: 'abgeholt',
    active7: 'Aktiv 7T', active30: 'Aktiv 30T', admins: 'Inquisitoren', noArmies: 'Ohne Armeen',
    searchPlaceholder: 'Nutzer suchen…',
    exportCsv: 'CSV export',
    colUser: 'Nutzer', colRegistered: 'Registriert', colLastSeen: 'Zuletzt gesehen', colArmies: 'Armeen', colActions: 'Aktionen',
    resetPw: 'PW zurücks.', makeAdmin: '+inqui', revokeAdmin: '−inqui', del: 'lösch.',
    resetPwConfirm: u => `Passwort für "${u}" zurücksetzen?`,
    deleteConfirm: u => `Konto "${u}" und alle Speicherstände LÖSCHEN? Kann nicht rückgängig gemacht werden.`,
    promoteConfirm: (grant, u) => `Inquisitor für "${u}" ${grant ? 'gewähren' : 'entziehen'}?`,
    tempPw: 'Temp-PW: ', recovery: 'Wiederherst.: ', hide: 'verbergen',
    dataHealthTitle: 'Datenintegrität',
    dataHealthDesc: 'Prüft die strukturelle Konsistenz aller Fraktionen (leere Gruppen, Geisterwaffen, ungültige Referenzen…). Nur Lesen; prüft keine Regeln.',
    check: 'Prüfen', checking: 'Prüfe…',
    noFindings: 'keine Befunde', findings: n => `${n} Befund${n > 1 ? 'e' : ''}`,
    exportDb: 'DB export (JSON)',
    auditTitle: 'Aktionsprotokoll', auditEmpty: 'Noch keine Aktionen protokolliert.',
    armies: 'Armeen', hideArmies: 'verbergen', userNoArmies: 'Dieser Nutzer hat keine gespeicherten Armeen.', publicBadge: 'öffentlich',
    delRoster: 'lösch.', delRosterConfirm: name => `Armee "${name}" löschen? Kann nicht rückgängig gemacht werden.`,
    helpReload: 'Panel-Daten (Nutzer, Anfragen, Protokoll) neu vom Server laden.',
    helpDataHealth: 'Alle Fraktionsdaten auf strukturelle Probleme prüfen (leere Gruppen, Geisterwaffen, ungültige Referenzen). Nur Lesen; Ergebnisse erscheinen hier.',
    helpExportCsv: 'Nutzerliste als CSV-Tabelle herunterladen (ID, Name, Admin, Armee-Anzahl, Daten). Öffnet in Excel / Google Sheets.',
    helpExportDb: 'VOLLSTÄNDIGES JSON-Backup der Datenbank herunterladen — jede Tabelle, jede Spalte, inklusive Passwort-Hashes und Wiederherstellungscodes, damit Konten wirklich wiederhergestellt werden können. Die Datei ist Zugangsdaten-Material: sicher aufbewahren, niemals weitergeben.',
    exportDbConfirm: 'Dies lädt ein VOLLSTÄNDIGES Backup der Datenbank herunter.\n\nEs enthält Passwort-Hashes und Wiederherstellungscodes aller Konten — behandle die Datei wie ein Passwort: sicher speichern, niemals teilen oder hochladen.\n\nFortfahren?',
    annSectionTitle: 'Ankündigungsbanner', annEnabled: 'Banner anzeigen',
    annVersion: 'Version (Ausblend-Schlüssel)', annVersionHint: 'Ändern, um das Banner erneut anzuzeigen für Nutzer, die das vorige bereits ausgeblendet haben.',
    annFieldTitle: 'Titel', annFieldIntro: 'Einleitung', annFieldLines: 'Zeilen (eine pro Zeile; Text vor " — " ist fett)', annFieldContrib: 'Fußzeile',
    save: 'Speichern', saving: 'Speichere…', saved: 'Gespeichert ✓',
    factionSectionTitle: 'Fraktions-Verfügbarkeit', factionAvailHint: 'Nicht angehakte Fraktionen sind ausgegraut und im Builder nicht wählbar.',
    transSectionTitle: 'UI-Übersetzungen',
    transHint: 'Bearbeite den deutschen / spanischen Text jeder Oberflächen-Zeichenkette. Englisch ist die Quelle. Leere oder unveränderte Felder behalten den eingebauten Text. Gespeicherte Änderungen gehen für alle live.',
    transSearch: 'Zeichenketten filtern (Schlüssel oder engl. Text)…', transSource: 'EN (Quelle)',
    transOnlyUntranslated: 'nur unübersetzte', transBoth: 'DE + ES',
    annTranslate: 'die anderen hiervon automatisch übersetzen', annTranslating: 'übersetze…',
    backToApp: '← Zurück zur App',
    tabOverview: 'Übersicht', tabUsers: 'Nutzer', tabHealth: 'Datenintegrität', tabAudit: 'Protokoll', tabAnnounce: 'Ankündigung', tabFactions: 'Fraktionen', tabI18n: 'Übersetzungen',
    helpTabOverview: 'Aktivität, Wiederherstellungsanfragen und vollständiges Datenbank-Backup.',
    helpTabUsers: 'Nutzer suchen; Passwörter zurücksetzen, Admin geben/entziehen, Armeen ansehen/löschen, Liste als CSV exportieren.',
    helpTabHealth: 'Alle Fraktionsdaten auf strukturelle Probleme prüfen (leere Gruppen, Geisterwaffen, ungültige Referenzen). Nur Lesen.',
    helpTabAudit: 'Protokoll jeder privilegierten Admin-Aktion (wer, was, wann).',
    helpTabAnnounce: 'Ankündigungsbanner schreiben und aktivieren; in die anderen Sprachen übersetzen.',
    helpTabFactions: 'Jede Fraktion im Builder ein- oder ausschalten.',
    helpTabI18n: 'Den deutschen / spanischen Text jeder Oberflächen-Zeichenkette bearbeiten.',
    tabSource: 'Quellenabgleich',
    helpTabSource: 'Punkte der App gegen das Live-Google-Sheet des Erstellers vergleichen und Abweichungen anzeigen.',
    srcHint: 'Fraktion wählen und die Google-Sheet-ID (aus der Sheet-URL) einfügen. "Vergleichen" lädt jede Einheiten-Registerkarte und listet Punkt-Abweichungen gegenüber der App. Nur Lesen — nichts wird automatisch geändert.',
    srcSpreadsheetId: 'Google-Sheet-ID', srcCompare: 'Vergleichen', srcComparing: 'Vergleiche…', srcNoDiff: 'Keine Punkt-Abweichungen — die App stimmt mit dem Sheet überein.',
    srcCol: (unit, model) => `${unit} · ${model}`,
    srcCoverage: (f, t) => f < t
      ? `${f}/${t} Einheiten-Registerkarten gelesen — ${t - f} nicht lesbar (umbenannt oder Rate-Limit). Diese Einheiten wurden NICHT geprüft.`
      : `Alle ${t} Einheiten-Registerkarten gelesen.`,
    srcWhereSheet: 'Tabelle', srcWhereReview: 'prüfen',
    fixSheet: 'Sheet', fixCode: 'Code', fixUnknown: 'prüfen',
    srcIgnore: 'ignorieren', srcUnignore: 'zurückholen',
    srcIgnoreHint: 'Als bekannt und akzeptiert markieren, damit es nicht bei jedem Lauf wieder erscheint. Nichts wird gelöscht — ignorierte Zeilen bleiben gezählt und lassen sich zurückholen.',
    srcUnignoreHint: 'Diese Zeile wieder bei jedem Lauf anzeigen.',
    srcShowIgnored: n => `${n} ignorierte zeigen`, srcHideIgnored: n => `${n} ignorierte ausblenden`,
    srcSupplementId: 'Sheet-ID des Supplements (optional)',
    srcSupplementHint: 'Eine zweite Arbeitsmappe für Einheiten dieser Armee, deren Tabs nicht in ihrer eigenen Tabelle liegen — die Escalation Lords of War, die Horus-Heresy-Datenblätter. Nur die in der Hauptmappe fehlenden Einheiten werden hier gesucht.',
    fixSheetHint: 'Die Hinweise deuten auf die Tabelle. Für uns nichts zu tun — die Zeile darunter nennt Tab und Zelle.',
    fixCodeHint: 'Unsere Sache: die App-Daten oder der Vergleich selbst sind falsch. An der Tabelle ist nichts zu ändern.',
    fixUnknownHint: 'Keine Seite ist bewiesen falsch. Die Zeile darunter sagt, was zu prüfen ist.',
    srcWhereReviewHint: 'App und Sheet widersprechen sich einfach — nichts beweist hier, welche Seite falsch ist. Öffne den Einheiten-Tab und entscheide: dort das Sheet korrigieren, oder mit Übernehmen den Sheet-Wert in die App holen.',
    srcOpenSheet: 'Tabelle öffnen ↗',
    srcTabHint: tab => `In der Tabelle: Registerkarte "${tab}". In der App: die gleichnamige Einheit dieser Fraktion.`,
    srcApply: 'Übernehmen', srcApplying: '…', srcUndo: 'Rückgängig', srcAppliedTag: 'übernommen',
    srcApplyHint: 'Übernehmen schreibt den Sheet-Wert sofort und für alle in die Live-App, ohne neues Deployment. Nur Punkte, Werte und Waffenfelder sind änderbar; Rückgängig stellt den eingebauten Wert wieder her.',
    srcApplied: (unit, field, value) => `Übernommen: ${unit} · ${field} → ${value}. Für alle Spieler live.`,
    srcUndone: 'Korrektur entfernt — es gilt wieder der eingebaute Wert.',
    srcOverridesActive: n => `${n} Korrektur${n === 1 ? '' : 'en'} für diese Fraktion aktiv.`,
    srcExport: '.json exportieren',
    srcExportHint: 'Die gesamte Prüfung als eine Datei herunterladen — alle Fraktionen, was abweicht und was nicht verglichen werden konnte — statt Zeilen von Hand herauszukopieren.',
    srcCompareAll: 'Alle vergleichen',
    srcAllTitle: 'Alle Fraktionen — zum Anzeigen der Befunde anklicken',
    srcAllFailed: 'Abruf fehlgeschlagen',
    srcNoSheetIds: 'Noch keine Sheet-IDs gespeichert. Vergleiche eine Fraktion einmal, dann nimmt „Alle vergleichen" sie mit auf.',
    srcAllProgress: (done, total, current) => `Vergleiche ${done + 1}/${total} — ${current}…`,
    srcAllDiffs: n => `${n} Abweichung${n === 1 ? '' : 'en'}`,
    srcAllGaps: n => `${n} ungeprüft`,
    srcGapsNone: 'Alles geprüft — jeder Tab geladen und alle Namen passen zusammen.',
    srcGapsCount: n => `${n} Sache${n === 1 ? '' : 'n'} konnte${n === 1 ? '' : 'n'} NICHT geprüft werden`,
    srcGapsHint: 'Diese hat der Vergleich übersprungen, sie können echte Probleme verbergen. „sheet-weapon" / „sheet-model" = steht im Sheet, fehlt aber in der App; „tab" / „block" = für diese Einheit wurde gar nichts gelesen.',
  },
  es: {
    title: 'Panel Inquisidor',
    usersSaved: (u, r) => `${u} usuarios · ${r} ejércitos guardados`,
    loading: 'Cargando…',
    reload: 'Recargar',
    recoveryTitle: 'Solicitudes de recuperación',
    pending: n => `${n} pendiente${n > 1 ? 's' : ''}`,
    noRequests: 'Sin solicitudes.',
    resolve: 'Resolver',
    resolveConfirm: u => `¿Resolver solicitud de "${u}"? Se generarán nuevas credenciales.`,
    statusPending: 'pendiente', statusResolved: 'resuelta', statusCollected: 'recogida',
    active7: 'Activos 7d', active30: 'Activos 30d', admins: 'Inquisidores', noArmies: 'Sin ejércitos',
    searchPlaceholder: 'Buscar usuario…',
    exportCsv: 'exportar CSV',
    colUser: 'Usuario', colRegistered: 'Registro', colLastSeen: 'Última vez', colArmies: 'Ejércitos', colActions: 'Acciones',
    resetPw: 'reset pw', makeAdmin: '+inqui', revokeAdmin: '−inqui', del: 'borrar',
    resetPwConfirm: u => `¿Resetear la contraseña de "${u}"?`,
    deleteConfirm: u => `¿BORRAR la cuenta "${u}" y todos sus guardados? No se puede deshacer.`,
    promoteConfirm: (grant, u) => `¿${grant ? 'Otorgar' : 'Retirar'} Inquisidor a "${u}"?`,
    tempPw: 'Contraseña temp: ', recovery: 'Recuperación: ', hide: 'ocultar',
    dataHealthTitle: 'Integridad de datos',
    dataHealthDesc: 'Comprueba consistencia estructural de todas las facciones (grupos vacíos, armas fantasma, referencias colgantes…). Solo lectura; no valida reglas.',
    check: 'Comprobar', checking: 'Analizando…',
    noFindings: 'sin hallazgos', findings: n => `${n} hallazgo${n > 1 ? 's' : ''}`,
    exportDb: 'exportar BD (JSON)',
    auditTitle: 'Registro de acciones', auditEmpty: 'Sin acciones registradas todavía.',
    armies: 'ejércitos', hideArmies: 'ocultar', userNoArmies: 'Este usuario no tiene ejércitos guardados.', publicBadge: 'público',
    delRoster: 'borrar', delRosterConfirm: name => `¿Borrar el ejército "${name}"? No se puede deshacer.`,
    helpReload: 'Recarga los datos del panel (usuarios, solicitudes, registro) desde el servidor.',
    helpDataHealth: 'Analiza los datos de todas las facciones en busca de problemas estructurales (grupos vacíos, armas fantasma, referencias colgantes). Solo lectura; los resultados salen aquí.',
    helpExportCsv: 'Descarga la lista de usuarios como hoja CSV (id, usuario, admin, nº de ejércitos, fechas). Se abre en Excel / Google Sheets.',
    helpExportDb: 'Descarga una copia COMPLETA en JSON de la base de datos — todas las tablas y columnas, incluidos los hashes de contraseña y los códigos de recuperación, para que las cuentas se puedan restaurar de verdad. El archivo son credenciales: guárdalo a buen recaudo y no lo compartas nunca.',
    exportDbConfirm: 'Esto descarga una copia COMPLETA de la base de datos.\n\nIncluye los hashes de contraseña y los códigos de recuperación de todas las cuentas — trata el archivo como una contraseña: guárdalo en un sitio seguro y no lo compartas ni lo subas a ningún lado.\n\n¿Continuar?',
    annSectionTitle: 'Banner de anuncio', annEnabled: 'Mostrar el banner',
    annVersion: 'Versión (clave de descarte)', annVersionHint: 'Cámbiala para volver a mostrar el banner a quien ya cerró el anterior.',
    annFieldTitle: 'Título', annFieldIntro: 'Intro', annFieldLines: 'Líneas (una por línea; el texto antes de " — " va en negrita)', annFieldContrib: 'Pie',
    save: 'Guardar', saving: 'Guardando…', saved: 'Guardado ✓',
    factionSectionTitle: 'Disponibilidad de facciones', factionAvailHint: 'Las facciones sin marcar se muestran en gris y no se pueden seleccionar en el builder.',
    transSectionTitle: 'Traducciones de la interfaz',
    transHint: 'Edita el texto en alemán / español de cualquier cadena de la interfaz. El inglés es la fuente. Los campos vacíos o sin cambios conservan el texto original. Los cambios guardados se aplican en vivo para todos.',
    transSearch: 'Filtrar cadenas (clave o texto en inglés)…', transSource: 'EN (fuente)',
    transOnlyUntranslated: 'solo sin traducir', transBoth: 'DE + ES',
    annTranslate: 'auto-traducir los demás desde este', annTranslating: 'traduciendo…',
    backToApp: '← Volver a la app',
    tabOverview: 'Resumen', tabUsers: 'Usuarios', tabHealth: 'Integridad', tabAudit: 'Registro', tabAnnounce: 'Anuncio', tabFactions: 'Facciones', tabI18n: 'Traducciones',
    helpTabOverview: 'Actividad del sitio, solicitudes de recuperación y copia completa de la base de datos.',
    helpTabUsers: 'Buscar usuarios; resetear contraseñas, dar/quitar admin, ver o borrar sus ejércitos, exportar la lista en CSV.',
    helpTabHealth: 'Analiza los datos de todas las facciones en busca de problemas estructurales (grupos vacíos, armas fantasma, referencias colgantes). Solo lectura.',
    helpTabAudit: 'Registro de cada acción privilegiada de admin (quién, qué y cuándo).',
    helpTabAnnounce: 'Escribe y activa el banner de anuncio; auto-traduce a los otros idiomas.',
    helpTabFactions: 'Activa o desactiva cada facción en el builder.',
    helpTabI18n: 'Edita el texto en alemán / español de cualquier cadena de la interfaz.',
    tabSource: 'Comparar fuente',
    helpTabSource: 'Compara los puntos de la app con la hoja de Google en vivo del creador y marca las diferencias.',
    srcHint: 'Elige una facción y pega el ID de su hoja de Google (de la URL de la hoja). "Comparar" descarga cada pestaña de unidad y lista las diferencias de puntos vs la app. Solo lectura — no se cambia nada automáticamente.',
    srcSpreadsheetId: 'ID de la hoja de Google', srcCompare: 'Comparar', srcComparing: 'Comparando…', srcNoDiff: 'Sin diferencias de puntos — la app coincide con la hoja.',
    srcCol: (unit, model) => `${unit} · ${model}`,
    srcCoverage: (f, t) => f < t
      ? `Leídas ${f}/${t} pestañas de unidad — ${t - f} no se pudieron leer (pestaña renombrada, o la hoja nos limitó). Esas unidades NO se comprobaron.`
      : `Leídas las ${t} pestañas de unidad.`,
    srcWhereSheet: 'hoja', srcWhereReview: 'revisar',
    fixSheet: 'hoja', fixCode: 'código', fixUnknown: 'revisar',
    srcIgnore: 'ignorar', srcUnignore: 'recuperar',
    srcIgnoreHint: 'Marcar como conocido y aceptado para que deje de salir en cada pasada. No se borra nada — las filas ignoradas se siguen contando y se pueden recuperar.',
    srcUnignoreHint: 'Volver a mostrar esta fila en cada pasada.',
    srcShowIgnored: n => `ver ${n} ignoradas`, srcHideIgnored: n => `ocultar ${n} ignoradas`,
    srcSupplementId: 'ID de la hoja del suplemento (opcional)',
    srcSupplementHint: 'Un segundo libro donde buscar las unidades que este ejército puede llevar pero cuyas pestañas no están en su propia hoja — los Lords of War de Escalation, las fichas de Horus Heresy. Aquí solo se buscan las unidades que faltaban en el libro principal.',
    fixSheetHint: 'Las pistas apuntan a la hoja. Por nuestra parte no hay nada que cambiar — la línea de abajo dice qué pestaña y qué celda.',
    fixCodeHint: 'Nos toca a nosotros: los datos de la app o la propia comparación están mal. En la hoja no hay nada que tocar.',
    fixUnknownHint: 'Ninguno de los dos lados está demostrado. La línea de abajo dice qué mirar para decidir.',
    srcWhereReviewHint: 'La app y la hoja simplemente no coinciden — nada demuestra aquí cuál de las dos está mal. Abre la pestaña de la unidad y decide: corregir ahí la hoja, o pulsar Aplicar para llevar el valor de la hoja a la app.',
    srcOpenSheet: 'Abrir la hoja ↗',
    srcTabHint: tab => `En la hoja: pestaña "${tab}". En la app: la unidad con ese mismo nombre en esta facción.`,
    srcApply: 'Aplicar', srcApplying: '…', srcUndo: 'Deshacer', srcAppliedTag: 'aplicado',
    srcApplyHint: 'Aplicar escribe el valor de la hoja en la app en vivo, para todos y al instante, sin volver a desplegar. Solo se pueden corregir puntos, características y campos de arma; Deshacer restaura el valor original.',
    srcApplied: (unit, field, value) => `Aplicado: ${unit} · ${field} → ${value}. En vivo para todos los jugadores.`,
    srcUndone: 'Corrección eliminada — vuelve a usarse el valor original.',
    srcOverridesActive: n => `${n} corrección${n === 1 ? '' : 'es'} activa${n === 1 ? '' : 's'} en esta facción.`,
    srcExport: 'Exportar .json',
    srcExportHint: 'Descarga el chequeo entero en un archivo — todas las facciones, lo que difiere y lo que no se pudo comparar — en vez de copiar filas a mano.',
    srcCompareAll: 'Comparar todas',
    srcAllTitle: 'Todas las facciones — pulsa una para ver sus hallazgos',
    srcAllFailed: 'fallo al descargar',
    srcNoSheetIds: 'Todavía no hay ids de hoja guardados. Compara una facción una vez y "Comparar todas" ya la incluirá.',
    srcAllProgress: (done, total, current) => `Comparando ${done + 1}/${total} — ${current}…`,
    srcAllDiffs: n => `${n} diferencia${n === 1 ? '' : 's'}`,
    srcAllGaps: n => `${n} sin comprobar`,
    srcGapsNone: 'Se comprobó todo — todas las pestañas cargaron y todos los nombres cuadran.',
    srcGapsCount: n => `${n} cosa${n === 1 ? '' : 's'} NO se pudo comprobar`,
    srcGapsHint: 'La comparación se las saltó, así que pueden esconder problemas reales. "sheet-weapon" / "sheet-model" = está en la hoja pero falta en la app; "tab" / "block" = de esa unidad no se leyó nada.',
  },
};

export function AdminPanel({ onClose }: Props) {
  const { language } = useLanguage();
  const L = ADMIN_I18N[language] ?? ADMIN_I18N.en;
  const { username: adminUsername } = useAuth();

  const [stats, setStats]     = useState<api.AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState('');
  const [revealed, setRevealed] = useState<Record<number, { pw: string; rc: string }>>({});
  const [requests, setRequests] = useState<api.RecoveryRequest[]>([]);
  const [resolving, setResolving] = useState<number | null>(null);
  const [health, setHealth]   = useState<HealthFinding[] | null>(null);
  const [healthRunning, setHealthRunning] = useState(false);
  const [filter, setFilter]   = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [auditLog, setAuditLog] = useState<api.AdminAction[]>([]);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [userRosters, setUserRosters] = useState<Record<number, api.AdminRosterRow[]>>({});
  const [exporting, setExporting] = useState(false);
  // Announcement editor + faction availability
  const [annEnabled, setAnnEnabled] = useState(false);
  const [annVersion, setAnnVersion] = useState('');
  const [annText, setAnnText] = useState<Record<Language, AnnFields>>({ en: emptyAnnFields(), de: emptyAnnFields(), es: emptyAnnFields() });
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [transEdits, setTransEdits] = useState<Record<'de' | 'es', Record<string, string>>>({ de: {}, es: {} });
  const [transFilter, setTransFilter] = useState('');
  const [transLang, setTransLang] = useState<'both' | 'de' | 'es'>('both');
  const [transUntranslated, setTransUntranslated] = useState(false);
  const [translatingFrom, setTranslatingFrom] = useState<Language | null>(null);
  const [tab, setTab] = useState<AdminTab>('overview');
  // Source-compare tool
  const [sourceIds, setSourceIds] = useState<Record<string, string>>(DEFAULT_SOURCE_IDS);
  const [srcFaction, setSrcFaction] = useState<string>('chaos_space_marines');
  const [srcId, setSrcId] = useState<string>(DEFAULT_SOURCE_IDS.chaos_space_marines ?? '');
  const [srcRunning, setSrcRunning] = useState(false);
  /** Optional second workbook for this faction's supplement units (see supplementKey). */
  const [srcSuppId, setSrcSuppId] = useState<string>('');
  const [srcFindings, setSrcFindings] = useState<SourceFinding[] | null>(null);
  /** Admin corrections currently stored in app_settings.data_overrides, keyed by faction. */
  const [dataOverrides, setDataOverrides] = useState<api.DataOverrides>({});
  /** overrideKey of the row whose save is in flight (disables just that row's buttons). */
  const [srcApplying, setSrcApplying] = useState<string | null>(null);
  const [srcCoverage, setSrcCoverage] = useState<{ fetched: number; total: number } | null>(null);
  /** What the comparison could NOT check for the selected faction (unfetched tabs, names present
   *  on one side only) — a diff that finds nothing is meaningless if half the sheet never loaded. */
  const [srcGaps, setSrcGaps] = useState<SourceGap[] | null>(null);
  const [srcShowGaps, setSrcShowGaps] = useState(false);
  /** "Compare all": per-faction results, so one run covers the whole codex set and clicking a row
   *  just swaps the already-computed findings in (no refetch, Apply stays scoped to that faction). */
  const [srcAll, setSrcAll] = useState<Record<string, SourceRun> | null>(null);
  const [srcAllProgress, setSrcAllProgress] = useState<{ done: number; total: number; current: string } | null>(null);
  /** Which "Compare all" faction rows are unfolded — each shows its own findings + Apply buttons
   *  in place, so a correction can be made without leaving the summary. */
  const [srcExpanded, setSrcExpanded] = useState<Record<string, boolean>>({});
  /** Rows marked "known and accepted" — hidden from the lists but counted, and restorable. Lets a
   *  difference both sides are happy with (a naming convention, a unit whose tab lives in another
   *  workbook) stop drowning the rows that still need doing. Nothing is ever dropped silently. */
  const [srcIgnores, setSrcIgnores] = useState<api.SourceIgnores>({});
  const [srcShowIgnored, setSrcShowIgnored] = useState(false);
  const [savingKey, setSavingKey] = useState<'announcement' | 'faction_flags' | 'translations' | null>(null);
  const [savedKey, setSavedKey] = useState<'announcement' | 'faction_flags' | 'translations' | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [s, r, a, cfg] = await Promise.all([
        api.adminStats(),
        api.adminListRecoveryRequests(),
        api.adminActions().catch(() => ({ actions: [] })),
        api.adminGetSettings().catch(() => ({ settings: {} as { announcement?: api.AnnouncementSetting; faction_flags?: api.FactionFlags; translations?: api.TranslationOverrides; source_sheets?: Record<string, string>; data_overrides?: api.DataOverrides; source_ignores?: api.SourceIgnores } })),
      ]);
      setStats(s);
      setRequests(r.requests);
      setAuditLog(a.actions);
      // hydrate announcement editor
      const ann = cfg.settings.announcement;
      if (ann) {
        setAnnEnabled(ann.enabled !== false);
        setAnnVersion(ann.version ?? '');
        setAnnText({
          en: annFieldsFrom(ann, 'en'), de: annFieldsFrom(ann, 'de'), es: annFieldsFrom(ann, 'es'),
        });
      }
      // hydrate faction availability (default from code, overridden by stored flags)
      const stored = cfg.settings.faction_flags ?? {};
      const merged: Record<string, boolean> = {};
      for (const f of ALL_FACTIONS) merged[f.key] = stored[f.key] ?? f.defaultAvailable;
      setFlags(merged);
      // hydrate translation editor (effective value = override ?? code default)
      const tr = cfg.settings.translations ?? {};
      const de: Record<string, string> = {}, es: Record<string, string> = {};
      for (const k of allTranslationKeys()) {
        de[k] = tr.de?.[k] ?? defaultString('de', k);
        es[k] = tr.es?.[k] ?? defaultString('es', k);
      }
      setTransEdits({ de, es });
      // hydrate source-sheet ids (stored override merged over the built-in defaults)
      const ids = { ...DEFAULT_SOURCE_IDS, ...(cfg.settings.source_sheets ?? {}) };
      setSourceIds(ids);
      setSrcId(ids[srcFaction] ?? '');
      setSrcSuppId(ids[supplementKey(srcFaction)] ?? DEFAULT_SUPPLEMENT_ID);
      setDataOverrides((cfg.settings.data_overrides ?? {}) as api.DataOverrides);
      setSrcIgnores((cfg.settings.source_ignores ?? {}) as api.SourceIgnores);
    } catch (e) { setMsg(String(e)); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const statusLabel = (s: api.RecoveryRequest['status']) =>
    s === 'pending' ? L.statusPending : s === 'resolved' ? L.statusResolved : L.statusCollected;

  async function handleResolve(requestId: number, username: string) {
    if (!confirm(L.resolveConfirm(username))) return;
    setResolving(requestId);
    try {
      await api.adminResolveRecovery(requestId);
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'resolved' as const } : r));
    } catch (e) { setMsg(String(e)); }
    finally { setResolving(null); }
  }

  async function handleResetPw(userId: number, username: string) {
    if (!confirm(L.resetPwConfirm(username))) return;
    try {
      const r = await api.adminResetPw(userId);
      setRevealed(prev => ({ ...prev, [userId]: { pw: r.tempPassword, rc: r.recoveryCode } }));
      await load();
    } catch (e) { setMsg(String(e)); }
  }

  async function handleDelete(userId: number, username: string) {
    if (!confirm(L.deleteConfirm(username))) return;
    try {
      await api.adminDelUser(userId);
      await load();
    } catch (e) { setMsg(String(e)); }
  }

  async function handleRunHealth() {
    setHealthRunning(true);
    try { setHealth(await runDataHealth()); }
    catch (e) { setMsg(String(e)); }
    finally { setHealthRunning(false); }
  }

  /** Fetch one faction's sheet and diff it. Shared by the single-faction and "compare all" runs. */
  async function runSourceCompare(factionKey: string, id: string): Promise<SourceRun> {
    const loader = FACTION_LOADERS[factionKey];
    if (!loader) throw new Error(`No data for ${factionKey}`);
    const data = await loader();
    const names = Object.keys(data.units);
    const resp = await api.adminSourceSheets(id, names);
    const csv = { ...resp.data };
    let fetched = resp.fetched;

    // Units the faction's own workbook doesn't have a tab for are not necessarily missing: a
    // supplement keeps its datasheets in its OWN spreadsheet (the Escalation Lords of War — Chaos
    // Fellblade, Knight Rampager, War Dog…— are in the army's list but live in the Escalation
    // workbook). Look the leftovers up there before calling them uncomparable.
    const extraId = toSheetId(sourceIds[supplementKey(factionKey)] ?? DEFAULT_SUPPLEMENT_ID);
    const missing = names.filter(n => !csv[n]);
    if (missing.length > 0 && SHEET_ID_RE.test(extraId)) {
      const extra = await api.adminSourceSheets(extraId, missing);
      for (const [n, text] of Object.entries(extra.data)) if (text) { csv[n] = text; fetched++; }
    }

    return {
      findings: compareFaction(data, csv),
      gaps: coverageGaps(data, csv),
      coverage: { fetched, total: resp.total },
    };
  }

  async function handleSourceCompare() {
    const id = toSheetId(srcId);
    if (!SHEET_ID_RE.test(id)) return;
    setSrcRunning(true); setSrcFindings(null); setSrcCoverage(null); setSrcGaps(null); setSrcAll(null); setMsg('');
    try {
      const run = await runSourceCompare(srcFaction, id);
      setSrcFindings(run.findings); setSrcGaps(run.gaps); setSrcCoverage(run.coverage);
      // remember the id for this faction
      const next = { ...sourceIds, [srcFaction]: id, [supplementKey(srcFaction)]: toSheetId(srcSuppId) };
      setSourceIds(next);
      api.adminSetSetting('source_sheets', next).catch(() => {});
    } catch (e) { setMsg(String(e)); }
    finally { setSrcRunning(false); }
  }

  /**
   * Run the comparison for every faction that has a spreadsheet id stored, one after another —
   * each run fetches ~60 tabs from Google, so they are sequential on purpose (parallel bursts come
   * back empty and would read as "no differences"). A faction that throws is recorded with its
   * error instead of aborting the sweep.
   */
  async function handleSourceCompareAll() {
    const targets = SOURCE_FACTIONS
      .map(f => ({ key: f.key, name: f.name, id: toSheetId(sourceIds[f.key] ?? '') }))
      .filter(t => SHEET_ID_RE.test(t.id) && FACTION_LOADERS[t.key]);
    if (targets.length === 0) { setMsg(L.srcNoSheetIds); return; }
    setSrcRunning(true); setSrcFindings(null); setSrcCoverage(null); setSrcGaps(null); setMsg('');
    const results: Record<string, SourceRun> = {};
    for (const [i, t] of targets.entries()) {
      setSrcAllProgress({ done: i, total: targets.length, current: t.name });
      try { results[t.key] = await runSourceCompare(t.key, t.id); }
      catch (e) { results[t.key] = { findings: [], gaps: [], coverage: { fetched: 0, total: 0 }, error: String(e) }; }
      setSrcAll({ ...results });
    }
    setSrcAllProgress(null);
    setSrcRunning(false);
  }

  /**
   * Apply one Source-check finding to the live app: store the sheet's value as a data override so
   * every player sees the corrected number immediately, without waiting for a redeploy. Only the
   * three value kinds are patchable — a 'sheet' finding is a problem in the source document, so
   * there is nothing to copy into the app.
   */
  async function handleApplyFinding(f: SourceFinding, factionKey: string = srcFaction) {
    if (f.kind === 'sheet') return;
    const key = overrideKey({ unit: f.unit, kind: f.kind, target: f.target, field: f.field });
    const next: api.DataOverrides = { ...dataOverrides };
    const list = (next[factionKey] ?? []).filter(o => overrideKey(o) !== key);
    next[factionKey] = [...list, {
      unit: f.unit, kind: f.kind, target: f.target, field: f.field, value: f.source,
      by: adminUsername ?? undefined, at: new Date().toISOString(),
    }];
    setSrcApplying(key);
    try {
      await api.adminSetSetting('data_overrides', next);
      setDataOverrides(next);
      refreshDataOverrides();               // next faction load re-reads them
      setMsg(L.srcApplied(f.unit, f.field, f.source));
    } catch (e) { setMsg(String(e)); }
    finally { setSrcApplying(null); }
  }

  /** Drop a previously applied override, so the bundled value takes over again. */
  async function handleUndoFinding(f: SourceFinding, factionKey: string = srcFaction) {
    if (f.kind === 'sheet') return;
    const key = overrideKey({ unit: f.unit, kind: f.kind, target: f.target, field: f.field });
    const next: api.DataOverrides = { ...dataOverrides };
    next[factionKey] = (next[factionKey] ?? []).filter(o => overrideKey(o) !== key);
    if (next[factionKey].length === 0) delete next[factionKey];
    setSrcApplying(key);
    try {
      await api.adminSetSetting('data_overrides', next);
      setDataOverrides(next);
      refreshDataOverrides();
      setMsg(L.srcUndone);
    } catch (e) { setMsg(String(e)); }
    finally { setSrcApplying(null); }
  }

  async function handlePromote(userId: number, username: string, makeAdmin: boolean) {
    if (!confirm(L.promoteConfirm(makeAdmin, username))) return;
    try {
      await api.adminPromote(userId, makeAdmin);
      await load();
    } catch (e) { setMsg(String(e)); }
  }

  async function saveSetting(key: 'announcement' | 'faction_flags' | 'translations', value: unknown) {
    setSavingKey(key); setSavedKey(null);
    try {
      await api.adminSetSetting(key, value);
      setSavedKey(key);
      setTimeout(() => setSavedKey(k => (k === key ? null : k)), 2500);
    } catch (e) { setMsg(String(e)); }
    finally { setSavingKey(null); }
  }

  async function handleTranslateAnnFrom(src: Language) {
    const f = annText[src];
    const linesArr = f.lines.split('\n').map(s => s.trim()).filter(Boolean);
    const payload = [f.title, f.intro, f.contrib, ...linesArr];   // fixed head + variable lines
    setTranslatingFrom(src);
    try {
      const targets = EDIT_LANGS.filter(l => l !== src);
      const results = await Promise.all(targets.map(to => api.adminTranslate(payload, src, to).then(r => ({ to, tr: r.translations }))));
      setAnnText(prev => {
        const next = { ...prev };
        for (const { to, tr } of results) {
          next[to] = { title: tr[0] ?? '', intro: tr[1] ?? '', contrib: tr[2] ?? '', lines: tr.slice(3).join('\n') };
        }
        return next;
      });
    } catch (e) { setMsg(String(e)); }
    finally { setTranslatingFrom(null); }
  }

  function handleSaveAnnouncement() {
    const text: api.AnnouncementSetting['text'] = {};
    for (const lang of EDIT_LANGS) {
      const f = annText[lang];
      text[lang] = {
        title: f.title, intro: f.intro,
        lines: f.lines.split('\n').map(s => s.trim()).filter(Boolean),
        contrib: f.contrib,
      };
    }
    saveSetting('announcement', { enabled: annEnabled, version: annVersion.trim(), author: adminUsername ?? undefined, text });
  }

  function handleSaveFlags() {
    saveSetting('faction_flags', flags);
  }

  function handleSaveTranslations() {
    // store only values that differ from the code default (keeps overrides small; future code
    // string changes still flow through for untouched keys)
    const out: api.TranslationOverrides = {};
    for (const lang of TRANS_LANGS) {
      const m: Record<string, string> = {};
      for (const k of allTranslationKeys()) {
        const v = transEdits[lang][k];
        if (v != null && v.trim() !== '' && v !== defaultString(lang, k)) m[k] = v;
      }
      if (Object.keys(m).length) out[lang] = m;
    }
    setTranslationOverrides(out);   // apply live in this session immediately
    saveSetting('translations', out);
  }

  async function handleExport() {
    if (!confirm(L.exportDbConfirm)) return;
    setExporting(true);
    try {
      const data = await api.adminExport();
      downloadText(`custom40k-FULL-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), 'application/json');
    } catch (e) { setMsg(String(e)); }
    finally { setExporting(false); }
  }

  async function toggleUserRosters(userId: number) {
    if (expandedUser === userId) { setExpandedUser(null); return; }
    setExpandedUser(userId);
    if (!userRosters[userId]) {
      try {
        const r = await api.adminUserRosters(userId);
        setUserRosters(prev => ({ ...prev, [userId]: r.rosters }));
      } catch (e) { setMsg(String(e)); }
    }
  }

  async function handleDelRoster(rosterId: number, userId: number, name: string) {
    if (!confirm(L.delRosterConfirm(name))) return;
    try {
      await api.adminDelRoster(rosterId);
      setUserRosters(prev => ({ ...prev, [userId]: (prev[userId] ?? []).filter(r => r.id !== rosterId) }));
      setStats(prev => prev && { ...prev, totalRosters: prev.totalRosters - 1, users: prev.users.map(u => u.id === userId ? { ...u, roster_count: Math.max(0, u.roster_count - 1) } : u) });
    } catch (e) { setMsg(String(e)); }
  }

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir(key === 'username' ? 'asc' : 'desc'); }
  }

  const allUsers = stats?.users ?? [];
  const q = filter.trim().toLowerCase();
  const visibleUsers = allUsers
    .filter(u => q === '' || u.username.toLowerCase().includes(q))
    .sort((a, b) => {
      let d: number;
      if (sortKey === 'username') d = a.username.localeCompare(b.username);
      else if (sortKey === 'roster_count') d = a.roster_count - b.roster_count;
      else {
        const av = a[sortKey] ? new Date(a[sortKey] as string).getTime() : 0;
        const bv = b[sortKey] ? new Date(b[sortKey] as string).getTime() : 0;
        d = av - bv;
      }
      return sortDir === 'asc' ? d : -d;
    });
  const active7  = allUsers.filter(u => seenWithin(u.last_seen_at, 7)).length;
  const active30 = allUsers.filter(u => seenWithin(u.last_seen_at, 30)).length;
  const adminCount = allUsers.filter(u => u.is_admin).length;
  const emptyCount = allUsers.filter(u => u.roster_count === 0).length;
  const arrow = (key: SortKey) => (key === sortKey ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  // Translation editor: source strings + filtered key list (capped when unfiltered for perf)
  const SRC = sourceStrings();
  const tq = transFilter.trim().toLowerCase();
  const shownLangs: ('de' | 'es')[] = transLang === 'both' ? ['de', 'es'] : [transLang];
  // "untranslated" = the DE/ES value is empty or still identical to the English source
  const isUntranslated = (lang: 'de' | 'es', k: string) => {
    const v = transEdits[lang][k];
    return v == null || v.trim() === '' || v === SRC[k];
  };
  const transKeysAll = allTranslationKeys().filter(k => {
    if (tq !== '' && !(k.toLowerCase().includes(tq) || (SRC[k] ?? '').toLowerCase().includes(tq))) return false;
    if (transUntranslated && !shownLangs.some(l => isUntranslated(l, k))) return false;
    return true;
  });
  // The glossary adds ~290 keys on top of the UI labels, so show more before the list is cut;
  // the search box and the "untranslated only" filter are what actually narrow it down.
  const transKeys = transKeysAll.slice(0, 400);

  // normalised + validated sheet id (accepts a pasted URL); gates both the request and the link
  const srcSheetId = toSheetId(srcId);
  const srcIdOk = SHEET_ID_RE.test(srcSheetId);

  const toolbarBtn = 'text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-800 disabled:opacity-50';

  /**
   * Mark a row as known-and-accepted (or bring it back). Stored per faction in app_settings so the
   * decision survives sessions and is shared between admins — the alternative is everyone re-reading
   * the same accepted difference on every run until the real ones get ignored too.
   */
  async function toggleIgnore(row: SourceFinding | SourceGap, factionKey: string, label: string) {
    const key = ignoreKey(row);
    const list = srcIgnores[factionKey] ?? [];
    const next: api.SourceIgnores = { ...srcIgnores };
    next[factionKey] = list.some(i => i.key === key)
      ? list.filter(i => i.key !== key)
      : [...list, { key, label, by: adminUsername ?? undefined, at: new Date().toISOString() }];
    if (next[factionKey].length === 0) delete next[factionKey];
    setSrcIgnores(next);
    try { await api.adminSetSetting('source_ignores', next); }
    catch (e) { setMsg(String(e)); }
  }

  const isIgnored = (row: SourceFinding | SourceGap, factionKey: string) =>
    (srcIgnores[factionKey] ?? []).some(i => i.key === ignoreKey(row));

  /** The small "ignore / bring back" control shared by both lists. */
  function ignoreButton(row: SourceFinding | SourceGap, factionKey: string, label: string) {
    const ignored = isIgnored(row, factionKey);
    return (
      <button
        onClick={() => toggleIgnore(row, factionKey, label)}
        title={ignored ? L.srcUnignoreHint : L.srcIgnoreHint}
        className={`shrink-0 text-[9px] uppercase px-1.5 py-0.5 border ${
          ignored ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200'
                  : 'border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-300'
        }`}
      >{ignored ? L.srcUnignore : L.srcIgnore}</button>
    );
  }

  /**
   * Download the whole source check as one .json — every faction that was run, what differs and
   * what could not be compared. The long "action" sentences are left out: they are generated from
   * the other fields, and the point of the file is to be small enough to hand over instead of
   * pasting hundreds of rows.
   */
  function handleExportReport() {
    const runs: Record<string, SourceRun> = srcAll
      ?? (srcFindings ? { [srcFaction]: { findings: srcFindings, gaps: srcGaps ?? [], coverage: srcCoverage ?? { fetched: 0, total: 0 } } } : {});
    if (Object.keys(runs).length === 0) return;
    const report = {
      generatedAt: new Date().toISOString(),
      appVersion: CHANGELOG[0]?.version ?? null,
      factions: Object.fromEntries(Object.entries(runs).map(([key, run]) => [key, {
        coverage: run.coverage,
        ...(run.error ? { error: run.error } : {}),
        findings: run.findings.map(f => ({
          fix: f.fix, kind: f.kind, unit: f.unit, target: f.target, field: f.field,
          app: f.prod, sheet: f.source,
          ...(isIgnored(f, key) ? { ignored: true } : {}),
        })),
        gaps: run.gaps.map(g => ({
          fix: g.fix, kind: g.kind, unit: g.unit, what: g.what,
          ...(isIgnored(g, key) ? { ignored: true } : {}),
        })),
      }])),
    };
    downloadText(`custom40k-source-check-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(report, null, 2), 'application/json');
  }

  /** Who has to make the fix — the first thing to read on every row, so nobody hunts a spreadsheet
   *  cell for something only we can change (or waits on us for a typo in a tab). */
  function fixBadge(fix: FixOwner) {
    const style = fix === 'sheet' ? 'border-amber-700 text-amber-400 bg-amber-950/30'
      : fix === 'code' ? 'border-sky-800 text-sky-400 bg-sky-950/30'
      : 'border-zinc-700 text-zinc-500';
    return (
      <span
        title={fix === 'sheet' ? L.fixSheetHint : fix === 'code' ? L.fixCodeHint : L.fixUnknownHint}
        className={`shrink-0 w-14 text-center text-[8px] uppercase px-1 rounded border cursor-help ${style}`}
      >{fix === 'sheet' ? L.fixSheet : fix === 'code' ? L.fixCode : L.fixUnknown}</span>
    );
  }

  /** The list of things the comparison could not check. Same markup inline under a faction row in
   *  "Compare all" and under the single-faction panel. */
  function renderGaps(gaps: SourceGap[], factionKey: string) {
    const shown = srcShowIgnored ? gaps : gaps.filter(g => !isIgnored(g, factionKey));
    if (shown.length === 0) return null;
    return (
      <div className="mt-1 space-y-1.5 max-h-[45vh] overflow-y-auto border border-zinc-800 p-2">
        <p className="text-zinc-600 text-[10px] font-mono mb-1">{L.srcGapsHint}</p>
        {shown.map((g, i) => (
          <div key={i} className={`text-[11px] font-mono ${isIgnored(g, factionKey) ? 'opacity-40' : ''}`}>
            <div className="flex gap-2 items-center">
              {fixBadge(g.fix)}
              <span className="shrink-0 w-28 text-[9px] uppercase text-zinc-600">{g.kind}</span>
              <span className="text-zinc-300 shrink-0">{g.unit}</span>
              <span className="text-zinc-400 flex-1 truncate" title={g.what}>{g.what}</span>
              {ignoreButton(g, factionKey, `${g.unit}: ${g.what}`)}
            </div>
            {/* the action is the point of the row — always visible, never only a tooltip */}
            <div className="text-[10px] text-zinc-500 pl-[6.5rem] leading-snug">{g.action}</div>
          </div>
        ))}
      </div>
    );
  }

  /**
   * The findings list, with the Apply/Undo buttons bound to `factionKey` — so it works both under
   * the single-faction panel and expanded inline under a "Compare all" row, without first having to
   * switch the whole screen to that faction.
   */
  function renderFindings(factionKey: string, findings: SourceFinding[]) {
    const shown = srcShowIgnored ? findings : findings.filter(f => !isIgnored(f, factionKey));
    if (shown.length === 0) return <p className="text-green-500 text-[11px] font-mono">{L.srcNoDiff}</p>;
    return (
      <div className="space-y-1.5 max-h-[55vh] overflow-y-auto border border-zinc-800 p-2">
        {shown.map((f, i) => (
          <div key={i} className={`text-[11px] font-mono ${isIgnored(f, factionKey) ? 'opacity-40' : ''}`}>
          <div className="flex gap-2 items-center">
            {fixBadge(f.fix)}
            <span className={`shrink-0 w-14 text-[9px] uppercase ${
              f.kind === 'points' ? 'text-amber-500' : f.kind === 'stat' ? 'text-sky-500'
              : f.kind === 'sheet' ? 'text-red-500' : 'text-fuchsia-500'
            }`}>{f.kind}</span>
            <span className="text-zinc-300 flex-1 truncate" title={L.srcTabHint(f.unit)}>
              {L.srcCol(f.unit, f.target)} <span className="text-zinc-600">· {f.field}</span>
            </span>
            <span className="text-zinc-500 shrink-0">app <span className="text-red-400">{f.prod || '—'}</span></span>
            <span className="text-zinc-600 shrink-0">→</span>
            <span className="text-zinc-500 shrink-0">sheet <span className="text-green-400">{f.source}</span></span>
            {(() => {
              // 'sheet' findings are a problem in the source document — there is no trustworthy
              // value to copy into the app, so no button is offered.
              if (f.kind === 'sheet') return null;
              const k = overrideKey({ unit: f.unit, kind: f.kind, target: f.target, field: f.field });
              const active = (dataOverrides[factionKey] ?? []).find(o => overrideKey(o) === k);
              const busy = srcApplying === k;
              return active ? (
                <span className="shrink-0 flex items-center gap-1">
                  <span className="text-[8px] uppercase px-1 rounded border border-green-800 text-green-400 bg-green-950/30">{L.srcAppliedTag}</span>
                  <button
                    onClick={() => handleUndoFinding(f, factionKey)}
                    disabled={busy}
                    className="text-[9px] uppercase px-1.5 py-0.5 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-40"
                  >{busy ? L.srcApplying : L.srcUndo}</button>
                </span>
              ) : (
                <button
                  onClick={() => handleApplyFinding(f, factionKey)}
                  disabled={busy}
                  title={L.srcApplyHint}
                  className="shrink-0 text-[9px] uppercase px-1.5 py-0.5 border border-amber-800 text-amber-500 hover:border-amber-600 hover:text-amber-300 disabled:opacity-40"
                >{busy ? L.srcApplying : L.srcApply}</button>
              );
            })()}
            {ignoreButton(f, factionKey, `${f.unit} · ${f.target} · ${f.field}`)}
          </div>
          <div className="text-[10px] text-zinc-500 pl-[4.5rem] leading-snug">{f.action}</div>
          </div>
        ))}
      </div>
    );
  }

  const TAB_DEFS: { id: AdminTab; label: string; help: string }[] = [
    { id: 'overview', label: L.tabOverview, help: L.helpTabOverview },
    { id: 'users',    label: L.tabUsers,    help: L.helpTabUsers },
    { id: 'health',   label: L.tabHealth,   help: L.helpTabHealth },
    { id: 'audit',    label: L.tabAudit,    help: L.helpTabAudit },
    { id: 'announce', label: L.tabAnnounce, help: L.helpTabAnnounce },
    { id: 'factions', label: L.tabFactions, help: L.helpTabFactions },
    { id: 'i18n',     label: L.tabI18n,     help: L.helpTabI18n },
    { id: 'source',   label: L.tabSource,   help: L.helpTabSource },
  ];

  return (
    <div className="fixed inset-0 bg-zinc-950 z-[100] flex flex-col">
      {/* Control-panel header */}
      <div className="flex justify-between items-center px-4 py-3 bg-zinc-900 border-b border-zinc-700 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-[11px] px-2 py-1 border border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-800">{L.backToApp}</button>
          <span className="text-zinc-300 text-sm font-mono uppercase tracking-widest">{L.title}</span>
          {stats && <span className="hidden sm:inline text-zinc-500 text-xs font-mono">{L.usersSaved(stats.totalUsers, stats.totalRosters)}</span>}
        </div>
        <span className="inline-flex items-center">
          <button onClick={load} disabled={loading} className={toolbarBtn}>↻ {L.reload}</button>
          <Help text={L.helpReload} />
        </span>
      </div>

      {/* Tab nav */}
      <div className="flex flex-wrap gap-1 px-4 py-2 bg-zinc-900/60 border-b border-zinc-800 shrink-0">
        {TAB_DEFS.map(td => (
          <span key={td.id} className="inline-flex items-center">
            <button
              onClick={() => setTab(td.id)}
              className={`text-[11px] px-3 py-1 border font-mono uppercase tracking-wider ${tab === td.id ? 'border-amber-700 text-amber-400 bg-amber-950/20' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
            >{td.label}{td.id === 'overview' && pendingCount > 0 ? ` (${pendingCount})` : ''}</button>
            <Help text={td.help} />
          </span>
        ))}
      </div>

      {msg && <div className="mx-4 mt-3 text-red-400 text-xs font-mono bg-red-950/30 border border-red-800/50 px-3 py-2 shrink-0">{msg}</div>}

      {loading ? (
        <div className="p-8 text-center text-zinc-600 text-sm">{L.loading}</div>
      ) : !stats ? null : (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 w-full max-w-5xl mx-auto">
            {tab === 'overview' && (<>
            {/* Recovery requests */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-2">
                {L.recoveryTitle}
                {pendingCount > 0 && (
                  <span className="bg-amber-800 text-amber-200 px-1.5 py-0.5 text-[9px] rounded">{L.pending(pendingCount)}</span>
                )}
              </div>
              {requests.length === 0 ? (
                <p className="text-zinc-600 text-xs font-mono italic">{L.noRequests}</p>
              ) : (
                <div className="space-y-1.5">
                  {requests.map(r => (
                    <div key={r.id} className={`flex items-start gap-3 p-2 border text-xs font-mono ${
                      r.status === 'pending' ? 'border-amber-800/60 bg-amber-950/20' : 'border-zinc-800 opacity-50'
                    }`}>
                      <div className="flex-1 min-w-0">
                        <span className="text-amber-400">{r.username}</span>
                        <span className="text-zinc-600 ml-2">{fmt(r.created_at)}</span>
                        {r.message && <p className="text-zinc-400 text-[10px] mt-0.5 truncate">{r.message}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] uppercase px-1 ${
                          r.status === 'pending' ? 'text-amber-500' : r.status === 'resolved' ? 'text-green-500' : 'text-zinc-500'
                        }`}>{statusLabel(r.status)}</span>
                        {r.status === 'pending' && (
                          <button
                            onClick={() => handleResolve(r.id, r.username)}
                            disabled={resolving === r.id}
                            className="text-[10px] px-2 py-0.5 border border-amber-700 text-amber-400 hover:bg-amber-900/30 disabled:opacity-50"
                          >{resolving === r.id ? '…' : L.resolve}</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity summary */}
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              {[
                { label: L.active7, value: active7 },
                { label: L.active30, value: active30 },
                { label: L.admins, value: adminCount },
                { label: L.noArmies, value: emptyCount },
              ].map(s => (
                <div key={s.label} className="border border-zinc-800 bg-zinc-900/50 px-3 py-1.5">
                  <span className="text-zinc-500">{s.label}: </span>
                  <span className="text-zinc-200">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleExport} disabled={exporting} className={toolbarBtn}>{L.exportDb}</button>
              <Help text={L.helpExportDb} />
            </div>
            </>)}

            {tab === 'users' && (
            <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder={L.searchPlaceholder}
                className="flex-1 bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-800"
              />
              <span className="text-zinc-600 text-[10px] font-mono">{visibleUsers.length}/{allUsers.length}</span>
              <button
                onClick={() => downloadText(`custom40k-users-${new Date().toISOString().slice(0, 10)}.csv`, usersToCsv(allUsers))}
                disabled={allUsers.length === 0}
                className={toolbarBtn}
              >{L.exportCsv}</button>
            </div>
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th onClick={() => toggleSort('username')} className="text-left py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">{L.colUser}{arrow('username')}</th>
                  <th onClick={() => toggleSort('created_at')} className="text-left py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">{L.colRegistered}{arrow('created_at')}</th>
                  <th onClick={() => toggleSort('last_seen_at')} className="text-left py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">{L.colLastSeen}{arrow('last_seen_at')}</th>
                  <th onClick={() => toggleSort('roster_count')} className="text-center py-2 pr-3 text-zinc-500 font-normal cursor-pointer hover:text-zinc-300 select-none">{L.colArmies}{arrow('roster_count')}</th>
                  <th className="py-2 text-zinc-500 font-normal text-right">{L.colActions}</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map(u => (
                  <>
                    <tr key={u.id} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                      <td className="py-2 pr-3">
                        <span className={u.is_admin ? 'text-amber-400' : 'text-zinc-200'}>{u.username}</span>
                        {u.is_admin && <span className="ml-1 text-[10px] text-amber-600">inqui</span>}
                      </td>
                      <td className="py-2 pr-3 text-zinc-500">{fmt(u.created_at)}</td>
                      <td className="py-2 pr-3 text-zinc-400">{fmt(u.last_seen_at)}</td>
                      <td className="py-2 pr-3 text-center text-zinc-300">{u.roster_count}</td>
                      <td className="py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleUserRosters(u.id)}
                            disabled={u.roster_count === 0}
                            className="text-[11px] px-2 py-0.5 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-800 disabled:opacity-40"
                          >{expandedUser === u.id ? L.hideArmies : `${L.armies} (${u.roster_count})`}</button>
                          <button
                            onClick={() => handleResetPw(u.id, u.username)}
                            className="text-[11px] px-2 py-0.5 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-800"
                          >{L.resetPw}</button>
                          <button
                            onClick={() => handlePromote(u.id, u.username, !u.is_admin)}
                            className="text-[11px] px-2 py-0.5 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-800"
                          >{u.is_admin ? L.revokeAdmin : L.makeAdmin}</button>
                          <button
                            onClick={() => handleDelete(u.id, u.username)}
                            className="text-[11px] px-2 py-0.5 border border-red-900/50 text-red-700 hover:text-red-400 hover:border-red-700"
                          >{L.del}</button>
                        </div>
                      </td>
                    </tr>
                    {revealed[u.id] && (
                      <tr key={`${u.id}-rev`} className="bg-zinc-900/60">
                        <td colSpan={5} className="px-3 py-2 text-[11px]">
                          <span className="text-zinc-500">{L.tempPw}</span>
                          <span className="text-green-400 select-all">{revealed[u.id].pw}</span>
                          <span className="text-zinc-500 ml-4">{L.recovery}</span>
                          <span className="text-amber-400 select-all">{revealed[u.id].rc}</span>
                          <button onClick={() => setRevealed(p => { const n={...p}; delete n[u.id]; return n; })} className="ml-4 text-zinc-600 hover:text-zinc-400">{L.hide}</button>
                        </td>
                      </tr>
                    )}
                    {expandedUser === u.id && (
                      <tr key={`${u.id}-arm`} className="bg-zinc-900/40">
                        <td colSpan={5} className="px-3 py-2">
                          {(userRosters[u.id] ?? []).length === 0 ? (
                            <p className="text-zinc-600 text-[10px] font-mono italic">{L.userNoArmies}</p>
                          ) : (
                            <div className="space-y-1">
                              {(userRosters[u.id] ?? []).map(r => (
                                <div key={r.id} className="flex items-center gap-2 text-[10px] font-mono">
                                  <span className="text-zinc-200 flex-1 truncate">{r.name}</span>
                                  {r.faction && <span className="text-zinc-500">{r.faction}</span>}
                                  {r.is_public && <span className="text-green-600">{L.publicBadge}</span>}
                                  <span className="text-zinc-600">{fmt(r.updated_at)}</span>
                                  <button
                                    onClick={() => handleDelRoster(r.id, u.id, r.name)}
                                    className="px-1.5 py-0.5 border border-red-900/50 text-red-700 hover:text-red-400 hover:border-red-700"
                                  >{L.delRoster}</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
            </div>
            )}

            {tab === 'health' && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-2">
                {L.dataHealthTitle}
                <button onClick={handleRunHealth} disabled={healthRunning} className={`${toolbarBtn} normal-case`}>{healthRunning ? L.checking : L.check}</button>
                {health && (
                  <span className={`px-1.5 py-0.5 text-[9px] rounded normal-case tracking-normal ${health.length === 0 ? 'bg-green-900 text-green-300' : 'bg-amber-800 text-amber-200'}`}>
                    {health.length === 0 ? L.noFindings : L.findings(health.length)}
                  </span>
                )}
              </div>
              <p className="text-zinc-600 text-[10px] font-mono mb-2">{L.dataHealthDesc}</p>
              {health && health.length > 0 && (
                <div className="space-y-0.5 max-h-[60vh] overflow-y-auto border border-zinc-800 p-2">
                  {health.map((f, i) => (
                    <div key={i} className="text-[10px] font-mono flex gap-2">
                      <span className="text-amber-700 shrink-0 w-4">{f.category}</span>
                      <span className="text-zinc-500 shrink-0">{f.faction}{f.unit ? ` · ${f.unit}` : ''}</span>
                      <span className="text-zinc-400">{f.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}

            {tab === 'audit' && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-2">{L.auditTitle}</div>
              {auditLog.length === 0 ? (
                <p className="text-zinc-600 text-xs font-mono italic">{L.auditEmpty}</p>
              ) : (
                <div className="space-y-0.5 max-h-72 overflow-y-auto border border-zinc-800 p-2">
                  {auditLog.map(a => (
                    <div key={a.id} className="text-[10px] font-mono flex gap-2">
                      <span className="text-zinc-600 shrink-0">{fmt(a.created_at)}</span>
                      <span className="text-amber-500 shrink-0">{a.admin_username ?? '—'}</span>
                      <span className="text-zinc-300 shrink-0">{a.action}</span>
                      <span className="text-zinc-400 truncate">{a.target_username ?? ''}{a.detail ? ` · ${a.detail}` : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            )}

            {tab === 'announce' && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-3">
                {L.annSectionTitle}
                <label className="flex items-center gap-1.5 normal-case tracking-normal text-zinc-400 text-[11px] font-mono">
                  <input type="checkbox" checked={annEnabled} onChange={e => setAnnEnabled(e.target.checked)} />
                  {L.annEnabled}
                </label>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-zinc-500 text-[10px] font-mono">{L.annVersion}</label>
                <input
                  value={annVersion}
                  onChange={e => setAnnVersion(e.target.value)}
                  placeholder="1.53"
                  className="w-24 bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-800"
                />
                <span className="text-zinc-600 text-[9px] font-mono">{L.annVersionHint}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {EDIT_LANGS.map(lang => {
                  const f = annText[lang];
                  const set = (patch: Partial<AnnFields>) => setAnnText(prev => ({ ...prev, [lang]: { ...prev[lang], ...patch } }));
                  const inp = 'w-full bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-amber-800';
                  return (
                    <div key={lang} className="border border-zinc-800 p-2 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-amber-600 text-[10px] uppercase tracking-widest">{lang}</span>
                        <button
                          onClick={() => handleTranslateAnnFrom(lang)}
                          disabled={translatingFrom !== null}
                          title={L.annTranslate}
                          className="text-[9px] px-1.5 py-0.5 border border-sky-900/60 text-sky-400 hover:bg-sky-900/20 disabled:opacity-50"
                        >{translatingFrom === lang ? L.annTranslating : '↺ ⇄'}</button>
                      </div>
                      <input className={inp} placeholder={L.annFieldTitle} value={f.title} onChange={e => set({ title: e.target.value })} />
                      <input className={inp} placeholder={L.annFieldIntro} value={f.intro} onChange={e => set({ intro: e.target.value })} />
                      <textarea className={`${inp} h-24 resize-y`} placeholder={L.annFieldLines} value={f.lines} onChange={e => set({ lines: e.target.value })} />
                      <input className={inp} placeholder={L.annFieldContrib} value={f.contrib} onChange={e => set({ contrib: e.target.value })} />
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={handleSaveAnnouncement} disabled={savingKey === 'announcement'} className={toolbarBtn}>
                  {savingKey === 'announcement' ? L.saving : L.save}
                </button>
                {savedKey === 'announcement' && <span className="text-green-500 text-[10px] font-mono">{L.saved}</span>}
              </div>
            </div>

            )}

            {tab === 'factions' && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-1">{L.factionSectionTitle}</div>
              <p className="text-zinc-600 text-[10px] font-mono mb-2">{L.factionAvailHint}</p>
              <div className="grid gap-x-4 gap-y-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                {ALL_FACTIONS.map(f => (
                  <label key={f.key} className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300">
                    <input
                      type="checkbox"
                      checked={flags[f.key] ?? f.defaultAvailable}
                      onChange={e => setFlags(prev => ({ ...prev, [f.key]: e.target.checked }))}
                    />
                    {f.name}
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={handleSaveFlags} disabled={savingKey === 'faction_flags'} className={toolbarBtn}>
                  {savingKey === 'faction_flags' ? L.saving : L.save}
                </button>
                {savedKey === 'faction_flags' && <span className="text-green-500 text-[10px] font-mono">{L.saved}</span>}
              </div>
            </div>

            )}

            {tab === 'i18n' && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-1">{L.transSectionTitle}</div>
              <p className="text-zinc-600 text-[10px] font-mono mb-2">{L.transHint}</p>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <input
                  value={transFilter}
                  onChange={e => setTransFilter(e.target.value)}
                  placeholder={L.transSearch}
                  className="flex-1 min-w-[140px] bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-800"
                />
                <select
                  value={transLang}
                  onChange={e => setTransLang(e.target.value as 'both' | 'de' | 'es')}
                  className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-amber-800"
                >
                  <option value="both">{L.transBoth}</option>
                  <option value="de">DE</option>
                  <option value="es">ES</option>
                </select>
                <label className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                  <input type="checkbox" checked={transUntranslated} onChange={e => setTransUntranslated(e.target.checked)} />
                  {L.transOnlyUntranslated}
                </label>
                <span className="text-zinc-600 text-[10px] font-mono">{transKeys.length}/{transKeysAll.length}</span>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto border border-zinc-800 p-2">
                {transKeys.map(k => (
                  <div key={k} className="border-b border-zinc-900 pb-1.5">
                    <div className="flex gap-2 text-[10px] font-mono mb-1">
                      <span className="text-amber-700 shrink-0">{k}</span>
                      <span className="text-zinc-500 truncate" title={SRC[k]}>{L.transSource}: {SRC[k]}</span>
                    </div>
                    <div className={`grid gap-1.5 ${shownLangs.length > 1 ? 'md:grid-cols-2' : ''}`}>
                      {shownLangs.map(lang => (
                        <div key={lang} className="flex items-center gap-1.5">
                          <span className={`text-[9px] uppercase w-4 shrink-0 ${isUntranslated(lang, k) ? 'text-red-500' : 'text-zinc-600'}`}>{lang}</span>
                          <input
                            value={transEdits[lang][k] ?? ''}
                            onChange={e => setTransEdits(prev => ({ ...prev, [lang]: { ...prev[lang], [k]: e.target.value } }))}
                            className="flex-1 bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-amber-800"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {transKeysAll.length > transKeys.length && (
                  <p className="text-zinc-600 text-[10px] font-mono italic pt-1">+{transKeysAll.length - transKeys.length} more — refine the filter to see them.</p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={handleSaveTranslations} disabled={savingKey === 'translations'} className={toolbarBtn}>
                  {savingKey === 'translations' ? L.saving : L.save}
                </button>
                {savedKey === 'translations' && <span className="text-green-500 text-[10px] font-mono">{L.saved}</span>}
              </div>
            </div>
            )}

            {tab === 'source' && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-600 mb-1">{L.tabSource}</div>
              <p className="text-zinc-600 text-[10px] font-mono mb-2">{L.srcHint} {L.srcApplyHint}</p>
              {(dataOverrides[srcFaction]?.length ?? 0) > 0 && (
                <p className="text-green-600 text-[10px] font-mono mb-2">
                  {L.srcOverridesActive(dataOverrides[srcFaction].length)}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <select
                  value={srcFaction}
                  onChange={e => { setSrcFaction(e.target.value); setSrcId(sourceIds[e.target.value] ?? ''); setSrcSuppId(sourceIds[supplementKey(e.target.value)] ?? DEFAULT_SUPPLEMENT_ID); setSrcFindings(null); }}
                  className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-amber-800"
                >
                  {SOURCE_FACTIONS.map(f => <option key={f.key} value={f.key}>{f.name}</option>)}
                </select>
                <input
                  value={srcId}
                  onChange={e => setSrcId(e.target.value)}
                  placeholder={L.srcSpreadsheetId}
                  className="flex-1 min-w-[200px] bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-800"
                />
                <input
                  value={srcSuppId}
                  onChange={e => setSrcSuppId(e.target.value)}
                  placeholder={L.srcSupplementId}
                  title={L.srcSupplementHint}
                  className="flex-1 min-w-[200px] bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-800"
                />
                <button onClick={handleSourceCompare} disabled={srcRunning || !srcIdOk} className={toolbarBtn}>
                  {srcRunning ? L.srcComparing : L.srcCompare}
                </button>
                <button onClick={handleSourceCompareAll} disabled={srcRunning} className={toolbarBtn}>
                  {L.srcCompareAll}
                </button>
                <button
                  onClick={handleExportReport}
                  disabled={srcRunning || (!srcAll && !srcFindings)}
                  title={L.srcExportHint}
                  className={toolbarBtn}
                >{L.srcExport}</button>
                {(() => {
                  const n = Object.values(srcIgnores).reduce((s, l) => s + l.length, 0);
                  if (n === 0) return null;
                  return (
                    <button onClick={() => setSrcShowIgnored(v => !v)} className={toolbarBtn} title={L.srcIgnoreHint}>
                      {srcShowIgnored ? L.srcHideIgnored(n) : L.srcShowIgnored(n)}
                    </button>
                  );
                })()}
              </div>
              {srcAllProgress && (
                <p className="text-amber-500 text-[10px] font-mono mb-2">
                  {L.srcAllProgress(srcAllProgress.done, srcAllProgress.total, srcAllProgress.current)}
                </p>
              )}
              {srcAll && (
                <div className="mb-3 border border-zinc-800">
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500 px-2 py-1 border-b border-zinc-800">{L.srcAllTitle}</div>
                  {Object.entries(srcAll).map(([key, run]) => {
                    const name = SOURCE_FACTIONS.find(f => f.key === key)?.name ?? key;
                    const missing = run.coverage.total - run.coverage.fetched;
                    const open = !!srcExpanded[key];
                    const sheetId = toSheetId(sourceIds[key] ?? '');
                    return (
                      <div key={key} className="border-b border-zinc-900">
                        <button
                          onClick={() => setSrcExpanded(m => ({ ...m, [key]: !m[key] }))}
                          className={`w-full text-left text-[11px] font-mono flex gap-3 items-center px-2 py-1 hover:bg-zinc-900 ${open ? 'bg-zinc-900' : ''}`}
                        >
                          <span className="shrink-0 text-zinc-600">{open ? '▾' : '▸'}</span>
                          <span className="flex-1 truncate text-zinc-300">{name}</span>
                          {run.error ? (
                            <span className="text-red-500 truncate max-w-[50%]" title={run.error}>{L.srcAllFailed}</span>
                          ) : (
                            <>
                              <span className={missing > 0 ? 'text-amber-500' : 'text-zinc-600'}>
                                {run.coverage.fetched}/{run.coverage.total}
                              </span>
                              <span className={run.findings.length > 0 ? 'text-fuchsia-400' : 'text-green-600'}>
                                {L.srcAllDiffs(run.findings.length)}
                              </span>
                              <span className={run.gaps.length > 0 ? 'text-amber-500' : 'text-zinc-600'}>
                                {L.srcAllGaps(run.gaps.length)}
                              </span>
                            </>
                          )}
                        </button>
                        {open && (
                          <div className="px-2 pb-2">
                            {run.error ? (
                              <p className="text-red-400 text-[10px] font-mono break-all">{run.error}</p>
                            ) : (
                              <>
                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                  {SHEET_ID_RE.test(sheetId) && (
                                    <a
                                      href={`https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/edit`}
                                      target="_blank" rel="noopener noreferrer"
                                      className="text-[10px] font-mono text-sky-400 hover:text-sky-300 underline"
                                    >{L.srcOpenSheet}</a>
                                  )}
                                  {(dataOverrides[key]?.length ?? 0) > 0 && (
                                    <span className="text-green-600 text-[10px] font-mono">{L.srcOverridesActive(dataOverrides[key].length)}</span>
                                  )}
                                </div>
                                {run.gaps.length > 0 && renderGaps(run.gaps, key)}
                                <div className="mt-1">{renderFindings(key, run.findings)}</div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {srcCoverage && (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <p className={`text-[10px] font-mono ${srcCoverage.fetched < srcCoverage.total ? 'text-amber-500' : 'text-zinc-500'}`}>
                    {L.srcCoverage(srcCoverage.fetched, srcCoverage.total)}
                  </p>
                  {srcIdOk && (
                    <a
                      href={`https://docs.google.com/spreadsheets/d/${encodeURIComponent(srcSheetId)}/edit`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-[10px] font-mono text-sky-400 hover:text-sky-300 underline"
                    >{L.srcOpenSheet}</a>
                  )}
                </div>
              )}
              {srcGaps && (
                <div className="mb-2">
                  <button
                    onClick={() => setSrcShowGaps(v => !v)}
                    className={`text-[10px] font-mono underline ${srcGaps.length > 0 ? 'text-amber-500 hover:text-amber-300' : 'text-green-600'}`}
                  >
                    {srcGaps.length === 0 ? L.srcGapsNone : `${srcShowGaps ? '▾' : '▸'} ${L.srcGapsCount(srcGaps.length)}`}
                  </button>
                  {srcShowGaps && srcGaps.length > 0 && renderGaps(srcGaps, srcFaction)}
                </div>
              )}
              {srcFindings && renderFindings(srcFaction, srcFindings)}
            </div>
            )}
          </div>
        )}
    </div>
  );
}
