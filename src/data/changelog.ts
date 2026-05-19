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
    status: 'known',
    title: 'Special rule descriptions show name only — no rules text',
    description: 'Some abilities (e.g. "Fearless", "Infiltrate", "Aegis(5+)") appear as names without their full rules text. Other abilities do include the description. A Core Rules glossary is needed to fill in the missing descriptions.',
  },
  {
    id: 'ki-12',
    status: 'investigating',
    title: 'Trait costs marked with * may not be calculated per model',
    description: 'Some traits (e.g. "Iron Within, Iron Without" in CSM) have costs listed as "2*" or "5*" in the source data, which may indicate a per-model cost. Currently the asterisk is ignored and a flat cost is applied. Verifying the correct rule interpretation.',
  },
  // ── Planned ───────────────────────────────────────────────────────────────
  {
    id: 'ki-p3',
    status: 'planned',
    title: 'Allied detachment — add a second faction as allies in the same list',
    description: 'The ability to include a detachment from a second faction in the same army list. Currently you need two separate armies. This is a nice-to-have feature, not blocking.',
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
    version: '0.10',
    date: '2026-05-19',
    title: 'GK + Inquisition allies, known issue tracking',
    changes: [
      'Fixed: Grey Knights can now select Inquisition units directly — all 13 Inquisition units available in the GK unit catalogue without a separate army',
      'Tracking: Ability descriptions missing for reference-only rules (e.g. "Fearless" with no text)',
      'Tracking: Trait costs marked with * (per-model multiplier) under investigation',
      'Tracking: Allied detachment (second army in same list) added to pipeline',
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
