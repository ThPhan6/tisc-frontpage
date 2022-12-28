import store, { RootState } from '@/reducers';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface LoadingAction {
  spinning: boolean;
  fetchingApi: boolean;
}

const initialState: LoadingAction = { spinning: false, fetchingApi: false };

const loadingPageSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoadingAction(state, action: PayloadAction<boolean>) {
      state.spinning = action.payload;
    },
    startFetchingApiAction(state) {
      state.fetchingApi = true;
    },
    endFetchingApiAction(state) {
      state.fetchingApi = false;
    },
  },
});

export const { setLoadingAction, startFetchingApiAction, endFetchingApiAction } =
  loadingPageSlice.actions;

export const loadingActionReducer = loadingPageSlice.reducer;

export const fetchingApiSelector = (state: RootState) => state.loading.fetchingApi;
export const loadingSelector = (state: RootState) => state.loading.spinning;

export const startFetchingApi = () => store.dispatch(startFetchingApiAction());
export const endFetchingApi = () => store.dispatch(startFetchingApiAction());
