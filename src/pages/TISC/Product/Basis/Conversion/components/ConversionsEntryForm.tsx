import { useEffect, useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import {
  createConversionMiddleware,
  getOneConversionMiddleware,
  updateConversionMiddleware,
} from '@/services';

import { ConversionValueProp, conversionValueDefault } from '@/types';

import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { ConversionItem } from './ConversionItem';

const ConversionsEntryForm = () => {
  const [conversionValue, setConversionValue] = useState<ConversionValueProp>({
    name: '',
    subs: [],
  });
  const isLoading = useBoolean();
  const idConversion = useGetParamId();
  const isUpdate = idConversion ? true : false;

  const submitButtonStatus = useBoolean(false);

  useEffect(() => {
    if (idConversion) {
      isLoading.setValue(true);
      getOneConversionMiddleware(
        idConversion,
        (dataRes: ConversionValueProp) => {
          if (dataRes) {
            setConversionValue(dataRes);
          }
          isLoading.setValue(false);
        },
        () => {
          isLoading.setValue(false);
        },
      );
    }
  }, []);

  const handleOnChangeValue = (value: ConversionValueProp['subs'][0], index: number) => {
    const newSub = [...conversionValue.subs];
    newSub[index] = value;
    setConversionValue({
      ...conversionValue,
      subs: newSub,
    });
  };

  const handleOnClickDelete = (index: number) => {
    const newSub = [...conversionValue.subs];
    newSub.splice(index, 1);
    setConversionValue({
      ...conversionValue,
      subs: newSub,
    });
  };

  const handleCreateConversion = (data: ConversionValueProp) => {
    isLoading.setValue(true);
    createConversionMiddleware(data, (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.CREATE_CONVERSION_SUCCESS);
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.conversions);
          submitButtonStatus.setValue(false);
        }, 1000);
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  const handleUpdateConversion = (data: ConversionValueProp) => {
    isLoading.setValue(true);
    updateConversionMiddleware(idConversion, data, (type: STATUS_RESPONSE, msg?: string) => {
      if (type === STATUS_RESPONSE.SUCCESS) {
        message.success(MESSAGE_NOTIFICATION.UPDATE_CONVERSION_SUCCESS);
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 2000);
      } else {
        message.error(msg);
      }
      isLoading.setValue(false);
    });
  };

  const handleSubmit = isUpdate ? handleUpdateConversion : handleCreateConversion;

  const onHandleSubmit = () => {
    handleSubmit({
      ...conversionValue,
      name: conversionValue.name.trim(),
      subs: conversionValue.subs.map((sub) => {
        return {
          ...sub,
          name_1: sub.name_1.trim(),
          name_2: sub.name_2.trim(),
          unit_1: sub.unit_1.trim(),
          unit_2: sub.unit_2.trim(),
          formula_1: sub.formula_1.trim(),
          formula_2: sub.formula_2.trim(),
        };
      }),
    });
  };

  const handleCancel = () => {
    pushTo(PATH.conversions);
  };

  const handleOnChangeConversionGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConversionValue({
      ...conversionValue,
      name: e.target.value,
    });
  };

  const HandleOnClickAddIcon = () => {
    setConversionValue({
      ...conversionValue,
      subs: [...conversionValue.subs, conversionValueDefault],
    });
  };

  return (
    <div>
      <TableHeader title={'CONVERSIONS'} rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper
        handleSubmit={onHandleSubmit}
        handleCancel={handleCancel}
        submitButtonStatus={submitButtonStatus.value}>
        <FormNameInput
          placeholder="type group name"
          title="Conversion Group"
          onChangeInput={handleOnChangeConversionGroupName}
          HandleOnClickAddIcon={HandleOnClickAddIcon}
          inputValue={conversionValue.name}
        />
        <div>
          {conversionValue.subs.map((conversion, index) => (
            <ConversionItem
              key={index}
              value={conversion}
              onChangeValue={(value) => {
                handleOnChangeValue(value, index);
              }}
              handleOnClickDelete={() => handleOnClickDelete(index)}
            />
          ))}
        </div>
      </EntryFormWrapper>
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default ConversionsEntryForm;
