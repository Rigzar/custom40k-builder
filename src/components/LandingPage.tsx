import { useState, useEffect } from 'react';
import * as api from '../lib/api';
import { ChangelogModal } from './ChangelogModal';
import { LanguageSelector } from './LanguageSelector';
import { SupplementModal, type SupplementKey } from './SupplementModal';
import { FactionSymbol } from './FactionSymbol';
import { Avatar } from './Avatar';
import { MessagesModal, InquisitorBadge } from './MessagesModal';
import { useT, useLanguage, type Language } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import type { SavedArmy } from '../hooks/useSavedArmies';
import { CHANGELOG } from '../data/changelog';

const ANNOUNCEMENT_KEY = 'c40k_announcement_v158g_dismissed';

type AnnouncementLang = { title: string; intro: string; install: string; line1: string; line2: string; line3: string; line4: string; line5: string; line6: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: 'v1.58: building an army is four numbered steps now',
    intro: 'The bar across the top was pretty and nobody could navigate with it. It has been rebuilt:',
    install: '🧭 ① Faction → ② Configuration → ③ Units → ④ Review. The bar is visible from the very first screen — it used to stay hidden until you pressed “Add Troops”, so you set up a whole army without ever seeing it — and it now says where you are and what is left instead of listing open tabs.',
    line6: '↩ Going back can no longer make your army vanish. The old “← Select Faction” button cleared your faction, which closed the tab holding your list: the army was still there, just unreachable. Moving between steps is free now and discards nothing. Only one move costs you anything — switching to a different faction while units are on the table — and it asks first. · ⚙ Archetype, Legacy, Traits and allies live on step ② and you can return to them whenever you like; from inside the builder there was previously no way to reach them at all. · ✗ The error counter in the header is a button now: it opens step ④, which lists every error and warning in full.',
    line5: '🤝 An Allied Detachment is no longer a tab next to your army — it is a Primary / Allied switch on the Units step. The two share one point limit and one validation, so showing them as separate tabs was exactly what made them look like two separate armies. Each still keeps its own Army Organisation Plan and its own customisation.',
    line1: '⚔ Tyranids — a Tyrant Guard Brood taken alongside a Neurotyrant no longer uses up an HQ slot. The datasheet reads “For every Hive Tyrant, Neurotyrant or Swarmlord selection…” and only two of those three were being checked. · ⚙ Necrons — the unit catalogue no longer greys out the “+” for units the validator would accept: the Royal Court, the Cryptothralls and the Hexmark Destroyer’s Royal Assassin were missing from the catalogue’s own sums, so a legal list could not be built. And the Plasmacyte’s free Elite slot now rounds UP, because its rule says “for each STARTED 500 points” — at 2750 pts that is 6, not 5.',
    line2: '🐛 Tyranids — Biomorphs are no longer capped at 16 per unit. The datasheets say “any number of Basic and Advanced Biomorphs” and the Armory adds “every item can only be purchased once by each model”, but a limit of 16 was applied across all of them regardless of squad size — so a 20-model Hormagaunt Brood with 16 Acid Blood could not take a single other biomorph. The 16 was never a rule: it is how many biomorphs are in the list, and the import read it as a maximum. Fixed on all 39 datasheets that have this group; each biomorph now allows one per model and no longer blocks the rest.',
    line3: '',
    line4: '⚠ Changing the battle type to Skirmish no longer deletes your Allied Detachment without warning. A Skirmish may include no allies, so switching to it does have to drop the ally and its units — but it was doing that silently, and switching back does not undo it. Someone reviewing an old list changed the battle type, changed it straight back, and the detachment was gone. It asks first now, and cancelling changes nothing at all. · 🎯 Also in Skirmish: the validation panel used to print “X exempted from the Elite slot … max 2” for exemptions it was correctly refusing to grant, because a Skirmish gives none — every unit occupies a slot there, whatever its own rules say. The rule never changed; the panel now says that instead of contradicting itself.',
    contrib: '❓ One open report we cannot fix without you: a Space Marine **Terminator Squad listing weapons it never took** (5x Power sword next to the chainaxes and fists), and a **Lieutenant whose Plasma pistol is missing from the printed card**. We have not reproduced either. If that was you, please answer on our Discord — your list’s .json (Review → ↓ JSON) plus a screenshot would settle it in minutes. It is listed under Known Issues meanwhile. · 👁️ Reporting something else? Be specific — which unit, engagement and archetype, with a screenshot. Vague reports cannot be reproduced, so they cannot be fixed.',
  },
  de: {
    title: 'v1.58: Der Armeebau besteht jetzt aus vier nummerierten Schritten',
    intro: 'Die Leiste oben war hübsch, aber niemand konnte damit navigieren. Sie wurde neu gebaut:',
    install: '🧭 ① Fraktion → ② Konfiguration → ③ Einheiten → ④ Prüfung. Die Leiste ist ab dem allerersten Bildschirm sichtbar — bisher blieb sie verborgen, bis man „Truppen hinzufügen“ drückte, man richtete also eine ganze Armee ein, ohne sie je zu sehen — und sie zeigt jetzt, wo man ist und was noch fehlt, statt offene Tabs aufzuzählen.',
    line6: '↩ Zurückgehen kann deine Armee nicht mehr verschwinden lassen. Der alte Knopf „← Fraktion wählen“ setzte die Fraktion zurück und schloss damit den Tab mit deiner Liste: Die Armee war noch da, nur nicht mehr erreichbar. Zwischen den Schritten zu wechseln kostet jetzt nichts. Nur ein Schritt kostet etwas — der Wechsel zu einer anderen Fraktion, während Einheiten in der Liste stehen — und der fragt vorher nach. · ⚙ Archetyp, Legacy, Traits und Verbündete liegen auf Schritt ② und sind jederzeit wieder erreichbar; aus dem Builder heraus gab es bisher überhaupt keinen Weg dorthin. · ✗ Der Fehlerzähler in der Kopfzeile ist jetzt ein Knopf: Er öffnet Schritt ④ mit der vollständigen Liste aller Fehler und Warnungen.',
    line5: '🤝 Ein verbündetes Detachment ist kein eigener Tab mehr neben deiner Armee, sondern ein Umschalter Primär / Verbündet auf dem Einheiten-Schritt. Beide teilen sich ein Punktelimit und eine Prüfung — sie als getrennte Tabs zu zeigen war genau der Grund, warum sie wie zwei getrennte Armeen aussahen. Jedes behält weiterhin seinen eigenen Army Organisation Plan und seine eigene Anpassung.',
    line1: '⚔ Tyraniden — eine Tyrant Guard Brood zusammen mit einem Neurotyrant belegt keinen HQ-Slot mehr. Auf dem Datenblatt steht „Für jede Hive Tyrant-, Neurotyrant- oder Swarmlord-Auswahl…“, geprüft wurden aber nur zwei der drei. · ⚙ Necrons — der Einheitenkatalog graut das „+“ nicht mehr für Einheiten aus, die der Validator akzeptiert: Royal Court, Cryptothralls und der Royal Assassin des Hexmark Destroyer fehlten in den Summen des Katalogs, eine legale Liste ließ sich so nicht bauen. Und der freie Elite-Slot des Plasmacyte rundet jetzt AUF, denn seine Regel sagt „für je ANGEFANGENE 500 Punkte“ — bei 2750 Punkten sind das 6, nicht 5.',
    line2: '🐛 Tyraniden — Biomorphe sind nicht mehr auf 16 pro Einheit begrenzt. Auf den Datenblättern steht „any number of Basic and Advanced Biomorphs“, und die Armory ergänzt „every item can only be purchased once by each model“ — trotzdem galt unabhängig von der Truppgröße ein Limit von 16 für alle zusammen: Eine Hormagaunt Brood mit 20 Modellen und 16 Acid Blood konnte keinen einzigen weiteren Biomorph nehmen. Die 16 war nie eine Regel, sondern schlicht die Anzahl der Biomorphe in der Liste, die der Import als Maximum gelesen hat. Auf allen 39 betroffenen Datenblättern behoben; jeder Biomorph erlaubt jetzt einen pro Modell und blockiert die anderen nicht mehr.',
    line3: '',
    line4: '⚠ Der Wechsel der Schlachtart zu Skirmish löscht dein verbündetes Detachment nicht mehr ohne Warnung. Ein Skirmish erlaubt keine Verbündeten, der Wechsel muss den Verbündeten und seine Einheiten also entfernen — aber das geschah stillschweigend, und ein Wechsel zurück macht es nicht rückgängig. Jemand sah sich eine alte Liste an, änderte die Schlachtart, änderte sie sofort zurück — und das Detachment war weg. Jetzt wird vorher gefragt, und Abbrechen ändert gar nichts. · 🎯 Ebenfalls Skirmish: Das Prüf-Panel zeigte „X vom Elite-Slot befreit … max 2“ für Befreiungen, die es korrekt verweigerte — in einem Skirmish gibt es keine, dort belegt jede Einheit einen Slot, egal was ihre Regeln sagen. Die Regel blieb gleich; das Panel sagt das jetzt, statt sich selbst zu widersprechen.',
    contrib: '❓ Eine offene Meldung, die wir ohne euch nicht beheben können: eine Space-Marine-**Terminatoreinheit listet Waffen, die sie nie gewählt hat** (5x Energieschwert neben Kettenäxten und Fäusten), und beim **Lieutenant fehlt die Plasmapistole auf der gedruckten Karte**. Beides konnten wir nicht nachstellen. Wenn das jemand von euch war: bitte auf unserem Discord antworten — die .json eurer Liste (Prüfung → ↓ JSON) und ein Screenshot klären es in Minuten. Bis dahin steht es unter „Bekannte Probleme“. · 👁️ Etwas anderes melden? Bitte konkret: welche Einheit, welches Engagement, welcher Archetyp, mit Screenshot. Vage Meldungen lassen sich nicht nachstellen und daher nicht beheben.',
  },
  es: {
    title: 'v1.58: construir un ejército son cuatro pasos numerados',
    intro: 'La barra de arriba era bonita y nadie sabía moverse con ella. Está rehecha:',
    install: '🧭 ① Facción → ② Configuración → ③ Unidades → ④ Revisión. La barra se ve desde la primera pantalla — antes estaba oculta hasta que pulsabas “Agregar tropas”, así que montabas un ejército entero sin verla nunca — y ahora dice dónde estás y qué falta, en vez de enumerar pestañas abiertas.',
    line6: '↩ Volver atrás ya no puede hacer desaparecer tu ejército. El viejo botón “← Facción” borraba la facción, y eso cerraba la pestaña que tenía tu lista: el ejército seguía ahí, pero era inalcanzable. Moverte entre pasos ya no cuesta nada. Solo hay un movimiento que cuesta algo — cambiar a otra facción con unidades ya puestas — y ese pregunta antes. · ⚙ Arquetipo, Legacy, Traits y aliados están en el paso ② y puedes volver a ellos cuando quieras; desde dentro del builder antes no había ninguna forma de llegar. · ✗ El contador de errores de la cabecera ahora es un botón: abre el paso ④, con la lista completa de errores y avisos.',
    line5: '🤝 Un Destacamento Aliado ya no es una pestaña al lado de tu ejército, sino un conmutador Principal / Aliado en el paso de Unidades. Los dos comparten un único límite de puntos y una única validación, así que enseñarlos como pestañas separadas era justo lo que hacía que parecieran dos ejércitos distintos. Cada uno conserva su propio Army Organisation Plan y su propia personalización.',
    line1: '⚔ Tyránidos — una Tyrant Guard Brood junto a un Neurotyrant ya no ocupa slot de HQ. La ficha dice “For every Hive Tyrant, Neurotyrant or Swarmlord selection…” y solo se comprobaban dos de los tres. · ⚙ Necrones — el catálogo ya no bloquea el “+” en unidades que el validador sí acepta: le faltaban el Royal Court, los Cryptothralls y el Royal Assassin del Hexmark Destroyer, así que no se podía montar una lista legal. Y el slot de Elite gratis del Plasmacyte ahora redondea hacia ARRIBA, porque su regla dice “por cada 500 puntos EMPEZADOS” — a 2750 puntos son 6, no 5.',
    line2: '🐛 Tyránidos — los biomorfos ya no están limitados a 16 por unidad. Las fichas dicen “any number of Basic and Advanced Biomorphs” y la Armería añade “every item can only be purchased once by each model”, pero se aplicaba un tope de 16 para todos juntos, fuese cual fuese el tamaño de la unidad: una Hormagaunt Brood de 20 modelos con 16 Acid Blood no podía coger ni un biomorfo más. Ese 16 nunca fue una regla: es cuántos biomorfos hay en la lista, y la importación lo tomó por un máximo. Corregido en las 39 fichas que tienen este grupo; cada biomorfo permite ahora uno por modelo y ya no bloquea a los demás.',
    line3: '',
    line4: '⚠ Cambiar el tipo de batalla a Skirmish ya no borra tu Destacamento Aliado sin avisar. Un Skirmish no admite aliados, así que el cambio tiene que quitar el aliado y sus unidades — pero lo hacía en silencio, y volver atrás no lo deshace. Alguien revisó una lista vieja, cambió el tipo de batalla, lo volvió a cambiar, y el destacamento había desaparecido. Ahora pregunta antes, y cancelar no cambia absolutamente nada. · 🎯 También en Skirmish: el panel de validación mostraba “X exento del slot de Elite … max 2” para exenciones que estaba negando correctamente — en Skirmish no hay ninguna, ahí toda unidad ocupa slot digan lo que digan sus reglas. La regla no cambió; ahora el panel lo dice en vez de contradecirse.',
    contrib: '❓ Un reporte abierto que no podemos arreglar sin vosotros: una **Terminator Squad de Space Marines que lista armas que nunca eligió** (5x espada de energía junto a las hachas y los puños), y un **Lieutenant al que le falta la pistola de plasma en la ficha impresa**. No hemos conseguido reproducir ninguno de los dos. Si fuisteis vosotros, contestad en nuestro Discord: el .json de vuestra lista (Revisión → ↓ JSON) y una captura lo resuelven en minutos. Mientras tanto está en Problemas conocidos. · 👁️ ¿Reportas otra cosa? Sé concreto: qué unidad, qué engagement y qué arquetipo, con captura. Los reportes vagos no se pueden reproducir, así que no se pueden arreglar.',
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
            className="text-zinc-600 hover:text-zinc-300 text-lg leading-none shrink-0 transition-colors"
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
          {/* line6 and line5 are prepend slots: a release that leads with something other than
              line1 puts it there without renumbering every line below. */}
          {[tx.line6, tx.line5, tx.line1, tx.line2, tx.line3, tx.line4]
            .filter(Boolean)
            .map((line, i) => <BoldSplitLine key={i} text={line} />)}
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
          className="text-zinc-600 hover:text-zinc-300 text-lg leading-none shrink-0 transition-colors"
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
}

export function LandingPage({
  saves, announcement, canResume,
  onStart, onResume, onLoadArmy, onShowAuth, onShowCloudSaves, onShowCommunity,
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
  const { loggedIn, username, avatar } = useAuth();
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
          <LanguageSelector />
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
              Wiki
            </a>

            <button
              onClick={() => loggedIn ? onShowCloudSaves?.() : onShowAuth()}
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              {loggedIn && username
                ? <Avatar username={username} avatar={avatar} size={18} />
                : <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              }
              {loggedIn ? (username ?? 'Account') : 'Login / Sign in'}
            </button>

            {loggedIn && (
              <button
                onClick={() => setShowMessages(true)}
                className="btn-sweep relative flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-300 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Messages
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
              Glossary
            </a>

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
              Community Armies
            </button>
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
            Discord
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
              <img src="/faction-symbols/horus-heresy.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Horus Heresy</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Space Marine legions of the Age of Darkness</div>
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
              <img src="/faction-symbols/horus-heresy.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Legio Titanicus</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Secutarii of the Collegia Titanica</div>
                <div className="text-orange-900 group-hover:text-orange-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Titan Legion</div>
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
              <img src="/faction-symbols/escalation.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Escalation</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Super-heavy vehicles and Gargantuan Creatures</div>
                <div className="text-amber-800 group-hover:text-amber-600 text-[10px] uppercase tracking-widest mt-1.5 transition-colors">Lords of War</div>
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
              <img src="/faction-symbols/assassins.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Assassins</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Operatives of the Officio Assassinorum</div>
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
