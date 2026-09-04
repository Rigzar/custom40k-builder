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

const ANNOUNCEMENT_KEY = 'c40k_announcement_v169_dismissed';

// v1.69 (2026-09-02) stays v1.69 (Rigzar: "mantenemos version") — line1-2 were the original two
// Discord reports; line3-7 are 5 more bugs found the same day while building player-style army
// lists (a technique Rigzar explicitly asked to repeat), all still under this same version per the
// standing rule (append to the current version's banner instead of cutting a new one, unless
// explicitly told to cut).
type AnnouncementLang = { title: string; intro: string; install: string; line1: string; line2: string; line3: string; line4: string; line5: string; line6: string; line7: string; line8: string; line9: string; line10: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: "v1.69: pricing bugs fixed",
    intro: "Discord reports plus a same-day audit, all about an option's cost applying to the wrong thing.",
    install: "",
    line1: "🧬 Tyranids — a Basic/Advanced Biomorph (Pathogenesis, Acid Maw, ...) could be bought more than once on the same unit, letting its \"+\" stepper run up to the unit's model count as if the 5pt cost applied per model instead of once for the whole unit. Checked the canonical .ods: \"Point costs are paid per unit\" for both tiers — fixed, each Biomorph now caps at 1.",
    line2: "🔫 Space Marines — Death Watch's \"Special ammunition\" was a flat +4pt toggle for the whole squad regardless of size, when its own text says \"each model may receive\" it. Fixed — it now scales with the unit's model count (a 5-model squad shows \"Ammo +20\").",
    line3: "🕸️ Chaos Space Marines/Necrons/Tau Empire — 5 \"any model may swap/equip X\" options (Possessed's Jump packs, Big Mutants, Tomb Blades, Hazard/Broadside Battlesuits) charged their per-model rate TWICE, once per model and again for the whole unit — 5 Possessed with Jump packs cost 275pts instead of 55. Fixed.",
    line4: "🎯 Imperial Guard — Stormtroopers/Stormtrooper Command Squad/Penal Legion Squad's \"the unit may get ONE of these abilities\" pickers let you buy BOTH at once instead of picking one. Fixed — it's an exclusive pick again, still priced per model.",
    line5: "🛡️ 12 armor-upgrade items across 8 factions (Daemonic armor, Hellfire armor, Executioner's armour, Master-crafted armor/suit, Plate/Power/Carapace armour, Forgewrought armor, ...) were paid for but never actually improved the save — their plain \"gains a 2+ save\" wording wasn't recognized unless it repeated the word \"armor\" next to \"save\". Fixed.",
    line6: "⚔️ A Veteran Ability (Furious charge, Tank hunter, ...) bought for a unit with no general Armory access could silently vanish on save/reload if that unit's separate Champion-upgrade option wasn't also taken. Fixed — Veteran Abilities no longer depend on Armory access surviving a reload.",
    line7: "🔧 Orks — most \"Kustom job\" vehicle upgrades (More Dakka, Press the Button, Shokka Hull, Squig-hide Tyres, Eavy armour cabin, Gyroscopic Whirlygig, Stompamatic Pistons) were paid for but did nothing at all — no ability text, no stat change. Fixed across all 13 vehicles/fortifications that offer them; Fortress on Wheels now grants its ward save and Stompamatic Pistons its +2\" Movement.",
    line8: "🏍️ Space Marines — \"Space Marine bike\" added its Movement/Toughness/Wound bonus but never the Twin bolt rifle or the \"Bike\" unit type it grants (GitHub #112). Fixed.",
    line9: "🔧 Same-day audit across 6 more factions found 8 more items with the identical gap (Space Wolves, White Scars, Adeptus Mechanicus, Genestealer Cults, Adeptus Sororitas, Inquisition, Tau Empire, Orks) — all fixed. Dark Eldar's Skybike was checked too and correctly left alone: its own rulebook genuinely calls \"Jetbike\" an ability there, not a type change.",
    line10: "🗡️ Chaos Space Marines — Alpha Legion's \"Blade of the Hydra\" listed Rending with no threshold (a Discord question confirmed by Dominic: 5+). Fixed — now reads Rending(5+), matching every other Rending weapon in the game.",
    contrib: "👁️ Reported straight from the in-app bug report form — keep using it. Anything still wrong: unit, engagement, archetype and a picture.",
  },
  de: {
    title: "v1.69: Preis-Bugs behoben",
    intro: "Discord-Reports plus ein Audit am selben Tag, alle darüber, dass sich die Kosten einer Option auf das Falsche bezogen.",
    install: "",
    line1: "🧬 Tyranids — ein Basis-/Advanced-Biomorph (Pathogenesis, Acid Maw, ...) ließ sich mehrfach auf derselben Einheit kaufen, wobei der „+\"-Regler bis zur Modellanzahl der Einheit hochging, als würden die 5 Punkte pro Modell statt einmal für die ganze Einheit gelten. Im kanonischen .ods geprüft: „Point costs are paid per unit\" steht bei beiden Stufen ausdrücklich — behoben, jedes Biomorph deckelt jetzt bei 1.",
    line2: "🔫 Space Marines — Death Watchs „Special ammunition\" war ein fester +4-Punkte-Umschalter für den ganzen Trupp, egal wie groß, obwohl der eigene Text „each model may receive\" sagt. Behoben — es skaliert jetzt mit der Modellanzahl der Einheit (ein 5-Modell-Trupp zeigt „Ammo +20\").",
    line3: "🕸️ Chaos Space Marines/Necrons/Tau Empire — 5 „any model may swap/equip X\"-Optionen (Possessed, Big Mutants, Tomb Blades, Hazard/Broadside Battlesuits) berechneten ihren Pro-Modell-Preis ZWEIMAL — 5 Possessed mit Jump packs kosteten 275 statt 55 Punkte. Behoben.",
    line4: "🎯 Imperial Guard — bei Stormtroopers/Stormtrooper Command Squad/Penal Legion Squad konnte man beide „eine von diesen Fähigkeiten\"-Optionen gleichzeitig kaufen statt nur eine. Behoben — wieder eine exklusive Wahl, weiterhin pro Modell bepreist.",
    line5: "🛡️ 12 Rüstungs-Upgrades in 8 Fraktionen (Daemonic armor, Hellfire armor, Executioner's armour, Master-crafted armor/suit, Plate/Power/Carapace armour, Forgewrought armor, ...) wurden bezahlt, verbesserten aber nie den Save — die schlichte Formulierung „gains a 2+ save\" wurde nur erkannt, wenn „armor\" direkt neben „save\" stand. Behoben.",
    line6: "⚔️ Eine Veteranenfähigkeit (Furious charge, Tank hunter, ...), die für eine Einheit ohne allgemeinen Armory-Zugang gekauft wurde, konnte beim Speichern/Neuladen verschwinden, wenn die separate Champion-Option der Einheit nicht auch gewählt war. Behoben.",
    line7: "🔧 Orks — die meisten „Kustom job\"-Fahrzeug-Upgrades (More Dakka, Press the Button, Shokka Hull, Squig-hide Tyres, Eavy armour cabin, Gyroscopic Whirlygig, Stompamatic Pistons) wurden bezahlt, bewirkten aber gar nichts — kein Fähigkeitstext, keine Statänderung. Behoben bei allen 13 Fahrzeugen/Befestigungen, die sie anbieten; Fortress on Wheels gewährt jetzt seinen Ward-Save und Stompamatic Pistons sein +2\"-Movement.",
    line8: "🏍️ Space Marines — „Space Marine bike\" fügte Movement/Toughness/Wound hinzu, aber nie das Twin bolt rifle oder den „Bike\"-Einheitstyp (GitHub #112). Behoben.",
    line9: "🔧 Ein Audit am selben Tag über 6 weitere Fraktionen fand 8 weitere Items mit derselben Lücke (Space Wolves, White Scars, Adeptus Mechanicus, Genestealer Cults, Adeptus Sororitas, Inquisition, Tau Empire, Orks) — alle behoben. Dark Eldars Skybike wurde ebenfalls geprüft und korrekt unverändert gelassen: dort heißt „Jetbike\" laut eigenem Regelwerk tatsächlich eine Fähigkeit, kein Typwechsel.",
    line10: "🗡️ Chaos Space Marines — Alpha Legions „Blade of the Hydra\" hatte Rending ohne Schwellenwert (eine Discord-Frage, von Dominic bestätigt: 5+). Behoben — steht jetzt als Rending(5+), wie jede andere Rending-Waffe im Spiel.",
    contrib: "👁️ Direkt aus dem Bug-Report-Formular in der App gemeldet — nutzt es weiter. Was noch falsch aussieht: Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "v1.69: bugs de precio arreglados",
    intro: "Reportes de Discord más una auditoría el mismo día, todos sobre el coste de una opción aplicándose a lo que no era.",
    install: "",
    line1: "🧬 Tyranids — un Biomorfo Básico/Avanzado (Pathogenesis, Acid Maw, ...) se podía comprar más de una vez en la misma unidad, dejando que el \"+\" subiera hasta el tamaño de la unidad como si el coste de 5pts fuera por modelo en vez de una sola vez para toda la unidad. Comprobado en el .ods canónico: \"Point costs are paid per unit\" para ambos niveles — arreglado, cada Biomorfo ahora topa en 1.",
    line2: "🔫 Space Marines — \"Special ammunition\" de Death Watch era un cargo fijo de +4pts para toda la escuadra sin importar su tamaño, cuando su propio texto dice \"cada modelo puede recibirlo\". Arreglado — ahora escala con el tamaño de la unidad (una escuadra de 5 modelos muestra \"Ammo +20\").",
    line3: "🕸️ Chaos Space Marines/Necrons/Tau Empire — 5 opciones \"cualquier modelo puede cambiar/equipar X\" (Poseídos, Big Mutants, Tomb Blades, Hazard/Broadside Battlesuits) cobraban su tarifa por modelo DOS VECES — 5 Poseídos con Jump packs costaban 275pts en vez de 55. Arreglado.",
    line4: "🎯 Imperial Guard — en Stormtroopers/Stormtrooper Command Squad/Penal Legion Squad se podían comprar las dos habilidades \"la unidad puede obtener UNA de estas\" a la vez en vez de solo una. Arreglado — vuelve a ser una elección exclusiva, sigue costando por modelo.",
    line5: "🛡️ 12 items de armadura en 8 facciones (Daemonic armor, Hellfire armor, Executioner's armour, Master-crafted armor/suit, Plate/Power/Carapace armour, Forgewrought armor, ...) se cobraban pero nunca mejoraban la salvación — el texto llano \"gana una salvación de 2+\" solo se reconocía si repetía la palabra \"armor\" junto a \"save\". Arreglado.",
    line6: "⚔️ Una Habilidad de Veterano (Furious charge, Tank hunter, ...) comprada para una unidad sin acceso general a la Armería podía desaparecer sin aviso al guardar/recargar si la opción de Campeón de esa unidad no estaba también activada. Arreglado.",
    line7: "🔧 Orks — la mayoría de mejoras de vehículo \"Kustom job\" (More Dakka, Press the Button, Shokka Hull, Squig-hide Tyres, Eavy armour cabin, Gyroscopic Whirlygig, Stompamatic Pistons) se cobraban pero no hacían absolutamente nada — sin texto de habilidad, sin cambio de estadística. Arreglado en los 13 vehículos/fortificaciones que las ofrecen; Fortress on Wheels ahora concede su salvación ward y Stompamatic Pistons su +2\" de Movimiento.",
    line8: "🏍️ Space Marines — \"Space Marine bike\" añadía Movimiento/Aguante/Heridas pero nunca el Twin bolt rifle ni el tipo de unidad \"Bike\" (GitHub #112). Arreglado.",
    line9: "🔧 Una auditoría el mismo día en 6 facciones más encontró 8 ítems más con el mismo fallo (Space Wolves, White Scars, Adeptus Mechanicus, Genestealer Cults, Adeptus Sororitas, Inquisición, Tau Empire, Orks) — todos arreglados. El Skybike de Dark Eldar también se revisó y se dejó correctamente igual: su propio reglamento llama \"Jetbike\" a una habilidad ahí, no a un cambio de tipo.",
    line10: "🗡️ Chaos Space Marines — \"Blade of the Hydra\" (Alpha Legion) tenía Rending sin umbral (una duda de Discord confirmada por Dominic: 5+). Arreglado — ahora es Rending(5+), como cualquier otra arma con Rending del juego.",
    contrib: "👁️ Reportado directo desde el formulario de reporte de bugs de la app — seguid usándolo. Lo que siga pareciendo mal: unidad, engagement, arquetipo y una imagen.",
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
          {/* v1.69 (2026-09-02) stays v1.69 — Rigzar: "mantenemos version". line1-2 were the
              original 2 Discord reports (Tyranid Biomorphs qty-cap, Death Watch Special ammunition
              flat-not-per-model). line3-6 are 4 more pricing bugs found the same day while building
              a themed Chaos Space Marines army list (Argel Tal as a Chosen + daemonic upgrades):
              line3 = 5 "any model may swap/equip X" options double-charging their per-model rate
              (Possessed Jump packs et al.), line4 = 3 Imperial Guard units letting both halves of a
              mutually-exclusive pick be bought at once, line5 = 12 armor-upgrade items across 8
              factions whose bare "gains a 2+ save" wording the equipMods parser never recognized,
              line6 = Veteran Abilities silently vanishing on reload for a unit with no Armory
              access whose Champion-upgrade gate wasn't taken. line7 = found while building 3 more
              4000pt bug-hunting army lists across different factions (Rigzar: "armate unas 3 listas
              de diferentes ejercitos... para ver donde hay bugs") — Ork vehicle "Kustom job"
              choices with no effect at all. line8 = GitHub #112, Space Marine bike's missing
              weapon/unit-type grant. line9 = Rigzar asked whether other factions had the same
              gap — cross-faction audit found 8 more instances (6 factions) + a Tau Crisis Honor
              Guard option; Dark Eldar's Skybike checked and correctly left alone (canon calls it
              an ability there, not a type). line10 = a Discord rules question (Blade of the
              Hydra's Rending had no threshold in either production or the .ods; Dominic confirmed
              5+). Do NOT cut a new version for a follow-up fix under this same effort — keep
              appending here unless told otherwise. */}
          {[tx.line1, tx.line2, tx.line3, tx.line4, tx.line5, tx.line6, tx.line7, tx.line8, tx.line9, tx.line10]
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
  onShowCheatSheets: () => void;
}

export function LandingPage({
  saves, announcement, canResume,
  onStart, onResume, onLoadArmy, onShowAuth, onShowCloudSaves, onShowCommunity, onShowCheatSheets,
  onShowCampaign,
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
              <img src="/faction-symbols/horus-heresy.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
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
              <img src="/faction-symbols/horus-heresy.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
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
              <img src="/faction-symbols/escalation.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
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
              <img src="/faction-symbols/assassins.svg" alt="" className="relative z-10 shrink-0" style={{ width: 54, height: 54, filter: 'brightness(0) invert(1) opacity(0.75)' }} draggable={false} />
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
