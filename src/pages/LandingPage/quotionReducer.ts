import { Quotation } from '@/types';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface QuocationData {
  quotations: Quotation[];
  loaded: boolean;
}

const initialState: QuocationData = {
  quotations: [],
  loaded: false,
};

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    setQuotationData(state, action: PayloadAction<Quotation[]>) {
      state.quotations = action.payload;
    },
    setQuotationLoaded(state, action: PayloadAction<boolean>) {
      state.loaded = action.payload;
    },
  },
});

export const { setQuotationData, setQuotationLoaded } = quotationSlice.actions;

export const quotationReducer = quotationSlice.reducer;
