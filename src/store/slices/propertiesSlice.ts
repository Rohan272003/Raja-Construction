import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { apiAddProperty, apiDeleteProperty, apiFetchProperties } from '../../services/api';
import type { ApiError, Property, PropertyFilters, SortOption } from '../../types';

interface PropertiesState {
  items: Property[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: PropertyFilters;
  sortBy: SortOption;
}

export const defaultFilters: PropertyFilters = {
  search: '',
  type: 'All',
  city: 'All',
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  status: 'All',
};

const initialState: PropertiesState = {
  items: [],
  status: 'idle',
  error: null,
  filters: defaultFilters,
  sortBy: 'newest',
};

export const fetchProperties = createAsyncThunk<Property[], void, { rejectValue: ApiError }>(
  'properties/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetchProperties();
    } catch (err) {
      return rejectWithValue(err as ApiError);
    }
  },
);

export const addProperty = createAsyncThunk<
  Property,
  Omit<Property, 'id' | 'createdAt'>,
  { rejectValue: ApiError }
>('properties/addProperty', async (payload, { rejectWithValue }) => {
  try {
    return await apiAddProperty(payload);
  } catch (err) {
    return rejectWithValue(err as ApiError);
  }
});

export const deleteProperty = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiError }
>('properties/deleteProperty', async (id, { rejectWithValue }) => {
  try {
    return await apiDeleteProperty(id);
  } catch (err) {
    return rejectWithValue(err as ApiError);
  }
});

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<Partial<PropertyFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = defaultFilters;
    },
    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Unable to load properties right now.';
      })
      .addCase(addProperty.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setFilter, resetFilters, setSortBy } = propertiesSlice.actions;
export default propertiesSlice.reducer;
