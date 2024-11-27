import { INVENTORY_EXPORT_COLUMN_HEADERS } from '@/features/Import/constants';
import { RcFile, UploadFile } from 'antd/es/upload';

import { isNumeric } from '@/helper/utils';
import { forEach, isArray, isNil } from 'lodash';

import { InventoryExportType } from '@/features/Import/types/export.type';
import { ImportDatabaseHeader, ImportStep } from '@/features/Import/types/import.type';
import store, { useAppSelector } from '@/reducers';

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
  setFileResult,
  setDataImport,
  setFileUploaded,
  setHeaderMatching,
  setSelectedExportTypes,
} = importSlice.actions;

export const importReducer = importSlice.reducer;

export const useDispatchDataImport = () => {
  const unitTypeData = useAppSelector((s) => s.summary.unitType);
  const fileResult = useAppSelector((s) => s.import.fileResult);
  const headerMatching = useAppSelector((s) => s.import.headerMatching);

  const matchingData = (header?: Record<string, string> | null) => {
    const newHeader = header ?? headerMatching;

    return fileResult?.data.map((item) => {
      const newData: any = {};

      forEach(item, (value, key) => {
        if (!isNil(newHeader?.[key])) {
          newData[newHeader[key]] = value;
        }
      });

      return newData;
    });
  };

  const validateDataImport = (header?: Record<string, any> | null) => {
    const newData = matchingData(header);

    if (!newData?.length) return { error: {}, validated: false };

    const newError: Record<string, any[]> = {};
    const skus: string[] = [];
    const unitPrices: string[] = [];
    const unitTypes: string[] = [];
    const descriptions: string[] = [];

    let hasBackOrder = false;
    const backOrders: string[] = [];
    let hasOnOrder = false;
    const onOrders: string[] = [];

    newData.forEach((data) => {
      forEach(data, (value, key) => {
        if (key === ImportDatabaseHeader.PRODUCT_ID) {
          skus.push(value);
        }

        if (key === ImportDatabaseHeader.UNIT_PRICE) {
          if (isNumeric(value)) {
            unitPrices.push(value);
          }
        }

        if (key === ImportDatabaseHeader.UNIT_TYPE) {
          const unitType = unitTypeData.find(
            (el) =>
              el.name.toLowerCase() === value.toLowerCase() ||
              el.code.toLowerCase() === value.toLowerCase(),
          );

          if (unitType) {
            unitTypes.push(value);
          }
        }

        if (key === ImportDatabaseHeader.DESCRIPTION) {
          descriptions.push(value);
        }

        if (key === ImportDatabaseHeader.BACK_ORDER) {
          hasBackOrder = true;

          if (isNumeric(value || 0) && Number(value) >= 0) {
            backOrders.push(value);
          }
        }

        if (key === ImportDatabaseHeader.ON_ORDER) {
          hasOnOrder = true;

          if (isNumeric(value || 0) && Number(value) >= 0) {
            onOrders.push(value);
          }
        }
      });
    });

    if (skus.length !== newData.length) {
      newError[ImportDatabaseHeader.PRODUCT_ID] = ['SKU is required.'];
    }

    if (unitPrices.length !== newData.length) {
      newError[ImportDatabaseHeader.UNIT_PRICE] = ['Unit price is required.'];
    }

    if (unitTypes.length !== newData.length) {
      newError[ImportDatabaseHeader.UNIT_TYPE] = ['Unit type is required.'];
    }

    if (backOrders.length !== newData.length && hasBackOrder) {
      newError[ImportDatabaseHeader.BACK_ORDER] = ['Back order is invalid.'];
    }

    if (onOrders.length !== newData.length && hasOnOrder) {
      newError[ImportDatabaseHeader.ON_ORDER] = ['On order is invalid.'];
    }

    if (descriptions.length !== newData.length && descriptions.length !== 0) {
      newError[ImportDatabaseHeader.DESCRIPTION] = ['Description is invalid.'];
    }

    store.dispatch(setErrors(newError));

    return {
      error: newError,
      data: newData,
      validated:
        skus.length === newData.length &&
        unitPrices.length === newData.length &&
        unitTypes.length === newData.length &&
        (backOrders.length === 0 || backOrders.length === newData.length) &&
        (onOrders.length === 0 || onOrders.length === newData.length) &&
        (descriptions.length === 0 || descriptions.length === newData.length),
    };
  };

  const dispatchImportData = (header?: Record<string, string> | null) => {
    const dataMatching = validateDataImport(header);

    if (!dataMatching?.data?.length) return;

    store.dispatch(
      setDataImport(
        dataMatching.data.map((item: any) => {
          const newItem = { ...item };

          newItem.unit_price = Number(newItem.unit_price);
          newItem.back_order = Number(newItem.back_order);
          newItem.on_order = Number(newItem.on_order);
          newItem.in_stock = Number(newItem.in_stock);
          newItem.unit_type =
            unitTypeData.find(
              (el) =>
                el?.name?.toLowerCase() === newItem?.unit_type?.toLowerCase() ||
                el?.code?.toLowerCase() === newItem?.unit_type?.toLowerCase(),
            )?.id ?? '';

          return newItem;
        }),
      ),
    );
  };

  return {
    validateDataImport,
    dispatchImportData,
  };
};
