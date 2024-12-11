import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VenueThemeState {
  primaryColor: string;
  secondaryColor: string;
  font: 'cormorant' | 'playfair' | 'lora';
  venueId: string | null;
}

const initialState: VenueThemeState = {
  primaryColor: '#1e293b',
  secondaryColor: '#f472b6',
  font: 'cormorant',
  venueId: null
};

export const venueThemeSlice = createSlice({
  name: 'venueTheme',
  initialState,
  reducers: {
    setVenueTheme: (state, action: PayloadAction<{
      primaryColor: string;
      secondaryColor: string;
      font: 'cormorant' | 'playfair' | 'lora';
      venueId: string;
    }>) => {
      state.primaryColor = action.payload.primaryColor;
      state.secondaryColor = action.payload.secondaryColor;
      state.font = action.payload.font;
      state.venueId = action.payload.venueId;
    },
    clearVenueTheme: (state) => {
      state.primaryColor = initialState.primaryColor;
      state.secondaryColor = initialState.secondaryColor;
      state.font = initialState.font;
      state.venueId = null;
    }
  },
});

export const { setVenueTheme, clearVenueTheme } = venueThemeSlice.actions;
export default venueThemeSlice.reducer;