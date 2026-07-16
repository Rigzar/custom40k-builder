import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useLanguage, setTranslationOverrides, allTranslationKeys, defaultString, sourceStrings, type Language } from '../i18n';
import { runDataHealth, type HealthFinding } from '../engine/dataHealth';
import { compareFaction, type SourceFinding } from '../engine/sourceCompare';
import { FACTION_LOADERS } from '../data/loaders';
import { ALL_FACTIONS } from './LandingPage';
import { useAuth } from '../hooks/useAuth';

// Languages a translator edits (English is the source, shown read-only).
const TRANS_LANGS: Exclude<Language, 'en'>[] = ['de', 'es'];

/** Default source spreadsheets by faction (creator's live Google Sheets). Admin can add/override. */
const DEFAULT_SOURCE_IDS: Record<string, string> = {
  chaos_space_marines: '1Tj4zAtpprqI2W5VeIoV_HsuzhX_3XGhDMMgM2axOiBw',
};

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
  srcWhereSheet: string; srcWhereReview: string; srcOpenSheet: string; srcTabHint: (tab: string) => string;
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
    srcOpenSheet: 'Open the spreadsheet ↗',
    srcTabHint: tab => `In the spreadsheet: tab "${tab}". In the app: this faction's unit of the same name.`,
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
    srcOpenSheet: 'Tabelle öffnen ↗',
    srcTabHint: tab => `In der Tabelle: Registerkarte "${tab}". In der App: die gleichnamige Einheit dieser Fraktion.`,
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
    srcOpenSheet: 'Abrir la hoja ↗',
    srcTabHint: tab => `En la hoja: pestaña "${tab}". En la app: la unidad con ese mismo nombre en esta facción.`,
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
  const [srcFindings, setSrcFindings] = useState<SourceFinding[] | null>(null);
  const [srcCoverage, setSrcCoverage] = useState<{ fetched: number; total: number } | null>(null);
  const [savingKey, setSavingKey] = useState<'announcement' | 'faction_flags' | 'translations' | null>(null);
  const [savedKey, setSavedKey] = useState<'announcement' | 'faction_flags' | 'translations' | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [s, r, a, cfg] = await Promise.all([
        api.adminStats(),
        api.adminListRecoveryRequests(),
        api.adminActions().catch(() => ({ actions: [] })),
        api.adminGetSettings().catch(() => ({ settings: {} as { announcement?: api.AnnouncementSetting; faction_flags?: api.FactionFlags; translations?: api.TranslationOverrides; source_sheets?: Record<string, string> } })),
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

  async function handleSourceCompare() {
    const id = srcId.trim();
    if (!id) return;
    setSrcRunning(true); setSrcFindings(null); setSrcCoverage(null); setMsg('');
    try {
      const loader = FACTION_LOADERS[srcFaction];
      if (!loader) throw new Error(`No data for ${srcFaction}`);
      const data = await loader();
      const unitNames = Object.keys(data.units);
      const resp = await api.adminSourceSheets(id, unitNames);
      setSrcCoverage({ fetched: resp.fetched, total: resp.total });
      setSrcFindings(compareFaction(data, resp.data));
      // remember the id for this faction
      const next = { ...sourceIds, [srcFaction]: id };
      setSourceIds(next);
      api.adminSetSetting('source_sheets', next).catch(() => {});
    } catch (e) { setMsg(String(e)); }
    finally { setSrcRunning(false); }
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
  const transKeys = transKeysAll.slice(0, 150);

  const toolbarBtn = 'text-[11px] px-3 py-1 border border-zinc-700 text-zinc-300 hover:text-amber-400 hover:border-amber-800 disabled:opacity-50';

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
              <p className="text-zinc-600 text-[10px] font-mono mb-2">{L.srcHint}</p>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <select
                  value={srcFaction}
                  onChange={e => { setSrcFaction(e.target.value); setSrcId(sourceIds[e.target.value] ?? ''); setSrcFindings(null); }}
                  className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-amber-800"
                >
                  {ALL_FACTIONS.map(f => <option key={f.key} value={f.key}>{f.name}</option>)}
                </select>
                <input
                  value={srcId}
                  onChange={e => setSrcId(e.target.value)}
                  placeholder={L.srcSpreadsheetId}
                  className="flex-1 min-w-[220px] bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-800"
                />
                <button onClick={handleSourceCompare} disabled={srcRunning || !srcId.trim()} className={toolbarBtn}>
                  {srcRunning ? L.srcComparing : L.srcCompare}
                </button>
              </div>
              {srcCoverage && (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <p className={`text-[10px] font-mono ${srcCoverage.fetched < srcCoverage.total ? 'text-amber-500' : 'text-zinc-500'}`}>
                    {L.srcCoverage(srcCoverage.fetched, srcCoverage.total)}
                  </p>
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${srcId.trim()}/edit`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[10px] font-mono text-sky-400 hover:text-sky-300 underline"
                  >{L.srcOpenSheet}</a>
                </div>
              )}
              {srcFindings && (
                srcFindings.length === 0 ? (
                  <p className="text-green-500 text-[11px] font-mono">{L.srcNoDiff}</p>
                ) : (
                  <div className="space-y-0.5 max-h-[55vh] overflow-y-auto border border-zinc-800 p-2">
                    {srcFindings.map((f, i) => (
                      <div key={i} className="text-[11px] font-mono flex gap-2 items-center">
                        <span className={`shrink-0 w-14 text-[9px] uppercase ${
                          f.kind === 'points' ? 'text-amber-500' : f.kind === 'stat' ? 'text-sky-500'
                          : f.kind === 'sheet' ? 'text-red-500' : 'text-fuchsia-500'
                        }`}>{f.kind}</span>
                        <span
                          title={f.why ?? ''}
                          className={`shrink-0 text-[8px] uppercase px-1 rounded border ${
                            f.where === 'sheet'
                              ? 'border-red-800 text-red-400 bg-red-950/30 cursor-help'
                              : 'border-zinc-700 text-zinc-500'
                          }`}
                        >{f.where === 'sheet' ? L.srcWhereSheet : L.srcWhereReview}</span>
                        <span className="text-zinc-300 flex-1 truncate" title={L.srcTabHint(f.unit)}>
                          {L.srcCol(f.unit, f.target)} <span className="text-zinc-600">· {f.field}</span>
                        </span>
                        <span className="text-zinc-500 shrink-0">app <span className="text-red-400">{f.prod || '—'}</span></span>
                        <span className="text-zinc-600 shrink-0">→</span>
                        <span className="text-zinc-500 shrink-0">sheet <span className="text-green-400">{f.source}</span></span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
            )}
          </div>
        )}
    </div>
  );
}
