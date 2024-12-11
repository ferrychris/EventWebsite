import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Guest } from '../../types';
import { api } from '../../services/api';

interface GuestState {
  guests: Guest[];
  loading: boolean;
  error: string | null;
}

// Async thunks
export const fetchGuests = createAsyncThunk(
  'guests/fetchGuests',
  async (eventId: string) => {
    const guests = await api.getGuests(eventId);
    return guests;
  }
);

export const updateGuestStatusAsync = createAsyncThunk(
  'guests/updateStatus',
  async ({ guestId, status }: { guestId: string; status: Guest['status'] }) => {
    const updatedGuest = await api.updateGuestStatus(guestId, status);
    return updatedGuest;
  }
);

export const addGuestsAsync = createAsyncThunk(
  'guests/addGuests',
  async (guests: Omit<Guest, 'id'>[]) => {
    const newGuests = await api.addGuests(guests);
    return newGuests;
  }
);

const initialState: GuestState = {
  guests: [],
  loading: false,
  error: null,
};

export const guestsSlice = createSlice({
  name: 'guests',
  initialState,
  reducers: {
    setGuests: (state, action: PayloadAction<Guest[]>) => {
      state.guests = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch guests
    builder.addCase(fetchGuests.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchGuests.fulfilled, (state, action) => {
      state.guests = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchGuests.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch guests';
    });

    // Update guest status
    builder.addCase(updateGuestStatusAsync.fulfilled, (state, action) => {
      const index = state.guests.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.guests[index] = action.payload;
      }
    });

    // Add guests
    builder.addCase(addGuestsAsync.fulfilled, (state, action) => {
      state.guests.push(...action.payload);
    });
  },
});

export const { setGuests, clearError } = guestsSlice.actions;
export default guestsSlice.reducer;