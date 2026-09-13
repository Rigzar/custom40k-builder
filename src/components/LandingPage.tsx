import { useState, useEffect } from 'react';
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

const ANNOUNCEMENT_KEY = 'c40k_announcement_v172e_dismissed';

// v1.72 (2026-09-12) is a REAL version cut (Rigzar: "este update seria nueva version"), so per
// [[feedback_version_cut_banner_scope]] this banner is RESET to ONLY v1.72's own content --
// v1.71's two lines (the GH#119 wargear sweep and the quoted damage results) shipped on
// 2026-09-11 and were already announced; they live on in the changelog modal.
//   line1 = Core Rules 1.261, led by the Skirmish one-Trait cap because it invalidates saved lists
//   line2 = all 22 codices are in; the two consolidations and the points moves players must check
//   line3 = the five wargear items found while closing the update, which granted nothing
//   line4 = the ability clean-up IS in as of 2026-09-13, with the new names spelled out.
//           Horus Heresy closed it out the same day — its sheet became readable again, so the
//           last three weapons without a Suppression value have one and NOTHING is outstanding.
//           The intro no longer says a part is missing; that is why the key was bumped to v172c.
//   line5 = the eight Extra Attack / Limit corrections found from one player report. It is
//           here rather than in the changelog alone because it changes weapons people are
//           already fielding, so they have to re-check a card — hence the bump to v172d.
//   line6 = light mode. In the banner because it is for everyone rather than for whoever
//           happens to open Preferences, which is why the key goes to v172e.
// Append follow-ups here while v1.72 stays open. Bump ANNOUNCEMENT_KEY whenever these lines
// change materially, or readers who dismissed the previous card never see the new one.
type AnnouncementLang = { title: string; intro: string; install: string; line1: string; line2: string; line3: string; line4: string; line5: string; line6: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: "v1.72: the September rules and codex update",
    intro: "The Core Rules, the Missions supplement and all 22 codices are up to date, and so is the weapon-ability clean-up. Nothing from this update is still outstanding.",
    install: "",
    line1: "📕 The Core Rules are now at 1.261 / Balance 5.04, and one change will affect lists you have already built: IN SKIRMISH YOU MAY NOW SELECT ONLY ONE ARMY TRAIT. A Legacy that normally grants an extra Trait cannot lift that limit, so an existing Skirmish list with two will be flagged until you drop one. Also in: Monstrous Creatures and Monstrous Infantry get a flat +3 and +2 on Armor penetration instead of extra dice, Armorbane and Melta give a flat +3 and Armor piercing +2 in place of their extra dice, Extra Attack and Flurry are now per ACTIVATION rather than per battle round, Smite counts as a Basic power, and Sniper grants +1 Ballistic Skill. The full list is in the changelog.",
    line2: "📖 EVERY FACTION'S CODEX UPDATE IS IN — all 22. Two datasheets were merged away and your saved lists have been migrated for you: the Tyranid SWARMLORD is now a Legendary Hive Tyrant upgrade at the same 339 points, and the Custodes JETBIKE CUSTODIANS and VERTUS PRAETOR are one unit, Vertus Praetors. New arrivals: the Tyranid Hive Crone, the Custodes Venatari Custodians, four new Space Marine Chapter armouries (Iron Hands, Raven Guard, Salamanders, Ultramarines) and two new psychic disciplines, Technomancy and Umbromancy. And a great many points moved — Space Marine Desolation Squads, Hellblasters and Intercessors, Ork Nobs, Tau Stealth Battlesuits, Eldar Striking Scorpions, the Chaos Ascended Daemon Prince. Open a list you care about and check its total.",
    line3: "⚔️ Five more pieces of wargear named a weapon and handed over nothing. The Tau XV81 Crisis battlesuit's Smart missile system, and the Hunter-killer missile sold on Space Marine, Imperial Guard, Adeptus Custodes and Adeptus Sororitas vehicles — 5 points for nothing on four factions' tanks. All five are on your card now.",
    line4: "🔄 THE WEAPON-ABILITY CLEAN-UP IS IN TOO — Unwise finished it, so your cards now speak Core Rules 1.262. Flames is now AUTO HIT plus SUNDER(1). Flurry is now EXTRA ATTACK. Explosive, Barrage and Colossal Blast are all BLAST(x) — 4, 6 and 8 respectively. And Suppression now carries a number per weapon, SUPPRESSION(x), where each of its hits counts as x toward Suppressive Fire. Suppressive Fire itself got simpler: 6+ ranged hits in one activation, −1 for every further 6, and no separate test just because a Suppression weapon hit you. 1331 weapon profiles changed, and the glossary, the cheat sheets and the wiki moved with them, so an ability on a card is always one you can look up. The Horus Heresy supplement is in as well — its sheet went readable again, and the last three weapons that still said Suppression with no number have one.",
    line5: "⚖️ CHECK THESE EIGHT WEAPONS IF YOU FIELD THEM — we got their abilities wrong, and one of you caught it. September’s clean-up turned every EXTRA ATTACK(x) into EXTRA ATTACK(x) plus LIMIT(x) across the whole game, but on some weapons the author dropped Extra Attack instead of keeping both. All 203 profiles carrying either ability have now been re-read against their own codex sheet. SEVEN LOSE AN EXTRA ATTACK they never had: the Adeptus Mechanicus Adamantine Arm, Omnissiah’s Hand, Chordclaw, Servo arm and Servo-arc claw, the Space Marine Furioso psy halberd, and the Tyranid Implant Attack. ONE GAINS A LIMIT: the Chaos Daemons Snapping claws. And a warning if you play more than one faction: the SERVO ARM is three different weapons — Adeptus Mechanicus prints Limit(1) alone, Space Marines and Imperial Guard print Extra Attack(1) too.",
    line6: "☀ LIGHT MODE IS HERE — atypicalhero asked for it. The sun button next to the flags on this page switches it, and so does Appearance in Preferences; whichever you pick is remembered on this device. It is the whole app, not one screen: the builder, the printed cards, the league, every window. The dark theme is untouched and stays the default, so nothing changes unless you want it to.",
    contrib: "👁️ Found something wrong? The in-app bug report form works — unit, engagement, archetype and a picture.",
  },
  de: {
    title: "v1.72: Das September-Update für Regeln und Codices",
    intro: "Die Core Rules, das Missions-Supplement und alle 22 Codices sind auf dem neuesten Stand — und die Überarbeitung der Waffenfähigkeiten ebenfalls. Aus diesem Update steht nichts mehr aus.",
    install: "",
    line1: "📕 Die Core Rules stehen jetzt auf 1.261 / Balance 5.04, und eine Änderung betrifft bereits gebaute Listen: IM SCHARMÜTZEL DARF NUR NOCH EINE ARMEE-EIGENSCHAFT GEWÄHLT WERDEN. Ein Vermächtnis, das sonst eine zusätzliche Eigenschaft gewährt, hebt dieses Limit nicht auf — eine bestehende Scharmützel-Liste mit zweien wird beanstandet, bis eine wegfällt. Ebenfalls neu: Monströse Kreaturen und Monströse Infanterie erhalten pauschal +3 bzw. +2 auf Panzerungsdurchschlag statt zusätzlicher Würfel, Armorbane und Melta geben pauschal +3 und Armor piercing +2 statt ihrer Extrawürfel, Extra Attack und Flurry gelten jetzt pro AKTIVIERUNG statt pro Kampfrunde, Smite zählt als Basis-Kraft, und Sniper gibt +1 Ballistische Fähigkeit. Die vollständige Liste steht im Changelog.",
    line2: "📖 DIE CODEX-UPDATES ALLER FRAKTIONEN SIND DRIN — alle 22. Zwei Datenblätter wurden zusammengelegt, und deine gespeicherten Listen wurden dabei automatisch mitgezogen: Der Tyraniden-SCHWARMLORD ist jetzt ein Aufstieg zum Legendären Schwarmtyranten zum selben Preis von 339 Punkten, und die Custodes-JETBIKE CUSTODIANS und der VERTUS PRAETOR sind eine Einheit, die Vertus Praetors. Neu dabei: die Tyraniden-Hive Crone, die Venatari Custodians, vier neue Ordensarsenale der Space Marines (Iron Hands, Raven Guard, Salamanders, Ultramarines) und zwei neue Psi-Disziplinen, Technomancy und Umbromancy. Außerdem haben sich sehr viele Punktekosten verschoben — Desolation Squads, Hellblaster und Intercessors der Space Marines, Ork-Nobs, Tau Stealth Battlesuits, Eldar Striking Scorpions, der Aufgestiegene Dämonenprinz des Chaos. Öffne eine Liste, die dir wichtig ist, und prüfe ihre Gesamtkosten.",
    line3: "⚔️ Fünf weitere Ausrüstungsteile nannten eine Waffe und gaben sie nie: das Smart missile system des Tau XV81 sowie das Hunter-killer missile auf Fahrzeugen der Space Marines, der Imperialen Armee, der Custodes und der Sororitas — 5 Punkte für nichts auf den Panzern von vier Fraktionen. Alle fünf stehen jetzt auf der Karte.",
    line4: "🔄 AUCH DIE ÜBERARBEITUNG DER WAFFENFÄHIGKEITEN IST DRIN — Unwise ist fertig, eure Karten sprechen jetzt Core Rules 1.262. Aus Flames wird AUTO HIT plus SUNDER(1), aus Flurry wird EXTRA ATTACK, und Explosive, Barrage und Colossal Blast werden alle zu BLAST(x) — 4, 6 bzw. 8. Suppression hat jetzt einen Wert pro Waffe, SUPPRESSION(x): jeder ihrer Treffer zählt als x für Suppressive Fire. Suppressive Fire selbst wurde einfacher: 6+ Fernkampftreffer in einer Aktivierung, −1 für je weitere 6 — und kein eigener Test mehr, nur weil eine Suppression-Waffe getroffen hat. 1331 Waffenprofile geändert, und Glossar, Cheat Sheets und Wiki sind mitgezogen. Das Horus-Heresy-Supplement ist ebenfalls dabei — sein Tabellenblatt ist wieder lesbar, und die letzten drei Waffen, bei denen Suppression noch ohne Zahl stand, haben jetzt eine.",
    line5: "⚖️ PRÜFT DIESE ACHT WAFFEN, wenn ihr sie spielt — wir hatten ihre Fähigkeiten falsch, und einer von euch hat es bemerkt. Die September-Überarbeitung machte aus jedem EXTRA ATTACK(x) ein EXTRA ATTACK(x) plus LIMIT(x), aber bei manchen Waffen hat der Autor Extra Attack gestrichen statt beides zu behalten. Alle 203 Profile mit einer der beiden Fähigkeiten wurden jetzt gegen ihr eigenes Codex-Blatt neu gelesen. SIEBEN VERLIEREN EIN EXTRA ATTACK: Adamantine Arm, Omnissiah’s Hand, Chordclaw, Servo arm und Servo-arc claw des Adeptus Mechanicus, die Furioso psy halberd der Space Marines und der Implant Attack der Tyraniden. EINE BEKOMMT EIN LIMIT: die Snapping claws der Chaos Daemons. Und ein Hinweis, falls ihr mehrere Fraktionen spielt: der SERVO ARM sind drei verschiedene Waffen — beim Adeptus Mechanicus steht Limit(1) allein, bei Space Marines und Imperialer Armee zusätzlich Extra Attack(1).",
    line6: "☀ DER HELLE MODUS IST DA — atypicalhero hat darum gebeten. Die Sonne neben den Flaggen auf dieser Seite schaltet um, ebenso „Darstellung“ in den Einstellungen; deine Wahl wird auf diesem Gerät gespeichert. Es gilt für die ganze App, nicht nur einen Bildschirm: Builder, gedruckte Karten, Liga, jedes Fenster. Das dunkle Design bleibt unverändert und bleibt Standard — es ändert sich also nichts, wenn du nicht willst.",
    contrib: "👁️ Etwas falsch? Das Bug-Report-Formular in der App funktioniert — Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "v1.72: el update de reglas y códex de septiembre",
    intro: "Las Core Rules, el suplemento de Missions y los 22 códices están al día, y la limpieza de habilidades de arma también. De este update ya no queda nada pendiente.",
    install: "",
    line1: "📕 Las Core Rules ya están en 1.261 / Balance 5.04, y un cambio afecta a listas que ya tengas hechas: EN SKIRMISH SOLO SE PUEDE ELEGIR UN RASGO DE EJÉRCITO. Una Legacy que normalmente da un rasgo extra no levanta ese límite, así que una lista de Skirmish con dos quedará marcada hasta que quites uno. También entra: las Criaturas Monstruosas y la Infantería Monstruosa pasan a un +3 y +2 fijos a penetración de blindaje en vez de tirar dados extra, Armorbane y Melta dan un +3 fijo y Armor piercing un +2 en lugar de sus dados extra, Extra Attack y Flurry pasan a ser por ACTIVACIÓN en vez de por ronda, Smite cuenta como poder Básico, y Sniper da +1 a Habilidad de Proyectiles. La lista completa está en el changelog.",
    line2: "📖 LOS UPDATES DE CÓDEX DE TODAS LAS FACCIONES YA ESTÁN — las 22. Dos hojas se fusionaron y tus listas guardadas se migran solas: el SWARMLORD tyránido es ahora una mejora a Legendary Hive Tyrant por los mismos 339 puntos, y los JETBIKE CUSTODIANS y el VERTUS PRAETOR de Custodes son una sola unidad, Vertus Praetors. Novedades: la Hive Crone tyránida, los Venatari Custodians, cuatro armerías de Capítulo nuevas de Space Marines (Iron Hands, Raven Guard, Salamanders, Ultramarines) y dos disciplinas psíquicas nuevas, Technomancy y Umbromancy. Y se han movido muchísimos puntos — Desolation Squads, Hellblasters e Intercessors de Space Marines, los Nob orkos, los Stealth Battlesuits de Tau, los Striking Scorpions de Eldar, el Príncipe Demonio Ascendido del Caos. Abre la lista que te importe y mira el total.",
    line3: "⚔️ Cinco piezas de equipo más nombraban un arma y no daban nada: el Smart missile system del XV81 de Tau y el Hunter-killer missile de los vehículos de Space Marines, Guardia, Custodes y Sororitas — 5 puntos por nada en los tanques de cuatro facciones. Las cinco ya salen en la ficha.",
    line4: "🔄 LA LIMPIEZA DE HABILIDADES TAMBIÉN ESTÁ DENTRO — Unwise la terminó, así que tus fichas ya hablan Core Rules 1.262. Flames pasa a AUTO HIT más SUNDER(1), Flurry pasa a EXTRA ATTACK, y Explosive, Barrage y Colossal Blast se unifican en BLAST(x) — 4, 6 y 8 respectivamente. Suppression lleva ahora un número por arma, SUPPRESSION(x), y cada uno de sus impactos cuenta como x para Suppressive Fire. El propio Suppressive Fire se simplificó: 6+ impactos a distancia en una activación, −1 por cada 6 más, y ya no hay test aparte por que te impacte un arma con Suppression. 1331 perfiles de arma cambiados, y el glosario, las chuletas y el wiki han ido con ellos. El suplemento de Horus Heresy también entra — su hoja volvió a ser legible, y las tres últimas armas que seguían diciendo Suppression sin número ya tienen su valor.",
    line5: "⚖️ REVISA ESTAS OCHO ARMAS si las juegas — teníamos mal sus habilidades, y lo cazasteis vosotros. La limpieza de septiembre convirtió cada EXTRA ATTACK(x) en EXTRA ATTACK(x) más LIMIT(x) en todo el juego, pero en algunas armas el autor quitó Extra Attack en vez de dejar las dos. Los 203 perfiles que llevan cualquiera de las dos se han vuelto a leer contra su propia hoja de códex. SIETE PIERDEN UN EXTRA ATTACK que nunca tuvieron: el Adamantine Arm, la Omnissiah’s Hand, el Chordclaw, el Servo arm y el Servo-arc claw del Adeptus Mechanicus, la Furioso psy halberd de Space Marines y el Implant Attack tyránido. UNA GANA UN LIMIT: las Snapping claws de Demonios del Caos. Y un aviso si juegas varias facciones: el SERVO ARM son tres armas distintas — en Adeptus Mechanicus pone Limit(1) a secas, y en Space Marines y Guardia lleva además Extra Attack(1).",
    line6: "☀ YA HAY MODO CLARO — lo pidió atypicalhero. El botón del sol junto a las banderas de esta página lo cambia, y también Apariencia en Preferencias; lo que elijas se recuerda en este dispositivo. Es la app entera, no una pantalla: el constructor, las fichas impresas, la liga, cada ventana. El tema oscuro sigue igual y sigue siendo el que viene por defecto, así que no cambia nada si no quieres.",
    contrib: "👁️ ¿Algo mal? El formulario de reporte de bugs de la app funciona — unidad, engagement, arquetipo y una imagen.",
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
          {/* v1.72 is a REAL version cut, so this banner carries ONLY v1.72's own content;
              v1.71's lines were removed -- see [[feedback_version_cut_banner_scope]]. Append
              here while v1.72 is open; cut a fresh banner when a new version is cut. */}
          {[tx.line1, tx.line2, tx.line3, tx.line4, tx.line5, tx.line6]
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

            {/* Events & Leagues, same alpha gate as Campaign: the module is built but stays
                admin-only until it has been run end to end with test data and reset. */}
            {loggedIn && (isAdmin || isInterrogator) ? (
              <button
                onClick={onShowEvents}
                title="Events & Leagues — alpha access (admin)"
                className="col-span-2 btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-amber-700 text-zinc-400 hover:text-amber-300 text-[12px] uppercase tracking-wider transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4-4v4m-7-9a7 7 0 0014 0V4H5v8zm0 0H3a2 2 0 01-2-2V6h4m14 6h2a2 2 0 002-2V6h-4" /></svg>
                EVENTS &amp; LEAGUES (ALPHA)
              </button>
            ) : (
              <button
                disabled
                title="Events & Leagues is still in alpha testing"
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 border border-zinc-800 text-zinc-600 text-[12px] uppercase tracking-wider cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4-4v4m-7-9a7 7 0 0014 0V4H5v8zm0 0H3a2 2 0 01-2-2V6h4m14 6h2a2 2 0 002-2V6h-4" /></svg>
                EVENTS &amp; LEAGUES — COMING SOON
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
