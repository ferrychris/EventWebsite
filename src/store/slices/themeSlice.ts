import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  primaryColor: string;
  font: 'cormorant' | 'playfair' | 'lora';
}

const initialState: ThemeState = {
  primaryColor: '#1e293b', // Default color
  font: 'cormorant',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
    },
    setFont: (state, action: PayloadAction<ThemeState['font']>) => {
      state.font = action.payload;
    },
  },
});

export const { setPrimaryColor, setFont } = themeSlice.actions;
export default themeSlice.reducer;