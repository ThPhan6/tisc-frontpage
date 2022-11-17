import { CustomProductList } from './types';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface CustomProductState {
  list: CustomProductList[];
}

const initialState: CustomProductState = {
  list: [],
};

const officeProductSlice = createSlice({
  name: 'officeProduct',
  initialState,
  reducers: {
    setProductList(state, action: PayloadAction<Partial<CustomProductList>>) {
      state.list = { ...state.list, ...action.payload };
    },
  },
});

export const { setProductList } = officeProductSlice.actions;
export const officeProductReducer = officeProductSlice.reducer;
