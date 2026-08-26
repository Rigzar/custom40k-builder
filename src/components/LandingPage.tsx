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

const ANNOUNCEMENT_KEY = 'c40k_announcement_v166g_dismissed';

type AnnouncementLang = { title: string; intro: string; install: string; line1: string; line2: string; line3: string; line4: string; line5: string; line6: string; line7: string; line8: string; line9: string; line10: string; line11: string; contrib: string; };
const ANNOUNCEMENT_TEXT: Record<Language, AnnouncementLang> = {
  en: {
    title: "v1.66: Horus Heresy — the armory that looked missing",
    intro: "CSM/SM \"Legion\" — a unit actually GRANTED by the Horus Heresy supplement (Legion Breacher/Tactical/Tactical Support Squad, etc) had its own Armory's General tab plainly labeled \"General\" with Horus Heresy items silently inside — looked like the Horus Heresy armory was missing entirely, since a normal unit gets an explicitly separate \"Horus Heresy Legiones Astartes Armoury\" tab for the same content. The tab now names itself after the supplement it actually is. Adeptus Mechanicus \"Taghmata\" had it worse: native AdMech units had NO tab at all for the Legio Titanicus armory this archetype's own rules promise — only Taghmata's own injected units could reach it. Both fixed.",
    install: "🔫 Buying the SAME Armory item for two different models (e.g. two Boltguns on two different Chosen) showed no count at all, on any unit/Champion with no other squad option touched — a deeper root cause behind the Kill Team Veterans fix in v1.65. Fixed at the engine level, so it covers every unit and every Champion/leader hitting the same pattern, not just one datasheet.",
    line1: "🩻 Orks — 9 units' 'Eavy armour upgrade (Boyz, Skarboyz, Burna Boyz, Kommandos, Nobz, Tankbustas, Deffkoptaz, Stormboyz, Lootas) charged points but never improved the Save at all. Each now correctly lands on the codex's stated 4+ from its own base Save.",
    line2: "🏍️ Orks — a Warboss (or any character) buying \"Waaagh!-Bike\" got the points and the Bike unit type but never the promised Dakkagun. Fixed — the weapon now actually shows up.",
    line3: "🔮 Eldar's \"Children of Prophecy\" and Space Marines' \"Knowledge is Power\" Traits (both \"Only for Psykers\") were being handed to every unit in the army, not just ones that could manifest a single power. Both fixed.",
    line4: "🌌 Eldar — a Psyker character (Farseer, Spiritseer, Wraithseer) could not buy a single item from the Craftworld or Ynnari Armoury; everything showed unavailable. Fixed, without reopening anything that's genuinely Autarch-only.",
    line5: "⚔️ Horus Heresy — Legion Tactical Squad's Bolt-gun bayonet swap could only ever be bought once for the WHOLE squad, when each Bolt-gun-armed model should get its own choice. Fixed to scale with squad size; its Astartes chainsword upgrade also now correctly charges per model instead of a flat 5 points.",
    line6: "🎖️ Admin — both admin ranks can now open Campaign (Planetary Assault) from the home screen while logged in, ahead of its wider release; every other player still sees the disabled \"Coming Soon\" button.",
    line7: "🪐 Planetary Assault — first backend piece of the \"systems\" layer above sectors (map UI still to come): a GM can group sectors into a system with one capital, and victory can count controlled capitals instead of raw sectors. No existing campaign's win condition changes.",
    line8: "🔧 Correction to this same v1.66's Horus Heresy/Legio Titanicus armory-scope fix above: it was wrong. A Horus Heresy or Legio Titanicus unit DOES get full access to its host codex's basic Armory (confirmed by the ruleset's author) — restored, so a Legion Tactical Squad's Armoury shows the full Chaos Space Marines armory again alongside its own Horus Heresy items.",
    line9: "🔧 That restore only covered HH units granted by the Legion archetype. Horus Heresy can also be added as its own Allied Detachment, and that path still showed just its own 5 items with none of the host codex's — fixed the same way, so it now matches the archetype path.",
    line10: "🗂️ Both fixes above merged the host codex's items straight into the Horus Heresy tab, mixing them with its own 5 items in one list. Now split into two clean tabs — its own Armoury and a separate \"General\" tab for the host codex — exactly like a native unit already shows its own Armoury plus an archetype-granted foreign one.",
    line11: "🛡️ Taking Terminator armor (or Gravis armor) as a model's Veteran Ability made every OTHER Veteran Ability vanish from the picker. That restriction is only meant for weapons/equipment, never Veteran Abilities — fixed for every faction that has it, not just this case.",
    contrib: "👁️ Reported straight from the in-app bug report form — keep using it. Anything still wrong: unit, engagement, archetype and a picture.",
  },
  de: {
    title: "v1.66: Horus Heresy — die Armory, die zu fehlen schien",
    intro: "CSM/SM „Legion“ — eine Einheit, die tatsächlich vom Horus-Heresy-Supplement gewährt wird (Legion Breacher/Tactical/Tactical Support Squad usw.), zeigte in ihrer eigenen Armory einen schlicht „General\" genannten Tab mit still darin versteckten Horus-Heresy-Items — sah aus, als fehle die Horus-Heresy-Armory komplett, da eine normale Einheit dafür einen eigenen, klar benannten „Horus Heresy Legiones Astartes Armoury\"-Tab bekommt. Der Tab nennt sich jetzt nach dem Supplement, das er tatsächlich ist. Adeptus Mechanicus „Taghmata\" traf es schlimmer: normale AdMech-Einheiten hatten GAR KEINEN Tab für die Legio-Titanicus-Armory, die dieses Archetyp selbst verspricht — nur die vom Taghmata injizierten Einheiten konnten sie erreichen. Beides behoben.",
    install: "🔫 Den GLEICHEN Armory-Gegenstand für zwei verschiedene Modelle zu kaufen (z. B. zwei Boltguns auf zwei verschiedenen Chosen) zeigte gar keine Anzahl an, bei jeder Einheit/jedem Champion ohne sonstige Squad-Option. Eine tiefere Ursache hinter dem Kill-Team-Veterans-Fix in v1.65. Auf Engine-Ebene behoben — betrifft also jede Einheit und jeden Champion/Anführer mit demselben Muster, nicht nur ein Datenblatt.",
    line1: "🩻 Orks — bei 9 Einheiten (Boyz, Skarboyz, Burna Boyz, Kommandos, Nobz, Tankbustas, Deffkoptaz, Stormboyz, Lootas) kostete das 'Eavy-armour-Upgrade Punkte, verbesserte aber nie den Rettungswurf. Jede landet jetzt korrekt beim im Codex angegebenen 4+, ausgehend vom eigenen Basiswurf.",
    line2: "🏍️ Orks — ein Warboss (oder jeder Charaktermodell), der „Waaagh!-Bike\" aus der Armory kaufte, bekam Punkte und den Bike-Einheitentyp, aber nie die versprochene Dakkagun. Behoben — die Waffe erscheint jetzt tatsächlich.",
    line3: "🔮 Die Eldar-Eigenschaft „Children of Prophecy“ und die Space-Marines-Eigenschaft „Knowledge is Power“ (beide „Nur für Psioniker“) wurden jeder Einheit der Armee verliehen, nicht nur solchen, die überhaupt eine Kraft manifestieren können. Beides behoben.",
    line4: "🌌 Eldar — ein psionisches Charaktermodell (Farseer, Spiritseer, Wraithseer) konnte keinen einzigen Gegenstand aus der Craftworld- oder Ynnari-Armory kaufen; alles zeigte sich als nicht verfügbar. Behoben, ohne echte Autarch-exklusive Gegenstände wieder zu öffnen.",
    line5: "⚔️ Horus Heresy — der Bolter-Bajonett-Tausch des Legion Tactical Squad konnte für den GANZEN Trupp nur einmal gekauft werden, obwohl jedes mit Bolter bewaffnete Modell eine eigene Wahl haben sollte. Jetzt skaliert er mit der Truppgröße; das Astartes-Kettenschwert-Upgrade auf demselben Datenblatt berechnet jetzt ebenfalls korrekt pro Modell statt pauschal 5 Punkte.",
    line6: "🎖️ Admin — beide Admin-Ränge können jetzt Campaign (Planetary Assault) vom Startbildschirm aus öffnen, während sie eingeloggt sind, vor der breiteren Veröffentlichung; alle anderen Spieler sehen weiterhin den deaktivierten „Coming Soon“-Button.",
    line7: "🪐 Planetary Assault — erstes Backend-Stück der „Systems“-Ebene über den Sektoren (Karten-UI folgt noch): ein GM kann Sektoren zu einem System mit einer Hauptstadt gruppieren, und der Sieg kann kontrollierte Hauptstädte statt roher Sektoren zählen. Keine bestehende Kampagne ändert ihre Siegbedingung.",
    line8: "🔧 Korrektur zum eigenen Horus-Heresy/Legio-Titanicus-Armory-Umfang-Fix dieser v1.66 oben: er war falsch. Eine Horus-Heresy- oder Legio-Titanicus-Einheit HAT vollen Zugriff auf die Basis-Armory ihres Wirtscodex (vom Regelwerksautor bestätigt) — wiederhergestellt, ein Legion Tactical Squad zeigt in seiner Armory jetzt wieder die volle Chaos-Space-Marines-Armory neben den eigenen Horus-Heresy-Items.",
    line9: "🔧 Diese Wiederherstellung deckte nur HH-Einheiten ab, die vom Legion-Archetyp gewährt werden. Horus Heresy lässt sich auch als eigenes Allied Detachment hinzufügen, und dieser Weg zeigte weiterhin nur die eigenen 5 Items ohne alles aus dem Wirtscodex — jetzt genauso behoben, entspricht nun dem Archetyp-Weg.",
    line10: "🗂️ Beide Fixes oben mischten die Items des Wirtscodex direkt in den Horus-Heresy-Tab, zusammen mit den eigenen 5 Items in einer Liste. Jetzt in zwei saubere Tabs aufgeteilt — die eigene Armory und ein separater „General\"-Tab für den Wirtscodex — genau wie eine native Einheit bereits ihre eigene Armory plus eine archetyp-gewährte fremde Armory zeigt.",
    line11: "🛡️ Terminator-Rüstung (oder Gravis-Rüstung) als Veteranenfähigkeit zu wählen ließ jede ANDERE Veteranenfähigkeit aus der Auswahl verschwinden. Diese Einschränkung gilt nur für Waffen/Ausrüstung, nie für Veteranenfähigkeiten — behoben für jede Fraktion, die sie hat, nicht nur diesen Fall.",
    contrib: "👁️ Direkt aus dem Bug-Report-Formular in der App gemeldet — nutzt es weiter. Was noch falsch aussieht: Einheit, Engagement, Archetyp und ein Bild.",
  },
  es: {
    title: "v1.66: Horus Heresy — la armería que parecía no estar",
    intro: "CSM/SM \"Legion\" — una unidad realmente concedida por el suplemento Horus Heresy (Legion Breacher/Tactical/Tactical Support Squad, etc) tenía en su propia Armería una pestaña \"General\" a secas con los ítems de Horus Heresy escondidos dentro — parecía que la armería de Horus Heresy no estaba, ya que una unidad normal recibe una pestaña separada y explícita \"Horus Heresy Legiones Astartes Armoury\" para el mismo contenido. La pestaña ahora se llama como el suplemento que realmente es. Adeptus Mechanicus \"Taghmata\" lo tenía peor: las unidades nativas de AdMech no tenían NINGUNA pestaña para la armería de Legio Titanicus que el propio archetype promete — solo las unidades que Taghmata inyecta podían llegar a ella. Ambos arreglados.",
    install: "🔫 Comprar el MISMO ítem de la Armería para dos miembros distintos (p.ej. dos Boltguns en dos Chosen distintos) no mostraba ninguna cantidad, en cualquier unidad/Campeón sin ninguna otra opción de escuadrón tocada — una causa más profunda detrás del fix de Kill Team Veterans de v1.65. Arreglado a nivel de motor, así que cubre cualquier unidad y cualquier Campeón/líder con el mismo patrón, no solo una ficha.",
    line1: "🩻 Orks — el upgrade 'Eavy armour en 9 unidades (Boyz, Skarboyz, Burna Boyz, Kommandos, Nobz, Tankbustas, Deffkoptaz, Stormboyz, Lootas) cobraba puntos pero nunca mejoraba la Salvación de verdad. Cada una ahora llega correctamente al 4+ que dice el códex, partiendo de su propia Salvación base.",
    line2: "🏍️ Orks — un Warboss (o cualquier personaje) que compraba \"Waaagh!-Bike\" de la Armería recibía los puntos y el tipo de unidad Bike, pero nunca la Dakkagun prometida. Arreglado — el arma ahora aparece de verdad.",
    line3: "🔮 El Trait \"Children of Prophecy\" de Eldar y \"Knowledge is Power\" de Space Marines (ambos \"Solo para Psykers\") se aplicaban a todas las unidades del ejército, no solo a las que pueden manifestar un poder. Ambos arreglados.",
    line4: "🌌 Eldar — un personaje Psyker (Farseer, Spiritseer, Wraithseer) no podía comprar ni un solo ítem de la Armería Craftworld o Ynnari; todo aparecía como no disponible. Arreglado, sin volver a abrir nada que sea genuinamente exclusivo de Autarch.",
    line5: "⚔️ Horus Heresy — el cambio de bayoneta de bólter del Legion Tactical Squad solo se podía comprar UNA vez para todo el escuadrón, cuando cada modelo armado con bólter debería elegir por su cuenta. Ahora escala con el tamaño del escuadrón; la mejora de espada sable Astartes de la misma ficha también cobra ya por modelo en vez de 5 puntos fijos.",
    line6: "🎖️ Admin — ambos rangos de admin ya pueden abrir Campaign (Planetary Assault) desde la pantalla principal estando logueados, antes de su lanzamiento general; el resto de jugadores sigue viendo el botón \"Coming Soon\" desactivado.",
    line7: "🪐 Planetary Assault — primera pieza de backend de la capa \"systems\" sobre los sectores (falta la UI del mapa): un GM ya puede agrupar sectores en un system con una capital, y la victoria puede contar capitales controladas en vez de sectores sueltos. Ninguna campaña existente cambia su condición de victoria.",
    line8: "🔧 Corrección al propio fix de alcance de armería de Horus Heresy/Legio Titanicus de esta misma v1.66, arriba: estaba mal. Una unidad de Horus Heresy o Legio Titanicus SÍ tiene acceso completo a la armería básica de su códex anfitrión (confirmado por el autor del reglamento) — restaurado, así que un Legion Tactical Squad vuelve a mostrar la armería general completa de Chaos Space Marines junto a sus propios ítems de Horus Heresy.",
    line9: "🔧 Esa restauración solo cubría unidades de HH concedidas por el archetype Legion. Horus Heresy también se puede añadir como su propio Allied Detachment, y por ese camino seguía mostrando solo sus 5 ítems propios sin nada del códex anfitrión — arreglado igual, ahora coincide con el camino del archetype.",
    line10: "🗂️ Los dos arreglos anteriores mezclaban los ítems del códex anfitrión directamente dentro de la pestaña de Horus Heresy, junto a sus propios 5 ítems en una sola lista. Ahora está dividido en dos pestañas limpias — su propia Armería y una pestaña \"General\" separada para el códex anfitrión — igual que una unidad nativa ya muestra su propia Armería más una archetype-otorgada por separado.",
    line11: "🛡️ Elegir Terminator armor (o Gravis armor) como habilidad veterana de un modelo hacía desaparecer TODAS las demás habilidades veteranas del selector. Esa restricción es solo para armamento/equipo, nunca para habilidades veteranas — arreglado para cualquier facción que la tenga, no solo este caso.",
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
          {/* v1.66 (2026-08-26) is a genuine version cut, not a prepend onto v1.65's banner — the
              old v1.65 lines (Tyranids, Rough Riders, Henchman Warband, etc, all already shown to
              players when v1.65 first shipped) are intentionally NOT repeated here; that history
              lives in the Changelog modal, not the popup every player sees on load. line1-line7
              are v1.66's OWN follow-up fixes, added the same day as the initial cut (GH#97-100:
              Ork 'Eavy armour/Waaagh!-Bike, Eldar/SM Psyker-only Traits, Eldar Craftworld/Ynnari
              Armoury pricing, HH Legion Tactical Squad bayonet swap; plus admin Campaign access
              and the Planetary Assault systems-layer backend) — same "append to the still-open
              release" pattern v1.65 used, just starting from empty since v1.66 is new. */}
          {[tx.line1, tx.line2, tx.line3, tx.line4, tx.line5, tx.line6, tx.line7, tx.line8, tx.line9, tx.line10, tx.line11]
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
              onClick={onShowCheatSheets}
              className="btn-sweep flex items-center justify-center gap-2 py-3 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-[12px] uppercase tracking-wider transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              Cheat Sheets
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
              Community Armies
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
                Campaign — Alpha (Admin)
              </button>
            ) : (
              <button
                disabled
                title="Campaign mode is still in alpha testing"
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 border border-zinc-800 text-zinc-600 text-[12px] uppercase tracking-wider cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v4.083M17.91 3.5A9 9 0 0121 12a9 9 0 01-9 9m0-18a9 9 0 00-9 9m9-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 18v-4a2 2 0 012-2h2.599" /></svg>
                Campaign — Coming Soon (Alpha)
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
                <div className="text-zinc-100 text-[13px] font-bold uppercase tracking-wide mb-0.5">Forces of the Machine God</div>
                <div className="text-zinc-500 text-[10px] leading-relaxed">Secutarii of the Collegia Titanica</div>
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
