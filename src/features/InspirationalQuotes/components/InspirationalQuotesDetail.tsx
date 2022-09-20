import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import { hidePageLoading, showPageLoading } from '@/helper/utils';
import { createQuotation, getOneQuotation, updateQuotation } from '@/services';

import { Quotation } from '@/types';

import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { InspirationalQuotationEntryForm } from './InspirationalQuotesEntryForm';

const DEFAULT_INPUT: Quotation = {
  author: '',
  identity: '',
  quotation: '',
};

const UpdateQuotationPage = () => {
  const submitButtonStatus = useBoolean(false);
  const idQuotation = useGetParamId();
  const isUpdate = idQuotation ? true : false;
  const [input, setInput] = useState<Quotation>(DEFAULT_INPUT);

  /// get data to update
  const getOneQuotationData = () => {
    getOneQuotation(idQuotation).then((data) => {
      if (data) {
        setInput(data);
      }
    });
  };

  /// for update data
  useEffect(() => {
    if (isUpdate) {
      getOneQuotationData();
    }
  }, []);

  /// rewrite data
  const handleOnChangeInput = (newInput: Quotation) => {
    setInput(newInput);
  };

  const handleCancel = () => {
    pushTo(PATH.quotation);
  };

  const onSubmit = (data: Quotation) => {
    showPageLoading();

    if (isUpdate) {
      updateQuotation(idQuotation, data).then((isSuccess) => {
        hidePageLoading();
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 1000);
        }
      });
    } else {
      createQuotation(data).then((isSuccess) => {
        hidePageLoading();
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            handleCancel();
          }, 1000);
        }
      });
    }
  };

  return (
    <div>
      <TableHeader title="Inspirational Quotes" rightAction={<CustomPlusButton disabled />} />
      <InspirationalQuotationEntryForm
        value={input}
        onChange={handleOnChangeInput}
        onCancel={handleCancel}
        onSubmit={onSubmit}
        submitButtonStatus={submitButtonStatus.value}
      />
    </div>
  );
};

export default UpdateQuotationPage;
