import { Quotation } from '@/types';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface QuotationData {
  quotations: Quotation[];
}

const initialState: QuotationData = {
  quotations: [],
};

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    setQuotationData(state, action: PayloadAction<Quotation[]>) {
      state.quotations = action.payload;
    },
  },
});

export const { setQuotationData } = quotationSlice.actions;

export const quotationReducer = quotationSlice.reducer;
