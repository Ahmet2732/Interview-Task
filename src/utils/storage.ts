import type { SavedBundle } from '../types';

export const STORAGE_KEY = 'sentinel-bundle-config';

export function loadSavedBundle(): SavedBundle | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedBundle;
    if (!parsed.quantities || typeof parsed.activeStep !== 'number') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveBundle(bundle: SavedBundle): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
}

export function clearSavedBundle(): void {
  localStorage.removeItem(STORAGE_KEY);
}
