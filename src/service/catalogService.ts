import catalogData from './data/catalog.json';
import initialStateData from './data/initialState.json';
import type { BundleState, Catalog } from '../types';

export function getCatalog(): Catalog {
  return catalogData as Catalog;
}

export function getDefaultBundleState(): BundleState {
  return initialStateData as BundleState;
}
