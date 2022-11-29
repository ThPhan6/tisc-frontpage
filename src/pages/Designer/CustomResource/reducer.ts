import { CustomResourceType } from './type';
import { DataMenuSummaryProps } from '@/components/MenuSummary/types';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface CustomResourceState {
  customResourceType: number;
  summaryCustomResoure: DataMenuSummaryProps[];
}

const initialState: CustomResourceState = {
  customResourceType: CustomResourceType.Brand,
  summaryCustomResoure: [],
};

const customResourceSlice = createSlice({
  name: 'customResource',
  initialState,
  reducers: {
    setCustomResourceType(state, action: PayloadAction<Partial<number>>) {
      state.customResourceType = action.payload;
    },
    setSummaryCustomResource(state, action: PayloadAction<DataMenuSummaryProps[]>) {
      state.summaryCustomResoure = action.payload;
    },
  },
});

export const { setCustomResourceType, setSummaryCustomResource } = customResourceSlice.actions;
export const customResourceReducer = customResourceSlice.reducer;
