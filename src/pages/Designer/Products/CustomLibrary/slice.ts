import { CustomProductList } from './types';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface CustomProductState {
  list: CustomProductList[];
  customResourceValue: number;
}

const initialState: CustomProductState = {
  list: [],
  customResourceValue: 0,
};

const officeProductSlice = createSlice({
  name: 'officeProduct',
  initialState,
  reducers: {
    setProductList(state, action: PayloadAction<Partial<CustomProductList>>) {
      state.list = { ...state.list, ...action.payload };
    },
    setCustomResourceValue(state, action: PayloadAction<Partial<number>>) {
      state.customResourceValue = action.payload;
    },
  },
});

export const { setProductList, setCustomResourceValue } = officeProductSlice.actions;
export const officeProductReducer = officeProductSlice.reducer;
