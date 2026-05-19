export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export type IssueStatus = 'known' | 'investigating' | 'fixed';

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
    title: 'Some units missing from a faction',
    description: 'Not all units from every codex are in the app yet. We are adding them gradually from official sources.',
  },
  {
    id: 'ki-2',
    status: 'known',
    title: 'Army data saves only in this browser',
    description: 'Armies are stored in your browser\'s local storage. Clearing your browser data or switching devices will lose your saves. Use Export JSON to back up your rosters.',
  },
  {
    id: 'ki-3',
    status: 'known',
    title: 'Print layout varies by browser',
    description: 'The print view is optimised for Chrome/Edge. In Firefox or Safari the card layout may shift slightly. Use "Print" in Chrome for best results.',
  },
  {
    id: 'ki-4',
    status: 'known',
    title: 'Allied units do not receive veteran traits',
    description: 'Veteran traits only apply to units from the main faction. Allied detachment units intentionally skip trait costs.',
  },
  {
    id: 'ki-5',
    status: 'known',
    title: 'Horus Heresy not available as a playable faction',
    description: 'Horus Heresy Space Marines data exists for import compatibility but is not selectable in the faction list yet.',
  },
  // ── Fixed ─────────────────────────────────────────────────────────────────
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
    id: 'ki-f3',
    status: 'fixed',
    title: 'Pitched Battle default was 3000 pts instead of 2500',
    description: 'Fixed in v0.7.1 — a data migration now corrects saved rosters that still had 3000 pts stored in the browser.',
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
  {
    id: 'ki-f7',
    status: 'fixed',
    title: 'No visual feedback when adding an item in the Armory',
    description: 'Fixed in v0.7 — the row now flashes green and shows ✓ Added when an item is selected.',
  },
];

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '0.7',
    date: '2026-05-19',
    title: 'Armory feedback, Known Issues & header cleanup',
    changes: [
      'Added: Visual feedback in the Armory modal — the row flashes green and shows ✓ Added when an item is selected',
      'Added: Known Issues tab in the Updates modal — lists ongoing limitations and already-fixed bugs so users don\'t report duplicates',
      'Fixed: "Updates" button removed from the builder header (it remains on the home screen)',
      'Fixed: Pitched Battle default points now correctly migrates saved rosters from 3000 to 2500 pts on first load',
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
