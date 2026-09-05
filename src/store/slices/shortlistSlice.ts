import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ShortlistState {
  ids: string[];
}

const initialState: ShortlistState = { ids: [] };

function persist(ids: string[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('raja_shortlist', JSON.stringify(ids));
  }
}

const shortlistSlice = createSlice({
  name: 'shortlist',
  initialState,
  reducers: {
    initializeShortlist(state) {
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('raja_shortlist');
          state.ids = raw ? (JSON.parse(raw) as string[]) : [];
        } catch {
          state.ids = [];
        }
      }
    },
    toggleShortlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.ids = state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [...state.ids, id];
      persist(state.ids);
    },
    removeFromShortlist(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((x) => x !== action.payload);
      persist(state.ids);
    },
    clearShortlist(state) {
      state.ids = [];
      persist(state.ids);
    },
  },
});

export const { initializeShortlist, toggleShortlist, removeFromShortlist, clearShortlist } = shortlistSlice.actions;
export default shortlistSlice.reducer;
