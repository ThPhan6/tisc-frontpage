import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CategoryListResponse } from '@/types';

interface CategoryState {
  list: CategoryListResponse[];
}

const initialState: CategoryState = {
  list: [],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setList(state, action: PayloadAction<CategoryListResponse[]>) {
      state.list = action.payload;
    },
  },
});

export const { setList } = categorySlice.actions;
export default categorySlice.reducer;
