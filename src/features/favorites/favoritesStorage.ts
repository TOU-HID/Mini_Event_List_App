import {MMKV} from 'react-native-mmkv';
import type {EventItem} from '../../types/event';

const storage = new MMKV({id: 'favorites-storage'});

const FAVORITES_KEY = 'favorites_events';

/**
 * Load all favorite events from MMKV.
 */
export function loadFavorites(): EventItem[] {
  try {
    const raw = storage.getString(FAVORITES_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as EventItem[];
  } catch {
    return [];
  }
}

/**
 * Persist the full favorites list to MMKV.
 */
export function saveFavorites(events: EventItem[]): void {
  storage.set(FAVORITES_KEY, JSON.stringify(events));
}
