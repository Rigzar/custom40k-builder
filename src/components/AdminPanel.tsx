import { useEffect, useMemo, useRef, useState } from 'react';
import * as api from '../lib/api';
import { useLanguage, setTranslationOverrides, allTranslationKeys, defaultString, sourceStrings, type Language } from '../i18n';
import { runDataHealth, type HealthFinding } from '../engine/dataHealth';
import { abilityKey, ruleStrings } from '../data/coreRules';
import { FACTION_LOADERS } from '../data/loaders';
import { ALL_FACTIONS, DEFAULT_CODEX_VERSIONS } from '../data/factionCatalog';
import { PointsCalculator } from './PointsCalculator';
import { useAuth } from '../hooks/useAuth';

// Languages a translator edits (English is the source, shown read-only).
type TransLang = Exclude<Language, 'en'>;
const TRANS_LANGS: TransLang[] = ['de', 'es', 'ru', 'ja'];

/** One place a search phrase occurs, precise enough for the creator to find it in his spreadsheet. */
type TextHit = { faction: string; where: string; field: string; text: string };

/**
 * Every string in a faction dataset, with a readable path.
 *
 * WHY A BLIND WALK AND NOT A CURATED FIELD LIST: the creator asked "show me everywhere this wording
 * is used" so he can retire a phrase in favour of a new special rule. A curated list is exactly the
 * thing that would silently miss the one option header nobody remembered, which is the failure the
 * search exists to prevent. So it walks the whole object; a field the search shouldn't have found
 * is a cheap thing to ignore, a field it missed is a rule left half-renamed.
 */
function walkStrings(node: unknown, path: string[], emit: (path: string[], text: string) => void, depth = 0): void {
  if (depth > 14) return;
  if (typeof node === 'string') { if (node.length > 1) emit(path, node); return; }
  if (Array.isArray(node)) { for (const v of node) walkStrings(v, path, emit, depth + 1); return; }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) walkStrings(v, path.concat(k), emit, depth + 1);
  }
}

/**
 * Default source spreadsheets by faction (creator's live Google Sheets). Extracted straight from
 * the hyperlinks embedded in the creator's own Custom40k Core Rules document (2026-08-23) —
 * every faction/supplement it links to a sheet for, keyed to match FACTION_LOADERS. The admin
 * can still override any of these through the source_sheets setting, which always
 * wins over this default. The codex version / content checks send this map to the server;
 * the Source check tab that used to edit it was retired on 2026-10-04.
 *
 * RESOLVED 2026-08-24: the Core Rules doc links "Tyranids" to two different sheet ids
 * (1Os-J6QK4quRtd0K6ocOsbaRMHd7PimPaQpRZw8kR_5M and 1-oox_d8xDqNM7hlMKLey1779tDGhUPpPJ3KeHRusGqA).
 * Fetched both live titles: the first is "Tyranids 1.05" (matches `Codex/Tyranids 1.05.ods`
 * exactly), the second is "Tyranids Custom Edit" — clearly a personal scratch copy, not canon.
 * The default below was already the correct one; no creator confirmation needed.
 */
const DEFAULT_SOURCE_IDS: Record<string, string> = {
  chaos_space_marines: '1Tj4zAtpprqI2W5VeIoV_HsuzhX_3XGhDMMgM2axOiBw',
  chaos_daemons: '1t4UjzvS44a2h-x5KJGM-GyIou66yt0XfpOqqjAE1zl8',
  space_marines: '16Ri3G9Jx1NAzguMbTKtxsL8uaOq6hik3h7NVuU85mZA',
  imperial_guard: '1nii7VyPLnNHlRlpJTxsh79P7qo1WT3D-yJM0g88CbZM',
  adeptus_mechanicus: '1uufTN0BOMRNtjSWfFJzEtfXUmpHdU8WTdKDUoXNLs8w',
  adeptus_custodes: '1Ic420krL5mcf3_E_vwmwLnGoT1hZ9Qzl0IxWeJ79yoI',
  adeptus_sororitas: '1t6sB5Ls5UdXu5LE61Ab_2OOgxD4m2TC6hFvsEy0bP3k',
  grey_knights: '1XkDkdshwkySGDwBaF4sQblDcE4xITkm1iSSlZSUE_mk',
  inquisition: '1krDncaF0CSf6bDIeA-j20dAo3tqkphkeDd2weq56MN4',
  assassins: '1NZepq8IfXgWs9mmZMxg4emgOxTPP5VfVNfRZ3ryh5f4',
  tau_empire: '1S1Uub6VvvlBuxlqh61S5DhZYIKtdRHvkRs1CsIRgu8s',
  necrons: '1hkc7MKcM4NrWr3GWIKcF9lYBx55CfQ9pBI6srKuzwOA',
  orks: '1gt2q98cnPczVyaujVWX56r2F_GJXBFp8IW9VpAWZ6qI',
  eldar: '139EqmDtxDjDZ4t6tllqHKjATrTpKQgJks7UzmKkUSkw',
  dark_eldar: '1SGc2WinOPa4gy66gICT4KiczzOgugDMe-v5JGz-bPQ8',
  genestealer_cults: '1s0RwILJINi2QcCYnpjQ8und3QRoTDZWp83UJGlo8hqQ',
  harlequins: '1E_9Vy6kWaAUXVBV-BiyJK4GD7_r72cYwEa115_G2Dec',
  leagues_of_votann: '1lZ6MxdCM710N-d4ba9RUSdhmeN8iJjzM5hlpVf73iPY',
  tyranids: '1Os-J6QK4quRtd0K6ocOsbaRMHd7PimPaQpRZw8kR_5M', // see KNOWN GAP above
  horus_heresy: '1vRRoUGkH3HhzZYQk6_3Hp0pSlWGWb9BKaz3VrYfYmFU',
  legio_titanicus: '1SrBhi_8b77QwqoI03xNDxgOwgt-ePmqRQvA5dyquYtM',
};

/** Every dataset the app can load, by key and display name (the "Find text" tab and the datasheet-text picker). */
const SOURCE_FACTIONS: { key: string; name: string }[] = Object.keys(FACTION_LOADERS).map(key => ({
  key,
  name: ALL_FACTIONS.find(f => f.key === key)?.name
    ?? key.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
}));

type AdminTab = 'overview' | 'users' | 'health' | 'audit' | 'announce' | 'factions' | 'i18n' | 'find' | 'calc';

const EDIT_LANGS: Language[] = ['en', 'de', 'es', 'ru', 'ja'];
type AnnFields = { title: string; intro: string; lines: string; contrib: string };
const emptyAnnFields = (): AnnFields => ({ title: '', intro: '', lines: '', contrib: '' });
/** Read one language's fields out of a stored announcement setting (lines array → textarea text). */
function annFieldsFrom(ann: api.AnnouncementSetting, lang: Language): AnnFields {
  const t = ann.text?.[lang];
  if (!t) return emptyAnnFields();
  return { title: t.title ?? '', intro: t.intro ?? '', lines: (t.lines ?? []).join('\n'), contrib: t.contrib ?? '' };
}

interface Props {
  onClose: () => void;
  isAdmin: boolean;
  /** Limited admin rank ("Interrogator", one below Inquisitor): translations-only. When true and
   *  `isAdmin` is false, the panel only shows the i18n and find tabs — enforced again server-side
   *  in api/admin/[action].js, this is just what keeps the UI from offering doors that lead nowhere. */
  isInterrogator: boolean;
}

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
  makeInterrogator: string; revokeInterrogator: string; interrogatorBadge: string;
  resetPwConfirm: (u: string) => string;
  deleteConfirm: (u: string) => string;
  promoteConfirm: (grant: boolean, u: string) => string;
  interrogatorConfirm: (grant: boolean, u: string) => string;
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
  settingsLoadFailed: string;
  transImportTitle: string; transImportHint: string; transImportBtn: string;
  transImportResult: (ok: number, bad: number, sample: string[]) => string;
  transOnlyUntranslated: string;
  transNoDatasheets: string; transAbilitiesHint: string;
  transAbilitiesLoaded: (n: number) => string; transBoth: string;
  annTranslate: string; annTranslating: string;
  backToApp: string;
  tabOverview: string; tabUsers: string; tabHealth: string; tabAudit: string; tabAnnounce: string; tabFactions: string; tabI18n: string; tabFind: string; tabCalc: string;
  helpTabOverview: string; helpTabUsers: string; helpTabHealth: string; helpTabAudit: string; helpTabAnnounce: string; helpTabFactions: string; helpTabI18n: string; helpTabFind: string; helpTabCalc: string;
  catDashboard: string; catUsers: string; catContent: string; catDataAudit: string; catTools: string;
  codexVerTitle: string; codexVerHint: string;
  findHint: string; findPlaceholder: string; findRun: string; findRunning: string; findWhole: string; findCase: string;
  findNone: string; findCount: (hits: number, factions: number) => string; findExport: string; findScanning: (f: string) => string;
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
    makeInterrogator: '+interro', revokeInterrogator: '−interro', interrogatorBadge: 'interro',
    resetPwConfirm: u => `Reset password for "${u}"?`,
    deleteConfirm: u => `DELETE account "${u}" and all their saves? This cannot be undone.`,
    promoteConfirm: (grant, u) => `${grant ? 'Grant' : 'Revoke'} Inquisitor for "${u}"?`,
    interrogatorConfirm: (grant, u) => `${grant ? 'Grant' : 'Revoke'} Interrogator (translations only) for "${u}"?`,
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
    transImportTitle: 'Import terms',
    transImportHint: 'Paste rows from the terms spreadsheet: English, German, Spanish, separated by tabs (a leading Category column is ignored). Matched by the English text. This only fills the fields below — press Save to store them.',
    transImportBtn: 'Fill fields',
    transImportResult: (ok, bad, sample) => bad === 0 ? `${ok} terms matched and filled in.` : `${ok} matched, ${bad} not found (no translatable string has that English text): ${sample.join(', ')}${bad > sample.length ? ' …' : ''}`,
    settingsLoadFailed: 'Settings could not be loaded, so saving is disabled — saving now would overwrite the stored translations, announcement and flags with empty defaults. Reload the panel.',
    transSectionTitle: 'UI translations',
    transHint: 'Edit the German / Spanish text of any interface string. English is the source. Fields left empty or unchanged keep the built-in text. Saved changes go live for everyone.',
    transSearch: 'Filter strings (key or English text)…', transSource: 'EN (source)',
    transOnlyUntranslated: 'only untranslated',
    transNoDatasheets: 'Datasheet texts: none',
    transAbilitiesLoaded: n => `${n} datasheet texts, listed first`,
    transAbilitiesHint: 'Also load one codex\'s datasheet ability texts ("Fearless, Synapse", "Advisor: …"). They are keyed by the English text, so a sentence shared by several units is translated once. Edit and save them like any other string.', transBoth: 'DE + ES + RU + JA',
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
    tabFind: 'Find text',
    tabCalc: 'Calculator',
    helpTabCalc: 'The game author\u2019s own points calculator, with his special-rule price list. Reference only \u2014 it changes nothing in the app.',
    codexVerTitle: 'Codex versions',
    codexVerHint: 'The version and readiness badge on each faction button. Saving publishes immediately \u2014 no deploy needed.',
    helpTabFind: 'Search every faction\'s data for a word or phrase and list every place it appears.',
    catDashboard: 'Dashboard', catUsers: 'Users', catContent: 'Content', catDataAudit: 'Data Audit', catTools: 'Tools',
    findHint: 'Type any wording — an ability, a rules phrase, a weapon name — and this lists every place it appears across all factions: unit abilities, weapon abilities, option headers, armoury descriptions and the rules glossary. Useful before replacing a phrase with a new special rule. Read-only.',
    findPlaceholder: 'e.g. Can only be used with a Charge order',
    findRun: 'Search', findRunning: 'Searching…',
    findWhole: 'Whole words only', findCase: 'Match case',
    findNone: 'Not found anywhere.',
    findCount: (h, f) => `${h} ${h === 1 ? 'hit' : 'hits'} in ${f} ${f === 1 ? 'faction' : 'factions'}`,
    findExport: 'Export .json', findScanning: f => `Scanning ${f}…`,
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
    makeInterrogator: '+interro', revokeInterrogator: '−interro', interrogatorBadge: 'interro',
    resetPwConfirm: u => `Passwort für "${u}" zurücksetzen?`,
    deleteConfirm: u => `Konto "${u}" und alle Speicherstände LÖSCHEN? Kann nicht rückgängig gemacht werden.`,
    promoteConfirm: (grant, u) => `Inquisitor für "${u}" ${grant ? 'gewähren' : 'entziehen'}?`,
    interrogatorConfirm: (grant, u) => `Interrogator (nur Übersetzungen) für "${u}" ${grant ? 'gewähren' : 'entziehen'}?`,
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
    transImportTitle: 'Begriffe importieren',
    transImportHint: 'Zeilen aus der Begriffstabelle einfügen: Englisch, Deutsch, Spanisch, durch Tabs getrennt (eine führende Kategorie-Spalte wird ignoriert). Zuordnung über den englischen Text. Füllt nur die Felder unten — zum Speichern auf Speichern drücken.',
    transImportBtn: 'Felder füllen',
    transImportResult: (ok, bad, sample) => bad === 0 ? `${ok} Begriffe zugeordnet und eingetragen.` : `${ok} zugeordnet, ${bad} nicht gefunden (kein übersetzbarer Text mit diesem englischen Wortlaut): ${sample.join(', ')}${bad > sample.length ? ' …' : ''}`,
    settingsLoadFailed: 'Einstellungen konnten nicht geladen werden, Speichern ist deshalb deaktiviert — es würde die gespeicherten Übersetzungen, die Ankündigung und die Flags mit leeren Standardwerten überschreiben. Panel neu laden.',
    transSectionTitle: 'UI-Übersetzungen',
    transHint: 'Bearbeite den deutschen / spanischen Text jeder Oberflächen-Zeichenkette. Englisch ist die Quelle. Leere oder unveränderte Felder behalten den eingebauten Text. Gespeicherte Änderungen gehen für alle live.',
    transSearch: 'Zeichenketten filtern (Schlüssel oder engl. Text)…', transSource: 'EN (Quelle)',
    transOnlyUntranslated: 'nur unübersetzte',
    transNoDatasheets: 'Datenblatt-Texte: keine',
    transAbilitiesLoaded: n => `${n} Datenblatt-Texte, zuerst gelistet`,
    transAbilitiesHint: 'Zusätzlich die Fähigkeitstexte eines Codex laden („Fearless, Synapse\", „Advisor: …\"). Sie werden über den englischen Text adressiert, ein von mehreren Einheiten geteilter Satz wird also nur einmal übersetzt. Bearbeiten und speichern wie jede andere Zeichenkette.', transBoth: 'DE + ES + RU + JA',
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
    tabFind: 'Text suchen',
    tabCalc: 'Rechner',
    helpTabCalc: 'Der Punkterechner des Autors, mit seiner Sonderregel-Preisliste. Nur Nachschlagewerk \u2014 \u00e4ndert nichts in der App.',
    codexVerTitle: 'Codex-Versionen',
    codexVerHint: 'Version und Status auf jedem Fraktions-Button. Speichern ver\u00f6ffentlicht sofort \u2014 kein Deploy n\u00f6tig.',
    helpTabFind: 'Alle Fraktionsdaten nach einem Wort oder Satz durchsuchen und jede Fundstelle auflisten.',
    catDashboard: 'Übersicht', catUsers: 'Nutzer', catContent: 'Inhalte', catDataAudit: 'Datenprüfung', catTools: 'Werkzeuge',
    findHint: 'Gib eine beliebige Formulierung ein — eine Fähigkeit, einen Regelsatz, einen Waffennamen — und hier erscheint jede Fundstelle über alle Fraktionen hinweg: Einheiten-Fähigkeiten, Waffen-Fähigkeiten, Options-Überschriften, Arsenal-Beschreibungen und das Regelglossar. Praktisch, bevor man eine Formulierung durch eine neue Spezialregel ersetzt. Nur Lesen.',
    findPlaceholder: 'z. B. Can only be used with a Charge order',
    findRun: 'Suchen', findRunning: 'Suche…',
    findWhole: 'Nur ganze Wörter', findCase: 'Groß-/Kleinschreibung',
    findNone: 'Nirgends gefunden.',
    findCount: (h, f) => `${h} ${h === 1 ? 'Treffer' : 'Treffer'} in ${f} ${f === 1 ? 'Fraktion' : 'Fraktionen'}`,
    findExport: '.json exportieren', findScanning: f => `Durchsuche ${f}…`,
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
    makeInterrogator: '+interro', revokeInterrogator: '−interro', interrogatorBadge: 'interro',
    resetPwConfirm: u => `¿Resetear la contraseña de "${u}"?`,
    deleteConfirm: u => `¿BORRAR la cuenta "${u}" y todos sus guardados? No se puede deshacer.`,
    promoteConfirm: (grant, u) => `¿${grant ? 'Otorgar' : 'Retirar'} Inquisidor a "${u}"?`,
    interrogatorConfirm: (grant, u) => `¿${grant ? 'Otorgar' : 'Retirar'} Interrogator (solo traducciones) a "${u}"?`,
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
    transImportTitle: 'Importar términos',
    transImportHint: 'Pega filas de la hoja de términos: inglés, alemán, español, separados por tabuladores (una primera columna de categoría se ignora). Se emparejan por el texto en inglés. Solo rellena los campos de abajo — pulsa Guardar para almacenarlos.',
    transImportBtn: 'Rellenar campos',
    transImportResult: (ok, bad, sample) => bad === 0 ? `${ok} términos emparejados y rellenados.` : `${ok} emparejados, ${bad} no encontrados (ningún texto traducible tiene ese inglés): ${sample.join(', ')}${bad > sample.length ? ' …' : ''}`,
    settingsLoadFailed: 'No se pudieron cargar los ajustes, así que guardar está desactivado — guardar ahora sobrescribiría las traducciones, el anuncio y los flags guardados con valores por defecto vacíos. Recarga el panel.',
    transSectionTitle: 'Traducciones de la interfaz',
    transHint: 'Edita el texto en alemán / español de cualquier cadena de la interfaz. El inglés es la fuente. Los campos vacíos o sin cambios conservan el texto original. Los cambios guardados se aplican en vivo para todos.',
    transSearch: 'Filtrar cadenas (clave o texto en inglés)…', transSource: 'EN (fuente)',
    transOnlyUntranslated: 'solo sin traducir',
    transNoDatasheets: 'Textos de ficha: ninguno',
    transAbilitiesLoaded: n => `${n} textos de ficha, al principio de la lista`,
    transAbilitiesHint: 'Carga además los textos de habilidad de un códex (\"Fearless, Synapse\", \"Advisor: …\"). Se indexan por el texto en inglés, así que una frase que comparten varias unidades se traduce una sola vez. Se editan y guardan como cualquier otra cadena.', transBoth: 'DE + ES + RU + JA',
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
    tabFind: 'Buscar texto',
    tabCalc: 'Calculadora',
    helpTabCalc: 'La calculadora de puntos del autor, con su lista de precios de reglas especiales. Solo consulta \u2014 no cambia nada en la app.',
    codexVerTitle: 'Versiones de codex',
    codexVerHint: 'La versi\u00f3n y el estado que salen en cada bot\u00f3n de facci\u00f3n. Guardar publica al momento \u2014 sin desplegar.',
    helpTabFind: 'Busca una palabra o frase en los datos de todas las facciones y lista dónde aparece.',
    catDashboard: 'Resumen', catUsers: 'Usuarios', catContent: 'Contenido', catDataAudit: 'Auditoría de datos', catTools: 'Herramientas',
    findHint: 'Escribe cualquier texto — una habilidad, una frase de reglas, un nombre de arma — y aquí sale cada sitio donde aparece en todas las facciones: habilidades de unidad, habilidades de arma, cabeceras de opciones, descripciones de armería y el glosario de reglas. Útil antes de sustituir una frase por una regla especial nueva. Solo lectura.',
    findPlaceholder: 'p. ej. Can only be used with a Charge order',
    findRun: 'Buscar', findRunning: 'Buscando…',
    findWhole: 'Solo palabras completas', findCase: 'Distinguir mayúsculas',
    findNone: 'No aparece en ningún sitio.',
    findCount: (h, f) => `${h} ${h === 1 ? 'resultado' : 'resultados'} en ${f} ${f === 1 ? 'facción' : 'facciones'}`,
    findExport: 'Exportar .json', findScanning: f => `Buscando en ${f}…`,
  },
  // The Inquisitor panel is an admin-only tool: it stays in English for these languages. The
  // translation editor inside it does cover ru/ja.
  get ru() { return ADMIN_I18N.en; },
  get ja() { return ADMIN_I18N.en; },
};

export function AdminPanel({ onClose, isAdmin, isInterrogator }: Props) {
  const { language } = useLanguage();
  const L = ADMIN_I18N[language] ?? ADMIN_I18N.en;
  const { username: adminUsername } = useAuth();
  /** Interrogator without full admin: translations-only. Everything else in this file still
   *  behaves as before — the tab list and default tab are the only things scoped here; every
   *  backend call an Interrogator isn't allowed to make already fails closed server-side. */
  const isTranslatorOnly = isInterrogator && !isAdmin;

  const [stats, setStats]     = useState<api.AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState('');
  const [revealed, setRevealed] = useState<Record<number, { pw: string; rc: string }>>({});
  // Creating an account: the password and recovery code come back ONCE, so they are held here
  // until the admin dismisses them rather than being dropped after the request.
  const [newUsername, setNewUsername] = useState('');
  const [newUserIsTest, setNewUserIsTest] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createdUser, setCreatedUser] = useState<{ username: string; pw: string; rc: string } | null>(null);
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
  const [annText, setAnnText] = useState<Record<Language, AnnFields>>({ en: emptyAnnFields(), de: emptyAnnFields(), es: emptyAnnFields(), ru: emptyAnnFields(), ja: emptyAnnFields() });
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [transEdits, setTransEdits] = useState<Record<TransLang, Record<string, string>>>({ de: {}, es: {}, ru: {}, ja: {} });
  const [transFilter, setTransFilter] = useState('');
  const [transLang, setTransLang] = useState<'both' | TransLang>('both');
  /** Datasheet ability texts of ONE faction, loaded on demand: there are ~1100 of them across the
   *  game, and a translator works through a codex at a time. '' = only UI labels and the glossary. */
  const [transFaction, setTransFaction] = useState('');
  /** Bumped after a save so the 'only untranslated' list is re-evaluated then — and only then. */
  const [transListVersion, setTransListVersion] = useState(0);
  const [transAbilities, setTransAbilities] = useState<Record<string, string>>({});
  /**
   * The translation overrides EXACTLY as stored in the DB. Saving merges into this instead of
   * rebuilding the whole object from the editor, because the editor only ever holds one codex's
   * datasheet texts at a time — rebuilding dropped every other codex's work (see
   * handleSaveTranslations).
   */
  const [storedTrans, setStoredTrans] = useState<api.TranslationOverrides>({});
  const [transImport, setTransImport] = useState('');
  const [transImportMsg, setTransImportMsg] = useState('');
  /**
   * False until adminGetSettings has actually answered. Saving while false would persist an editor
   * hydrated purely from code defaults, i.e. wipe every stored override — the failed-fetch path is
   * silent, so the Save button has to be the thing that refuses.
   */
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [transUntranslated, setTransUntranslated] = useState(false);
  const [translatingFrom, setTranslatingFrom] = useState<Language | null>(null);
  const [tab, setTab] = useState<AdminTab>(isTranslatorOnly ? 'i18n' : 'overview');
  const [findQuery, setFindQuery] = useState('');
  const [findWhole, setFindWhole] = useState(false);
  const [findCase, setFindCase] = useState(false);
  const [findHits, setFindHits] = useState<TextHit[] | null>(null);
  const [findRunning, setFindRunning] = useState(false);
  const [findProgress, setFindProgress] = useState('');
  // Sheet ids the codex checks send to the server: the built-in map with any stored override on top.
  const [sourceIds, setSourceIds] = useState<Record<string, string>>(DEFAULT_SOURCE_IDS);
  // Codex versions live beside the availability flags because they are the same decision seen
  // twice: which factions are open, and how finished each one is.
  const [codexVer, setCodexVer] = useState<api.CodexVersions>(DEFAULT_CODEX_VERSIONS);
  const [savingKey, setSavingKey] = useState<'announcement' | 'faction_flags' | 'translations' | 'codex_versions' | 'codex_content_hashes' | null>(null);
  const [savedKey, setSavedKey] = useState<'announcement' | 'faction_flags' | 'translations' | 'codex_versions' | 'codex_content_hashes' | null>(null);
  // Reads each faction's own Google Sheet title ("Chaos Space Marines 1.03") instead of an admin
  // re-typing the version by hand every time a codex ships — see codex-versions-check.
  const [checkingVersions, setCheckingVersions] = useState(false);
  // Unit auto-update (UnwiseGetData/update_units.py run by a GitHub Action that opens a pull request).
  const [unitUpdate, setUnitUpdate] = useState<{ configured: boolean; runs: api.UnitUpdateRun[] } | null>(null);
  const [unitUpdateBusy, setUnitUpdateBusy] = useState(false);
  const [unitUpdateMsg, setUnitUpdateMsg] = useState<string | null>(null);
  const [versionCheck, setVersionCheck] = useState<Record<string, { title: string; version: string | null } | null> | null>(null);
  // Content-level check (one level deeper than the title check above) — hashes every tab of the
  // live sheet and compares against the last-accepted baseline, so a silent cell edit (no title
  // bump) still gets flagged. Read-only until explicitly "accepted" per faction — see
  // codex-content-check and the file-level comment there for why this never auto-applies.
  const [contentBaseline, setContentBaseline] = useState<Record<string, Record<string, string>>>({});
  const [checkingContent, setCheckingContent] = useState(false);
  const [contentCheck, setContentCheck] = useState<Record<string, api.CodexContentCheckResult> | null>(null);
  const [acceptingKey, setAcceptingKey] = useState<string | null>(null);
  // Populated by the daily cron (api/cron/cleanup.js), independent of anyone clicking "CHECK
  // CONTENT" by hand — this is what makes a codex change an actual proactive notification rather
  // than something you only find by remembering to check.
  const [contentAlerts, setContentAlerts] = useState<Record<string, { newTabs?: string[]; removedTabs?: string[]; changedTabs?: string[]; flaggedAt?: string }>>({});

  async function load() {
    setLoading(true);
    try {
      // Every call carries its own fallback. `Promise.all` rejects as a whole, so one unguarded
      // request took the other three down with it and left the panel rendering against undefined —
      // "Cannot read properties of undefined (reading 'filter')", a blank crash rather than a
      // panel with a missing section. That is what happens with no API at all (a local build) and
      // equally when one endpoint is briefly down in production.
      const [s, r, a, cfg] = await Promise.all([
        api.adminStats().catch(() => null),
        api.adminListRecoveryRequests().catch(() => ({ requests: [] as api.RecoveryRequest[] })),
        api.adminActions().catch(() => ({ actions: [] })),
        api.adminGetSettings().catch(() => null),
      ]);
      setStats(s);
      setRequests(r.requests);
      setAuditLog(a.actions);
      // A failed settings fetch must NOT look like "there are no settings": the editors would
      // hydrate from code defaults and the next Save would persist that over the real data. Leave
      // them untouched and let `settingsLoaded` keep the Save buttons shut.
      if (!cfg) {
        setSettingsLoaded(false);
        setMsg(L.settingsLoadFailed);
        setLoading(false);
        return;
      }
      // hydrate announcement editor
      const ann = cfg.settings.announcement;
      if (ann) {
        setAnnEnabled(ann.enabled !== false);
        setAnnVersion(ann.version ?? '');
        setAnnText({
          en: annFieldsFrom(ann, 'en'), de: annFieldsFrom(ann, 'de'), es: annFieldsFrom(ann, 'es'), ru: annFieldsFrom(ann, 'ru'), ja: annFieldsFrom(ann, 'ja'),
        });
      }
      // hydrate faction availability (default from code, overridden by stored flags)
      setCodexVer({ ...DEFAULT_CODEX_VERSIONS, ...(cfg.settings.codex_versions ?? {}) });
      setContentBaseline(cfg.settings.codex_content_hashes ?? {});
      setContentAlerts(cfg.settings.codex_content_alerts ?? {});
      const stored = cfg.settings.faction_flags ?? {};
      const merged: Record<string, boolean> = {};
      for (const f of ALL_FACTIONS) merged[f.key] = stored[f.key] ?? f.defaultAvailable;
      setFlags(merged);
      // hydrate translation editor (effective value = override ?? code default)
      const tr = cfg.settings.translations ?? {};
      setStoredTrans(tr);
      setSettingsLoaded(true);
      const de: Record<string, string> = {}, es: Record<string, string> = {}, ru: Record<string, string> = {}, ja: Record<string, string> = {};
      for (const k of allTranslationKeys()) {
        de[k] = tr.de?.[k] ?? defaultString('de', k);
        es[k] = tr.es?.[k] ?? defaultString('es', k);
        ru[k] = tr.ru?.[k] ?? defaultString('ru', k);
        ja[k] = tr.ja?.[k] ?? defaultString('ja', k);
      }
      // Datasheet ability texts are keyed by their English text, so they are NOT in
      // allTranslationKeys() — without this they came back blank every time and looked deleted.
      for (const k of Object.keys(tr.de ?? {})) if (de[k] == null) de[k] = tr.de![k];
      for (const k of Object.keys(tr.es ?? {})) if (es[k] == null) es[k] = tr.es![k];
      for (const k of Object.keys(tr.ru ?? {})) if (ru[k] == null) ru[k] = tr.ru![k];
      for (const k of Object.keys(tr.ja ?? {})) if (ja[k] == null) ja[k] = tr.ja![k];
      setTransEdits({ de, es, ru, ja });
      setSourceIds({ ...DEFAULT_SOURCE_IDS, ...(cfg.settings.source_sheets ?? {}) });
    } catch (e) { setMsg(String(e)); }
    setLoading(false);
  }

  // `load` is redeclared on every render, so listing it here would re-fetch in a loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /**
   * Creates an account from the panel. Added for the Events & Leagues alpha, which is meant to be
   * run closed with invented players — until now an admin could promote, delete and reset a user
   * but never make one, so each test player meant going through the public sign-up form.
   */
  async function handleCreateUser() {
    if (!newUsername.trim()) return;
    setCreatingUser(true); setMsg('');
    try {
      const r = await api.adminCreateUser(newUsername.trim(), newUserIsTest);
      setCreatedUser({ username: r.user.username, pw: r.password, rc: r.recoveryCode });
      setNewUsername('');
      await load();
    } catch (e) { setMsg(String(e)); }
    finally { setCreatingUser(false); }
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

  async function handlePromote(userId: number, username: string, makeAdmin: boolean) {
    if (!confirm(L.promoteConfirm(makeAdmin, username))) return;
    try {
      await api.adminPromote(userId, makeAdmin);
      await load();
    } catch (e) { setMsg(String(e)); }
  }

  async function handleSetInterrogator(userId: number, username: string, makeInterrogator: boolean) {
    if (!confirm(L.interrogatorConfirm(makeInterrogator, username))) return;
    try {
      await api.adminSetInterrogator(userId, makeInterrogator);
      await load();
    } catch (e) { setMsg(String(e)); }
  }

  async function saveSetting(key: 'announcement' | 'faction_flags' | 'translations' | 'codex_versions' | 'codex_content_hashes', value: unknown) {
    // Every one of these four editors is hydrated from adminGetSettings. If that call failed the
    // editors hold code defaults, and writing them back replaces whatever is really stored —
    // silently, because a failed fetch produced an empty object that looked exactly like
    // "nothing configured yet". Refuse instead.
    if (!settingsLoaded) { setMsg(L.settingsLoadFailed); return; }
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

  async function refreshUnitUpdate() {
    try {
      const r = await api.adminUnitUpdateStatus();
      setUnitUpdate({ configured: r.configured, runs: r.runs });
    } catch { /* the status line is a convenience */ }
  }

  async function handleRunUnitUpdate() {
    if (!window.confirm('Download the sheet of every faction and open a pull request with the changes? It takes a few minutes and changes nothing on the live site until the pull request is merged.')) return;
    setUnitUpdateBusy(true);
    setUnitUpdateMsg(null);
    try {
      await api.adminRunUnitUpdate();
      setUnitUpdateMsg('Started. The pull request appears on GitHub in a few minutes.');
    } catch (e) {
      setUnitUpdateMsg(e instanceof Error ? e.message : 'Could not start the update');
    } finally {
      setUnitUpdateBusy(false);
      void refreshUnitUpdate();
    }
  }

  async function handleCheckVersions() {
    setCheckingVersions(true);
    try {
      const res = await api.adminCheckCodexVersions(sourceIds);
      setVersionCheck(res.results);
    } catch { /* best-effort — leave prior results in place */ }
    finally { setCheckingVersions(false); }
  }

  async function handleCheckContent() {
    setCheckingContent(true);
    try {
      const res = await api.adminCheckCodexContent(sourceIds);
      setContentCheck(res.results);
    } catch { /* best-effort — leave prior results in place */ }
    finally { setCheckingContent(false); }
  }

  /** Accepts the just-fetched hashes for one faction as the new baseline — only ever called after
   *  the admin/rules-expert has actually reviewed what changed, never automatically. */
  async function handleAcceptBaseline(key: string) {
    const hashes = contentCheck?.[key]?.hashes;
    if (!hashes || !settingsLoaded) return;
    setAcceptingKey(key);
    try {
      const merged = { ...contentBaseline, [key]: hashes };
      await api.adminSetSetting('codex_content_hashes', merged);
      setContentBaseline(merged);
      setContentCheck(prev => prev && { ...prev, [key]: { status: 'unchanged', hashes } });
      if (contentAlerts[key]) {
        const { [key]: _dropped, ...rest } = contentAlerts;
        await api.adminSetSetting('codex_content_alerts', rest);
        setContentAlerts(rest);
      }
    } catch (e) { setMsg(String(e)); }
    finally { setAcceptingKey(null); }
  }

  function applyDetectedVersion(key: string, version: string) {
    const cur = codexVer[key] ?? DEFAULT_CODEX_VERSIONS[key] ?? { version: '1.00', status: 'testing' as const };
    setCodexVer(p => ({ ...p, [key]: { ...cur, version } }));
  }

  /**
   * Saving MERGES into what is already stored. It used to rebuild the whole overrides object from
   * the editor and iterate `allTranslationKeys()` only — datasheet ability texts are keyed by their
   * English text and are not in that list, so a codex's translations were silently dropped from
   * every save. They were edited, listed, reported "saved", and never actually written; reloading
   * showed empty fields and looked like a wipe (translator report 2026-08-11, four factions lost).
   *
   * Rebuilding was also wrong for a second reason: the editor only ever holds ONE codex's ability
   * texts at a time, so even once they were included, a full rebuild would drop every other codex.
   */
  /**
   * Paste rows straight out of the terms spreadsheet — `English <TAB> German <TAB> Spanish`, which
   * is what you get by selecting the columns and copying. Matching is by the English text, so the
   * translator never has to know a key exists, and a term that is written with its parameter
   * notation ("Aegis(X+)") still finds the glossary entry stored as "Aegis({X})".
   *
   * It only fills the editor — nothing is stored until Save, so a bad paste is one reload away
   * from being undone.
   */
  function handleImportTerms() {
    const src = { ...sourceStrings(), ...transAbilities };
    const norm = (s: string) => s.toLowerCase().trim();
    const bare = (s: string) => norm(s).replace(/\s*\(.*$/, '').trim();
    const byText = new Map<string, string>();
    for (const [k, v] of Object.entries(src)) {
      if (!v) continue;
      byText.set(norm(v), k);
      if (!byText.has(bare(v))) byText.set(bare(v), k);
    }

    const lookup = (s: string) => (s ? byText.get(norm(s)) ?? byText.get(bare(s)) : undefined);
    const rows = transImport.split('\n').map(r => r.split('\t').map(c => c.trim()));

    // Which column holds the English? The sheet may or may not lead with a Category column, and
    // counting trailing cells is not safe: a row whose Spanish is still blank arrives with one
    // cell fewer, so "the last three" silently slid over and read the CATEGORY as the English and
    // the English as the translation. Pick the offset that matches the most rows and use it for
    // the whole paste — a per-row guess would shift mid-file.
    const score = (off: number) => rows.reduce((n, c) => n + (lookup(c[off] ?? '') ? 1 : 0), 0);
    const offset = score(1) > score(0) ? 1 : 0;

    const de = { ...transEdits.de }, es = { ...transEdits.es }, ru = { ...transEdits.ru }, ja = { ...transEdits.ja };
    let matched = 0; const unmatched: string[] = [];
    for (const cells of rows) {
      const en = cells[offset] ?? '', dev = cells[offset + 1] ?? '', esv = cells[offset + 2] ?? '', ruv = cells[offset + 3] ?? '', jav = cells[offset + 4] ?? '';
      if (!en || (!dev && !esv && !ruv && !jav)) continue;
      const key = lookup(en);
      if (!key) { unmatched.push(en); continue; }
      if (dev) de[key] = dev;
      if (esv) es[key] = esv;
      if (ruv) ru[key] = ruv;
      if (jav) ja[key] = jav;
      matched++;
    }
    setTransEdits({ de, es, ru, ja });
    setTransListVersion(v => v + 1);
    setTransImportMsg(L.transImportResult(matched, unmatched.length, unmatched.slice(0, 8)));
  }

  function handleSaveTranslations() {
    if (!settingsLoaded) { setMsg(L.settingsLoadFailed); return; }
    const src = { ...sourceStrings(), ...transAbilities };
    // Everything the editor can currently speak for: the UI/glossary keys plus whichever codex's
    // datasheet texts are loaded. Keys outside this set are carried over from storage untouched.
    const editableKeys = [...allTranslationKeys(), ...Object.keys(transAbilities)];
    const out: api.TranslationOverrides = {};
    for (const lang of TRANS_LANGS) {
      const m: Record<string, string> = { ...(storedTrans[lang] ?? {}) };
      for (const k of editableKeys) {
        const v = transEdits[lang][k];
        // "unset" = blank, or still identical to what it would say without an override: the code
        // default for a UI key, the English source text for a datasheet ability (which has no
        // code default — defaultString returns '' for those).
        const baseline = defaultString(lang, k) || src[k] || '';
        if (v == null || v.trim() === '' || v === baseline) delete m[k];
        else m[k] = v;
      }
      if (Object.keys(m).length) out[lang] = m;
    }
    setStoredTrans(out);
    setTranslationOverrides(out);   // apply live in this session immediately
    setTransListVersion(v => v + 1);  // now the finished rows may leave the 'untranslated' list
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
  const codexAlertCount = Object.keys(contentAlerts).length;

  // Translation editor: source strings + filtered key list (capped when unfiltered for perf)
  const SRC = { ...sourceStrings(), ...transAbilities };
  const tq = transFilter.trim().toLowerCase();
  const shownLangs: TransLang[] = transLang === 'both' ? TRANS_LANGS : [transLang];
  // "untranslated" = the DE/ES value is empty or still identical to the English source
  const isUntranslated = (lang: TransLang, k: string) => {
    const v = transEdits[lang][k];
    return v == null || v.trim() === '' || v === SRC[k];
  };
  // A picked codex goes FIRST: picking one is a request to work on it, and there are already ~900
  // UI and glossary keys — appended after those, its texts fell past the display cut and choosing a
  // faction looked like it did nothing.
  // The "only untranslated" filter is evaluated ONCE per change of filter, language, search or
  // codex — never while typing. Re-running it on every keystroke made a row stop matching the
  // moment the first character was entered, so it vanished mid-word and the edit was unfinishable.
  // The list is deliberately not a function of transEdits; the rows you are working on stay put
  // until you change what you are looking at.
  const editsRef = useRef(transEdits);
  editsRef.current = transEdits;
  const transKeysAll = useMemo(() => {
    const src = { ...sourceStrings(), ...transAbilities };
    const stillEnglish = (lang: TransLang, k: string) => {
      const v = editsRef.current[lang][k];
      return v == null || v.trim() === '' || v === src[k];
    };
    return [...Object.keys(transAbilities), ...allTranslationKeys()].filter(k => {
      if (tq !== '' && !(k.toLowerCase().includes(tq) || (src[k] ?? '').toLowerCase().includes(tq))) return false;
      if (transUntranslated && !shownLangs.some(l => stillEnglish(l, k))) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tq, transUntranslated, transLang, transAbilities, transListVersion]);
  // Enough to hold a whole codex plus the glossary; the search box and the "untranslated only"
  // filter are what actually narrow it down.
  const transKeys = transKeysAll.slice(0, 400);

  const toolbarBtn = 'text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-800 disabled:opacity-50';

  /**
   * Load one faction's datasheet ability texts into the translation editor. Keyed by the English
   * text itself (see abilityKey), so the same sentence shared by many units is one row to translate.
   */
  /**
   * Search every faction dataset (plus the rules glossary) for a phrase.
   *
   * Loads the factions one at a time and yields to the event loop between them: the datasets are
   * megabytes of JSON and doing all twenty in one synchronous pass freezes the tab for seconds with
   * no sign it is working. The progress label is the whole point of the pause.
   */
  async function runFind() {
    const needle = findQuery.trim();
    if (!needle) return;
    setFindRunning(true); setFindHits(null); setMsg('');
    const flags = findCase ? 'g' : 'gi';
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(findWhole ? `\\b${escaped}\\b` : escaped, flags);
    const hits: TextHit[] = [];
    try {
      for (const f of SOURCE_FACTIONS) {
        setFindProgress(f.name);
        await new Promise(r => setTimeout(r, 0));
        let data;
        try { data = await FACTION_LOADERS[f.key](); } catch { continue; }
        walkStrings(data, [], (path, text) => {
          re.lastIndex = 0;
          if (!re.test(text)) return;
          // path[0] is the dataset section ('units', 'traits', …); for units path[1] is the name.
          const where = path[0] === 'units' && path[1] ? path[1] : (path[0] ?? '—');
          const field = path.slice(path[0] === 'units' ? 2 : 1).join(' › ') || (path[0] ?? '—');
          hits.push({ faction: f.name, where, field, text });
        });
      }
      setFindProgress('');
      for (const [key, text] of Object.entries(ruleStrings())) {
        re.lastIndex = 0;
        if (re.test(text)) hits.push({ faction: 'Core rules', where: key.split('.')[1] ?? key, field: key.split('.').pop() ?? '', text });
      }
      setFindHits(hits);
    } catch (e) { setMsg(String(e)); }
    finally { setFindRunning(false); setFindProgress(''); }
  }

  function exportFind() {
    if (!findHits) return;
    const blob = new Blob([JSON.stringify({ query: findQuery, wholeWords: findWhole, matchCase: findCase, generated: new Date().toISOString(), hits: findHits }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `custom40k-find-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function loadFactionAbilities(factionKey: string) {
    setTransFaction(factionKey);
    if (!factionKey) { setTransAbilities({}); return; }
    try {
      const data = await FACTION_LOADERS[factionKey]();
      const out: Record<string, string> = {};
      for (const unit of Object.values(data.units)) {
        for (const a of unit.abilities ?? []) {
          const text = String(a).trim();
          if (text) out[abilityKey(text)] = text;
        }
      }
      setTransAbilities(out);
    } catch (e) { setMsg(String(e)); }
  }

  // Grouped by what kind of work the tab is for, not just listed flat — a dashboard/log reading,
  // user account management, content the author publishes himself, read-only data-correctness
  // audits, and reference-only tools are different jobs and used at different moments.
  const ALL_TAB_DEFS: { id: AdminTab; label: string; help: string; category: string }[] = [
    { id: 'overview', label: L.tabOverview, help: L.helpTabOverview, category: L.catDashboard },
    { id: 'audit',    label: L.tabAudit,    help: L.helpTabAudit,    category: L.catDashboard },
    { id: 'users',    label: L.tabUsers,    help: L.helpTabUsers,    category: L.catUsers },
    { id: 'announce', label: L.tabAnnounce, help: L.helpTabAnnounce, category: L.catContent },
    { id: 'factions', label: L.tabFactions, help: L.helpTabFactions, category: L.catContent },
    { id: 'i18n',     label: L.tabI18n,     help: L.helpTabI18n,     category: L.catContent },
    { id: 'health',   label: L.tabHealth,   help: L.helpTabHealth,   category: L.catDataAudit },
    { id: 'find',     label: L.tabFind,     help: L.helpTabFind,     category: L.catDataAudit },
    { id: 'calc',     label: L.tabCalc,     help: L.helpTabCalc,     category: L.catTools },
  ];
  // An Interrogator only ever sees the tabs their backend calls can actually answer: the i18n
  // editor, and 'find' (a client-side, read-only search over the same public faction data the
  // army builder itself already loads — nothing it needs is admin-gated).
  const TAB_DEFS = isTranslatorOnly
    ? ALL_TAB_DEFS.filter(td => td.id === 'i18n' || td.id === 'find')
    : ALL_TAB_DEFS;
  const TAB_GROUPS: { category: string; tabs: typeof TAB_DEFS }[] = [];
  for (const td of TAB_DEFS) {
    let g = TAB_GROUPS.find(g => g.category === td.category);
    if (!g) { g = { category: td.category, tabs: [] }; TAB_GROUPS.push(g); }
    g.tabs.push(td);
  }

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

      {/* Tab nav — grouped by what kind of work each tab is for */}
      <div className="flex flex-wrap items-start gap-x-5 gap-y-2 px-4 py-2 bg-zinc-900/60 border-b border-zinc-800 shrink-0">
        {TAB_GROUPS.map(g => (
          <div key={g.category} className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-widest text-zinc-600">{g.category}</span>
            <div className="flex flex-wrap gap-1">
              {g.tabs.map(td => (
                <span key={td.id} className="inline-flex items-center">
                  <button
                    onClick={() => setTab(td.id)}
                    className={`text-[11px] px-3 py-1 border font-mono uppercase tracking-wider ${tab === td.id ? 'border-amber-700 text-amber-400 bg-amber-950/20' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
                  >{td.label}{td.id === 'overview' && (pendingCount + codexAlertCount) > 0 ? ` (${pendingCount + codexAlertCount})` : ''}</button>
                  <Help text={td.help} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {msg && <div className="mx-4 mt-3 text-red-400 text-xs font-mono bg-red-950/30 border border-red-800/50 px-3 py-2 shrink-0">{msg}</div>}

      {loading ? (
        <div className="p-8 text-center text-zinc-600 text-sm">{L.loading}</div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 w-full max-w-5xl mx-auto">
            {tab === 'overview' && (<>
            {/* Codex content alerts — set by the daily cron (api/cron/cleanup.js), so a sheet
                edit shows up here even on a day nobody remembered to click "CHECK CONTENT" by
                hand. Purely a pointer to the Factions tab; review + Accept happens there. */}
            {codexAlertCount > 0 && (
              <div className="border border-amber-700 bg-amber-950/20 px-3 py-2">
                <div className="text-[10px] uppercase tracking-widest text-amber-500 mb-1.5 flex items-center gap-2">
                  ⚠ Codex sheets changed
                  <span className="bg-amber-800 text-amber-200 px-1.5 py-0.5 text-[9px] rounded">{codexAlertCount}</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-300 space-y-0.5">
                  {Object.entries(contentAlerts).map(([key, a]) => {
                    const f = ALL_FACTIONS.find(x => x.key === key);
                    const tabs = [...(a.changedTabs ?? []), ...(a.newTabs ?? []).map(t => `${t} (new)`), ...(a.removedTabs ?? []).map(t => `${t} (removed)`)];
                    return (
                      <div key={key}>
                        <span className="text-amber-400">{f?.name ?? key}</span>
                        <span className="text-zinc-500"> — {tabs.join(', ')}</span>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setTab('factions')}
                  className="mt-2 text-[10px] text-amber-400 underline underline-offset-2 hover:text-amber-300">
                  Go review in Factions →
                </button>
              </div>
            )}

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
            <div className="border border-zinc-800 p-2 mb-3 space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-amber-600">Create account</div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="username"
                  className="flex-1 min-w-[140px] bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-800"
                />
                <label className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                  <input type="checkbox" checked={newUserIsTest} onChange={e => setNewUserIsTest(e.target.checked)} />
                  test account
                </label>
                <button onClick={handleCreateUser} disabled={creatingUser || !newUsername.trim()} className={toolbarBtn}>
                  {creatingUser ? '…' : 'Create'}
                </button>
              </div>
              <p className="text-zinc-600 text-[10px] font-mono">
                A test account is deleted by “Reset test data” in Events &amp; Leagues, along with its
                armies and registrations.
              </p>
              {createdUser && (
                <div className="border border-amber-900/60 bg-amber-950/10 px-2 py-1.5 text-[11px] font-mono space-y-0.5">
                  <div className="text-amber-400">{createdUser.username} created — copy these now, they are not shown again:</div>
                  <div className="text-zinc-300">password: <span className="text-amber-300">{createdUser.pw}</span></div>
                  <div className="text-zinc-300">recovery code: <span className="text-amber-300">{createdUser.rc}</span></div>
                  <button onClick={() => setCreatedUser(null)} className="text-zinc-500 hover:text-zinc-300 text-[10px] underline">dismiss</button>
                </div>
              )}
            </div>
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
                        {!u.is_admin && u.is_interrogator && <span className="ml-1 text-[10px] text-amber-700">{L.interrogatorBadge}</span>}
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
                          {!u.is_admin && (
                            <button
                              onClick={() => handleSetInterrogator(u.id, u.username, !u.is_interrogator)}
                              className="text-[11px] px-2 py-0.5 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-800"
                            >{u.is_interrogator ? L.revokeInterrogator : L.makeInterrogator}</button>
                          )}
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

              {/* ── Codex version + readiness, editable without a deploy ──
                  The point of this block is that the game's author can ship a document and mark it
                  himself the same minute, instead of asking us to change a line of code. */}
              {/* ── Unit auto-update (Inquisitors only: this whole tab is) ── */}
              <div className="mt-5 mb-4 border border-zinc-800 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[10px] uppercase tracking-widest text-amber-600">Unit auto-update</div>
                  <div className="flex items-center gap-2">
                    <button onClick={refreshUnitUpdate} className={toolbarBtn}>⟳ STATUS</button>
                    <button onClick={handleRunUnitUpdate} disabled={unitUpdateBusy} className={toolbarBtn}>
                      {unitUpdateBusy ? 'STARTING…' : '▶ RUN UNIT UPDATE'}
                    </button>
                  </div>
                </div>
                <p className="text-zinc-600 text-[10px] font-mono mb-2">
                  Runs Unwise's update_units.py: downloads every faction's sheet and refreshes the models, stats, points, weapons, abilities and keywords of the units. It opens a pull request for a person to read and merge — the live site does not change until then. Options, the Armory, archetypes and psychic powers are not part of it yet.
                </p>
                {unitUpdateMsg && <p className="text-amber-500 text-[11px] font-mono mb-1">{unitUpdateMsg}</p>}
                {unitUpdate && !unitUpdate.configured && (
                  <p className="text-red-400 text-[11px] font-mono">The server has no GITHUB_DISPATCH_TOKEN yet, so the button cannot start anything.</p>
                )}
                {unitUpdate?.configured && unitUpdate.runs.length === 0 && (
                  <p className="text-zinc-500 text-[11px] font-mono">No runs yet.</p>
                )}
                {unitUpdate?.runs.map(run => (
                  <div key={run.id} className="text-[11px] font-mono text-zinc-400">
                    {new Date(run.createdAt).toLocaleString()} — {run.status === 'completed' ? (run.conclusion ?? 'done') : run.status}
                    {' '}<a href={run.url} target="_blank" rel="noreferrer" className="text-amber-600 hover:text-amber-400">open on GitHub</a>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-5 mb-1">
                <div className="text-[10px] uppercase tracking-widest text-amber-600">{L.codexVerTitle}</div>
                <button onClick={handleCheckVersions} disabled={checkingVersions} className={toolbarBtn}>
                  {checkingVersions ? '⟳ CHECKING…' : '⟳ CHECK VERSIONS'}
                </button>
              </div>
              <p className="text-zinc-600 text-[10px] font-mono mb-2">
                {L.codexVerHint} Reads each faction's own Google Sheet title (e.g. "Chaos Space Marines 1.03") and flags a mismatch below — never applied automatically.
              </p>
              <div className="grid gap-x-4 gap-y-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {ALL_FACTIONS.map(f => {
                  const cur = codexVer[f.key] ?? DEFAULT_CODEX_VERSIONS[f.key] ?? { version: '1.00', status: 'testing' as const };
                  const detected = versionCheck?.[f.key];
                  const mismatch = detected?.version && detected.version !== cur.version;
                  return (
                    <div key={f.key} className="text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="flex-1 min-w-0 truncate text-zinc-300">{f.name}</span>
                      <input
                        value={cur.version}
                        onChange={e => setCodexVer(p => ({ ...p, [f.key]: { ...cur, version: e.target.value } }))}
                        className="w-14 bg-zinc-900 border border-zinc-700 px-1 py-0.5 text-zinc-200 focus:outline-none focus:border-amber-700"
                      />
                      <select
                        value={cur.status}
                        onChange={e => setCodexVer(p => ({ ...p, [f.key]: { ...cur, status: e.target.value as api.CodexStatus } }))}
                        className="bg-zinc-900 border border-zinc-700 px-1 py-0.5 text-zinc-300 focus:outline-none focus:border-amber-700"
                      >
                        <option value="complete">complete</option>
                        <option value="testing">testing</option>
                        <option value="inreview">in review</option>
                        <option value="unreviewed">not reviewed</option>
                      </select>
                    </div>
                    {mismatch && (
                      <div className="flex items-center gap-1.5 mt-0.5 pl-0">
                        <span className="text-amber-500 text-[10px]">Sheet says {detected!.version} —</span>
                        <button onClick={() => applyDetectedVersion(f.key, detected!.version!)}
                          className="text-[10px] text-amber-400 underline underline-offset-2 hover:text-amber-300">
                          apply
                        </button>
                      </div>
                    )}
                    </div>
                  );
                })}
              </div>
              {versionCheck && (
                <p className="text-zinc-600 text-[10px] font-mono mt-1">
                  {Object.values(versionCheck).filter(v => v?.version).length}/{Object.keys(versionCheck).length} sheet titles read.
                  {' '}Remember to Save below after applying.
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => saveSetting('codex_versions', codexVer)} disabled={savingKey === 'codex_versions'} className={toolbarBtn}>
                  {savingKey === 'codex_versions' ? L.saving : L.save}
                </button>
                {savedKey === 'codex_versions' && <span className="text-green-500 text-[10px] font-mono">{L.saved}</span>}
              </div>

              {/* ── Content-level change check — one step deeper than the title check above.
                  Hashes every tab of each live sheet and compares against the last-accepted
                  baseline, so a silent cell edit with no version bump still gets flagged. A
                  changed tab here means: go run the full local audit (fetch_codex.cjs + a
                  rules-expert pass) before anything in data/parsed/ changes — this never touches
                  production itself, "Accept" below only moves the baseline forward. */}
              <div className="flex items-center justify-between mt-5 mb-1">
                <div className="text-[10px] uppercase tracking-widest text-amber-600">Content Change Check</div>
                <button onClick={handleCheckContent} disabled={checkingContent} className={toolbarBtn}>
                  {checkingContent ? '⟳ CHECKING…' : '⟳ CHECK CONTENT'}
                </button>
              </div>
              <p className="text-zinc-600 text-[10px] font-mono mb-2">
                Hashes every tab of each live sheet and flags any that differ from the last-accepted
                baseline — catches a silent edit even when the version number didn't change. A flagged
                faction needs a full local re-audit before "Accept" moves the baseline forward.
              </p>
              {!contentCheck ? (
                <p className="text-zinc-600 text-[10px] font-mono">Not checked yet this session.</p>
              ) : (
                <div className="space-y-1">
                  {ALL_FACTIONS.map(f => {
                    const r = contentCheck[f.key];
                    if (!r) return null;
                    return (
                      <div key={f.key} className="flex items-start gap-1.5 text-[11px] font-mono">
                        <span className="w-40 shrink-0 truncate text-zinc-300">{f.name}</span>
                        {r.status === 'unchanged' && <span className="text-zinc-600">unchanged</span>}
                        {r.status === 'error' && <span className="text-red-400">error — {r.error}</span>}
                        {r.status === 'no_baseline' && (
                          <span className="text-zinc-500">
                            no baseline yet ({r.tabCount} tabs) —{' '}
                            <button onClick={() => handleAcceptBaseline(f.key)} disabled={acceptingKey === f.key}
                              className="text-amber-400 underline underline-offset-2 hover:text-amber-300">
                              {acceptingKey === f.key ? 'accepting…' : 'accept as baseline'}
                            </button>
                          </span>
                        )}
                        {r.status === 'changed' && (
                          <div className="flex-1 min-w-0">
                            <span className="text-amber-500">
                              changed: {[...(r.changedTabs ?? []), ...(r.newTabs ?? []).map(t => `${t} (new)`), ...(r.removedTabs ?? []).map(t => `${t} (removed)`)].join(', ')}
                            </span>
                            {' — '}
                            <button onClick={() => handleAcceptBaseline(f.key)} disabled={acceptingKey === f.key}
                              className="text-amber-400 underline underline-offset-2 hover:text-amber-300">
                              {acceptingKey === f.key ? 'accepting…' : 'accept as new baseline'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
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
                  onChange={e => setTransLang(e.target.value as 'both' | TransLang)}
                  className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-amber-800"
                >
                  <option value="both">{L.transBoth}</option>
                  <option value="de">DE</option>
                  <option value="es">ES</option>
                  <option value="ru">RU</option>
                  <option value="ja">JA</option>
                </select>
                <label className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                  <input type="checkbox" checked={transUntranslated} onChange={e => setTransUntranslated(e.target.checked)} />
                  {L.transOnlyUntranslated}
                </label>
                <select
                  value={transFaction}
                  onChange={e => loadFactionAbilities(e.target.value)}
                  title={L.transAbilitiesHint}
                  className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-amber-800"
                >
                  <option value="">{L.transNoDatasheets}</option>
                  {SOURCE_FACTIONS.map(f => <option key={f.key} value={f.key}>{f.name}</option>)}
                </select>
                <span className="text-zinc-600 text-[10px] font-mono">{transKeys.length}/{transKeysAll.length}</span>
                {Object.keys(transAbilities).length > 0 && (
                  <span className="text-amber-600 text-[10px] font-mono">{L.transAbilitiesLoaded(Object.keys(transAbilities).length)}</span>
                )}
              </div>
              {/* Paste-from-spreadsheet import — the translator's terms workbook has hundreds of
                  rows and retyping them into the list below is how work gets lost. */}
              <details className="border border-zinc-800 mb-2">
                <summary className="cursor-pointer px-2 py-1.5 text-[11px] font-mono text-amber-600 select-none">
                  {L.transImportTitle}
                </summary>
                <div className="p-2 space-y-1.5">
                  <div className="text-[10px] font-mono text-zinc-500 leading-relaxed">{L.transImportHint}</div>
                  <textarea
                    value={transImport}
                    onChange={e => setTransImport(e.target.value)}
                    rows={5}
                    spellCheck={false}
                    placeholder={'Melta\tSchmelzer\nAegis(X+)\tAegis (X+)'}
                    className="w-full bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-amber-800"
                  />
                  <div className="flex items-center gap-2">
                    <button onClick={handleImportTerms} disabled={!transImport.trim()} className={toolbarBtn}>
                      {L.transImportBtn}
                    </button>
                    {transImportMsg && <span className="text-[10px] font-mono text-zinc-400">{transImportMsg}</span>}
                  </div>
                </div>
              </details>
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

            {tab === 'find' && (
            <div>
              <p className="text-zinc-500 text-[11px] font-mono mb-2">{L.findHint}</p>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <input
                  value={findQuery}
                  onChange={e => setFindQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !findRunning) runFind(); }}
                  placeholder={L.findPlaceholder}
                  className="flex-1 min-w-[260px] bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-800"
                />
                <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <input type="checkbox" checked={findWhole} onChange={e => setFindWhole(e.target.checked)} /> {L.findWhole}
                </label>
                <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <input type="checkbox" checked={findCase} onChange={e => setFindCase(e.target.checked)} /> {L.findCase}
                </label>
                <button onClick={runFind} disabled={findRunning || !findQuery.trim()} className={toolbarBtn}>
                  {findRunning ? L.findRunning : L.findRun}
                </button>
                <button onClick={exportFind} disabled={!findHits || findHits.length === 0} className={toolbarBtn}>
                  {L.findExport}
                </button>
                {findProgress && <span className="text-zinc-600 text-[10px] font-mono">{L.findScanning(findProgress)}</span>}
              </div>

              {findHits && findHits.length === 0 && (
                <p className="text-green-600 text-[11px] font-mono">{L.findNone}</p>
              )}
              {findHits && findHits.length > 0 && (
                <>
                  <p className="text-amber-500 text-[11px] font-mono mb-2">
                    {L.findCount(findHits.length, new Set(findHits.map(h => h.faction)).size)}
                  </p>
                  <div className="border border-zinc-800 max-h-[60vh] overflow-y-auto">
                    {findHits.map((h, i) => (
                      <div key={i} className="px-2 py-1 border-b border-zinc-900 last:border-b-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-amber-600 text-[10px] font-mono uppercase">{h.faction}</span>
                          <span className="text-zinc-200 text-[11px] font-mono">{h.where}</span>
                          <span className="text-zinc-600 text-[10px] font-mono">{h.field}</span>
                        </div>
                        <p className="text-zinc-400 text-[11px] whitespace-pre-wrap break-words">{h.text}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            )}

            {tab === 'calc' && <PointsCalculator lang={language} />}

          </div>
        )}
    </div>
  );
}
