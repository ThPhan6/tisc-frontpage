import { INVENTORY_EXPORT_COLUMN_HEADERS } from '@/features/Import/constants';
import { RcFile, UploadFile } from 'antd/es/upload';

import { isArray } from 'lodash';

import { InventoryExportType } from '@/features/Import/types/export.type';
import { ImportStep } from '@/features/Import/types/import.type';
import { LocationDetail } from '@/features/locations/type';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ParseResult } from 'papaparse';

interface ImportState {
  open: boolean;
  step: ImportStep;
  headerMatching: Record<string, string> | null; /// key: header, value: database header
  error: Record<string, any[]> | null; /// key: header, value: error
  fileResult: ParseResult<RcFile> | null;
  headers: string[];
  fileUploaded: UploadFile<RcFile> | null;
  dataImport: any[];
  selectedExportTypes: InventoryExportType[];
  warehouses?: LocationDetail[];
}

const initialState: ImportState = {
  open: false,
  step: ImportStep.STEP_1,
  error: null,
  headers: [],
  dataImport: [],
  headerMatching: null,
  fileResult: null,
  fileUploaded: null,
  selectedExportTypes: INVENTORY_EXPORT_COLUMN_HEADERS.flatMap((item) =>
    isArray(item.key) ? item.key : [item.key],
  ),
};

const importSlice = createSlice({
  name: 'import',
  initialState,
  reducers: {
    setOpenModal(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },
    setStep(state, action: PayloadAction<ImportStep>) {
      state.step = action.payload;
    },
    setWarehouses(state, action: PayloadAction<LocationDetail[]>) {
      state.warehouses = action.payload;
    },
    setFileUploaded(state, action: PayloadAction<UploadFile<RcFile>>) {
      state.fileUploaded = action.payload;
    },
    setFileResult(state, action: PayloadAction<ParseResult<RcFile>>) {
      state.fileResult = action.payload;
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
    setSelectedExportTypes(state, action: PayloadAction<InventoryExportType[]>) {
      state.selectedExportTypes = action.payload;
    },
    resetState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setStep,
  setErrors,
  setHeaders,
  resetState,
  setOpenModal,
  setWarehouses,
  setFileResult,
  setDataImport,
  setFileUploaded,
  setHeaderMatching,
  setSelectedExportTypes,
} = importSlice.actions;

export const importReducer = importSlice.reducer;
