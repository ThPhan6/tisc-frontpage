import { RcFile } from 'antd/lib/upload';

import { ImportStep } from '@/features/Import/types/import.type';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ImportState {
  step: ImportStep;
  importedCSVHeaders: string[];
  headerMatching: Record<string, string> | null;
  data: any[];
  errors: any[];
  fileUploaded: RcFile | null;
}

const initialState: ImportState = {
  step: ImportStep.STEP_1,
  importedCSVHeaders: [],
  headerMatching: null,
  data: [],
  errors: [],
  fileUploaded: null,
};

const importSlice = createSlice({
  name: 'import',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<ImportStep>) {
      state.step = action.payload;
    },
    setFileUploaded(state, action: PayloadAction<RcFile>) {
      state.fileUploaded = action.payload;
    },
  },
});

export const { setStep, setFileUploaded } = importSlice.actions;

export const importReducer = importSlice.reducer;
