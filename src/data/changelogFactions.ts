import { CHANGELOG, type ChangelogEntry, type I18nString, type I18nStringArray, type KnownIssue } from './changelog';
import { KNOWN_ISSUES } from './known-issues';

/** English-only resolution, used purely for faction-keyword detection. */
function tsEn(field: I18nString): string {
  if (typeof field === 'string') return field;
  const rec = field as Partial<Record<string, string>>;
  return rec['en'] ?? Object.values(rec)[0] ?? '';
}
function taEn(field: I18nStringArray): string[] {
  if (Array.isArray(field)) return field;
  const rec = field as Partial<Record<string, string[]>>;
  return rec['en'] ?? Object.values(rec)[0] ?? [];
}

export const GENERAL = 'General';

/** Faction tabs, in the same order as the landing page categories. */
export const FACTIONS: string[] = [
  'Chaos Space Marines', 'Chaos Daemons',
  'Space Marines', 'Imperial Guard', 'Adeptus Mechanicus', 'Adeptus Custodes', 'Adeptus Sororitas', 'Grey Knights', 'Inquisition',
  'Tau Empire', 'Necrons', 'Orks', 'Eldar', 'Dark Eldar', 'Genestealer Cults', 'Harlequins', 'Leagues of Votann', 'Tyranids',
  'Horus Heresy', 'Escalation', 'Assassins',
];

/** Alternate spellings/abbreviations that should map onto a faction tab. Longest match wins (checked first). */
const ALIASES: { name: string; faction: string }[] = [
  { name: 'Chaos Space Marines', faction: 'Chaos Space Marines' },
  { name: 'CSM', faction: 'Chaos Space Marines' },
  { name: 'Chaos Daemons', faction: 'Chaos Daemons' },
  { name: 'Space Marines', faction: 'Space Marines' },
  { name: 'Imperial Guard', faction: 'Imperial Guard' },
  { name: 'Adeptus Mechanicus', faction: 'Adeptus Mechanicus' },
  { name: 'Adeptus Custodes', faction: 'Adeptus Custodes' },
  { name: 'Adeptus Sororitas', faction: 'Adeptus Sororitas' },
  { name: 'Grey Knights', faction: 'Grey Knights' },
  { name: 'Inquisition', faction: 'Inquisition' },
  { name: "T'au Empire", faction: 'Tau Empire' },
  { name: 'Tau Empire', faction: 'Tau Empire' },
  { name: 'Necrons', faction: 'Necrons' },
  { name: 'Orks', faction: 'Orks' },
  { name: 'Dark Eldar', faction: 'Dark Eldar' },
  { name: 'Eldar', faction: 'Eldar' },
  { name: 'Genestealer Cults', faction: 'Genestealer Cults' },
  { name: 'Harlequins', faction: 'Harlequins' },
  { name: 'Leagues of Votann', faction: 'Leagues of Votann' },
  { name: 'Tyranids', faction: 'Tyranids' },
  { name: 'Horus Heresy', faction: 'Horus Heresy' },
  { name: 'Escalation', faction: 'Escalation' },
  { name: 'Assassins', faction: 'Assassins' },
].sort((a, b) => b.name.length - a.name.length);

/** Find all factions mentioned in a piece of text (e.g. a changelog bullet or issue description). */
function findFactions(text: string): string[] {
  const found = new Set<string>();
  let work = text;
  for (const { name, faction } of ALIASES) {
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${esc}\\b`, 'gi');
    if (re.test(work)) {
      found.add(faction);
      work = work.replace(re, '');
    }
  }
  return [...found];
}

/** Known-issue `id` prefixes that encode their faction directly. Checked before falling back to text scanning. */
const ID_PREFIX_FACTION: [string, string][] = [
  ['ki-csm-', 'Chaos Space Marines'],
  ['ki-cd-', 'Chaos Daemons'],
  ['ki-sm-', 'Space Marines'],
  ['ki-ig-', 'Imperial Guard'],
  ['ki-admech-', 'Adeptus Mechanicus'],
  ['ki-custodes-', 'Adeptus Custodes'],
  ['ki-sororitas-', 'Adeptus Sororitas'],
  ['ki-gk-', 'Grey Knights'],
  ['ki-inquisition-', 'Inquisition'],
  ['ki-tau-empire-', 'Tau Empire'],
  ['ki-necrons-', 'Necrons'],
  ['ki-orks-', 'Orks'],
  ['ki-dark-eldar-', 'Dark Eldar'],
  ['ki-eldar-', 'Eldar'],
  ['ki-genestealer-cults-', 'Genestealer Cults'],
  ['ki-harlequins-', 'Harlequins'],
  ['ki-leagues-of-votann-', 'Leagues of Votann'],
  ['ki-tyranids-', 'Tyranids'],
  ['ki-hh-', 'Horus Heresy'],
  ['ki-escalation-', 'Escalation'],
];

export interface FactionChangeRef {
  entry: ChangelogEntry;
  bulletIndex: number;
}

export const FACTION_CHANGES: Record<string, FactionChangeRef[]> = {};
export const FACTION_ISSUES: Record<string, KnownIssue[]> = {};
export const LATEST_FACTIONS = new Set<string>();

for (const name of [GENERAL, ...FACTIONS]) {
  FACTION_CHANGES[name] = [];
  FACTION_ISSUES[name] = [];
}

CHANGELOG.forEach((entry, entryIdx) => {
  const bullets = taEn(entry.changes);
  const titleFactions = findFactions(tsEn(entry.title));
  bullets.forEach((bullet, bulletIndex) => {
    const isExplicitGeneral = /^General:\s/i.test(bullet);
    const factions = isExplicitGeneral ? [] : findFactions(bullet);
    const targets = isExplicitGeneral
      ? [GENERAL]
      : factions.length > 0 ? factions : titleFactions.length > 0 ? titleFactions : [GENERAL];
    for (const f of targets) {
      FACTION_CHANGES[f].push({ entry, bulletIndex });
      if (entryIdx === 0) LATEST_FACTIONS.add(f);
    }
  });
});

/** A title starting with "GENERAL —" or "CROSS-FACTION —" is a deliberate override: the bug
 * spans (or used to span) every faction via shared engine code, so any faction names mentioned
 * in the text are incidental examples, not the actual scope — file it under General only,
 * skipping both the id-prefix and text-scan detection below. Mirrors the changelog's own
 * "General: " bullet-prefix convention. */
function isExplicitGeneralIssue(title: string): boolean {
  return /^(GENERAL|CROSS-FACTION)\s*—/.test(title);
}

for (const issue of KNOWN_ISSUES) {
  if (isExplicitGeneralIssue(tsEn(issue.title))) {
    FACTION_ISSUES[GENERAL].push(issue);
    continue;
  }
  const tags = new Set<string>();
  for (const [prefix, faction] of ID_PREFIX_FACTION) {
    if (issue.id.startsWith(prefix)) tags.add(faction);
  }
  const text = `${tsEn(issue.title)} ${tsEn(issue.description)}`;
  for (const f of findFactions(text)) tags.add(f);
  const targets = tags.size > 0 ? [...tags] : [GENERAL];
  for (const f of targets) FACTION_ISSUES[f].push(issue);
}

/** Faction tabs that actually have content, General first. */
export const TAB_FACTIONS: string[] = [GENERAL, ...FACTIONS].filter(
  f => FACTION_CHANGES[f].length > 0 || FACTION_ISSUES[f].length > 0,
);
