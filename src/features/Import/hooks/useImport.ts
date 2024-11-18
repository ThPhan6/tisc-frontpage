import { MESSAGE_ERROR } from '@/constants/message';
import { message } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';

import { keepLastObjectOccurrence } from '@/helper/utils';
import { forEach, isNil, isNumber } from 'lodash';

import {
  setDataImport,
  setErrors,
  setFileResult,
  setFileUploaded,
  setHeaderMatching,
  setHeaders,
  setStep,
} from '../reducers';
import { ImportDatabaseHeader, ImportFileType, ImportStep } from '../types/import.type';
import store, { useAppSelector } from '@/reducers';

import * as Papa from 'papaparse';
import type { RcFile, UploadRequestOption } from 'rc-upload/lib/interface';

export const useImport = () => {
  const unitTypeData = useAppSelector((s) => s.summary.unitType);
  const { step, fileResult, error, fileUploaded, headerMatching, headers } = useAppSelector(
    (s) => s.import,
  );

  const validateCSVFile = (file: RcFile) => {
    if (file.type !== ImportFileType.CSV) {
      message.error('Please upload CSV file.');
      return false;
    }

    return true;
  };

  const handleBeforeUpload = (file: RcFile, _fileList: RcFile[]) => {
    validateCSVFile(file);
  };

  const handleChangeUpload = (info: UploadChangeParam<UploadFile<RcFile>>) => {
    validateCSVFile(info.file as RcFile);
  };

  const handleCustomRequest = (options: UploadRequestOption) => {
    const { file } = options;
    const fileObj = file as RcFile;

    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) {
          message.error(MESSAGE_ERROR.READING_FILE);
          return;
        }

        if (fileObj.type !== ImportFileType.CSV) {
          validateCSVFile(fileObj);
        }

        Papa.parse<unknown, RcFile>(fileObj, {
          header: true,
          skipEmptyLines: true,
          complete(result: Papa.ParseResult<RcFile>, RCFile: UploadFile<RcFile>) {
            store.dispatch(setFileResult(result as any));
            store.dispatch(setFileUploaded(RCFile as any));
            store.dispatch(setHeaderMatching(null));
            store.dispatch(setErrors(null));
          },
          error(_error: Error, _RCFile: RcFile) {
            message.error(MESSAGE_ERROR.READING_FILE);
          },
        });
      };

      reader.onerror = () => {
        message.error(MESSAGE_ERROR.READING_FILE);
      };

      reader.readAsText(fileObj);
    } catch (_errors) {
      message.error(MESSAGE_ERROR.READING_FILE);
    }
  };

  const handleSelectDatabaseHeader = (fileField: string, header: ImportDatabaseHeader) => {
    const newHeaderMatching = { ...headerMatching, [fileField]: header };

    /// check if header is already selected then remove previous selection
    const groupByHeader = keepLastObjectOccurrence(newHeaderMatching);

    store.dispatch(setHeaderMatching(groupByHeader));
  };

  const handleDeleteHeader = (fileField: string) => () => {
    const newHeaderMatching = { ...headerMatching };
    delete newHeaderMatching[fileField];

    const newHeaders = [...headers].filter((header) => header !== fileField);

    store.dispatch(setHeaders(newHeaders));
    store.dispatch(setHeaderMatching(newHeaderMatching));
  };

  const validateDataImport = (newData: any[]) => {
    const newError: Record<string, any[]> = {};
    const skus: string[] = [];
    const unitPrices: string[] = [];
    const unitTypes: string[] = [];
    const backOrders: string[] = [];
    const onOrders: string[] = [];
    const descriptions: string[] = [];

    newData.forEach((data) => {
      forEach(data, (value, key) => {
        if (key === ImportDatabaseHeader.PRODUCT_ID) {
          skus.push(value);
        }

        if (key === ImportDatabaseHeader.UNIT_PRICE) {
          const backOrder = Number(value);

          if (isNumber(backOrder)) {
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
          const backOrder = Number(value);

          if (isNumber(backOrder)) {
            backOrders.push(value);
          }
        }

        if (key === ImportDatabaseHeader.ON_ORDER) {
          const onOrder = Number(value);

          if (isNumber(onOrder)) {
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

    if (backOrders.length !== newData.length && backOrders.length !== 0) {
      newError[ImportDatabaseHeader.BACK_ORDER] = ['Back order is invalid.'];
    }

    if (onOrders.length !== newData.length && backOrders.length !== 0) {
      newError[ImportDatabaseHeader.ON_ORDER] = ['On order is invalid.'];
    }

    if (descriptions.length !== newData.length && backOrders.length !== 0) {
      newError[ImportDatabaseHeader.DESCRIPTION] = ['Description is invalid.'];
    }

    store.dispatch(setErrors(newError));

    return (
      skus.length === newData.length &&
      unitPrices.length === newData.length &&
      unitTypes.length === newData.length &&
      (backOrders.length === 0 || backOrders.length === newData.length) &&
      (onOrders.length === 0 || onOrders.length === newData.length) &&
      (descriptions.length === 0 || descriptions.length === newData.length)
    );
  };

  const handleChangeStep = (current: ImportStep) => {
    if (current === ImportStep.STEP_1) {
      store.dispatch(setStep(current));
      return;
    }

    if (!fileResult?.data.length) {
      message.error('Please upload CSV file.');
      return;
    }

    if (current !== ImportStep.STEP_2 && !headerMatching) {
      message.error('Please matching header.');
      return;
    }

    if (current === ImportStep.STEP_3 && fileResult?.data.length && headerMatching) {
      const dataMapping = fileResult.data.map((item) => {
        const newData: any = {};

        forEach(item, (value, key) => {
          if (!isNil(headerMatching[key])) {
            newData[headerMatching[key]] = value;
          }
        });

        return newData;
      });

      const isDataValue = validateDataImport(dataMapping);

      if (!isDataValue) {
        message.error('Data is invalid, please check again.');
        return;
      }

      store.dispatch(
        setDataImport(
          dataMapping.map((item) => {
            const newItem = { ...item };

            newItem.unit_price = Number(newItem.unit_price);
            newItem.back_order = Number(newItem.back_order);
            newItem.on_order = Number(newItem.on_order);
            newItem.in_stock = Number(newItem.in_stock);
            newItem.unit_type =
              unitTypeData.find(
                (el) =>
                  el.name.toLowerCase() === newItem.unit_type.toLowerCase() ||
                  el.code.toLowerCase() === newItem.unit_type.toLowerCase(),
              )?.id ?? '';

            return newItem;
          }),
        ),
      );
    }

    store.dispatch(setStep(current));
  };

  return {
    step,
    error,
    headers,
    fileResult,
    fileUploaded,
    headerMatching,

    ///
    handleChangeStep,
    handleChangeUpload,
    handleBeforeUpload,
    handleDeleteHeader,
    handleCustomRequest,
    handleSelectDatabaseHeader,
  };
};
