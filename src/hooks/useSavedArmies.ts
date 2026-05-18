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
    persist(load().filter(s => s.id !== id));
  }

  return { saves, saveArmy, deleteArmy };
}
