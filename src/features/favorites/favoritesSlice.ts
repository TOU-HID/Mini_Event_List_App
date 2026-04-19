import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {EventItem} from '../../types/event';
import {loadFavorites, saveFavorites} from './favoritesStorage';

interface FavoritesState {
  items: EventItem[];
  ids: Record<string, boolean>; // fast lookup
}

// Hydrate from MMKV on launch
const persisted = loadFavorites();

const initialState: FavoritesState = {
  items: persisted,
  ids: Object.fromEntries(persisted.map(e => [e.id, true])),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<EventItem>) {
      const event = action.payload;
      if (state.ids[event.id]) {
        // Remove
        state.items = state.items.filter(e => e.id !== event.id);
        delete state.ids[event.id];
      } else {
        // Add
        state.items.unshift(event);
        state.ids[event.id] = true;
      }
      // Persist after mutation
      saveFavorites(state.items);
    },
  },
});

export const {toggleFavorite} = favoritesSlice.actions;
export default favoritesSlice.reducer;
