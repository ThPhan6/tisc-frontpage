import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { useParams } from 'umi';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getOneQuotation, updateQuotation } from '@/services';

import { Quotation } from '@/types';

import { InspirationalQuotationEntryForm } from './components/InspirationalQuotationEntryForm';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const DEFAULT_INPUT = {
  author: '',
  identity: '',
  quotation: '',
};

const UpdateInspirationalQuotationsPage = () => {
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const params = useParams<{ id: string }>();
  const idQuotation = params?.id || '';
  const [input, setInput] = useState<Quotation>(DEFAULT_INPUT);

  /// get data to update
  const getOneQuotationData = () => {
    getOneQuotation(idQuotation).then((data) => {
      if (data) {
        setInput(data);
      }
    });
  };

  useEffect(() => {
    /// firstly, load data
    getOneQuotationData();
  }, []);

  /// rewrite data
  const handleOnChangeInput = (newInput: Quotation) => {
    setInput(newInput);
  };

  const handleCancel = () => {
    pushTo(PATH.quotation);
  };

  const handleUpdateData = (data: Quotation) => {
    isLoading.setValue(true);

    updateQuotation(idQuotation, data).then((isSuccess) => {
      if (isSuccess) {
        /// change button icon
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
        onSubmit={handleUpdateData}
        submitButtonStatus={submitButtonStatus.value}
      />
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default UpdateInspirationalQuotationsPage;
