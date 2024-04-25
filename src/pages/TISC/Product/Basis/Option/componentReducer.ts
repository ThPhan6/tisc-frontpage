import { BasisOptionListResponse } from '@/types';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ComponentReducerProps {
  componentData: BasisOptionListResponse[];
}

const initialState: ComponentReducerProps = {
  componentData: [],
};

const componentSlice = createSlice({
  name: 'component',
  initialState,
  reducers: {
    setComponentData: (state, action: PayloadAction<BasisOptionListResponse[]>) => {
      state.componentData = action.payload;
    },
  },
});

export const { setComponentData } = componentSlice.actions;

export const componentReducer = componentSlice.reducer;
