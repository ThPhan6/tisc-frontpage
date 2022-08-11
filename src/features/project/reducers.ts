import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProjectItem {
  id: string;
  code: string;
  name: string;
}

interface ProjectState {
  list: ProjectItem[];
}

const initialState: ProjectState = {
  list: [],
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectList(state, action: PayloadAction<ProjectItem[]>) {
      state.list = action.payload;
    },
  },
});

export const { setProjectList } = projectSlice.actions;

export const projectReducer = projectSlice.reducer;
