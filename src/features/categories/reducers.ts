import { CategoryNestedList } from './types';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CategoryState {
  list: CategoryNestedList[];
}

const initialState: CategoryState = {
  list: [],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoryList(state, action: PayloadAction<CategoryNestedList[]>) {
      state.list = action.payload;
    },
  },
});

export const { setCategoryList } = categorySlice.actions;

export const categoryReducer = categorySlice.reducer;
