import { CustomProductList, CustomResourceType } from './types';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface CustomProductState {
  list: CustomProductList[];
  customResourceType: number;
}

const initialState: CustomProductState = {
  list: [],
  customResourceType: CustomResourceType.Brand,
};

const officeProductSlice = createSlice({
  name: 'officeProduct',
  initialState,
  reducers: {
    setProductList(state, action: PayloadAction<Partial<CustomProductList>>) {
      state.list = { ...state.list, ...action.payload };
    },
    setCustomResourceType(state, action: PayloadAction<Partial<number>>) {
      state.customResourceType = action.payload;
    },
  },
});

export const { setProductList, setCustomResourceType } = officeProductSlice.actions;
export const officeProductReducer = officeProductSlice.reducer;
