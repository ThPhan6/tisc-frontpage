import LoadingPageCustomize from './index';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface LoadingAction {
  whirling: boolean;
  spinning: Element | null;
}

const initialState: LoadingAction = {
  whirling: false,
  spinning: null,
};

const loadingPageSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoadingActionForTable(state, action: PayloadAction<boolean>) {
      state.whirling = action.payload;
    },
    setLoadingAction(state, action: PayloadAction<boolean>) {
      state.spinning = action.payload ? <LoadingPageCustomize /> : null;
    },
  },
});

export const { setLoadingActionForTable, setLoadingAction } = loadingPageSlice.actions;

export const loadingActionReducer = loadingPageSlice.reducer;
