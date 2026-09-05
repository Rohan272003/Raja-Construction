import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiSubmitInquiry } from '../../services/api';
import type { ApiError, InquiryPayload, InquiryRecord } from '../../types';

interface InquiryState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastInquiry: InquiryRecord | null;
}

const initialState: InquiryState = {
  status: 'idle',
  error: null,
  lastInquiry: null,
};

export const submitInquiry = createAsyncThunk<InquiryRecord, InquiryPayload, { rejectValue: ApiError }>(
  'inquiry/submit',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiSubmitInquiry(payload);
    } catch (err) {
      return rejectWithValue(err as ApiError);
    }
  },
);

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {
    resetInquiryStatus(state) {
      state.status = 'idle';
      state.error = null;
      state.lastInquiry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitInquiry.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitInquiry.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastInquiry = action.payload;
      })
      .addCase(submitInquiry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'We could not submit your request. Please try again.';
      });
  },
});

export const { resetInquiryStatus } = inquirySlice.actions;
export default inquirySlice.reducer;
