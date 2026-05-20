export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export type IssueStatus = 'known' | 'investigating' | 'fixed' | 'by_design' | 'planned';

export interface KnownIssue {
  id: string;
  status: IssueStatus;
  title: string;
  description: string;
}

export const KNOWN_ISSUES: KnownIssue[] = [
  // ── Fixed (v0.19) ─────────────────────────────────────────────────────────
  {
    id: 'ki-19a',
    status: 'fixed',
    title: '20+ faction rules showed name only with no description',
    description: 'Fixed in v0.19 — Supporting Fire (Tau), Dakka Dakka Dakka / Waaagh! / Mob (Orks), Battle Focus (Eldar), Acts of Faith / Shield of Faith (Sororitas), Ambush (GSC), Canticles of the Omnissiah (AdMech), Instinctive Behaviour / Synapse (Tyranids), Void Armor / Eye of the Ancestors / Steady Advance (LoV), Shield Host (Custodes), Power Through Pain / Combat Drugs (Dark Eldar), Reanimation Protocols (Necrons), and all four Chaos Marks now show their full descriptions.',
  },
  {
    id: 'ki-19b',
    status: 'fixed',
    title: 'Orks vehicles — Ramshackle table results and Shokk Attack Gun scatter table were missing',
    description: 'Fixed in v0.19 — the Ramshackle table results (Kaboom! / Kareen! / Kerrunch!) and the full Shokk Attack Gun doubles table are now shown in unit cards.',
  },
  {
    id: 'ki-19c',
    status: 'fixed',
    title: 'Students of Vaul, Interplanetary Invasors and Big Red Button vehicle traits had no points cost',
    description: 'Fixed in v0.19 — these three vehicle-only traits were showing a +0 pts cost due to a data import miss. All now correctly apply +5 pts per vehicle.',
  },
  // ── Fixed (v0.18) ─────────────────────────────────────────────────────────
  {
    id: 'ki-18a',
    status: 'fixed',
    title: 'Junk text entries appeared in ability list for several Grey Knights, Eldar and Sororitas units',
    description: 'Fixed in v0.18 — "Name:", "Range:", "Cast value:", "Effect:", "Duration:", "Complexity:", "When:", "Cost:" were showing up as fake abilities on GK vehicles (Dreadnought, Land Raiders, Razorback, Rhino, Stormraven), the Eldar Spiritseer, and the Sororitas Living Saint.',
  },
  {
    id: 'ki-18b',
    status: 'fixed',
    title: 'Equipment options missing on Blood Claws, Assault Squad, Tankbustas, Deffkoptaz, Big\'ed Bossbunka',
    description: 'Fixed in v0.18 — Jump pack for Blood Claws, jump pack removal and Heavy bolt pistol for Assault Squad, Bomb squig for Tankbustas, Big bomb for Deffkoptaz, and Big shoota for Big\'ed Bossbunka were not showing up in the unit card. All options now appear with the correct points cost.',
  },
  {
    id: 'ki-18c',
    status: 'fixed',
    title: 'Incorrect ability entries on Orks vehicles and several other factions',
    description: 'Fixed in v0.18 — minor bug fix affecting 10+ factions: various incorrect, duplicate, or corrupted ability entries were showing up in unit cards and the printed summary (e.g. date strings, dice notation, typos, placeholder text). All cleaned up.',
  },
  // ── Fixed (v0.17) ─────────────────────────────────────────────────────────
  {
    id: 'ki-17a',
    status: 'fixed',
    title: 'Armory shows CSM-only tabs (Mark, Legion, Daemon Weapons) for all factions',
    description: 'Fixed in v0.17 — Mark Armoury tab is now hidden for factions with no marks; Daemon Weapons section is hidden when the faction has none; the legacy/clan tab uses the faction\'s own key name (e.g. "Clan Armoury" for Orks instead of "Legion Armoury").',
  },
  {
    id: 'ki-17b',
    status: 'fixed',
    title: 'Grey Knights — Shrouding, They Shall Know No Fear, True Grit show no description',
    description: 'Fixed in v0.17 — these three Grey Knights special rules were stored as bare names in the unit data and had no entry in the core rules glossary. Full descriptions added.',
  },
  // ── Fixed (v0.16) ─────────────────────────────────────────────────────────
  {
    id: 'ki-16c',
    status: 'fixed',
    title: '"Jury-rigged repairs" trait not applying cost to vehicles',
    description: 'Fixed in v0.16 — the trait\'s pts_veh field was null due to a parser miss, so vehicles (including Chimera) did not receive the +5 pts cost. Fixed to 5 pts per vehicle.',
  },
  {
    id: 'ki-16a',
    status: 'fixed',
    title: 'Bullgryns equipment swap options were invisible',
    description: 'Fixed in v0.16 — the Plate shield and Grenadier gauntlet swap options now appear as numeric inputs on the Bullgryns unit card. Previously the parser produced empty choices lists, so the options were not rendered.',
  },
  {
    id: 'ki-16b',
    status: 'fixed',
    title: 'Mechanised Company — transports not counted toward 25% Troops',
    description: 'Fixed in v0.16 — when the Mechanised Company archetype is active, Dedicated Transports now contribute 50% of their points toward the 25% Troops requirement, matching the archetype rules.',
  },
  // ── Open ──────────────────────────────────────────────────────────────────
  {
    id: 'ki-1',
    status: 'known',
    title: 'Some units are missing from certain factions',
    description: 'Unit coverage is still being verified faction by faction. Factions with known gaps: Chaos Space Marines (some Daemon Engines), Imperial Guard (some vehicle squadrons), Necrons (some Canoptek units), Orks (some clan-specific units), Eldar (some Aspect Warrior variants). All others are being checked. Report a specific missing unit with the Bug button.',
  },
  {
    id: 'ki-2',
    status: 'known',
    title: 'Army data saves only in this browser',
    description: 'Armies are stored in your browser\'s local storage. Clearing browser data or switching devices will lose your saves. Use Export JSON to back up rosters. A full account/cloud system is being considered for a future update.',
  },
  {
    id: 'ki-3',
    status: 'known',
    title: 'Print layout and app not optimised for mobile or non-Chrome browsers',
    description: 'The app is currently built and tested on desktop Chrome/Edge. Mobile layout and Firefox/Safari support will be improved once the core feature set is stable.',
  },
  // ── Open / Investigating ──────────────────────────────────────────────────
  {
    id: 'ki-10',
    status: 'fixed',
    title: 'Grey Knights could not select Inquisition units',
    description: 'Fixed in v0.10 — all 13 Inquisition units now appear in the Grey Knights unit catalogue under their respective slots, with [Allied] label.',
  },
  {
    id: 'ki-11',
    status: 'fixed',
    title: 'Special rule descriptions show name only — no rules text',
    description: 'Fixed in v0.12 — a Core Rules glossary now covers all standard weapon abilities (AT, Barrage, Poison, etc.) and model special rules (Fearless, Deep Strike, Daemon, etc.). Each rule in the unit abilities list now shows its full description.',
  },
  {
    id: 'ki-12',
    status: 'fixed',
    title: 'Trait costs marked with * were not calculated per Wound',
    description: 'Fixed in v0.11 — all trait costs now multiply by unit size (a 5-pt trait on 5 models = 25 pts). Traits marked with * additionally multiply by Wounds per model (e.g. "Iron Within, Iron Without" CSM: 2* = 2 × W × size).',
  },
  // ── Planned ───────────────────────────────────────────────────────────────
  {
    id: 'ki-p3',
    status: 'fixed',
    title: 'Allied detachment — add a second faction as allies in the same list',
    description: 'Implemented in v0.13 — a full Allied Detachment panel lets you pick a second faction as allies, shows their relationship (Battle Brothers / Allies of Convenience / Desperate Allies), and provides a mini force org (0–1 HQ, 1–2 Troops, 0–1 Elites/FA/HS). Allied units are validated separately from the main force org.',
  },
  {
    id: 'ki-p1',
    status: 'planned',
    title: 'Account system & cloud army storage',
    description: 'A login/account system that lets you save armies in the cloud and access them from any device. Currently being designed — no release date yet.',
  },
  {
    id: 'ki-p2',
    status: 'planned',
    title: 'Escalation supplement — Lords of War',
    description: 'A new supplement adding Lords of War, super-heavy vehicles and Titans across all factions. Will introduce a dedicated slot and special engagement rules. Coming in a future update.',
  },
  // ── Fixed ─────────────────────────────────────────────────────────────────
  {
    id: 'ki-13',
    status: 'fixed',
    title: 'Chaos Daemons archetype dropdown showed footnote constraints as selectable entries',
    description: 'Fixed in v0.11 — the four footnote lines ("ᴷ Only for models with Mark of Khorne", etc.) that annotate mark-locked archetypes in the source data were being parsed as archetypes. They have been removed from the archetype list.',
  },
  {
    id: 'ki-f7',
    status: 'fixed',
    title: 'No visual feedback when adding an item in the Armory',
    description: 'Fixed in v0.7 — the row now flashes green and shows ✓ Added when an item is selected.',
  },
  {
    id: 'ki-f8',
    status: 'fixed',
    title: 'Unit print card showed all possible weapons, not just equipped ones',
    description: 'Fixed in v0.7 — cards now show only default equipment plus whatever optional weapons were selected.',
  },
  {
    id: 'ki-f9',
    status: 'fixed',
    title: 'Print view showed "pitched" instead of "Pitched Battle"',
    description: 'Fixed in v0.7 — Engagement Type now shows the full display name for all engagement types.',
  },
  {
    id: 'ki-f3',
    status: 'fixed',
    title: 'Pitched Battle default was 3000 pts instead of 2500',
    description: 'Fixed in v0.7 — a store migration corrects saved rosters that still had 3000 pts stored in the browser.',
  },
  {
    id: 'ki-f1',
    status: 'fixed',
    title: 'Print view showed a blank page',
    description: 'Fixed in v0.6 — the roster now opens in a new window and prints correctly.',
  },
  {
    id: 'ki-f2',
    status: 'fixed',
    title: 'Refreshing the page sent you back to the home screen',
    description: 'Fixed in v0.6 — refreshing now returns you to the builder with your faction and army intact.',
  },
  {
    id: 'ki-f4',
    status: 'fixed',
    title: 'Army name from previous faction appeared in new faction',
    description: 'Fixed in v0.6 — switching factions now clears the army name.',
  },
  {
    id: 'ki-f5',
    status: 'fixed',
    title: 'Troops slot showed "Raptors/Legionnaires" for non-CSM factions',
    description: 'Fixed in v0.6 — the label now only appears for Chaos Space Marines.',
  },
  {
    id: 'ki-f6',
    status: 'fixed',
    title: 'Daemon ability numbers (1–6) appeared as unit abilities in print',
    description: 'Fixed in v0.6 — standalone dice-result numbers are filtered out from the ability list.',
  },
];

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '0.19',
    date: '2026-05-20',
    title: 'Rule descriptions added for 20+ faction rules',
    changes: [
      'Tau Empire: "Supporting Fire" now shows its full description',
      'Orks: "Dakka Dakka Dakka", "Waaagh!" and "Mob" now show their full descriptions',
      'Eldar: "Battle Focus" now shows its full description',
      'Adeptus Sororitas: "Acts of Faith" and "Shield of Faith" now show their full descriptions',
      'Genestealer Cults: "Ambush" now shows its full description',
      'Adeptus Mechanicus: "Canticles of the Omnissiah" now shows its full description',
      'Tyranids: "Instinctive Behaviour" and "Synapse" now show their full descriptions',
      'Leagues of Votann: "Void Armor", "Eye of the Ancestors" and "Steady Advance" now show their full descriptions',
      'Adeptus Custodes: "Shield Host" now shows its full description',
      'Dark Eldar: "Power Through Pain" and "Combat Drugs" now show their full descriptions',
      'Necrons: "Reanimation Protocols" now shows its full description',
      'Chaos Space Marines / Chaos Daemons: "Mark of Khorne", "Mark of Nurgle", "Mark of Slaanesh" and "Mark of Tzeentch" now show their full descriptions',
      'Orks: Ramshackle table results (Kaboom! / Kareen! / Kerrunch!) now shown in unit card for all 18 affected vehicles',
      'Orks: Shokk Attack Gun and Junka Shokk Attack Gun scatter table now fully described (all 6 doubles results)',
      'Minor bug fix: "Students of Vaul" (Eldar), "Interplanetary Invasors" (Necrons) and "Big Red Button" (Orks) vehicle traits now apply their correct +5 pts cost',
    ],
  },
  {
    version: '0.18',
    date: '2026-05-20',
    title: 'Equipment options & rule descriptions fixed across 10+ factions',
    changes: [
      'Space Marines — Blood Claws: Jump pack option (+8 pts) now appears and can be selected',
      'Space Marines — Assault Squad: "Remove jump pack" (−9 pts) and "Heavy bolt pistol" (+1 pt) options now appear',
      'Orks — Tankbustas: Bomb squig option (+8 pts) now appears',
      'Orks — Deffkoptaz: Big bomb option (+13 pts) now appears',
      'Orks — Big\'ed Bossbunka: Big shoota option (+12 pts) now appears',
      'Core Rules: "Fire Hatches" rule now shows its description in unit cards (GK Rhino, IG Chimera, IG Taurox, SM Impulsor, and others)',
      'Grey Knights (7 vehicles), Eldar (Spiritseer), Sororitas (Living Saint): junk text entries (column headers from table data) were showing up in the abilities list — fixed',
      'Orks vehicles, Chaos Space Marines, Harlequins, Dark Eldar, Custodes, Leagues of Votann, Necrons, Tyranids, Inquisition: minor bug fix — various incorrect or corrupted ability entries removed or corrected',
    ],
  },
  {
    version: '0.17',
    date: '2026-05-20',
    title: 'Armory tab cleanup & Grey Knights missing rule descriptions',
    changes: [
      'Armory modal: "Mark Armoury" tab is now hidden for factions without marks (e.g. Orks, Grey Knights) — it was always disabled for those factions but still visible',
      'Armory modal: "Daemon Weapons" section tab is now hidden for factions whose armory has no daemon weapons',
      'Armory modal: the legacy/clan tab now uses the faction\'s own naming — Orks show "Clan Armoury" instead of "Legion Armoury"',
      'Grey Knights: "Shrouding", "They Shall Know No Fear" and "True Grit" now show their full rule descriptions in unit cards and the printed summary',
    ],
  },
  {
    version: '0.16',
    date: '2026-05-20',
    title: 'Bug fixes — Bullgryns equipment, Mechanised Company transports, Jury Rig',
    changes: [
      'Imperial Guard — Bullgryns: equipment swap options (Plate shield / Grenadier gauntlet) now appear and cost points correctly; previously the options were invisible due to a parser miss',
      'Imperial Guard — Mechanised Company archetype: Dedicated Transports now count at 50% of their points toward the 25% Troops requirement, as per the archetype rules',
      'Imperial Guard — "Jury-rigged repairs" trait: was not applying its +5 pts cost to vehicles (Chimera and others) because the parser left pts_veh as null instead of 5; fixed',
    ],
  },
  {
    version: '0.15',
    date: '2026-05-20',
    title: 'Missing units & enriched data (4 factions)',
    changes: [
      'Adeptus Custodes: added Coronus Grav-carrier (Dedicated Transport)',
      'Genestealer Cults: added Kelermorph and Locus (Elites)',
      'Space Marines: added Wolf Companions (Fast Attack)',
      'Tyranids, Space Marines, Adeptus Custodes, Genestealer Cults: weapon profiles and unit data filled in from parser',
    ],
  },
  {
    version: '0.14',
    date: '2026-05-19',
    title: 'Veteran Abilities and Vehicle Upgrade buttons',
    changes: [
      'New: "Veteran" button on each unit card — opens veteran abilities directly, without having to browse the full armoury',
      'New: "Upgrades" button on vehicle cards — shows only vehicle upgrade items available to that unit',
      'Both buttons only appear when the faction has items of that category and the unit can use them',
      'The Veteran button counter shows how many slots are used (e.g. "Veteran (1/2)")',
    ],
  },
  {
    version: '0.13',
    date: '2026-05-19',
    title: 'Allied detachment system',
    changes: [
      'New: Allied Detachment panel in the sidebar — pick a second faction as allies with a mini force org (0–1 HQ, 1–2 Troops, 0–1 Elites / Fast Attack / Heavy Support, 0–3 Transports)',
      'New: 16×16 Allied Matrix — shows Battle Brothers (green), Allies of Convenience (yellow) and Desperate Allies (red) with full relationship descriptions',
      'New: Allied faction data is loaded on demand and injected into the store so resolveUnit can find allied units',
      'New: Allied AOP validation is separate from the main force org — allied units do not count toward main slot mins/maxes',
      'New: Removing an allied faction or switching primary faction clears all allied units automatically',
      'New: Elites / Fast Attack / Heavy Support in the allied detachment are limited to 1 per Troop unit taken',
    ],
  },
  {
    version: '0.12',
    date: '2026-05-19',
    title: 'Descripciones de reglas en cartas y roster impreso',
    changes: [
      'Las reglas especiales ahora muestran su texto completo en la carta de unidad — AT, Barrage, Fearless, Deep Strike y muchas más ya no aparecen solo como un nombre',
      'Reglas con un valor propio como Terrifying(-2) o Poison(4+) muestran la descripción con ese número ya incluido',
      'Las reglas propias de la facción (escritas como "Nombre: texto") mantienen su descripción original y se muestran junto a las reglas estándar',
      'En el roster impreso, la sección Special Rules ahora incluye también las habilidades de las armas y el equipo de armería — ordenadas de la A a la Z',
      'Reglas con distintos valores (p.ej. Terrifying(-1) y Terrifying(-2)) aparecen como una sola entrada en el glosario impreso, sin repetirse',
    ],
  },
  {
    version: '0.11',
    date: '2026-05-19',
    title: 'Arquetipos Chaos Daemons y coste real de los traits',
    changes: [
      'El desplegable de arquetipos de Chaos Daemons ya no muestra las notas al pie (ᴷ ᴺ ˢ ᵀ) como si fueran arquetipos seleccionables',
      'Los traits ahora cuestan lo que toca: un trait de 5 pts en una escuadra de 5 modelos son 25 pts en total, no 5 planos',
      'Los traits marcados con * también multiplican por las Heridas (o Hull Points en vehículos) de cada modelo, tal como dicen las reglas',
      'Las Criaturas Monstruosas usan su propia columna de puntos para los traits, no la de infantería ni la de vehículos',
      'Los vehículos leían la columna equivocada para los traits — corregido',
      'Revisando cómo funciona el apilamiento de Poison cuando una misma unidad lo tiene a distintos valores',
    ],
  },
  {
    version: '0.10',
    date: '2026-05-19',
    title: 'Grey Knights + aliados Inquisición',
    changes: [
      'Los Grey Knights ya pueden elegir unidades de la Inquisición directamente desde su propio catálogo — sin necesidad de construir un segundo ejército',
      'Anotado para investigar: algunas reglas especiales aparecen solo con el nombre y sin descripción (p.ej. "Fearless" sin texto)',
      'Anotado para investigar: el multiplicador de los traits marcados con *',
      'Añadido al roadmap: destacamentos aliados (una segunda facción en el mismo ejército)',
    ],
  },
  {
    version: '0.9',
    date: '2026-05-19',
    title: 'Legal pages, cookie notice & footer',
    changes: [
      'Added: Legal Notice, Privacy Policy, Cookie Policy, Terms of Use and Accessibility Statement — accessible from the footer on every page',
      'Added: Lawwwing cookie consent widget — GDPR/LSSI compliant cookie management',
      'Added: Footer with legal links and copyright notice on all pages',
    ],
  },
  {
    version: '0.8',
    date: '2026-05-19',
    title: 'Slot icons & supplements section',
    changes: [
      'Added: Slot icons (HQ, Troops, Elites, Fast Attack, Heavy Support, Transport, Fortifications, Flyers) appear in the unit catalogue and on print cards',
      'Added: Supplements section on the home screen — Horus Heresy is now listed as a browsable supplement',
      'Added: Escalation supplement teaser (Lords of War) — coming soon',
      'Added: Known Issues improvements — By Design and Planned categories; more specific faction gaps listed',
    ],
  },
  {
    version: '0.7',
    date: '2026-05-19',
    title: 'Armory feedback, Known Issues tab & weapon fix',
    changes: [
      'Added: Visual feedback in the Armory modal — the row flashes green and shows ✓ Added when an item is selected',
      'Added: Known Issues tab in the Updates modal — lists ongoing limitations and already-fixed bugs so users don\'t report duplicates',
      'Fixed: "Updates" button removed from the builder header (it remains on the home screen)',
      'Fixed: Pitched Battle default points now correctly migrates saved rosters from 3000 to 2500 pts on first load',
      'Fixed: Print view showed "pitched" instead of "Pitched Battle" under Engagement Type (affected all factions)',
      'Fixed: Unit cards in the print view now show only default equipment + selected optional weapons, not all possible weapons in the entry',
    ],
  },
  {
    version: '0.6',
    date: '2026-05-19',
    title: 'Bug fixes — refresh, print, slots & names',
    changes: [
      'Fixed: Refreshing the page now returns to the builder instead of the landing page',
      'Fixed: Print view was showing a blank page — CSS corrected',
      'Fixed: Standalone numbers (1–6 from D6 result tables) no longer appear as abilities in the print view',
      'Fixed: Pitched Battle default points changed from 3000 to 2500',
      'Fixed: Pitched Battle slot limits — Troops up to 6, Elites / Fast Attack / Heavy Support up to 3',
      'Fixed: Troops validation label no longer shows "Raptors/Legionnaires" for non-CSM factions',
      'Fixed: Army name from a previous session no longer carries over when switching factions',
    ],
  },
  {
    version: '0.5',
    date: '2026-05-19',
    title: 'Tyranids & bug reporting',
    changes: [
      'Added: Tyranids — 40 units across HQ, Troops, Elites, Fast Attack, Heavy Support and Flyers',
      'Added: Bug report button in the header — fill the form and send without leaving the app',
      'Removed: Cloud sync (Supabase backend) — Push / Pull / Sync Key panel dropped',
    ],
  },
  {
    version: '0.3',
    date: '2026-05-18',
    title: 'Visualización, sincronización y ejércitos guardados',
    changes: [
      'Print view: las cartas de unidad aparecen ahora siempre en orden de slot (HQ → Troops → Elites → …)',
      'Página de resumen: gráficos de radar para Composición del ejército y Poder del ejército',
      'Cloud sync: sincroniza ejércitos entre dispositivos con una Clave Personal (backend Supabase)',
      'Panel de sync en la barra lateral — Push / Pull / Import desde otra clave',
      'Botón "Mis Ejércitos" en el builder — carga ejércitos guardados sin salir de la página',
      'Códigos de ejército: código compacto para compartir ejércitos sin cuenta',
      'Ejércitos con nombre — icono de lápiz en la cabecera para renombrar',
      'Botón Guardar Ejército — almacena ejércitos en el navegador, sin cuenta necesaria',
      'Página de inicio muestra los ejércitos guardados con botones de carga y borrado',
    ],
  },
  {
    version: '0.2',
    date: '2026-05-18',
    title: 'Rezos, disciplinas Legacy y poderes psíquicos completos',
    changes: [
      'Adeptus Sororitas: 5 Himnos de Batalla; Missionary, Dogmata y Preacher son ahora sacerdotes',
      'Imperial Guard: mismos Himnos de Batalla; Preacher con acceso a rezos',
      'Space Marines: 5 disciplinas Legacy (Geokinesis, Interromancy, Sanguine, Stormspeaking, Tempestus)',
      'Las disciplinas Legacy solo aparecen si hay un Legacy activo en el ejército',
      'Eldar: 4 disciplinas (Battle, Fate, Revenant, Wraith)',
      'Chaos Daemons: 3 disciplinas por marca (Change, Decay, Excess)',
      'Imperial Guard: Psikana I & II; Inquisition: Heresius & Telesthesia',
      'Genestealer Cults: Broodmind & Legacy Psychic Powers',
      'Harlequins: Phantasmancy; Leagues of Votann: Skeinwrought; Orks: Waaagh!',
      'Necrons: poderes del C\'tan; Pariahs corregidos a no-psíquicos',
      'Suplemento Horus Heresy eliminado del selector de facciones',
    ],
  },
  {
    version: '0.1',
    date: '2026-05-17',
    title: 'Lanzamiento inicial — 18 facciones jugables',
    changes: [
      '18 facciones jugables: Caos, Imperio y Xenos',
      'Slots de unidad, opciones, tamaños y cálculo de puntos',
      'Selección de Arquetipo y Legacy',
      'Rasgos veteranos y objetos de armería por unidad',
      'Poderes psíquicos y rezos (CSM, Space Marines, Grey Knights)',
      'Marcas del Caos con filtrado de disciplinas',
      'Validación del ejército y vista de impresión',
      'Exportar / Importar JSON',
      'App desplegada en Vercel con auto-deploy desde GitHub',
    ],
  },
];
