import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ICategoryListResponse } from '@/types';

interface CategoryState {
  list: ICategoryListResponse[];
}

const initialState: CategoryState = {
  list: [],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setList(state, action: PayloadAction<ICategoryListResponse[]>) {
      state.list = action.payload;
    },
  },
});

export const { setList } = categorySlice.actions;
export default categorySlice.reducer;
