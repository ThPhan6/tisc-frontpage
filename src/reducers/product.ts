import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IBrandDetail, IProductSummary } from '@/types';

interface ProductState {
  brand?: IBrandDetail;
  summary?: IProductSummary;
}

const initialState: ProductState = {};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setBrand(state, action: PayloadAction<IBrandDetail | undefined>) {
      state.brand = action.payload;
    },
    setProductSummary(state, action: PayloadAction<IProductSummary | undefined>) {
      state.summary = action.payload;
    },
  },
});

export const { setBrand, setProductSummary } = productSlice.actions;
export default productSlice.reducer;
