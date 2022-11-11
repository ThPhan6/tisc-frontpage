import { useCallback, useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
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
  PresetItemValueProp,
  SubBasisOption,
  SubPresetValueProp,
} from '@/types';

import { ConversionItem } from './Conversion/components/ConversionItem';
import { OptionItem } from './Option/components/OptionItem';
import { PresetItem } from './Preset/components/PresetItem';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

const conversionValueDefault: ConversionSubValueProps = {
  name_1: '',
  name_2: '',
  formula_1: 0,
  formula_2: 0,
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

type ProductBasisFormType = 'conversions' | 'presets' | 'options';

const getEntryFormTitle = (type: ProductBasisFormType) => {
  if (type === 'conversions') {
    return 'Conversion Group';
  }
  return type === 'presets' ? 'Preset Group' : 'Option Group';
};

const FORM_CONFIG = {
  conversions: {
    getOneFunction: getOneConversionMiddleware,
    createFunction: createConversionMiddleware,
    updateFunction: updateConversionMiddleware,
    newSubs: conversionValueDefault,
    path: PATH.conversions,
  },
  presets: {
    getOneFunction: getOnePresetMiddleware,
    createFunction: createPresetMiddleware,
    updateFunction: updatePresetMiddleware,
    newSubs: presetsValueDefault,
    path: PATH.presets,
  },
  options: {
    getOneFunction: getOneBasisOption,
    createFunction: createOptionMiddleWare,
    updateFunction: updateBasisOption,
    newSubs: optionValueDefault,
    path: PATH.options,
  },
};

const getSubItemValue = (valueItem: SubPresetValueProp | SubBasisOption) => ({
  value_1: valueItem.value_1.trim(),
  value_2: valueItem.value_2.trim(),
  unit_1: valueItem.unit_1.trim(),
  unit_2: valueItem.unit_2.trim(),
});

export const useProductBasicEntryForm = (type: ProductBasisFormType) => {
  const idItem = useGetParamId();

  const submitButtonStatus = useBoolean(false);

  const [data, setData] = useState<{ name: string; subs: any[] }>({ name: '', subs: [] });

  useEffect(() => {
    if (idItem) {
      showPageLoading();
      const getOneFunction = FORM_CONFIG[type].getOneFunction;
      getOneFunction(idItem).then((res) => {
        if (res) {
          setData(res);
        }
      });
      hidePageLoading();
    }
  }, []);

  const handleChangeGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevState) => ({ ...prevState, name: e.target.value }));
  };

  const handleOnClickAddIcon = () => {
    const newSubs = FORM_CONFIG[type].newSubs;
    setData((prevState) => ({ ...prevState, subs: [...data.subs, newSubs] }));
  };

  const handleOnChangeValue = (value: any, index: number) => {
    const newSubs = [...data['subs']];
    newSubs[index] = value;
    setData((prevState) => ({ ...prevState, subs: newSubs }));
  };

  const handleOnClickDelete = (index: number) => {
    const newSubs = [...data['subs']];
    newSubs.splice(index, 1);
    setData((prevState) => ({ ...prevState, subs: newSubs }));
  };

  const renderEntryFormItem = (item: any, index: number) => {
    if (type === 'conversions') {
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
    if (type === 'presets') {
      return (
        <PresetItem
          key={index}
          handleOnClickDelete={() => handleOnClickDelete(index)}
          onChangeValue={(value) => {
            handleOnChangeValue(value, index);
          }}
          value={item}
        />
      );
    }
    return (
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
    showPageLoading();
    const createFunction = FORM_CONFIG[type].createFunction;
    createFunction(dataSubmit).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(FORM_CONFIG[type].path);
        }, 1000);
      }
      hidePageLoading();
    });
  };

  const handleUpdate = (dataSubmit: any) => {
    showPageLoading();
    const updateFunction = FORM_CONFIG[type].updateFunction;
    updateFunction(idItem, dataSubmit).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 2000);
      }
      hidePageLoading();
    });
  };

  const onHandleSubmit = () => {
    const newSubs = data.subs.map((sub) => {
      if (type === 'conversions') {
        return {
          ...sub,
          name_1: sub.name_1.trim(),
          name_2: sub.name_2.trim(),
          unit_1: sub.unit_1.trim(),
          unit_2: sub.unit_2.trim(),
          formula_1: sub.formula_1.trim(),
          formula_2: sub.formula_2.trim(),
        };
      }
      if (type === 'presets') {
        return {
          ...sub,
          name: sub.name.trim(),
          subs: sub.subs?.map((subItem: SubPresetValueProp) => {
            return {
              ...subItem,
              ...getSubItemValue(subItem),
            };
          }),
        };
      }

      const itemOptions: SubBasisOption[] = sub.subs.map((optionItem: SubBasisOption) => {
        let requiredValue = {
          ...getSubItemValue(optionItem),
        };
        /// if it has ID, include ID
        if (optionItem.id) {
          requiredValue = merge(requiredValue, { id: optionItem.id });
        }
        /// send image data if using image otherwise remove it
        if (sub.is_have_image && optionItem.image) {
          const imageData = optionItem.isBase64 ? optionItem.image.split(',')[1] : optionItem.image;
          requiredValue = merge(requiredValue, { image: imageData });
        }
        return requiredValue;
      });
      let newSubOption = {
        name: sub.name.trim(),
        subs: itemOptions,
        is_have_image: sub.is_have_image ? true : false,
      };
      if (sub.id) {
        newSubOption = merge(newSubOption, { id: sub.id });
      }
      return newSubOption;
    });

    const handleSubmit = idItem ? handleUpdate : handleCreate;

    handleSubmit({
      name: data.name.trim(),
      subs: newSubs,
    });
  };

  const renderProductBasicEntryForm = useCallback(() => {
    return (
      <div>
        <TableHeader title={`${type}`} rightAction={<CustomPlusButton disabled />} />
        <EntryFormWrapper
          handleSubmit={onHandleSubmit}
          handleCancel={history.goBack}
          submitButtonStatus={submitButtonStatus.value}>
          <FormNameInput
            placeholder="type group name"
            title={getEntryFormTitle(type)}
            onChangeInput={handleChangeGroupName}
            HandleOnClickAddIcon={handleOnClickAddIcon}
            inputValue={data.name}
          />
          {data.subs.map(renderEntryFormItem)}
        </EntryFormWrapper>
      </div>
    );
  }, [submitButtonStatus.value, data.subs, data.name]);

  return { renderProductBasicEntryForm };
};
