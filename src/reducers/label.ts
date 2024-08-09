import { DynamicCheckboxValue } from '@/features/product/modals/CollectionAndLabel';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface LabelsState {
  labels: DynamicCheckboxValue[];
  selectedSubLabels: string[];
}

const initialState: LabelsState = {
  labels: [],
  selectedSubLabels: [],
};

const labelReducer = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    setLabels(state, action: PayloadAction<DynamicCheckboxValue[]>) {
      state.labels = action.payload;
    },
    setSelectedSubLabels(state, action: PayloadAction<string[]>) {
      state.selectedSubLabels = action.payload;
    },
  },
});

export const { setLabels, setSelectedSubLabels } = labelReducer.actions;
export default labelReducer.reducer;
