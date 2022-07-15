import LoadingPageCustomize from '@/components/LoadingPage';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableHeader } from '@/components/Table/TableHeader';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { createQuotation } from '@/services';
import { useState } from 'react';
import { InspirationalQuotationEntryForm } from './components/InspirationalQuotationEntryForm';
import { IInspirationalQuotationForm } from '@/types';

const DEFAULT_INPUT = {
  author: '',
  identity: '',
  quotation: '',
};

const CreateInspirationalQuotationsPage = () => {
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const [input, setInput] = useState<IInspirationalQuotationForm>(DEFAULT_INPUT);

  console.log(input);

  const handleOnChangeInput = (newInput: IInspirationalQuotationForm) => {
    setInput(newInput);
  };

  const handleCancel = () => {
    pushTo(PATH.quotation);
  };

  const handleCreateData = (data: IInspirationalQuotationForm) => {
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
      <TableHeader title="Inspirational Quotations" rightAction={<CustomPlusButton disabled />} />
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
