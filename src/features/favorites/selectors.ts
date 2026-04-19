import type {RootState} from '../../app/store';
import type {EventItem} from '../../types/event';

export const selectFavoriteItems = (state: RootState): EventItem[] =>
  state.favorites.items;

export const selectIsFavorite =
  (id: string) =>
  (state: RootState): boolean =>
    !!state.favorites.ids[id];
