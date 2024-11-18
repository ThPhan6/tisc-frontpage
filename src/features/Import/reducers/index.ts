import { RcFile, UploadFile } from 'antd/es/upload';

import { ImportStep } from '@/features/Import/types/import.type';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ParseResult } from 'papaparse';

interface ImportState {
  step: ImportStep;
  importedCSVHeaders: string[];
  headerMatching: Record<string, string> | null;
  data: any[];
  errors: any[];
  fileUploaded: RcFile | null;
  selectedFiels: number[];
  headerMatching: Record<string, string> | null; /// key: header, value: database header
  error: Record<string, any[]> | null; /// key: header, value: error
  fileResult: ParseResult<RcFile> | null;
  headers: string[];
  fileUploaded: UploadFile<RcFile> | null;
  dataImport: any[]; /// final data mapping to be imported
}

const initialState: ImportState = {
  step: ImportStep.STEP_1,
  error: null,
  headers: [],
  dataImport: [],
  headerMatching: null,
  fileResult: null,
  fileUploaded: null,
  selectedFiels: [],
};

const importSlice = createSlice({
  name: 'import',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<ImportStep>) {
      state.step = action.payload;
    },
    setFileUploaded(state, action: PayloadAction<UploadFile<RcFile>>) {
      state.fileUploaded = action.payload;
    },
    setFileResult(state, action: PayloadAction<ParseResult<RcFile>>) {
      state.fileResult = action.payload;
      state.headers = action.payload.meta.fields || [];
    },
    setHeaderMatching(state, action: PayloadAction<Record<string, string> | null>) {
      state.headerMatching = action.payload;
    },
    setDataImport(state, action: PayloadAction<any[]>) {
      state.dataImport = action.payload;
    },
    setHeaders(state, action: PayloadAction<string[]>) {
      state.headers = action.payload;
    },
    setErrors(state, action: PayloadAction<Record<string, any[]> | null>) {
      state.error = action.payload;
    },
    setSelectedFields(state, action: PayloadAction<number[]>) {
      state.selectedFiels = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export const { setStep, setFileUploaded, setSelectedFields } = importSlice.actions;

export const {
  setStep,
  setErrors,
  setHeaders,
  resetState,
  setFileResult,
  setDataImport,
  setFileUploaded,
  setHeaderMatching,
  setSelectedFields
} = importSlice.actions;

export const importReducer = importSlice.reducer;
