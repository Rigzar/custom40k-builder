import { useState } from 'react';
import type { ArmyState } from '../types/army';

export interface SavedArmy {
  id: string;
  name: string;
  factionKey: string;
  factionLabel: string;
  savedAt: number;
  totalPts: number;
  unitCount: number;
  state: ArmyState;
}

const STORAGE_KEY = 'custom40k-saved-armies';
export const AUTOSAVE_ID = 'autosave-session';
export const AUTOSAVE_DISMISSED_KEY = 'custom40k-autosave-dismissed';

function load(): SavedArmy[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
}

export function useSavedArmies() {
  const [saves, setSaves] = useState<SavedArmy[]>(load);

  function persist(list: SavedArmy[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setSaves(list);
  }

  function saveArmy(entry: SavedArmy) {
    const current = load();
    const idx = current.findIndex(s => s.id === entry.id);
    if (idx >= 0) {
      const next = [...current];
      next[idx] = entry;
      persist(next);
    } else {
      persist([entry, ...current]);
    }
  }

  function deleteArmy(id: string) {
    if (id === AUTOSAVE_ID) sessionStorage.setItem(AUTOSAVE_DISMISSED_KEY, '1');
    persist(load().filter(s => s.id !== id));
  }

  /** Copy a save under a new id, so renaming and re-saving the open army can no longer be the only
   *  way to keep the old version. */
  function duplicateArmy(id: string) {
    const current = load();
    const src = current.find(s => s.id === id);
    if (!src) return;
    const taken = new Set(current.map(s => s.name));
    let name = src.name + ' (copy)';
    for (let n = 2; taken.has(name); n++) name = src.name + ' (copy ' + n + ')';
    const copy: SavedArmy = { ...src, id: 'save-' + Date.now(), name, savedAt: Date.now(), state: { ...src.state, armyName: name } };
    persist([copy, ...current]);
  }

  return { saves, saveArmy, deleteArmy, duplicateArmy };
}
