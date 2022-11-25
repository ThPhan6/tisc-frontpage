import { CustomResourceType } from './type';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface CustomResourceState {
  customResourceType: number;
}

const initialState: CustomResourceState = {
  customResourceType: CustomResourceType.Brand,
};

const customResourceSlice = createSlice({
  name: 'customResource',
  initialState,
  reducers: {
    setCustomResourceType(state, action: PayloadAction<Partial<number>>) {
      state.customResourceType = action.payload;
    },
  },
});

export const { setCustomResourceType } = customResourceSlice.actions;
export const customResourceReducer = customResourceSlice.reducer;
