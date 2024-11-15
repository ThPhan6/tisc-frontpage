import { message } from 'antd';
import { RcFile } from 'antd/lib/upload';

import { setFileUploaded } from '../reducers';
import { ImportFileType } from '../types/import.type';
import store, { useAppSelector } from '@/reducers';

export const useImport = () => {
  const { step, data, errors, fileUploaded, headerMatching, importedCSVHeaders } = useAppSelector(
    (s) => s.import,
  );

  const handleUploadFile = (file: RcFile, _fileList: RcFile[]) => {
    if (file.type.toLowerCase() !== ImportFileType.CSV) {
      message.error('Only accept <file>.csv');
      return;
    }

    store.dispatch(setFileUploaded(file));
  };

  const handleSelectHeader = () => {};

  const handleDeleteHeader = () => {};

  const validateImport = () => {};

  const handleImport = () => {};

  return {
    step,
    data,
    errors,
    fileUploaded,
    headerMatching,
    importedCSVHeaders,

    ///
    handleUploadFile,
    handleSelectHeader,
    handleDeleteHeader,
    handleImport,
  };
};
