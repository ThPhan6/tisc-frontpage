import { RcFile, UploadFile } from 'antd/es/upload';

import { InventoryExportType } from '@/features/Import/types/export.type';
import { ImportStep } from '@/features/Import/types/import.type';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ParseResult } from 'papaparse';

interface ImportState {
  step: ImportStep;
  headerMatching: Record<string, string> | null; /// key: header, value: database header
  error: Record<string, any[]> | null; /// key: header, value: error
  fileResult: ParseResult<RcFile> | null;
  headers: string[];
  fileUploaded: UploadFile<RcFile> | null;
  dataImport: any[];
  exportType: InventoryExportType[];
}

const initialState: ImportState = {
  step: ImportStep.STEP_1,
  error: null,
  headers: [],
  dataImport: [],
  headerMatching: null,
  fileResult: null,
  fileUploaded: null,
  exportType: [],
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
    setSelectExportType(state, action: PayloadAction<number[]>) {
      state.exportType = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export const {
  setStep,
  setErrors,
  setHeaders,
  resetState,
  setFileResult,
  setDataImport,
  setFileUploaded,
  setHeaderMatching,
  setSelectExportType,
} = importSlice.actions;

export const importReducer = importSlice.reducer;
