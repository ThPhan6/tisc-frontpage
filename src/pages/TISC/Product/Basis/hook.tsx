import { createContext, useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { DEFAULT_MAIN_OPTION_ID } from './Option/components/constant';
import { PATH } from '@/constants/path';
import { message } from 'antd';
import { history } from 'umi';

import { useCheckBrandAttributePath } from '../BrandAttribute/hook';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import { checkNil } from '@/helper/utils';
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
import { cloneDeep, isNull, isUndefined, lowerCase, merge, uniqueId } from 'lodash';

import {
  BasisOptionForm,
  BasisOptionSubForm,
  ConversionSubValueProps,
  MainBasisOptionSubForm,
  PresetItemValueProp,
  SubBasisOption,
  SubBasisPreset,
  SubPresetValueProp,
} from '@/types';

import { ConversionItem } from './Conversion/components/ConversionItem';
import { FormOptionNameInput } from './Option/components/FormOptionNameInput';
import { MainOptionItem } from './Option/components/OptionItem';
import { PresetItem } from './Preset/components/PresetItem';
import { DragEndResultProps } from '@/components/Drag';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { BranchHeader } from '../BrandAttribute/BranchHeader';
import styles from './index.less';
import { getNewDataAfterDragging } from './util';

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
  collapse: '',
  subs: [],
};
const optionValueDefault: BasisOptionSubForm = {
  id: '',
  main_id: '',
  name: '',
  count: 0,
  subs: [],
};

export enum ProductBasisFormType {
  conversions = 'conversions',
  presets = 'presets',
  options = 'options',
}

const getEntryFormTitle = (type: ProductBasisFormType) => {
  if (type === 'conversions') {
    return 'Conversion Group';
  }
  return type === 'presets' ? 'Preset Group' : 'Option Group';
};

const getSubItemValue = (valueItem: SubPresetValueProp | SubBasisOption) => ({
  value_1: valueItem.value_1.trim(),
  value_2: valueItem.value_2.trim(),
  unit_1: valueItem.unit_1.trim(),
  unit_2: valueItem.unit_2.trim(),
});

export type formOptionMode = 'list' | 'card';

export const FormOptionGroupHeaderContext = createContext<{
  mode: formOptionMode;
  setMode: (mode: formOptionMode) => void;
}>({
  mode: 'list',
  setMode: (_mode) => null,
});

interface DynamicObjectProps {
  [key: string]: boolean;
}

export const FormOptionGroupContext = createContext<{
  collapse: DynamicObjectProps;
  setCollapse: (props: DynamicObjectProps) => void;
}>({
  collapse: {},
  setCollapse: ({}) => null,
});

export const useProductBasicEntryForm = (type: ProductBasisFormType) => {
  const idBasis = useGetParamId();

  const { componentPath } = useCheckBrandAttributePath();

  const submitButtonStatus = useBoolean(false);

  /// to set action handle(create, copy) for list and card mode
  const [mode, setMode] = useState<formOptionMode>('list');

  /// to set collapse for main, sub option content
  const [collapse, setCollapse] = useState<DynamicObjectProps>({});

  const [data, setData] = useState<{ name: string; count?: number; subs: any[] }>({
    name: '',
    subs: [],
  });

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
      path: componentPath,
    },
  };

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
    let newSubs = FORM_CONFIG[type].newSubs;

    if (type === 'options') {
      const newId = uniqueId('new-');

      newSubs = {
        ...(FORM_CONFIG[type].newSubs as any),
        id: newId,
      };

      setData((prevState) => ({
        ...prevState,
        count: prevState.subs.length + 1,
        subs: [...data.subs, newSubs],
      }));

      return;
    }

    setData((prevState) => ({
      ...prevState,
      subs: [...data.subs, newSubs],
    }));
  };

  const handleOnClickCopy = (mainOptionItem: MainBasisOptionSubForm) => {
    const newId = uniqueId('new-');

    const newSub: MainBasisOptionSubForm = {
      ...mainOptionItem,
      id: `${newId}-${mainOptionItem.id}`,
      subs: mainOptionItem.subs.map((opt) => ({
        ...opt,
        id: `${newId}-${opt.id}`,
        subs: opt.subs.map((el) => ({ ...el, id: `${newId}-${el.id}` })),
      })),
    };

    setData((prevState) => ({
      ...prevState,
      count: prevState.subs.length + 1,
      subs: [...data.subs, newSub],
    }));
  };

  const handleOnChangeValue = (value: any, index: number) => {
    const newSubs = [...data['subs']];
    if (value?.id === DEFAULT_MAIN_OPTION_ID) {
      newSubs[index].id = `new-${DEFAULT_MAIN_OPTION_ID}`;
    }
    newSubs[index] = value;
    setData((prevState) => ({ ...prevState, subs: newSubs }));
  };

  const onDragEnd = (result: any, _provided: any) => {
    const { source, destination, draggableId } = result as DragEndResultProps;

    const sourceIndex = source?.index;
    const destinationIndex = destination?.index;

    if (
      isNull(draggableId) ||
      isUndefined(draggableId) ||
      isNull(sourceIndex) ||
      isUndefined(sourceIndex) ||
      sourceIndex < 0 ||
      isNull(destinationIndex) ||
      isUndefined(destinationIndex) ||
      destinationIndex < 0
    ) {
      message.error('Failed to drag!');
      return;
    }

    const newSubs = getNewDataAfterDragging({
      data: data.subs as BasisOptionForm[],
      result: result as DragEndResultProps,
    });

    if (!newSubs?.length) {
      return;
    }

    setData((prevState) => ({ ...prevState, subs: newSubs }));
  };

  const handleOnClickDelete = (index: number) => {
    const newSubs = [...data['subs']];
    newSubs.splice(index, 1);

    if (type === 'options') {
      setData((prevState) => ({ ...prevState, count: newSubs.length, subs: newSubs }));
      return;
    }

    setData((prevState) => ({ ...prevState, subs: newSubs }));
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
    updateFunction(idBasis, dataSubmit).then((res: any) => {
      if (type === 'options') {
        if (res?.id) {
          const oldDdata = cloneDeep(data);
          const newCollapse = cloneDeep(collapse);

          /* { [main-option name]: main-option id } */
          const collapseData: { [optionName: string]: string } = {};

          /* find options copied to create */
          oldDdata.subs.forEach((sub) => {
            /* only main option copied */
            if (newCollapse[sub.id] && sub.id.indexOf('new') !== -1) {
              collapseData[sub.name] = sub.id;
            }

            sub.subs?.forEach((item: any) => {
              /* only sub option copied */
              if (newCollapse[item.id] && item.id.indexOf('new') !== -1) {
                collapseData[item.name] = item.id;
              }
            });
          });

          /* replace new options copied with data update*/
          res.subs.forEach((sub: any) => {
            if (collapseData[sub.name]) {
              /* add main option id from data updated to collapse array */
              newCollapse[sub.id] = true;
              /* delete old id */
              delete newCollapse[collapseData[sub.name]];
            }

            sub.subs?.forEach((item: any) => {
              if (collapseData[item.name]) {
                /* add sub option id from data updated to collapse array */
                newCollapse[item.id] = true;
                /* delete old id */
                delete newCollapse[collapseData[item.name]];
              }
            });
          });

          setCollapse(newCollapse);
          setData(res);
        }
      }

      submitButtonStatus.setValue(true);
      setTimeout(() => {
        submitButtonStatus.setValue(false);
      }, 1000);
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

  const onHandleSubmit = () => {
    let hasAllConversionValues = true;

    let hasPresetSubGroupName = true;
    let hasPresetValues = true;

    let hasMainOptionName = true;
    let hasSubOptionName = true;
    let hasSubItemValue = true;
    let hasSubItemProductId = true;
    let hasSubOptions = true;
    let hasSubItems = true;

    if (!data.name) {
      message.error('Group name is required');
      return;
    }

    if (type === 'options' && !data.subs.length) {
      message.error('Main Option is required');
      return;
    }

    const newSubs = cloneDeep(data).subs.map((sub) => {
      if (type === 'conversions') {
        /* SubBasisConversion */

        /// all values are required
        if (
          checkNil(sub.formula_1) ||
          checkNil(sub.formula_2) ||
          checkNil(sub.unit_1) ||
          checkNil(sub.unit_2) ||
          checkNil(sub.name_1) ||
          checkNil(sub.name_2)
        ) {
          hasAllConversionValues = false;
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

      if (type === 'presets') {
        /* SubBasisPreset */

        if (checkNil(sub.name)) {
          hasPresetSubGroupName = false;
          return;
        }

        const isPresetValueMissing = sub.subs?.some((item: SubBasisPreset) =>
          checkNil(item.value_1),
        );

        /// all values are required
        if (isPresetValueMissing) {
          hasPresetValues = false;
          return;
        }

        const newSub = cloneDeep(sub);
        delete newSub.is_collapse;

        return {
          ...newSub,
          name: newSub.name.trim(),
          subs: newSub.subs?.map((subItem: SubPresetValueProp) => {
            return {
              ...subItem,
              ...getSubItemValue(subItem),
            };
          }),
        };
      }

      let duplicateMainOptionName = 0;
      data.subs.forEach((el) => {
        if (lowerCase(el.name) === lowerCase(sub.name)) {
          duplicateMainOptionName++;
        }
      });

      if (checkNil(sub.name) || duplicateMainOptionName > 1) {
        hasMainOptionName = false;
        return;
      }

      if (!sub.subs.length) {
        hasSubOptions = false;
        return;
      }

      if (sub?.id?.indexOf('new') !== -1) {
        delete sub.id;
      }

      const mainOptionItems: BasisOptionSubForm[] = sub.subs.map(
        (mainOptionItem: BasisOptionSubForm) => {
          if (!mainOptionItem.subs.length) {
            hasSubItems = false;
            return;
          }

          let duplicateSubOptionName = 0;
          sub.subs.forEach((el: BasisOptionSubForm) => {
            if (lowerCase(el.name) === lowerCase(mainOptionItem.name)) {
              duplicateSubOptionName++;
            }
          });

          if (checkNil(mainOptionItem.name) || duplicateSubOptionName > 1) {
            hasSubOptionName = false;
            return;
          }

          if (mainOptionItem?.id?.indexOf('new') !== -1) {
            delete (mainOptionItem as any).id;
          }

          if (mainOptionItem?.main_id?.indexOf('new') !== -1) {
            delete (mainOptionItem as any).main_id;
          }

          ///
          const newSubOptionItem = mainOptionItem.subs.map((subItem) => {
            if (checkNil(subItem.value_1)) {
              hasSubItemValue = false;
              return;
            }

            if (checkNil(subItem.product_id)) {
              hasSubItemProductId = false;
              return;
            }

            if (subItem?.id?.indexOf('new') !== -1) {
              delete (subItem as any).id;
            }

            let requiredValue = {
              ...subItem,
              ...getSubItemValue(subItem),
              product_id: subItem.product_id,
            };
            /// if it has ID, include ID
            if (subItem.id) {
              requiredValue = merge(requiredValue, { id: subItem.id });
            }
            /// send image data if using image otherwise remove it
            // if (subItem.image) {
            const imageData = subItem.isBase64 ? subItem.image?.split(',')[1] : subItem.image;
            requiredValue = merge(requiredValue, { image: imageData || null });
            // }

            return requiredValue;
          });

          ///
          return {
            ...mainOptionItem,
            subs: newSubOptionItem,
          };
        },
      );

      let newSubOption = {
        name: sub.name.trim(),
        count: sub.subs.length,
        subs: [...mainOptionItems],
        // is_have_image: sub.is_have_image,
      };

      if (sub.id) {
        newSubOption = merge(newSubOption, { id: sub.id });
      }

      return newSubOption;
    });

    if (type === 'conversions') {
      if (!hasAllConversionValues) {
        message.error('All names, formulas and units are required');
        return;
      }
    }

    if (type === 'presets') {
      if (!hasPresetSubGroupName) {
        message.error('Preset name is required');
        return;
      }

      if (!hasPresetValues) {
        message.error('Value is required');
        return;
      }
    }

    if (type === 'options') {
      if (!hasMainOptionName) {
        message.error('Main Option name is unique and required');
        return;
      }

      if (!hasSubOptionName) {
        message.error('Sub Option name is unique and required');
        return;
      }

      if (!hasSubOptions) {
        message.error('Sub Option is required');
        return;
      }

      if (!hasSubItems) {
        message.error('Sub Option value is required');
        return;
      }

      if (!hasSubItemValue) {
        message.error('Value is required');
        return;
      }

      if (!hasSubItemProductId) {
        message.error('Product ID is required');
        return;
      }
    }

    const handleSubmit = idBasis ? handleUpdate : handleCreate;

    if (type === 'options') {
      handleSubmit({
        name: data.name.trim(),
        count: data.count,
        subs: newSubs,
      });

      return;
    }

    handleSubmit({
      name: data.name.trim(),
      subs: newSubs,
    });
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
      <FormOptionGroupContext.Provider value={{ collapse, setCollapse }}>
        <Droppable droppableId={item.id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <MainOptionItem
                key={index}
                mainOptionIndex={index}
                mainOption={item}
                handleChangeMainSubItem={(changedSubs) => handleOnChangeValue(changedSubs, index)}
                handleCopyMainOption={handleOnClickCopy}
                handleDeleteMainSubOption={() => handleOnClickDelete(index)}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </FormOptionGroupContext.Provider>
    );
  };

  const renderHeader = () => {
    // if (type === ProductBasisFormType.presets) {
    //   return <PresetHeader />;
    // }

    if (type === ProductBasisFormType.options) {
      return <BranchHeader />;
    }

    return <TableHeader title={`${type}`} rightAction={<CustomPlusButton disabled />} />;
  };

  const renderProductBasicEntryForm = useCallback(() => {
    return (
      <div>
        {renderHeader()}

        <EntryFormWrapper
          handleSubmit={onHandleSubmit}
          handleCancel={history.goBack}
          handleDelete={getDeleteFuntional}
          submitButtonStatus={submitButtonStatus.value}
          entryFormTypeOnMobile={idBasis ? 'edit' : 'create'}
          lg={type === 'options' ? 24 : 12}
          span={24}
          contentClass={type === 'options' ? styles.mainOptionContent : ''}
          contentStyles={{
            height:
              type === ProductBasisFormType.presets || type === ProductBasisFormType.options
                ? 'calc(var(--vh) * 100 - 289px)'
                : 'calc(var(--vh) * 100 - 250px)',
          }}
        >
          <FormOptionGroupHeaderContext.Provider value={{ mode, setMode }}>
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

            {/* render main content entry form */}
            <DragDropContext onDragEnd={onDragEnd}>
              {data.subs.map(renderEntryFormItem)}
            </DragDropContext>
          </FormOptionGroupHeaderContext.Provider>
        </EntryFormWrapper>
      </div>
    );
  }, [submitButtonStatus.value, data, mode, collapse]);

  return { renderProductBasicEntryForm };
};
