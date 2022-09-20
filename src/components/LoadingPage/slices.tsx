import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface LoadingAction {
  spninning: boolean;
}

const initialState: LoadingAction = { spninning: false };

const loadingPageSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoadingAction(state, action: PayloadAction<boolean>) {
      state.spninning = action.payload;
    },
  },
});

export const { setLoadingAction } = loadingPageSlice.actions;

export const loadingActionReducer = loadingPageSlice.reducer;
