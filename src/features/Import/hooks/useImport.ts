import { MESSAGE_ERROR } from '@/constants/message';
import { message } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';

import { keepLastObjectOccurrence } from '@/helper/utils';
import { intersection } from 'lodash';

import {
  setErrors,
  setFileResult,
  setFileUploaded,
  setHeaderMatching,
  setHeaders,
  setStep,
  useDispatchDataImport,
} from '../reducers';
import { ImportDatabaseHeader, ImportFileType, ImportStep } from '../types/import.type';
import store, { useAppSelector } from '@/reducers';

import * as Papa from 'papaparse';
import type { RcFile, UploadRequestOption } from 'rc-upload/lib/interface';

const validateCSVFile = (file: RcFile) => {
  if (file.type !== ImportFileType.CSV) {
    message.error('Please upload CSV file.');
    return false;
  }

  return true;
};

export const useImport = () => {
  const { step, fileResult, error, fileUploaded, headerMatching, headers } = useAppSelector(
    (s) => s.import,
  );

  const { dispatchImportData } = useDispatchDataImport();

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
            store.dispatch(setStep(ImportStep.STEP_2));
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
    const newHeaderMatching = { ...headerMatching };

    const existedFileField = Object.keys(headerMatching ?? {}).find((key) => key === fileField);

    if (existedFileField) {
      delete newHeaderMatching[existedFileField];
    }

    newHeaderMatching[fileField] = header;

    /// check if header is already selected then remove previous selection
    const groupByHeader = keepLastObjectOccurrence(newHeaderMatching);

    store.dispatch(setHeaderMatching(groupByHeader));

    dispatchImportData(groupByHeader);
  };

  const handleDeleteHeader = (fileField: string) => () => {
    const newHeaderMatching = { ...headerMatching };
    delete newHeaderMatching[fileField];

    const newHeaders = [...headers].filter((header) => header !== fileField);

    store.dispatch(setHeaders(newHeaders));
    store.dispatch(setHeaderMatching(newHeaderMatching));
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

    store.dispatch(setStep(current));

    if (current === ImportStep.STEP_3 && fileResult?.data.length && headerMatching) {
      const allFieldRequired = intersection(
        [
          ImportDatabaseHeader.PRODUCT_ID,
          ImportDatabaseHeader.UNIT_PRICE,
          ImportDatabaseHeader.UNIT_TYPE,
        ],
        Object.values(headerMatching),
      );

      if (allFieldRequired.length !== 3) {
        message.error('Product ID, Unit Price, and Unit Type are required.');
        return;
      }

      dispatchImportData();
    }
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
