import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { apiLogin, apiSignup } from '../../services/api';
import type { ApiError, User } from '../../types';

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk<User, { email: string; password: string }, { rejectValue: ApiError }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await apiLogin(email, password);
    } catch (err) {
      return rejectWithValue(err as ApiError);
    }
  },
);

export const signup = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: ApiError }
>('auth/signup', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    return await apiSignup(name, email, password);
  } catch (err) {
    return rejectWithValue(err as ApiError);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth(state) {
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('raja_user');
          state.user = raw ? (JSON.parse(raw) as User) : null;
        } catch {
          state.user = null;
        }
      }
    },
    logout(state) {
      state.user = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('raja_user');
      }
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: AuthState) => {
      state.status = 'loading';
      state.error = null;
    };
    const rejected = (state: AuthState, action: PayloadAction<ApiError | undefined>) => {
      state.status = 'failed';
      state.error = action.payload?.message ?? 'Something went wrong. Please try again.';
    };
    const fulfilled = (state: AuthState, action: PayloadAction<User>) => {
      state.status = 'succeeded';
      state.user = action.payload;
      localStorage.setItem('raja_user', JSON.stringify(action.payload));
    };

    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, fulfilled)
      .addCase(login.rejected, rejected)
      .addCase(signup.pending, pending)
      .addCase(signup.fulfilled, fulfilled)
      .addCase(signup.rejected, rejected);
  },
});

export const { initializeAuth, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
