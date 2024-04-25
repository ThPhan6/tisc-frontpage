import { BasisOptionListResponse, MainBasisOptionSubForm } from '@/types';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ComponentReducerProps {
  componentData: BasisOptionListResponse[];
  componentSubs: MainBasisOptionSubForm[];
}

const initialState: ComponentReducerProps = {
  componentData: [],
  componentSubs: [],
};

const componentSlice = createSlice({
  name: 'component',
  initialState,
  reducers: {
    setComponentData: (state, action: PayloadAction<BasisOptionListResponse[]>) => {
      state.componentData = action.payload;
    },

    setComponentSubs: (state, action: PayloadAction<MainBasisOptionSubForm[]>) => {
      state.componentSubs = action.payload;
    },
  },
});

export const { setComponentData, setComponentSubs } = componentSlice.actions;

export const componentReducer = componentSlice.reducer;
