import { useEffect, useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { PATH } from '@/constants/path';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { history } from 'umi';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import {
  createConversionMiddleware,
  createOptionMiddleWare,
  createPresetMiddleware,
  getOneBasisOption,
  getOneConversionMiddleware,
  getOnePresetMiddleware,
  updateBasisOption,
  updateConversionMiddleware,
  updatePresetMiddleware,
} from '@/services';
import { merge } from 'lodash';

import {
  BasisOptionSubForm,
  ConversionSubValueProps,
  ConversionValueProp,
  PresetItemValueProp,
  PresetsValueProp,
  SubBasisOption,
  SubPresetValueProp,
} from '@/types';

import { ConversionItem } from './Conversion/components/ConversionItem';
import { OptionItem } from './Option/components/OptionItem';
import { PresetItem } from './Preset/components/PresetItem';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const conversionValueDefault: ConversionSubValueProps = {
  name_1: '',
  name_2: '',
  formula_1: '',
  formula_2: '',
  unit_1: '',
  unit_2: '',
};
const presetsValueDefault: PresetItemValueProp = {
  name: '',
  is_collapse: '',
  subs: [],
};
const optionValueDefault: BasisOptionSubForm = {
  name: '',
  is_have_image: false,
  subs: [],
};

export const useProductBasicEntryForm = (type: 'CONVERSIONS' | 'PRESETS' | 'OPTIONS') => {
  const isLoading = useBoolean();
  const idItem = useGetParamId();
  const isUpdate = idItem ? true : false;

  const submitButtonStatus = useBoolean(false);

  const [data, setData] = useState<{ name: string; subs: any[] }>({ name: '', subs: [] });

  const getEntryFormTitle = () => {
    if (type === 'CONVERSIONS') {
      return 'Conversion Group';
    }
    return type === 'PRESETS' ? 'Preset Group' : 'Option Group';
  };

  useEffect(() => {
    if (idItem) {
      isLoading.setValue(true);
      if (type === 'CONVERSIONS') {
        getOneConversionMiddleware(
          idItem,
          (dataRes: ConversionValueProp) => {
            if (dataRes) {
              setData(dataRes);
            }
            isLoading.setValue(false);
          },
          () => {
            isLoading.setValue(false);
          },
        );
      } else if (type === 'PRESETS') {
        getOnePresetMiddleware(
          idItem,
          (dataRes: PresetsValueProp) => {
            if (dataRes) {
              setData(dataRes);
            }
            isLoading.setValue(false);
          },
          () => {
            isLoading.setValue(false);
          },
        );
      } else {
        getOneBasisOption(idItem).then((res) => {
          if (res) {
            setData(res);
          }
        });
      }
    }
  }, []);

  const handleChangeGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, name: e.target.value });
  };

  const handleOnClickAddIcon = () => {
    let newSubs = {};
    if (type === 'CONVERSIONS') {
      newSubs = conversionValueDefault;
    } else if (type === 'PRESETS') {
      newSubs = presetsValueDefault;
    } else {
      newSubs = optionValueDefault;
    }
    setData({ ...data, subs: [...data.subs, newSubs] });
  };

  const handleOnChangeValue = (value: any, index: number) => {
    const newSubs = [...data['subs']];
    newSubs[index] = value;
    setData({ ...data, subs: newSubs });
  };

  const handleOnClickDelete = (index: number) => {
    const newSubs = [...data['subs']];
    newSubs.splice(index, 1);
    setData({ ...data, subs: newSubs });
  };

  const renderChildren = (item: any, index: number) => {
    if (type === 'CONVERSIONS') {
      return (
        <ConversionItem
          key={index}
          value={item}
          onChangeValue={(value) => {
            handleOnChangeValue(value, index);
          }}
          handleOnClickDelete={() => handleOnClickDelete(index)}
        />
      );
    }
    return type === 'PRESETS' ? (
      <PresetItem
        key={index}
        handleOnClickDelete={() => handleOnClickDelete(index)}
        onChangeValue={(value) => {
          handleOnChangeValue(value, index);
        }}
        value={item}
      />
    ) : (
      <OptionItem
        key={index}
        optionIndex={index}
        subOption={item}
        handleChangeSubItem={(changedSubs) => handleOnChangeValue(changedSubs, index)}
        handleDeleteSubOption={() => handleOnClickDelete(index)}
      />
    );
  };

  const handleCreate = (dataSubmit: any) => {
    isLoading.setValue(true);
    if (type === 'CONVERSIONS') {
      createConversionMiddleware(dataSubmit, (typeStatus: STATUS_RESPONSE, msg?: string) => {
        if (typeStatus === STATUS_RESPONSE.SUCCESS) {
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
    } else if (type === 'PRESETS') {
      createPresetMiddleware(dataSubmit, (typeStatus: STATUS_RESPONSE, msg?: string) => {
        if (typeStatus === STATUS_RESPONSE.SUCCESS) {
          message.success(MESSAGE_NOTIFICATION.CREATE_PRESET_SUCCESS);
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            pushTo(PATH.presets);
            submitButtonStatus.setValue(false);
          }, 1000);
        } else {
          message.error(msg);
        }
        isLoading.setValue(false);
      });
    } else {
      createOptionMiddleWare(dataSubmit).then((isSuccess) => {
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            pushTo(PATH.options);
          }, 1000);
        }
        isLoading.setValue(false);
      });
    }
  };

  const handleUpdate = (dataSubmit: any) => {
    isLoading.setValue(true);
    if (type === 'CONVERSIONS') {
      updateConversionMiddleware(
        idItem,
        dataSubmit,
        (typeStatus: STATUS_RESPONSE, msg?: string) => {
          if (typeStatus === STATUS_RESPONSE.SUCCESS) {
            message.success(MESSAGE_NOTIFICATION.UPDATE_CONVERSION_SUCCESS);
            submitButtonStatus.setValue(true);
            setTimeout(() => {
              submitButtonStatus.setValue(false);
            }, 2000);
          } else {
            message.error(msg);
          }
          isLoading.setValue(false);
        },
      );
    } else if (type === 'PRESETS') {
      updatePresetMiddleware(idItem, dataSubmit, (typeStatus: STATUS_RESPONSE, msg?: string) => {
        if (typeStatus === STATUS_RESPONSE.SUCCESS) {
          message.success(MESSAGE_NOTIFICATION.UPDATE_PRESET_SUCCESS);
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 2000);
        } else {
          message.error(msg);
        }
        isLoading.setValue(false);
      });
    } else {
      updateBasisOption(idItem, dataSubmit).then((isSuccess) => {
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 2000);
        }
        isLoading.setValue(false);
      });
    }
  };

  const handleSubmit = isUpdate ? handleUpdate : handleCreate;

  const onHandleSubmit = () => {
    let newSubs: any[] = [];
    if (type === 'CONVERSIONS') {
      newSubs = data.subs.map((sub) => {
        return {
          ...sub,
          name_1: sub.name_1.trim(),
          name_2: sub.name_2.trim(),
          unit_1: sub.unit_1.trim(),
          unit_2: sub.unit_2.trim(),
          formula_1: sub.formula_1.trim(),
          formula_2: sub.formula_2.trim(),
        };
      });
    } else if (type === 'PRESETS') {
      newSubs = data.subs.map((sub) => {
        return {
          ...sub,
          name: sub.name.trim(),
          subs: sub.subs?.map((subItem: SubPresetValueProp) => {
            return {
              ...subItem,
              value_1: subItem.value_1.trim(),
              value_2: subItem.value_2.trim(),
              unit_1: subItem.unit_1.trim(),
              unit_2: subItem.unit_2.trim(),
            };
          }),
        };
      });
    } else {
      newSubs = data.subs.map((subOption) => {
        const itemOptions: SubBasisOption[] = subOption.subs.map((optionItem: SubBasisOption) => {
          let requiredValue = {
            value_1: optionItem.value_1.trim(),
            value_2: optionItem.value_2.trim(),
            unit_1: optionItem.unit_1.trim(),
            unit_2: optionItem.unit_2.trim(),
          };
          /// if it has ID, include ID
          if (optionItem.id) {
            requiredValue = merge(requiredValue, { id: optionItem.id });
          }
          /// send image data if using image otherwise remove it
          if (subOption.is_have_image && optionItem.image) {
            const imageData = optionItem.isBase64
              ? optionItem.image.split(',')[1]
              : optionItem.image;
            requiredValue = merge(requiredValue, { image: imageData });
          }
          return requiredValue;
        });
        let newSubOption = {
          name: subOption.name.trim(),
          subs: itemOptions,
          is_have_image: subOption.is_have_image ? true : false,
        };
        if (subOption.id) {
          newSubOption = merge(newSubOption, { id: subOption.id });
        }
        return newSubOption;
      });
    }

    handleSubmit({
      ...data,
      name: data.name.trim(),
      subs: newSubs,
    });
  };
  const ProductBasicEntryForm = () => (
    <div>
      <TableHeader title={`${type}`} rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper
        handleSubmit={onHandleSubmit}
        handleCancel={history.goBack}
        submitButtonStatus={submitButtonStatus.value}>
        <FormNameInput
          placeholder="type group name"
          title={getEntryFormTitle()}
          onChangeInput={handleChangeGroupName}
          HandleOnClickAddIcon={handleOnClickAddIcon}
          inputValue={data.name}
        />
        {data.subs.map((item: any, index: number) => renderChildren(item, index))}
      </EntryFormWrapper>
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
  return { ProductBasicEntryForm };
};
