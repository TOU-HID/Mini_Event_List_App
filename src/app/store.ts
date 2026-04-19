import {configureStore} from '@reduxjs/toolkit';
import {ticketmasterApi} from '../api/ticketmasterApi';
import favoritesReducer from '../features/favorites/favoritesSlice';

export const store = configureStore({
  reducer: {
    [ticketmasterApi.reducerPath]: ticketmasterApi.reducer,
    favorites: favoritesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // MMKV serialization is fine — suppress non-serializable warnings
      serializableCheck: false,
    }).concat(ticketmasterApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
