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

const ANNOUNCEMENT_KEY = 'c40k_announcement_v177_dismissed';

// v1.77 (2026-09-25) is a REAL version cut, so per [[feedback_version_cut_banner_scope]] this
// banner is RESET to ONLY v1.77's own content. Everything v1.76 announced lives on in the
// changelog modal; a reader who dismissed that card must not be shown its fixes again.
//
// This release is ONE thing: the player bug reports. Nineteen were open, and the ones that are
// fixed here are almost all the same complaint in different words -- the LIVE PROFILE disagreed
// with what you bought. So both lines lead with "look at your cards", not with the mechanism.
//
//   line1 = weapons: what the card shows after a swap. The Terminator Sergeant who lost his
//           Storm bolter, the Voidscarred whose new weapons went to the wrong models, the
//           Scarab Occult squad printed as one model, the Leman Russ sponsons that vanished.
//   line2 = points and saves, i.e. the ones that CHANGE A SAVED LIST's total: the Chosen
//           upgrades that were charged once for the whole squad, the Relic blade at 0 points,
//           the Magos's free 4+ ward, the Scout Sergeant's honours spreading to his squad.
//   line3 = the rest, plus the faction badges all turning green.
//
// Append follow-ups here while v1.77 stays open, and bump ANNOUNCEMENT_KEY whenever these lines
// change materially, or readers who dismissed the previous card never see the new one.
type AnnouncementLang = { title: string; intro: string; install: string; line1: string; line2: string; line3: string; line4: string; line5: string; line6: string; line7: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: "v1.77: what your card says you bought",
    intro: "This one is the bug reports. Nineteen were open and most of them turned out to be the same complaint told a different way: you bought something, and the live profile disagreed. Check the cards of any squad that swaps weapons — several of these change what is printed on them, and two change what your list costs.",
    install: "",
    line1: "⚔️ WEAPON SWAPS THAT PRINTED THE WRONG THING. THE SPACE MARINE TERMINATOR SERGEANT LOST HIS STORM BOLTER whenever the squad bought a Cyclone missile launcher (GH#143) — the option reads “Storm bolter and Cyclone missile launcher”, so it hands the bolter straight back, and the app was subtracting one anyway and taking it off the Sergeant's row as well. THE ELDAR CORSAIR VOIDSCARRED lost their Shuriken rifles and gained nothing (GH#157): the Power sword and Shuriken pistol they paid for landed on the Shade Runner, the Soul Weaver and the Way Seeker, who carry those already. THE VOIDREAVERS' FELARCH was handing every other model a free Shuriken pistol (GH#156). SCARAB OCCULT TERMINATORS printed as a single model with everything on it, Sorcerer and squad merged into one row (GH#147) — the datasheet says “EACH Scarab Occult Terminator is equipped with”, and the app only understood “Every” and “The”. AND THE LEMAN RUSS' TWO HEAVY BOLTER SPONSONS VANISHED if you had also swapped the hull Heavy bolter for something else (GH#152). The same pass fixed the SPACE MARINE ASSAULT SQUAD, the CSM MUTANTS, the SORORITAS PENITENT ENGINES and the KNIGHT CASTELLAN, none of them reported.",
    line2: "💰 AND FOUR THINGS THAT CHANGE THE NUMBERS ON YOUR LIST. CHAOS CHOSEN UPGRADES ARE PER MODEL (GH#141) — Dark Crusaders is +2 points PER MODEL, and one flat +2 was charged for the whole squad; the CSM MUTANTS' upgrades were the same. THE SPACE MARINES RELIC BLADE COST NOTHING (GH#142): the codex prices it “the same as the weapon it enhances”, which is not a number, so the app charged 0 — now that you name the weapon in the “apply to” picker, it charges that weapon's own Armory price. THE ADEPTUS MECHANICUS MAGOS HAD A 4+ WARD SAVE (GH#139) and should have 5+: an unbought specialisation's rules text was being read as if you had taken it. And SWORDSMAN HONOURS BOUGHT FOR A SCOUT SERGEANT RAISED THE WHOLE SQUAD'S WEAPON SKILL (GH#155) — the Scout Squad's codex entry gives the Armory to the Sergeant alone, and our copy said the whole squad. THE AGGRESSOR IMPERATIVE was also applied twice to the model carrying it, so an AdMech squad leader moved 10″ instead of 8″ (GH#140).",
    line3: "🛠️ AND THE REST OF THE REPORTS. NECRONS: the TRIARCH STALKER'S REINFORCED FORELIMBS now give it WS 3+ and +2 Attacks (GH#151); a CANOPTEK COURT ARMY MAY FIELD FOUR CRYPTEKS, two per HQ slot, as its own archetype says (GH#150); the BATTLE-READY SHEET NO LONGER SHOWS THE TOMB BLADES' ARMOUR UPGRADE BEFORE YOU BUY IT — and grants the 3+ when you do (GH#149); and the CANOPTEK SCARABS' Feeder mandibles read Strength “U”, not “T” (GH#144). ELDAR: A WARP SPIDER EXARCH'S SECOND DEATH SPINNER no longer wipes the squad's own five (GH#138). ADEPTUS MECHANICUS: DJINN EYES now adds Sunder(1) to weapons bought from the Armory too, not only to the ones printed on the datasheet (GH#137). CHAOS SPACE MARINES: A CHAOS PREDATOR WITH THE MARK OF TZEENTCH CAN REACH ITS MIRROR PLATE AND WARPFLAME GARGOYLES (GH#148) — a vehicle's equipment panel had no way to open the Mark tab. 🟢 AND EVERY FACTION BADGE IS GREEN: all eighteen codices have been through a full review, so the colour key is gone from the faction screen. Chaos Space Marines 1.05, Orks 1.03, Tau Empire 1.02 and Tyranids 1.07 are the versions this build was checked against.",
    line4: "",
    line5: "",
    line6: "",
    line7: "",
    contrib: "👁️ Found something wrong? The in-app bug report form works — unit, engagement, archetype and a picture.",
  },
  de: {
    title: "v1.77: was auf deiner Karte steht",
    intro: "Diese Version sind die Fehlermeldungen. Neunzehn waren offen, und die meisten waren dieselbe Beschwerde in anderen Worten: du hast etwas gekauft, und das Live-Profil sah es anders. Sieh dir die Karten jeder Einheit an, die Waffen tauscht — mehrere davon werden jetzt anders gedruckt, und zwei ändern, was deine Liste kostet.",
    install: "",
    line1: "⚔️ WAFFENTAUSCHE, DIE FALSCH GEDRUCKT WURDEN. DEM SPACE-MARINE-TERMINATOR-SERGEANT FEHLTE SEIN STORM BOLTER, sobald die Einheit einen Cyclone Missile Launcher kaufte (GH#143) — die Option heißt „Storm bolter and Cyclone missile launcher“, gibt den Bolter also zurück, und die App zog ihn trotzdem ab, auch beim Sergeant. DIE ELDAR CORSAIR VOIDSCARRED verloren ihre Shuriken-Gewehre und bekamen nichts (GH#157): Powerschwert und Shuriken-Pistole landeten beim Shade Runner, Soul Weaver und Way Seeker, die beides ohnehin tragen. DER FELARCH DER VOIDREAVERS verschenkte an alle anderen Modelle eine Shuriken-Pistole (GH#156). SCARAB OCCULT TERMINATORS wurden als ein einziges Modell gedruckt, Zauberer und Trupp in einer Zeile (GH#147) — das Datenblatt sagt „EACH Scarab Occult Terminator is equipped with“, und die App kannte nur „Every“ und „The“. UND DIE ZWEI HEAVY-BOLTER-SPONSONS DES LEMAN RUSS VERSCHWANDEN, wenn man zusätzlich den Rumpf-Heavy-Bolter getauscht hatte (GH#152). Derselbe Durchgang reparierte SPACE MARINE ASSAULT SQUAD, CSM MUTANTS, SORORITAS PENITENT ENGINES und KNIGHT CASTELLAN, von denen niemand berichtet hatte.",
    line2: "💰 UND VIER DINGE, DIE DIE ZAHLEN DEINER LISTE ÄNDERN. CHAOS-CHOSEN-UPGRADES KOSTEN PRO MODELL (GH#141) — Dark Crusaders ist +2 Punkte PRO MODELL, berechnet wurden +2 für den ganzen Trupp; bei den CSM MUTANTS dasselbe. DAS RELIC BLADE DER SPACE MARINES KOSTETE NICHTS (GH#142): der Codex preist es „genauso wie die Waffe, die es verbessert“ — keine Zahl, also wurden 0 berechnet. Jetzt, wo du die Waffe im „apply to“-Auswahlfeld benennst, kostet es deren Arsenal-Preis. DER ADEPTUS-MECHANICUS-MAGOS HATTE EINE 4+ RETTUNG (GH#139) statt 5+: der Regeltext einer nicht gekauften Spezialisierung wurde gelesen, als hättest du sie. Und SWORDSMAN HONOURS FÜR EINEN SCOUT-SERGEANT HOB DAS KAMPFGESCHICK DES GANZEN TRUPPS (GH#155) — der Codex gibt das Arsenal allein dem Sergeant, unsere Kopie dem ganzen Trupp. DAS AGGRESSOR IMPERATIVE wurde beim tragenden Modell doppelt angewendet, also bewegte sich ein AdMech-Anführer 10″ statt 8″ (GH#140).",
    line3: "🛠️ UND DER REST DER MELDUNGEN. NECRONS: die REINFORCED FORELIMBS DES TRIARCH STALKER geben jetzt KG 3+ und +2 Attacken (GH#151); eine CANOPTEK-COURT-ARMEE darf VIER CRYPTEKS aufstellen, zwei pro HQ-Slot, wie ihr Archetyp es sagt (GH#150); das BATTLE-READY-BLATT ZEIGT DAS RÜSTUNGS-UPGRADE DER TOMB BLADES NICHT MEHR, BEVOR MAN ES KAUFT — und gewährt die 3+, wenn man es tut (GH#149); und die Feeder mandibles der CANOPTEK SCARABS haben Stärke „U“, nicht „T“ (GH#144). ELDAR: DER ZWEITE DEATH SPINNER EINES WARP-SPIDER-EXARCHEN löscht die fünf des Trupps nicht mehr aus (GH#138). ADEPTUS MECHANICUS: DJINN EYES verleiht Sunder(1) jetzt auch aus dem Arsenal gekauften Waffen (GH#137). CHAOS SPACE MARINES: EIN CHAOS PREDATOR MIT DEM MAL DES TZEENTCH ERREICHT SEINE MIRROR PLATE UND WARPFLAME GARGOYLES (GH#148) — das Ausrüstungsfenster eines Fahrzeugs konnte den Mal-Reiter gar nicht öffnen. 🟢 UND ALLE FRAKTIONSPUNKTE SIND GRÜN: alle achtzehn Codices sind vollständig geprüft, die Farblegende ist von der Fraktionsauswahl verschwunden. Geprüft wurde gegen Chaos Space Marines 1.05, Orks 1.03, Tau Empire 1.02 und Tyranids 1.07.",
    line4: "",
    line5: "",
    line6: "",
    line7: "",
    contrib: "👁️ Etwas gefunden, das nicht stimmt? Das Fehlerformular in der App funktioniert — Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "v1.77: lo que tu ficha dice que compraste",
    intro: "Esta versión son los reportes. Había diecinueve abiertos y casi todos resultaron ser la misma queja contada de otra forma: compraste algo y el perfil en vivo no estaba de acuerdo. Mirá las fichas de cualquier escuadra que cambie armas — varias se imprimen distinto ahora, y dos cambian lo que cuesta tu lista.",
    install: "",
    line1: "⚔️ CAMBIOS DE ARMA QUE SE IMPRIMÍAN MAL. AL SARGENTO TERMINATOR DE SPACE MARINES LE DESAPARECÍA EL STORM BOLTER cuando la escuadra compraba un Cyclone missile launcher (GH#143) — la opción dice «Storm bolter and Cyclone missile launcher», o sea que te lo devuelve, y la app lo restaba igual, también al sargento. A LOS ELDAR CORSAIR VOIDSCARRED les quitaba los Shuriken rifles y no les daba nada (GH#157): la Power sword y la Shuriken pistol pagadas aterrizaban en el Shade Runner, el Soul Weaver y el Way Seeker, que ya las llevan. EL FELARCH DE LOS VOIDREAVERS regalaba una Shuriken pistol a todos los demás (GH#156). LOS SCARAB OCCULT TERMINATORS salían como un solo modelo, hechicero y escuadra en la misma fila (GH#147) — la hoja dice «EACH Scarab Occult Terminator is equipped with» y la app solo entendía «Every» y «The». Y LOS DOS HEAVY BOLTER DE SPONSON DEL LEMAN RUSS DESAPARECÍAN si además habías cambiado el Heavy bolter del casco (GH#152). La misma pasada arregló la SPACE MARINE ASSAULT SQUAD, los CSM MUTANTS, los PENITENT ENGINES de Sororitas y el KNIGHT CASTELLAN, ninguno reportado.",
    line2: "💰 Y CUATRO COSAS QUE CAMBIAN LOS NÚMEROS DE TU LISTA. LAS MEJORAS DE LOS CHOSEN SON POR MODELO (GH#141) — Dark Crusaders es +2 puntos POR MODELO y se cobraba un +2 plano para toda la escuadra; los CSM MUTANTS igual. LA RELIC BLADE DE SPACE MARINES NO COSTABA NADA (GH#142): el códex la precia «igual que el arma que mejora», que no es un número, así que se cobraba 0 — ahora que nombrás el arma en el selector «aplicar a», cobra el precio de esa arma en la armería. EL MAGOS DE ADEPTUS MECHANICUS TENÍA SALVACIÓN 4+ (GH#139) y debe tener 5+: el texto de una especialización sin comprar se leía como si la tuvieras. Y LAS SWORDSMAN HONOURS COMPRADAS PARA UN SCOUT SERGEANT SUBÍAN EL WS DE TODA LA ESCUADRA (GH#155) — el códex le da la armería solo al sargento, y nuestra copia se la daba a todos. EL AGGRESSOR IMPERATIVE también se aplicaba dos veces al modelo que lo lleva, así que un líder de AdMech movía 10″ en vez de 8″ (GH#140).",
    line3: "🛠️ Y EL RESTO DE LOS REPORTES. NECRONS: las REINFORCED FORELIMBS DEL TRIARCH STALKER ya dan WS 3+ y +2 Ataques (GH#151); un ejército CANOPTEK COURT puede llevar CUATRO CRYPTEKS, dos por slot de HQ, como dice su propio arquetipo (GH#150); la HOJA BATTLE-READY YA NO MUESTRA LA MEJORA DE ARMADURA DE LAS TOMB BLADES SIN COMPRARLA — y concede el 3+ cuando la comprás (GH#149); y las Feeder mandibles de los CANOPTEK SCARABS tienen Fuerza «U», no «T» (GH#144). ELDAR: EL SEGUNDO DEATH SPINNER DE UN WARP SPIDER EXARCH ya no borra los cinco de la escuadra (GH#138). ADEPTUS MECHANICUS: DJINN EYES ahora añade Sunder(1) también a las armas compradas en la armería (GH#137). CHAOS SPACE MARINES: UN CHAOS PREDATOR CON LA MARCA DE TZEENTCH YA LLEGA A SU MIRROR PLATE Y SUS WARPFLAME GARGOYLES (GH#148) — el panel de equipo de un vehículo no tenía forma de abrir la pestaña de marca. 🟢 Y TODOS LOS PUNTOS DE FACCIÓN ESTÁN EN VERDE: los dieciocho códices pasaron revisión completa, así que la leyenda de colores desapareció de la pantalla de facciones. Este build se verificó contra Chaos Space Marines 1.05, Orks 1.03, Tau Empire 1.02 y Tyranids 1.07.",
    line4: "",
    line5: "",
    line6: "",
    line7: "",
    contrib: "👁️ ¿Encontraste algo mal? El formulario de reporte de la app funciona — unidad, engagement, arquetipo y una foto.",
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
          {[tx.line1, tx.line2, tx.line3, tx.line4, tx.line5, tx.line6, tx.line7]
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
