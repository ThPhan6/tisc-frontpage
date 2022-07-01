import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IBrandAlphabetItem, IProductSummary } from '@/pages/TISC/Product/Configuration/types';

interface ProductState {
  brand?: {
    id?: string;
    logo?: string;
    name?: string;
  };
  summary?: IProductSummary;
}

const initialState: ProductState = {};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setBrand(state, action: PayloadAction<IBrandAlphabetItem | undefined>) {
      state.brand = action.payload;
    },
    setProductSummary(state, action: PayloadAction<IProductSummary | undefined>) {
      state.summary = action.payload;
    },
  },
});

export const { setBrand, setProductSummary } = productSlice.actions;
export default productSlice.reducer;
