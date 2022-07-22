import LoadingPageCustomize from '@/components/LoadingPage';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableHeader } from '@/components/Table/TableHeader';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { createQuotation } from '@/services';
import { useState } from 'react';
import { InspirationalQuotationEntryForm } from './components/InspirationalQuotationEntryForm';
import { Quotation } from '@/types';

const DEFAULT_INPUT = {
  author: '',
  identity: '',
  quotation: '',
};

const CreateInspirationalQuotationsPage = () => {
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const [input, setInput] = useState<Quotation>(DEFAULT_INPUT);

  const handleOnChangeInput = (newInput: Quotation) => {
    setInput(newInput);
  };

  const handleCancel = () => {
    pushTo(PATH.quotation);
  };

  const handleCreateData = (data: Quotation) => {
    isLoading.setValue(true);

    createQuotation(data).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.quotation);
        }, 1000);
      }
      isLoading.setValue(false);
    });
  };

  return (
    <div>
      <TableHeader title="Inspirational Quotes" rightAction={<CustomPlusButton disabled />} />
      <InspirationalQuotationEntryForm
        value={input}
        onChange={handleOnChangeInput}
        onCancel={handleCancel}
        onSubmit={handleCreateData}
        submitButtonStatus={submitButtonStatus.value}
      />
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default CreateInspirationalQuotationsPage;
