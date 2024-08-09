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
    updateLabelsAfterMove(state, action: PayloadAction<{ subLabelId: string; labelId: string }>) {
      const { subLabelId, labelId } = action.payload;
      const subLabel = state.labels
        .flatMap((label) => label.subs || [])
        .find((sub) => sub.id === subLabelId);

      if (subLabel) {
        state.labels = state.labels.map((label) => {
          // Add sub label to the target label
          if (label.id === labelId) return { ...label, subs: [...(label.subs || []), subLabel] };

          // Remove sub label from the source label
          if (label.subs?.some((sub) => sub.id === subLabelId))
            return { ...label, subs: label.subs.filter((sub) => sub.id !== subLabelId) };

          return label;
        });
      }
    },
  },
});

export const { setLabels, setSelectedSubLabels, updateLabelsAfterMove } = labelReducer.actions;
export default labelReducer.reducer;
