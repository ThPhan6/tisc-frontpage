import { useAppSelector } from '@/reducers';

export const useImport = () => {
  const { step, data, errors, fileUploaded, headerMatching, importedCSVHeaders } = useAppSelector(
    (s) => s.import,
  );

  const handleForwardStep = () => {};

  const handleBackwardStep = () => {};

  const handleUploadFile = () => {};

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
    handleForwardStep,
    handleBackwardStep,
    handleUploadFile,
    handleSelectHeader,
    handleDeleteHeader,
    handleImport,
  };
};
