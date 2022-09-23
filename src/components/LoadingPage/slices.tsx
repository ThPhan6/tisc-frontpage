import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface LoadingAction {
  spinning: boolean;
}

const initialState: LoadingAction = { spinning: false };

const loadingPageSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoadingAction(state, action: PayloadAction<boolean>) {
      state.spinning = action.payload;
    },
  },
});

export const { setLoadingAction } = loadingPageSlice.actions;

export const loadingActionReducer = loadingPageSlice.reducer;
