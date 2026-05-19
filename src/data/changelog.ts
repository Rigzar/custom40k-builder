export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
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
