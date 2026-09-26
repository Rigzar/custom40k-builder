import { useState, useEffect, Fragment } from 'react';
import * as api from '../lib/api';
import { ChangelogModal } from './ChangelogModal';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { SupplementModal, type SupplementKey } from './SupplementModal';
import { FactionSymbol } from './FactionSymbol';
import { Avatar } from './Avatar';
import { MessagesModal, InquisitorBadge } from './MessagesModal';
import { useT, useLanguage, type Language } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import type { SavedArmy } from '../hooks/useSavedArmies';
import { CHANGELOG } from '../data/changelog';

const ANNOUNCEMENT_KEY = 'c40k_announcement_v178d_dismissed';

// v1.78 (2026-09-26) is a REAL version cut, so per [[feedback_version_cut_banner_scope]] this
// banner is RESET to ONLY v1.78's own content. Everything v1.77 announced lives on in the
// changelog modal; a reader who dismissed that card must not be shown its fixes again.
//
// LAYOUT (unchanged from v1.77, and it took two rounds to get there). Rigzar: "el banner da mucha
// info basura, da ladilla leerlo... GH#xxx ahora puede hacer tal cosa, resuelto", then "que se vea
// mas ordenado", then "es posible que los titulos sean pestanas desplegables? asi pueden estar
// todas compactas y la gente abre el que quiere".
//
// So: COLLAPSIBLE SECTIONS, each a two-column list, one clause per row, and the count on the
// header so a closed section still says how much is behind it. Keep each line to a single clause;
// anything needing a "because" belongs in the changelog.
//
// THE SECTIONS ARE BY SOURCE, and that is the whole point of having them. v1.78 first shipped
// with one "What changed" block holding everything, and Rigzar: "si antes estaba ordenado lo de
// las pestanitas del banner, ahora lo cambiaste? la gente tiene que saber que se reparo de
// github, que de discord etc... no todo en un mismo bloque, por algo creamos solapar pestanas".
// Right: a reader who filed an issue wants to know whether THEIRS was fixed, and someone who
// reported on Discord wants the same, and "we re-read the codices" is a different kind of news
// from either. One block answers none of those questions. Keep a section per source.
//
// A SECTION THAT ASKS, not just tells. Rigzar posted three open questions to the Discord bug
// channel to reach the people who filed them, and: "en el discord no lo van a ver... mi idea, una
// pequena pregunta con un link directo al github o al canal de los bugs". A question buried in a
// chat scrolls away in an hour and nobody opens a GitHub issue they did not file, so the ask goes
// where the reporter already is — on the front page, with the issue one click away. A row with a
// third element renders its source cell as a link.
//
// KEEP THIS SECTION EMPTY WHEN THERE IS NOTHING TO ASK. It only works while it is short and every
// line is genuinely blocked on a reader; a standing list of five is furniture.
//
// Append follow-ups to the right section while v1.78 stays open and bump ANNOUNCEMENT_KEY, or
// readers who dismissed the card never see the new ones.
/** `[source, what changed]`, or `[source, what we need, href]` for a row that asks the reader
 *  something. The href turns the source cell into a link — see the note beside ANNOUNCEMENT_TEXT. */
type AnnouncementRow = [string, string] | [string, string, string];
type AnnouncementSection = { label: string; rows: AnnouncementRow[] };
type AnnouncementLang = { title: string; intro: string; install: string; sections: AnnouncementSection[]; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: "v1.78: the codex re-audit",
    intro: "All nineteen codices compared against the author\u2019s own sheets, field by field \u2014 plus three bug reports.",
    install: "",
    sections: [
      { label: "Reported on GitHub", rows: [
        ["GH#159", "A Commissar no longer frees an Elite slot for some other unit."],
        ["GH#153", "Same fault, wearing Assassins: the slot they share is theirs, not another Elite's."],
        ["GH#160", "The Yngir C\u2019tan\u2019s 2+ armour save prints on the sheet."],
        ["Obeisance Phalanx", "Warriors, Immortals and Flayed Ones can no longer be taken \u2014 its own text bans them."],
      ] },
      { label: "From the codex review", rows: [
        ["Exocrine, Harpy, Hive Crone, Tyrannofex", "May be fielded in twos. Every one reads \u201c1-2\u201d and was capped at one."],
        ["Mucolid Spore Cluster", "Up to six, not three."],
        ["Biovore", "110 points, not 111."],
        ["Heavy chainaxe", "9 points on both Chaos datasheets that offer it \u2014 we charged 4 and 5."],
        ["Reaper chaincannon", "The Legionnaires\u2019 copy now matches its own sheet: Suppression(2)."],
        ["Sslyth, Stealth Drones", "A purchase for one of them lands on its own line again."],
      ] },
      { label: "We need an answer", rows: [
        ["Reply on GitHub #154", "Allied Guard platoon: are your Infantry Squads linked to the Command Squad in the \u201c\u21b3 Platoon\u201d dropdown? A screenshot of the cards settles it.", "https://github.com/Rigzar/custom40k-builder/issues/154"],
        ["Reply on GitHub #152", "The Leman Russ\u2019 two Heavy bolter sponsons fold into its existing row as \u201c3x\u201d. Is that hard to read? Say so and we will label it.", "https://github.com/Rigzar/custom40k-builder/issues/152"],
        ["Or reply on Discord", "Either of those, or anything else that looks wrong \u2014 answer here instead if it is easier.", "https://discord.com/channels/1270330819893792818/1409790086605701171"],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Found something wrong? The in-app bug report form works \u2014 unit, engagement, archetype and a picture.",
  },
  de: {
    title: "v1.78: die Codex-Pruefung",
    intro: "Alle neunzehn Codices Feld fuer Feld mit den Blaettern des Autors verglichen \u2014 dazu drei Fehlermeldungen.",
    install: "",
    sections: [
      { label: "Auf GitHub gemeldet", rows: [
        ["GH#159", "Ein Kommissar gibt keinen Elite-Slot mehr fuer eine andere Einheit frei."],
        ["GH#153", "Derselbe Fehler bei den Assassinen: der geteilte Slot gehoert ihnen, nicht einer anderen Elite."],
        ["GH#160", "Die 2+ Ruestung des Yngir-C\u2019tan steht jetzt auf dem Blatt."],
        ["Obeisance Phalanx", "Warriors, Immortals und Flayed Ones sind nicht mehr waehlbar \u2014 der eigene Text verbietet sie."],
      ] },
      { label: "Aus der Codex-Pruefung", rows: [
        ["Exocrine, Harpy, Hive Crone, Tyrannofex", "Koennen zu zweit aufgestellt werden. Alle lesen \u201c1-2\u201d und waren auf eins begrenzt."],
        ["Mucolid Spore Cluster", "Bis zu sechs, nicht drei."],
        ["Biovore", "110 Punkte, nicht 111."],
        ["Heavy chainaxe", "9 Punkte auf beiden Chaos-Datenblaettern \u2014 wir berechneten 4 und 5."],
        ["Reaper chaincannon", "Die Kopie der Legionnaires entspricht jetzt ihrem Blatt: Suppression(2)."],
        ["Sslyth, Stealth Drones", "Ein Kauf fuer eines von ihnen landet wieder in seiner eigenen Zeile."],
      ] },
      { label: "Wir brauchen eine Antwort", rows: [
        ["Reply on GitHub #154", "Verbuendetes Guard-Platoon: sind deine Infantry Squads im \u201c\u21b3 Platoon\u201d-Menue mit dem Command Squad verknuepft? Ein Screenshot der Karten klaert es.", "https://github.com/Rigzar/custom40k-builder/issues/154"],
        ["Reply on GitHub #152", "Die zwei Heavy-Bolter-Sponsons des Leman Russ gehen als \u201c3x\u201d in die vorhandene Zeile. Schwer zu lesen? Sag Bescheid, dann beschriften wir sie.", "https://github.com/Rigzar/custom40k-builder/issues/152"],
        ["Or reply on Discord", "Eine der beiden Fragen, oder alles andere, was falsch aussieht \u2014 antworte hier, wenn es einfacher ist.", "https://discord.com/channels/1270330819893792818/1409790086605701171"],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f Etwas gefunden, das nicht stimmt? Das Fehlerformular in der App funktioniert \u2014 Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "v1.78: la re-auditoria de codices",
    intro: "Los diecinueve codices comparados campo a campo con las hojas del autor \u2014 mas tres reportes.",
    install: "",
    sections: [
      { label: "Reportado en GitHub", rows: [
        ["GH#159", "Un Comisario ya no libera un slot de Elite para otra unidad."],
        ["GH#153", "El mismo fallo con los Assassins: el slot que comparten es suyo, no de otra Elite."],
        ["GH#160", "La salvacion 2+ del C\u2019tan Yngir ya sale en la hoja impresa."],
        ["Obeisance Phalanx", "Warriors, Immortals y Flayed Ones ya no se pueden llevar \u2014 su propio texto lo prohibe."],
      ] },
      { label: "De la revision de codices", rows: [
        ["Exocrine, Harpy, Hive Crone, Tyrannofex", "Se pueden llevar de a dos. Todas leen \u201c1-2\u201d y estaban topadas en una."],
        ["Mucolid Spore Cluster", "Hasta seis, no tres."],
        ["Biovore", "110 puntos, no 111."],
        ["Heavy chainaxe", "9 puntos en las dos fichas de Caos que lo ofrecen \u2014 cobrabamos 4 y 5."],
        ["Reaper chaincannon", "La copia de los Legionnaires ya coincide con su hoja: Suppression(2)."],
        ["Sslyth, Stealth Drones", "Una compra para uno de ellos vuelve a aterrizar en su propia fila."],
      ] },
      { label: "Necesitamos una respuesta", rows: [
        ["Reply on GitHub #154", "Peloton de Guardia aliada: \u00bftus Infantry Squads estan enlazadas al Command Squad en el desplegable \u201c\u21b3 Platoon\u201d? Una captura de las fichas lo resuelve.", "https://github.com/Rigzar/custom40k-builder/issues/154"],
        ["Reply on GitHub #152", "Los dos sponsons de Heavy bolter del Leman Russ se funden en su fila como \u201c3x\u201d. \u00bfSe lee mal? Decilo y le ponemos etiqueta.", "https://github.com/Rigzar/custom40k-builder/issues/152"],
        ["Or reply on Discord", "Cualquiera de las dos, o cualquier otra cosa que se vea mal \u2014 contesta aqui si te resulta mas facil.", "https://discord.com/channels/1270330819893792818/1409790086605701171"],
      ] },
    ],
    contrib: "\ud83d\udc41\ufe0f \u00bfEncontraste algo mal? El formulario de reporte de la app funciona \u2014 unidad, engagement, arquetipo y una foto.",
  },
};
/* canvas-smoke placeholder — wire up here when user provides the effect */

function BoldSplitLine({ text }: { text: string }) {
  const parts = text.split(' — ');
  if (parts.length < 2) return <p>{text}</p>;
  return <p><strong className="text-emerald-400">{parts[0]}</strong> — {parts.slice(1).join(' — ')}</p>;
}

function ClipSvg() {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
      <rect x="1.5" y="0.5" width="11" height="15" rx="2.5" stroke="#52525b" strokeWidth="1.5" fill="#27272a"/>
      <rect x="4"   y="7"   width="6"  height="15" rx="1.5" stroke="#3f3f46" strokeWidth="1.5" fill="#3f3f46"/>
    </svg>
  );
}

function CommunityAnnouncement() {
  const { language } = useLanguage();
  const tx = ANNOUNCEMENT_TEXT[language];
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(ANNOUNCEMENT_KEY) === 'true'
  );
  if (dismissed) return null;
  return (
    <div className="relative mb-6">
      {/* Space for skull above the card */}
      <div className="h-14" />

      {/* Servo skull — large, centered, appears to hold the card from above */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
        <div className="relative inline-block w-28 h-28">
          <img
            src="/servo-skull.png"
            alt=""
            className="w-28 h-28 object-contain drop-shadow-[0_4px_20px_rgba(180,83,9,0.45)]"
            draggable={false}
          />
          <div className="servo-eye" aria-hidden="true" />
        </div>
      </div>

      {/* Binder clips at card top edge, connecting skull to document */}
      <div className="absolute top-14 left-0 right-0 flex justify-between px-8 z-10 pointer-events-none select-none">
        <ClipSvg /><ClipSvg /><ClipSvg />
      </div>

      {/* Ordo card — pt-14 so content clears the skull overlap */}
      <div className="bg-zinc-900 border border-zinc-700 border-t-2 border-t-amber-900/80 px-5 pt-14 pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="text-[10px] text-amber-600 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
            <span className="opacity-60">⚙</span>
            {tx.title}
          </div>
          <button
            onClick={() => { localStorage.setItem(ANNOUNCEMENT_KEY, 'true'); setDismissed(true); }}
            className="text-red-500 hover:text-red-300 text-lg leading-none shrink-0 transition-colors"
            title="Dismiss"
          >
            ×
          </button>
        </div>
        <div className="text-[12px] text-zinc-300 leading-relaxed space-y-2">
          <p>{tx.intro}</p>
          {/* `install` is a highlighted block used only when a release leads with the PWA/offline
              news; empty on releases that don't (skipped so it leaves no gap). */}
          {tx.install && (
            <p className="border-l-2 border-emerald-600/70 bg-emerald-950/20 pl-3 py-2 text-zinc-200">
              {tx.install}
            </p>
          )}
          {/* v1.72 is a REAL version cut, so this banner carries ONLY v1.72's own content;
              v1.75's lines were removed -- see [[feedback_version_cut_banner_scope]]. Append
              here while v1.76 is open; cut a fresh banner when a new version is cut. */}
          {/* Sections, each a COLLAPSED two-column list. Rigzar: "es posible que los titulos sean
              pestanas desplegables? asi pueden estar todas compactas y la gente abre el que quiere".
              So the card opens as three headers and nothing else, and you open the one you care
              about. The COUNT is on the header for that reason — a closed section still has to tell
              you how much is behind it, or there is no reason to open it.

              Native <details>, not React state: it keeps its own open/closed, it is keyboard- and
              screen-reader-operable for free, and Ctrl+F still finds text inside a closed one in
              Chrome. The marker is hidden explicitly rather than relying on `display:flex`
              dropping it, which only some browsers do. */}
          {tx.sections.map(sec => (
            <details key={sec.label} className="group pt-1">
              <summary className="cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex items-center gap-2 py-1">
                <span className="text-[10px] uppercase tracking-widest text-amber-600/90 font-semibold shrink-0 group-hover:text-amber-500 transition-colors">
                  {sec.label}
                </span>
                <span className="text-[10px] text-zinc-500 tabular-nums shrink-0">{sec.rows.length}</span>
                <span className="flex-1 h-px bg-zinc-700/60" />
                <span className="text-[10px] text-zinc-500 shrink-0 transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-baseline pt-1 pb-1">
                {sec.rows.map(([src, fix, href], i) => (
                  <Fragment key={i}>
                    {/* No `whitespace-nowrap`: a long label ("Close Combat Specialists") would hold the
                        column open and squeeze the fix into a sliver on a phone. A GH number has no
                        space in it, so it never wraps anyway. */}
                    {href
                      ? <a href={href} target="_blank" rel="noopener noreferrer"
                           className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold tabular-nums max-w-[9rem] underline decoration-amber-700/60 underline-offset-2 transition-colors">
                          {/* JSX TEXT IS NOT A JS STRING: a "\u2197" written here prints those six
                              characters, which is what the first version of this line did. Wrapped
                              in braces it is a real string literal and decodes. */}
                          {src} {'\u2197'}
                        </a>
                      : <span className="text-[11px] text-emerald-400 font-semibold tabular-nums max-w-[9rem]">{src}</span>}
                    <span className="text-[11.5px] text-zinc-300 leading-snug">{fix}</span>
                  </Fragment>
                ))}
              </div>
            </details>
          ))}
          <p className="text-zinc-400">{tx.contrib}</p>
        </div>
      </div>
    </div>
  );
}

/** Separate, admin-authored announcement banner (from the DB), shown BELOW the release-notes card. */
/** Stable 32-bit hash of a string — used to key an announcement's dismissal by its CONTENT. */
/** Single key holding the content-hash of the admin announcement this browser dismissed. */
const ADMIN_ANN_DISMISSED_KEY = 'c40k_admin_ann_dismissed_hash';

/** Shown at the foot of every admin announcement — see the comment where it is rendered. */
const BROKEN_LIST_NOTE: Record<Language, string> = {
  en: '⚠️ A unit renamed to match the codex can disappear from a list that already contained it. If one of your lists comes back wrong, tell us on Discord and send us its .json — we will repair it and send it back.',
  de: '⚠️ Eine Einheit, die an den Codex angeglichen und dabei umbenannt wurde, kann aus einer Liste verschwinden, die sie bereits enthielt. Falls eine deiner Listen falsch zurückkommt, sag uns auf Discord Bescheid und schick uns ihre .json — wir reparieren sie und schicken sie zurück.',
  es: '⚠️ Una unidad renombrada para cuadrar con el códex puede desaparecer de una lista que ya la tenía. Si alguna de tus listas vuelve mal, dínoslo en Discord y mándanos su .json — te la arreglamos y te la devolvemos.',
};

function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function AdminAnnouncement({ setting }: { setting: api.AnnouncementSetting | null }) {
  const { language } = useLanguage();
  // Dismissal is keyed off the announcement's CONTENT, and stored as the hash of the announcement
  // that was dismissed under ONE stable key. Earlier versions wrote a separate `..._<hash>_dismissed`
  // flag per announcement, which meant a browser that had dismissed anything under the older
  // scheme (where the key fell back to the literal 'default') kept a permanent "true" lying around
  // and could keep hiding banners. Storing the dismissed hash instead makes it self-healing: the
  // banner is hidden only while the CURRENT content hash equals the stored one, so writing a new
  // announcement — or editing an existing one — always shows it again, on every existing browser.
  const contentHash = setting
    ? hashString((setting.version || '') + JSON.stringify(setting.text ?? {}))
    : null;
  const [dismissedHash, setDismissedHash] = useState<string | null>(null);

  // The setting arrives asynchronously from /api/settings, so the hash is unknown on first render.
  // Re-read the stored value whenever it changes, or the initial (empty) state would stick.
  useEffect(() => {
    setDismissedHash(localStorage.getItem(ADMIN_ANN_DISMISSED_KEY));
  }, [contentHash]);
  const dismissed = !!contentHash && dismissedHash === contentHash;

  if (!setting || setting.enabled === false) return null;
  const t = setting.text?.[language] ?? setting.text?.en;
  const lines = (t?.lines ?? []).filter(Boolean);
  if (!t || (!t.title && !t.intro && lines.length === 0)) return null;   // nothing to show
  if (dismissed) return null;
  return (
    <div className="relative mb-6 bg-zinc-900 border border-sky-900/70 border-l-2 border-l-sky-500/80 px-5 py-4">
      <div className="flex justify-between items-start gap-4">
        <div className="text-[10px] text-sky-400 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
          <span className="opacity-80">📣</span>
          {t.title}
        </div>
        <button
          onClick={() => {
            if (contentHash) localStorage.setItem(ADMIN_ANN_DISMISSED_KEY, contentHash);
            setDismissedHash(contentHash);
          }}
          className="text-red-500 hover:text-red-300 text-lg leading-none shrink-0 transition-colors"
          title="Dismiss"
        >×</button>
      </div>
      <div className="text-[12px] text-zinc-300 leading-relaxed space-y-2">
        {t.intro && <p>{t.intro}</p>}
        {lines.map((line, i) => <BoldSplitLine key={i} text={line} />)}
        {t.contrib && <p className="text-zinc-400">{t.contrib}</p>}
        {/* Standing support note, carried by every admin announcement: renaming a unit to match the
            codex orphans it in lists that already contain it, and the player can't tell that's what
            happened. Say so once, in the place everyone reads, with the way to get it fixed. */}
        <p className="text-[11px] text-zinc-500 border-t border-zinc-800 pt-2">{BROKEN_LIST_NOTE[language] ?? BROKEN_LIST_NOTE.en}</p>
        {setting.author && (
          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
            — <span className="text-amber-400">{setting.author}</span>
            <InquisitorBadge label="Inquisitor" />
          </p>
        )}
      </div>
    </div>
  );
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * The front door — logo, release notes, the admin announcement, quick-load and the supplements.
 *
 * It used to be all three of those AND a hidden three-state machine (`hero` → `setup` → `config`)
 * that carried Battle Setup, faction selection and Army Customisation, with the app's own
 * navigation bar switched off the whole time. Those two screens are real steps now
 * (`FactionStep` and App's Config step), so this component only owns the front door.
 */
interface Props {
  saves: SavedArmy[];
  /** Fetched once in App and passed down, so the settings endpoint is hit exactly once. */
  announcement: api.AnnouncementSetting | null;
  /** True when there is a faction picked and units on the table — offers "continue" over "start". */
  canResume: boolean;
  onStart: () => void;
  onResume: () => void;
  onLoadArmy: (save: SavedArmy) => void;
  onShowAuth: () => void;
  onShowCloudSaves?: () => void;
  onShowCommunity?: () => void;
  onShowCampaign?: () => void;
  onShowEvents?: () => void;
  onShowCheatSheets: () => void;
}

export function LandingPage({
  saves, announcement, canResume,
  onStart, onResume, onLoadArmy, onShowAuth, onShowCloudSaves, onShowCommunity, onShowCheatSheets,
  onShowCampaign,
  onShowEvents,
}: Props) {
  const [showChangelog, setShowChangelog] = useState(false);
  // The fog is now STATIC. Animating the feTurbulence baseFrequency re-rendered a full-screen
  // fractalNoise + displacement filter every update — even throttled it kept the CPU at ~12% idle
  // and spun up fans. The static turbulence renders once and then just composites, so idle CPU
  // drops to ~0 while the fog still looks the same. (No rAF loop, no per-frame recompute.)
  const [openSupplement, setOpenSupplement] = useState<SupplementKey | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [unread, setUnread] = useState(0);
  const latestVersion = CHANGELOG[0]?.version ?? '';
  const t = useT();
  const { loggedIn, username, avatar, isAdmin, isInterrogator } = useAuth();
  const refreshUnread = () => { api.getUnreadCount().then(r => setUnread(r.count)).catch(() => {}); };
  useEffect(() => { if (loggedIn) refreshUnread(); else setUnread(0); }, [loggedIn]);

  const displaySaves = saves.filter(s => s.id !== 'autosave-session' && !s.id.startsWith('autosave'));

  return (
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
        {/* SVG fog filter */}
        <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          <defs>
            <filter id="c40k-fog" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" />
              <feDisplacementMap in="SourceGraphic" scale="55" />
            </filter>
          </defs>
        </svg>
        <div className="fog-layer" />

        {/* Top bar */}
        <div className="relative z-10 flex justify-between items-center px-5 py-3 border-b border-zinc-900">
          <div className="flex items-center gap-1">
            <LanguageSelector />
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChangelog(true)}
              className="text-[11px] uppercase tracking-wide text-zinc-500 hover:text-amber-400 transition-colors"
            >
              v{latestVersion}
            </button>
          </div>
        </div>

        {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        {showMessages && <MessagesModal onClose={() => { setShowMessages(false); refreshUnread(); }} />}

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center pt-14 pb-8 px-6">

          {/* Logo */}
          <img
            src="/custom40k-logo.png"
            alt="Custom40k"
            className="w-64 sm:w-80 mb-8 object-contain select-none logo-glitch"
            draggable={false}
          />

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 w-full max-w-xs mb-8 anim-divider anim-delay-1">
            <div className="flex-1 h-px bg-amber-900/50" />
            <div className="w-1.5 h-1.5 bg-amber-800 rotate-45 shrink-0" />
            <div className="flex-1 h-px bg-amber-900/50" />
          </div>

          {/* Announcement — always first after title */}
          <div className="w-full mb-2 anim-fade-up anim-delay-2">
            <CommunityAnnouncement />
            <AdminAnnouncement setting={announcement} />
          </div>

          {/* Quick-load: saved armies */}
          {displaySaves.length > 0 && (
            <div className="w-full max-w-xs mb-6 anim-fade-up anim-delay-3">
              <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2 text-center">
                {t('savedArmies')}
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {displaySaves.slice(0, 4).map(save => (
                  <button
                    key={save.id}
                    onClick={() => onLoadArmy(save)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-amber-800/60 hover:bg-zinc-800 transition-colors text-left"
                  >
                    <FactionSymbol factionKey={save.factionKey} size={22} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-zinc-200 truncate">{save.name}</div>
                      <div className="text-[10px] text-zinc-500">{save.totalPts} pts · {formatDate(save.savedAt)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons 2×2 */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs anim-fade-up anim-delay-4">
            <a
              href="https://custom40k-wiki.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              {t('navWiki')}
            </a>

            <button
              onClick={() => loggedIn ? onShowCloudSaves?.() : onShowAuth()}
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              {loggedIn && username
                ? <Avatar username={username} avatar={avatar} size={18} />
                : <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              }
              {loggedIn ? (username ?? 'Account') : t('navLoginSignIn')}
            </button>

            {loggedIn && (
              <button
                onClick={() => setShowMessages(true)}
                className="btn-sweep relative flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-300 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {t('navMessages')}
                {unread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-700 text-amber-100 text-[9px] rounded-full px-1.5 py-0.5 leading-none">{unread}</span>
                )}
              </button>
            )}

            <a
              href="https://custom40k-wiki.vercel.app/glossary"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              {t('navGlossary')}
            </a>

            <button
              onClick={onShowCheatSheets}
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              {t('navFieldManual')}
            </button>

            <button
              onClick={onStart}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-800 border-2 border-amber-600 hover:bg-amber-700 text-white text-[12px] uppercase tracking-wider font-bold transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              {t('buildArmy')}
            </button>

            {/* Going Home never discards the list, so there has to be a way back into it. */}
            {canResume && (
              <button
                onClick={onResume}
                className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-emerald-800 hover:border-emerald-600 text-emerald-400 hover:text-emerald-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <span>↩</span>
                {t('continueArmy')}
              </button>
            )}

            <button
              onClick={() => onShowCommunity ? onShowCommunity() : (loggedIn ? onShowCloudSaves?.() : onShowAuth())}
              className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-400 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {t('navCommunityArmies')}
            </button>

            {/* Campaign (Planetary Assault) is built but not yet opened up to regular players —
                admins (both Inquisitor and Interrogator) get early access to it while logged in,
                everyone else still sees the disabled "Coming Soon" state. */}
            {loggedIn && (isAdmin || isInterrogator) ? (
              <button
                onClick={onShowCampaign}
                title="Campaign mode — alpha access (admin)"
                className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-400 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v4.083M17.91 3.5A9 9 0 0121 12a9 9 0 01-9 9m0-18a9 9 0 00-9 9m9-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 18v-4a2 2 0 012-2h2.599" /></svg>
                {t('navCampaignAlphaAdmin')}
              </button>
            ) : (
              <button
                disabled
                title="Campaign mode is still in alpha testing"
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 border border-zinc-800 text-zinc-600 text-[12px] uppercase tracking-wider cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v4.083M17.91 3.5A9 9 0 0121 12a9 9 0 01-9 9m0-18a9 9 0 00-9 9m9-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 18v-4a2 2 0 012-2h2.599" /></svg>
                {t('navCampaignComingSoon')}
              </button>
            )}

            {/* OPEN TO EVERYONE since 2026-09-14: the alpha gate came off once Dominic, Unwise and
                atypicalhero had run a league end to end and signed it off. Signing in is still
                required — an event needs an account to register, report and confirm against. */}
            {loggedIn ? (
              <button
                onClick={onShowEvents}
                title="Events & Leagues"
                className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-400 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4-4v4m-7-9a7 7 0 0014 0V4H5v8zm0 0H3a2 2 0 01-2-2V6h4m14 6h2a2 2 0 002-2V6h-4" /></svg>
                EVENTS &amp; LEAGUES
              </button>
            ) : (
              <button
                disabled
                title="Sign in to join an event or a league"
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 border border-zinc-800 text-zinc-600 text-[12px] uppercase tracking-wider cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4-4v4m-7-9a7 7 0 0014 0V4H5v8zm0 0H3a2 2 0 01-2-2V6h4m14 6h2a2 2 0 002-2V6h-4" /></svg>
                EVENTS &amp; LEAGUES — SIGN IN
              </button>
            )}
          </div>

          {/* Discord */}
          <a
            href="https://discord.com/invite/wnGAB3TYAY"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center gap-2 text-[11px] text-zinc-600 hover:text-indigo-400 transition-colors uppercase tracking-wider anim-fade-up anim-delay-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            {t('navDiscord')}
          </a>

        </div>

        {/* Supplements */}
        <div className="px-6 pb-6 max-w-sm mx-auto w-full anim-fade-up anim-delay-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 shrink-0">{t('supplements')}</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setOpenSupplement('horus_heresy')}
              className="btn-sweep relative flex items-center gap-4 px-5 py-5 w-full bg-zinc-900 border border-zinc-800 border-l-[4px] border-l-red-900 hover:bg-zinc-800/70 hover:border-zinc-700 hover:border-l-red-700 transition-all text-left group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 to-transparent pointer-events-none" />
              <img src="/faction-symbols/horus-heresy.svg" alt="" className="relative z-10 shrink-0 symbol-tint" style={{ width: 54, height: 54, opacity: 0.75 }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Horus Heresy</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">{t('hhCardDesc')}</div>
                <div className="text-red-900 group-hover:text-red-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Legiones Astartes</div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-red-900 group-hover:text-red-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setOpenSupplement('legio_titanicus')}
              className="btn-sweep relative flex items-center gap-4 px-5 py-5 w-full bg-zinc-900 border border-zinc-800 border-l-[4px] border-l-orange-900 hover:bg-zinc-800/70 hover:border-zinc-700 hover:border-l-orange-700 transition-all text-left group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-950/30 to-transparent pointer-events-none" />
              <img src="/faction-symbols/horus-heresy.svg" alt="" className="relative z-10 shrink-0 symbol-tint" style={{ width: 54, height: 54, opacity: 0.75 }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">{t('mgCardTitle')}</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">{t('mgCardDesc')}</div>
                <div className="text-orange-900 group-hover:text-orange-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Taghmata</div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-orange-900 group-hover:text-orange-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setOpenSupplement('escalation')}
              className="btn-sweep relative flex items-center gap-4 px-5 py-5 w-full bg-zinc-900 border border-zinc-800 border-l-[4px] border-l-amber-800 hover:bg-zinc-800/70 hover:border-zinc-700 hover:border-l-amber-600 transition-all text-left group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-950/30 to-transparent pointer-events-none" />
              <img src="/faction-symbols/escalation.svg" alt="" className="relative z-10 shrink-0 symbol-tint" style={{ width: 54, height: 54, opacity: 0.75 }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Escalation</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">{t('escCardDesc')}</div>
                <div className="text-amber-800 group-hover:text-amber-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">{t('lordsOfWar')}</div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-amber-800 group-hover:text-amber-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setOpenSupplement('assassins')}
              className="btn-sweep relative flex items-center gap-4 px-5 py-5 w-full bg-zinc-900 border border-zinc-800 border-l-[4px] border-l-zinc-600 hover:bg-zinc-800/70 hover:border-zinc-600 hover:border-l-zinc-400 transition-all text-left group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/40 to-transparent pointer-events-none" />
              <img src="/faction-symbols/assassins.svg" alt="" className="relative z-10 shrink-0 symbol-tint" style={{ width: 54, height: 54, opacity: 0.75 }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Assassins</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">{t('assCardDesc')}</div>
                <div className="text-zinc-500 group-hover:text-zinc-300 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Execution Force</div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Supplement drawer — rendered at root level to escape any container z-index/overflow */}
        {openSupplement && <SupplementModal supplement={openSupplement} onClose={() => setOpenSupplement(null)} />}

      </div>
  );
}
