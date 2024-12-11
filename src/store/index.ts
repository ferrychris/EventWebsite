import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import guestsReducer from './slices/guestsSlice';
import themeReducer from './slices/themeSlice';
import venueThemeReducer from './slices/venueThemeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    guests: guestsReducer,
    theme: themeReducer,
    venueTheme: venueThemeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;