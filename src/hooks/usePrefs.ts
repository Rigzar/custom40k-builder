import { useState, useCallback } from 'react';
import type { EngagementType } from '../types/army';

export type AutosaveInterval = 'off' | '30s' | '5min' | 'close-only';

export interface Prefs {
  autosaveInterval: AutosaveInterval;
  defaultEngagement: EngagementType | '';
  defaultPoints: number | '';
}

const STORAGE_KEY = 'custom40k-prefs';

const DEFAULTS: Prefs = {
  autosaveInterval: '30s',
  defaultEngagement: '',
  defaultPoints: '',
};

function load(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function usePrefs() {
  const [prefs, setPrefsState] = useState<Prefs>(load);

  const setPrefs = useCallback((patch: Partial<Prefs>) => {
    setPrefsState(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
      return next;
    });
  }, []);

  return { prefs, setPrefs };
}

export function autosaveDelayMs(interval: AutosaveInterval): number | null {
  if (interval === 'off' || interval === 'close-only') return null;
  return interval === '30s' ? 30_000 : 300_000;
}
