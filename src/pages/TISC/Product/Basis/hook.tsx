import { createContext, useCallback, useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { message } from 'antd';
import { history } from 'umi';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import {
  createConversionMiddleware,
  createOptionMiddleWare,
  createPresetMiddleware,
  deleteBasisOption,
  deleteConversionMiddleware,
  deletePresetMiddleware,
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
  MainBasisOptionSubForm,
  PresetItemValueProp,
  SubBasisOption,
  SubPresetValueProp,
} from '@/types';

import { ConversionItem } from './Conversion/components/ConversionItem';
import { FormOptionNameInput } from './Option/components/FormOptionNameInput';
import { MainOptionItem } from './Option/components/OptionItem';
import { PresetItem } from './Preset/components/PresetItem';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

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

export type formOptionMode = 'list' | 'card';

export const FormOptionContext = createContext<{
  mode: formOptionMode;
  setMode: (mode: formOptionMode) => void;
}>({
  mode: 'list',
  setMode: (mode) => mode,
});

export const useProductBasicEntryForm = (type: ProductBasisFormType) => {
  const idBasis = useGetParamId();

  const submitButtonStatus = useBoolean(false);

  const [mode, setMode] = useState<formOptionMode>('list');

  const [data, setData] = useState<{ name: string; subs: any[] }>({ name: '', subs: [] });

  useEffect(() => {
    if (idBasis) {
      const getOneFunction = FORM_CONFIG[type].getOneFunction;
      getOneFunction(idBasis).then((res) => {
        if (res) {
          setData(res);
        }
      });
    }
  }, []);

  const handleChangeGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevState) => ({ ...prevState, name: e.target.value }));
  };

  const handleOnClickAddIcon = () => {
    const newSubs = FORM_CONFIG[type].newSubs;

    setData((prevState) => ({ ...prevState, subs: [...data.subs, newSubs] }));
  };
  const handleOnClickCopy = (mainOptionItem: MainBasisOptionSubForm) => {
    setData((prevState) => ({ ...prevState, subs: [...data.subs, mainOptionItem] }));
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
      <MainOptionItem
        key={index}
        mainOption={item}
        handleChangeMainSubItem={(changedSubs) => handleOnChangeValue(changedSubs, index)}
        handleCopyMainOption={handleOnClickCopy}
        handleDeleteMainSubOption={() => handleOnClickDelete(index)}
      />
    );
  };

  const handleCreate = (dataSubmit: any) => {
    const createFunction = FORM_CONFIG[type].createFunction;
    createFunction(dataSubmit).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(FORM_CONFIG[type].path);
        }, 1000);
      }
    });
  };

  const handleUpdate = (dataSubmit: any) => {
    const updateFunction = FORM_CONFIG[type].updateFunction;
    updateFunction(idBasis, dataSubmit).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 2000);
      }
    });
  };

  const onHandleSubmit = () => {
    const newSubs = data.subs.map((sub) => {
      if (type === 'conversions') {
        /// all values are required
        const isSubConversionValueMissing =
          sub.formula_1 === '' || sub.unit_1 === '' || sub.formula_2 === '' || sub.unit_2 === '';

        if (isSubConversionValueMissing) {
          return;
        }

        return {
          ...sub,
          name_1: sub.name_1.trim(),
          name_2: sub.name_2.trim(),
          unit_1: sub.unit_1.trim(),
          unit_2: sub.unit_2.trim(),
          formula_1: sub.formula_1,
          formula_2: sub.formula_2,
        };
      }

      /// unit must go with its value
      const isSubValueMissing = sub.subs?.some(
        (subItem: SubPresetValueProp | SubBasisOption) =>
          (subItem.value_1 === '' && subItem.unit_1 !== '') ||
          (subItem.value_2 === '' && subItem.unit_2 !== ''),
      );

      if (isSubValueMissing) {
        return;
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

      const mainOptionItems: BasisOptionSubForm[] = sub.subs.map(
        (mainOptionItem: BasisOptionSubForm) => {
          const newSubOptionItem = mainOptionItem.subs.map((subItem) => {
            let requiredValue = {
              ...getSubItemValue(subItem),
              product_id: subItem.product_id,
            };
            /// if it has ID, include ID
            if (subItem.id) {
              requiredValue = merge(requiredValue, { id: subItem.id });
            }
            /// send image data if using image otherwise remove it
            if (sub.is_have_image && subItem.image) {
              const imageData = subItem.isBase64 ? subItem.image.split(',')[1] : subItem.image;
              requiredValue = merge(requiredValue, { image: imageData });
            }
            return requiredValue;
          });

          return {
            ...mainOptionItem,
            subs: newSubOptionItem,
          };
        },
      );

      let newSubOption = {
        name: sub.name.trim(),
        subs: [...mainOptionItems],
        // is_have_image: sub.is_have_image,
      };
      if (sub.id) {
        newSubOption = merge(newSubOption, { id: sub.id });
      }
      return newSubOption;
    });

    const newSubDataInvalid = newSubs.some((newSub) => !newSub);

    if (newSubDataInvalid) {
      message.error(type === 'conversions' ? 'All values are required' : 'Value is required');
      return;
    }

    const handleSubmit = idBasis ? handleUpdate : handleCreate;

    handleSubmit({
      name: data.name.trim(),
      subs: newSubs,
    });
  };

  const handleDeleteConversion = () => {
    deleteConversionMiddleware(idBasis).then((isSuccess) => {
      if (isSuccess) {
        pushTo(PATH.conversions);
      }
    });
  };

  const handleDeleteBasisOption = () => {
    deleteBasisOption(idBasis).then((isSuccess) => {
      if (isSuccess) {
        pushTo(PATH.options);
      }
    });
  };

  const handleDeletePreset = () => {
    deletePresetMiddleware(idBasis).then((isSuccess) => {
      if (isSuccess) {
        pushTo(PATH.presets);
      }
    });
  };

  const getDeleteFuntional = () => {
    if (!idBasis) return undefined;

    if (type === 'conversions') {
      return handleDeleteConversion();
    }

    return type === 'presets' ? handleDeletePreset() : handleDeleteBasisOption();
  };

  const renderProductBasicEntryForm = useCallback(() => {
    return (
      <div>
        <TableHeader title={`${type}`} rightAction={<CustomPlusButton disabled />} />
        <EntryFormWrapper
          handleSubmit={onHandleSubmit}
          handleCancel={history.goBack}
          handleDelete={getDeleteFuntional}
          submitButtonStatus={submitButtonStatus.value}
          entryFormTypeOnMobile={idBasis ? 'edit' : 'create'}
          lg={type === 'options' ? 24 : 12}
          span={24}
        >
          <FormOptionContext.Provider value={{ mode, setMode }}>
            {type === 'options' ? (
              <FormOptionNameInput
                placeholder="type group name"
                title={getEntryFormTitle(type)}
                onChangeInput={handleChangeGroupName}
                handleOnClickAddIcon={handleOnClickAddIcon}
                inputValue={data.name}
              />
            ) : (
              <FormNameInput
                placeholder="type group name"
                title={getEntryFormTitle(type)}
                onChangeInput={handleChangeGroupName}
                handleOnClickAddIcon={handleOnClickAddIcon}
                inputValue={data.name}
              />
            )}
            {data.subs.map(renderEntryFormItem)}
          </FormOptionContext.Provider>
        </EntryFormWrapper>
      </div>
    );
  }, [submitButtonStatus.value, data.subs, data.name, mode, setMode]);

  return { renderProductBasicEntryForm };
};
