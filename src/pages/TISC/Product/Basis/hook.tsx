import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { getDefaultIDOfBasic } from './Option/components/constant';
import { PATH } from '@/constants/path';
import { message } from 'antd';
import { history, useLocation, useParams } from 'umi';

import { useAttributeLocation } from '../Attribute/hooks/location';
import {
  useBrandAttributeParam,
  useCheckBranchAttributeTab,
  useCheckBrandAttributePath,
} from '../BrandAttribute/hook';
import { useCheckPresetActiveTab } from './Preset/hook';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { checkNil, findDuplicateBy } from '@/helper/utils';
import {
  createAttribute,
  createConversionMiddleware,
  createOptionMiddleWare,
  createPresetMiddleware,
  deleteBasisOption,
  deleteConversionMiddleware,
  deletePresetMiddleware,
  getOneAttribute,
  getOneBasisOption,
  getOneConversionMiddleware,
  getOnePresetMiddleware,
  updateAttribute,
  updateBasisOption,
  updateConversionMiddleware,
  updatePresetMiddleware,
} from '@/services';
import { cloneDeep, flatMap, isNull, isUndefined, lowerCase, merge, uniqueId } from 'lodash';

import { BrandAttributeParamProps } from '../BrandAttribute/types';
import {
  AttributeForm,
  AttributeSubForm,
  BasisOptionForm,
  BasisOptionSubForm,
  BasisPresetType,
  ConversionSubValueProps,
  IUpdateAttributeRequest,
  MainBasisOptionSubForm,
  PresetItemValueProp,
  SubBasisOption,
  SubBasisPreset,
} from '@/types';

import { ConversionItem } from './Conversion/components/ConversionItem';
import { FormOptionNameInput } from './Option/components/FormOptionNameInput';
import { MainOptionItem } from './Option/components/OptionItem';
import { PresetHeader, PresetTabKey } from './Preset/components/PresetHeader';
import { DragEndResultProps } from '@/components/Drag';
import { EntryFormWrapper, contentId } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { BranchHeader } from '../BrandAttribute/BranchHeader';
import { replaceBrandAttributeBrandId } from '../BrandAttribute/util';
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
  subs: [],
  count: 0,
  id: '',
};
const optionValueDefault: BasisOptionSubForm = {
  id: '',
  main_id: '',
  name: '',
  count: 0,
  subs: [],
};

const attributeValueDefault: AttributeForm = {
  id: '',
  name: '',
  count: 0,
  subs: [],
};

const getAttributeValueDefault = (subs: AttributeForm[]) => {
  return {
    ...attributeValueDefault,
    count: subs.length,
    subs: subs,
  };
};

const sortPresetValues = (presetGroup: any) => {
  const newSubGroups = presetGroup.subs
    .map((subGroup) => {
      const newPresets = subGroup.subs
        .map((preset) => {
          const newPresetValues = preset.subs.sort((a, b) => {
            if (a.value_1 < b.value_1) return -1;
            if (a.value_1 > b.value_1) return 1;
            return 0;
          });
          return {
            ...preset,
            subs: newPresetValues,
          };
        })
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      return {
        ...subGroup,
        subs: newPresets,
      };
    })
    .sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  return {
    ...presetGroup,
    subs: newSubGroups,
  };
};

const removeOtherSubOptions = (data: BasisOptionForm, id: string) => {
  const sub = data.subs.find((el) => el.id === id || el.id === `new-${id}`);

  return {
    ...data,
    subs: sub ? [sub] : [],
  };
};

export enum ProductBasisFormType {
  conversions = 'conversions',
  presets = 'presets',
  options = 'options',
  attributes = 'attributes',
}

const getEntryFormTitle = (type: ProductBasisFormType) => {
  if (type === ProductBasisFormType.conversions) {
    return 'Conversion Group';
  }

  if (type === ProductBasisFormType.attributes) {
    return 'Attributes Configuration';
  }

  return type === ProductBasisFormType.presets ? 'Group Name' : 'Components Configuration';
};

const getSubItemValue = (valueItem: SubBasisPreset | SubBasisOption) => ({
  value_1: valueItem.value_1.trim(),
  value_2: valueItem.value_2.trim(),
  unit_1: valueItem.unit_1.trim(),
  unit_2: valueItem.unit_2.trim(),
});

export type formOptionMode = 'list' | 'card';

export const FormOptionGroupHeaderContext = createContext<{
  hideTitleAddIcon?: boolean;
  hideTitleInput?: boolean;
  mode?: formOptionMode;
  setMode?: (mode: formOptionMode) => void;
}>({
  mode: 'list',
  setMode: (mode) => {
    console.log(mode);
    return null;
  },
});

export interface DynamicObjectProps {
  [key: string]: boolean;
}

export const FormGroupContext = createContext<{
  hideDelete?: boolean;
  hideDrag?: boolean;
  collapse: DynamicObjectProps;
  setCollapse: (props: DynamicObjectProps) => void;
}>({
  collapse: {},
  setCollapse: ({}) => null,
});

export const useCheckBasicOptionForm = () => {
  const location = useLocation();
  const param = useParams<BrandAttributeParamProps>();
  const isBasicOption =
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(PATH.options, param.brandId, param.brandName, param?.id),
    ) !== -1 ||
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(PATH.createOptions, param.brandId, param.brandName, param?.id),
    ) !== -1 ||
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(PATH.updateOptions, param.brandId, param.brandName, param?.id),
    ) !== -1;

  return isBasicOption;
};

export const useProductBasicEntryForm = (type: ProductBasisFormType, param?: any) => {
  const hasMainSubOption =
    type === ProductBasisFormType.options ||
    type === ProductBasisFormType.presets ||
    type === ProductBasisFormType.attributes;

  const hideTitleInput =
    type === ProductBasisFormType.options || type === ProductBasisFormType.attributes;

  const hideTitleAddIcon = type === ProductBasisFormType.attributes;

  const hideDelete = type === ProductBasisFormType.attributes;

  const hideDrag = type === ProductBasisFormType.attributes;

  const location = useLocation();

  const { selectedTab, activePath: presetActivePath } = useCheckPresetActiveTab();

  const { brandId, id: idBasis, groupId, groupName, subId } = useBrandAttributeParam();

  const { activePath } = useCheckBranchAttributeTab();
  const { attributeLocation } = useAttributeLocation();
  const { componentCreatePath } = useCheckBrandAttributePath();

  const isCreateComponent =
    decodeURIComponent(location.pathname) === decodeURIComponent(componentCreatePath) && !idBasis;

  const submitButtonStatus = useBoolean(false);

  /// to set action handle(create, copy) for list and card mode
  const [mode, setMode] = useState<formOptionMode>('list');

  /// to set collapse for main, sub option content
  const [collapse, setCollapse] = useState<DynamicObjectProps>({});

  const [componentData, setComponentData] = useState<BasisOptionForm>();
  const subComponentData = componentData?.subs ?? [];

  const [data, setData] = useState<{ name: string; count?: number; subs: any[] }>({
    name: '',
    subs: [],
  });

  const dataContainerRef = useRef(null);

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
      path: presetActivePath,
    },
    options: {
      getOneFunction: getOneBasisOption,
      createFunction: createOptionMiddleWare,
      updateFunction: updateBasisOption,
      newSubs: optionValueDefault,
      path: activePath,
    },
    attributes: {
      getOneFunction: getOneAttribute,
      createFunction: createAttribute,
      updateFunction: updateAttribute,
      newSubs: attributeValueDefault,
      path: activePath,
    },
  };

  const handleOnClickAddIcon = () => {
    let newSubs = FORM_CONFIG[type].newSubs;

    if (hasMainSubOption) {
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

  useEffect(() => {
    if (idBasis) {
      const getOneFunction = FORM_CONFIG[type].getOneFunction;
      getOneFunction(idBasis).then((res) => {
        if (res) {
          let newData: any = res;
          if (type === ProductBasisFormType.attributes) {
            newData = getAttributeValueDefault([res as AttributeForm]);
          }

          /// cut other subs
          if (type === ProductBasisFormType.options) {
            setComponentData(res as any);

            newData = removeOtherSubOptions(res as unknown as BasisOptionForm, subId as string);
          }

          if (type === ProductBasisFormType.presets) newData = sortPresetValues(newData);

          setData(newData);
        }
      });

      return;
    }

    /// auto create 1 main sub attribute
    if (type === ProductBasisFormType.attributes) {
      handleOnClickAddIcon();
      return;
    }

    if (isCreateComponent) {
      if (!groupId) {
        message.error('Group not found');
        return;
      }
      handleOnClickAddIcon();
      FORM_CONFIG[type].getOneFunction(groupId).then((res) => {
        setComponentData(res as any);
      });

      return;
    }
  }, [idBasis]);

  /// update data when select content type of attribute configuration
  useEffect(() => {
    if (!param) {
      return;
    }

    const contentTypeSelected: AttributeSubForm = param;
    const newData = {
      ...data,
      subs: [
        ...data.subs.map((sub) => ({
          ...sub,
          subs: sub.subs.map((s: any) => ({
            ...s,
            subs: s.subs.map((el: any) => {
              if (el.id === contentTypeSelected.id) {
                return contentTypeSelected;
              }

              return el;
            }),
          })),
        })),
      ],
    };

    setData(newData);
  }, [JSON.stringify(param)]);

  const handleChangeGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevState) => ({ ...prevState, name: e.target.value }));
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

    const defaultId = getDefaultIDOfBasic(value?.id);

    if (defaultId) {
      newSubs[index].id = `new-${defaultId}`;
    }
    newSubs[index] = value;
    setData((prevState) => ({ ...prevState, subs: newSubs }));
  };

  const onDragEnd = (result: any, provided: any) => {
    console.log(provided);
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

    if (type === ProductBasisFormType.options || type === ProductBasisFormType.presets) {
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
    if ((!idBasis && !isCreateComponent) || (isCreateComponent && !groupId)) {
      message.error('Cannot update, something went wrong');
      return;
    }

    const updateFunction = FORM_CONFIG[type].updateFunction;
    const updateFunctionExcute =
      type === ProductBasisFormType.options
        ? updateFunction(
            idBasis ? idBasis : (groupId as string),
            dataSubmit,
            idBasis ? 'update' : 'create',
          )
        : updateFunction(idBasis as string, dataSubmit);

    updateFunctionExcute.then((res: any) => {
      if (hasMainSubOption) {
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

          let newData = res;
          if (type === ProductBasisFormType.attributes) {
            newData = getAttributeValueDefault([res as AttributeForm]);
          }

          if (type === ProductBasisFormType.options) {
            if (isCreateComponent) {
              submitButtonStatus.setValue(true);
              setTimeout(() => {
                submitButtonStatus.setValue(false);
                pushTo(FORM_CONFIG[type].path);
              }, 1000);

              return;
            }

            const check = data.subs.find((el) => el.id === subId);
            if (!check) {
              pushTo(FORM_CONFIG[type].path);
            }

            newData = removeOtherSubOptions(newData, subId as string);
          }
          setData(newData);
        }
        if (type === ProductBasisFormType.presets) setData(sortPresetValues(data));
      }

      submitButtonStatus.setValue(true);
      setTimeout(() => {
        submitButtonStatus.setValue(false);
      }, 1000);
    });
  };

  const handleDeleteConversion = () => {
    if (!idBasis) {
      message.error('Conversion not found');
      return;
    }

    deleteConversionMiddleware(idBasis).then((isSuccess) => {
      if (isSuccess) {
        pushTo(PATH.conversions);
      }
    });
  };

  const handleDeleteBasisOption = () => {
    if (!idBasis) {
      message.error('Option not found');
      return;
    }

    deleteBasisOption(idBasis).then((isSuccess) => {
      if (isSuccess) {
        pushTo(PATH.options);
      }
    });
  };

  const handleDeletePreset = () => {
    if (!idBasis) {
      message.error('Preset not found');
      return;
    }

    deletePresetMiddleware(idBasis).then((isSuccess) => {
      if (isSuccess) {
        pushTo(presetActivePath);
      }
    });
  };

  const getDeleteFuntional = () => {
    if (!idBasis) return undefined;

    if (type === ProductBasisFormType.conversions) {
      return handleDeleteConversion();
    }

    return type === ProductBasisFormType.presets ? handleDeletePreset() : handleDeleteBasisOption();
  };

  const onHandleAttributeSubmit = () => {
    const sub = data.subs[0] as unknown as AttributeForm;

    if (!sub.name) {
      message.error('Main attribute name is uniqued and required');
      return;
    }

    const inValidSubAttributeName = sub.subs.some((el) => !el.name);

    if (inValidSubAttributeName) {
      message.error('Sub attribute name is uniqued and required');
      return;
    }

    // const inValidAttribute =
    //   sub.subs.some((el) => !el.subs.length) ||
    //   sub.subs.some((el) => el.subs.some((s) => !s.name || !s.content_type));

    // if (inValidAttribute) {
    //   message.error('Attribute item is uniqued and required');
    //   return;
    // }

    const newSubs: IUpdateAttributeRequest = {
      name: sub.name.trim(),
      subs: sub.subs.map((el) => {
        const newEl = {
          id: el?.id,
          name: el.name,
          subs: el.subs.map((s) => {
            const newSub = {
              id: s.id,
              name: s.name.trim(),
              basis_id: s.basis_id,
              description: s.description,
              sub_group_id: el?.id,
            };

            if (newSub?.id?.indexOf('new') !== -1) {
              delete newSub.id;
            }

            return newSub;
          }),
        };

        if (newEl?.id?.indexOf('new') !== -1) {
          delete newEl.id;
        }

        return newEl;
      }) as any,
    };

    const duplicateSub = findDuplicateBy(
      newSubs.subs.map((el) => ({ ...el, name: el.name.toLowerCase() })),
      ['name'],
    );

    if (duplicateSub.length >= 1) {
      message.error('Sub attribute name is uniqued and required');
      return;
    }

    const duplicateAttributeItem = findDuplicateBy(
      flatMap(
        newSubs.subs.map((el) =>
          el.subs.map((s) => ({
            ...s,
            name: s.name.toLowerCase(),
          })),
        ),
      ),
      ['name', 'sub_group_id'],
    );
    if (duplicateAttributeItem.length >= 1) {
      message.error('Attribute item duplicated by its name and content type');
      return;
    }

    const handleSubmit = idBasis ? handleUpdate : handleCreate;

    handleSubmit(
      idBasis
        ? newSubs
        : {
            brand_id: brandId,
            type: attributeLocation.TYPE,
            ...newSubs,
          },
    );
  };

  const onHandleSubmit = () => {
    let hasAllConversionValues = true;
    let hasMainOptionName = true;
    let hasSubOptionName = true;
    let hasSubItemValue = true;
    let hasSubItemProductId = true;
    let hasSubOptions = true;
    let hasSubItems = true;

    if (!data.name && type !== ProductBasisFormType.options) {
      message.error('Group name is required');
      return;
    }

    if (hasMainSubOption && !data.subs.length) {
      message.error('Main Group is required');
      return;
    }

    const newSubs = cloneDeep(data).subs.map((sub) => {
      if (type === ProductBasisFormType.conversions) {
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

          /// check duplicate option name
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
          ///

          /// delete new option's id
          if (mainOptionItem?.id?.indexOf('new') !== -1) {
            delete (mainOptionItem as any).id;
          }

          /// delete new option's id
          if (mainOptionItem?.main_id?.indexOf('new') !== -1) {
            delete (mainOptionItem as any).main_id;
          }

          ///
          let newSubOptionItem = mainOptionItem.subs.map((subItem) => {
            if (checkNil(subItem.value_1)) {
              hasSubItemValue = false;
              return;
            }

            if (checkNil(subItem.product_id) && type === ProductBasisFormType.options) {
              hasSubItemProductId = false;
              return;
            }

            /// delete new option's id
            if (subItem?.id?.indexOf('new') !== -1) {
              delete (subItem as any).id;
            }

            let requiredValue = {
              ...subItem,
              ...getSubItemValue(subItem),
            };

            /// assigned product id for option
            if (type === ProductBasisFormType.options) {
              requiredValue = { ...requiredValue, product_id: subItem.product_id };
            }

            /// if it has ID, include ID
            if (subItem.id) {
              requiredValue = merge(requiredValue, { id: subItem.id });
            }
            /// send image data if using image otherwise remove it
            if (type === ProductBasisFormType.options) {
              const imageData = subItem.isBase64 ? subItem.image?.split(',')[1] : subItem.image;
              requiredValue = merge(requiredValue, { image: imageData || null });
            }

            return requiredValue;
          });

          if (type === ProductBasisFormType.presets) {
            newSubOptionItem = newSubOptionItem.map((el) => ({
              id: el?.id,
              value_1: el?.value_1,
              value_2: el?.value_2,
              unit_1: el?.unit_1 ?? '',
              unit_2: el?.unit_2 ?? '',
            })) as any;
          }

          ///
          return {
            ...mainOptionItem,
            subs: newSubOptionItem.filter(Boolean),
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

    if (type === ProductBasisFormType.conversions) {
      if (!hasAllConversionValues) {
        message.error('All names, formulas and units are required');
        return;
      }
    }

    if (hasMainSubOption) {
      if (!hasMainOptionName) {
        message.error('Main Group name is uniqued and required');
        return;
      }

      if (!hasSubOptionName) {
        message.error('Sub Group name is uniqued and required');
        return;
      }

      if (!hasSubOptions) {
        message.error('Sub Group is required');
        return;
      }

      if (!hasSubItems) {
        message.error('Sub Group value is required');
        return;
      }

      if (!hasSubItemValue) {
        message.error('Value is required');
        return;
      }

      if (!hasSubItemProductId && type === ProductBasisFormType.options) {
        message.error('Product ID is required');
        return;
      }
    }

    const handleSubmit =
      idBasis || type === ProductBasisFormType.options ? handleUpdate : handleCreate;

    if (hasMainSubOption) {
      let result: any = {
        name: data.name.trim(),
        count: data.count,
        subs: newSubs,
      };

      if (type === ProductBasisFormType.presets) {
        result = {
          name: data.name.trim(),
          count: data.count,
          subs: newSubs,
          additional_type:
            selectedTab === PresetTabKey.generalPresets
              ? BasisPresetType.general
              : BasisPresetType.feature,
        };
      }

      if (type === ProductBasisFormType.options) {
        if (isCreateComponent) {
          const newResultSubs = subComponentData.concat(result.subs);
          const subDup = findDuplicateBy(newResultSubs, ['name']);

          if (subDup.length >= 1) {
            message.error('Group Name existed');
            return;
          }

          result = {
            ...result,
            brand_id: brandId,
            name: groupName,
            id: groupId,
            subs: newResultSubs,
          };
        } else {
          const resultSubIds = result.subs.map((el: any) => el?.id).filter(Boolean);

          const subIdx = subComponentData.findIndex((el) => resultSubIds.includes(el.id));

          const newCompSubs = [...subComponentData];
          newCompSubs.splice(subIdx, 1);
          const newResultSubs = newCompSubs.concat(result.subs);

          const subDup = findDuplicateBy(newResultSubs, ['name']);

          if (subDup.length >= 1) {
            message.error('Group Name existed');
            return;
          }

          result = {
            ...result,
            subs: newResultSubs,
          };
        }
      }

      handleSubmit(result);

      return;
    }

    handleSubmit({
      name: data.name.trim(),
      subs: newSubs,
    });
  };

  const onSubmitForm = () => {
    if (type === ProductBasisFormType.attributes) {
      onHandleAttributeSubmit();
      return;
    }

    onHandleSubmit();
  };

  const renderEntryFormItem = (item: any, index: number) => {
    if (type === ProductBasisFormType.conversions) {
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

    if (!item?.id) {
      return null;
    }

    return (
      <FormGroupContext.Provider
        value={{
          collapse,
          setCollapse,
          hideDelete,
          hideDrag,
        }}
      >
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
                containerId={contentId}
                type={type}
                dataContainerRef={dataContainerRef}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </FormGroupContext.Provider>
    );
  };

  const renderHeader = () => {
    if (type === ProductBasisFormType.presets) {
      return <PresetHeader />;
    }

    if (type === ProductBasisFormType.options || type === ProductBasisFormType.attributes) {
      return <BranchHeader />;
    }

    return <TableHeader title={`${type}`} rightAction={<CustomPlusButton disabled />} />;
  };

  const renderProductBasicEntryForm = useCallback(() => {
    return (
      <div>
        {renderHeader()}

        <EntryFormWrapper
          handleSubmit={onSubmitForm}
          handleCancel={history.goBack}
          handleDelete={getDeleteFuntional}
          submitButtonStatus={submitButtonStatus.value}
          entryFormTypeOnMobile={idBasis ? 'edit' : 'create'}
          lg={hasMainSubOption ? 24 : 12}
          span={24}
          contentClass={hasMainSubOption ? styles.mainOptionContent : ''}
          contentStyles={{
            height: hasMainSubOption
              ? 'calc(var(--vh) * 100 - 289px)'
              : 'calc(var(--vh) * 100 - 250px)',
          }}
        >
          <FormOptionGroupHeaderContext.Provider
            value={{
              mode,
              setMode,
              hideTitleInput,
              hideTitleAddIcon,
            }}
          >
            {hasMainSubOption ? (
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
            <div ref={dataContainerRef}>
              <DragDropContext onDragEnd={onDragEnd}>
                {data.subs.map(renderEntryFormItem)}
              </DragDropContext>
            </div>
          </FormOptionGroupHeaderContext.Provider>
        </EntryFormWrapper>
      </div>
    );
  }, [submitButtonStatus.value, data, mode, collapse]);

  return { renderProductBasicEntryForm };
};
