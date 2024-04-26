import { useEffect, useState } from 'react';

import { message } from 'antd';

import { cloneDeep, isNull, isUndefined, uniq } from 'lodash';

import {
  CheckboxValue,
  DropdownCheckboxItem,
  DropdownCheckboxListProps,
} from './CustomCheckbox/types';
import { DropdownRadioListProps } from './CustomRadio/types';
import { ActiveKeyType, CollapseLevel } from '@/types';

interface CheckCollapsible {
  data: any;
  curSelect: CheckboxValue[] | undefined;
  canActiveMultiKey?: boolean;
  collapseLevel: CollapseLevel;
  type: 'checkbox' | 'radio';
}

const useCheckCollapsible = (params: CheckCollapsible) => {
  const { data, curSelect, collapseLevel, canActiveMultiKey, type } = params;

  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  const [optionKey, setOptionKey] = useState<ActiveKeyType>([]);

  const handleCollapseMain = (keys: string | string[]) => {
    if (!keys) {
      setActiveKey([]);
      setOptionKey([]);
      return;
    }

    let newKeys = keys;
    let optionIdx: number = -1;

    if (!canActiveMultiKey) {
      newKeys = typeof keys === 'string' ? keys : [keys[keys.length - 1]].filter(Boolean);

      const index = typeof newKeys === 'string' ? newKeys : newKeys[0];

      /// find index to open collapse if it has option selected
      if (collapseLevel === '2') {
        const optSelected: string[] = curSelect?.map?.((el: any) => String(el.value)) ?? [];
        data[index]?.subs?.some((sub: any, subIdx: number) => {
          sub.options.some((opt: any) => {
            if (optSelected.includes(String(opt.value))) {
              optionIdx = subIdx;
              return true;
            }

            return false;
          });
        });
      }
    }

    setActiveKey(newKeys);

    setOptionKey(optionIdx !== -1 ? [optionIdx] : []);
  };

  const handleCollapseOption = (keys: string | string[]) => {
    if (!keys) {
      setOptionKey([]);
      return;
    }

    let newKeys = keys;
    if (!canActiveMultiKey) {
      newKeys = typeof keys === 'string' ? keys : [keys[keys.length - 1]];
    }

    setOptionKey(newKeys);
  };

  return {
    activeKey,
    optionKey,
    setActiveKey,
    setOptionKey,
    handleCollapseMain,
    handleCollapseOption,
  };
};

export const useDropdropCheckboxList = (params: DropdownCheckboxListProps) => {
  const {
    data,
    selected,
    collapseLevel = '1',
    canActiveMultiKey,
    forceEnableCollapse = true,
    chosenItem,
    combinable,
    onChange,
    onOneChange,
  } = params;

  const [selectAll, setSelectAll] = useState<string[]>([]);

  const [curSelect, setCurSelect] = useState(selected);

  const {
    activeKey,
    optionKey,
    setActiveKey,
    setOptionKey,
    handleCollapseMain,
    handleCollapseOption,
  } = useCheckCollapsible({ data, curSelect, collapseLevel, canActiveMultiKey, type: 'checkbox' });

  const setActiveKeysToEnableCollapseOnCheckboxList = () => {
    let activeKeys: string[] = [];
    let optionKeys: string[] = [];

    if (collapseLevel === '1') {
      data.forEach((item: DropdownCheckboxItem, index: number) => {
        const selectedOption = item.options.find((option) => {
          return chosenItem?.find((checked) => option.value === checked.value);
        });
        if (selectedOption) {
          if (combinable) {
            activeKeys.push(String(item?.id ?? index));
          } else {
            activeKeys = [item?.id ?? String(index)];
          }
        }
      });
    }

    if (collapseLevel == '2') {
      data.forEach((item: any, index: number) => {
        item.subs.forEach((sub: any, subIdx: number) => {
          const selectedOption = sub.options.find((option: DropdownCheckboxItem) => {
            return chosenItem?.find((checked) => option.value === checked.value);
          });

          if (selectedOption) {
            if (combinable) {
              optionKeys.push(String(sub?.id ?? subIdx));
              activeKeys.push(String(item?.id ?? index));
            } else {
              optionKeys = [sub?.id ?? String(subIdx)];
              activeKeys = [item?.id ?? String(index)];
            }
          }
        });
      });
    }

    setActiveKey(activeKeys);
    setOptionKey(optionKeys);
  };

  useEffect(() => {
    if (!forceEnableCollapse) {
      return;
    }

    setActiveKeysToEnableCollapseOnCheckboxList();
  }, [chosenItem, forceEnableCollapse]);

  useEffect(() => {
    const currentSelect: CheckboxValue[] = [];
    const selectAllIds: string[] = [];

    data.forEach((item) => {
      const optSelected: CheckboxValue[] = selected
        ?.filter((selectedItem) =>
          item.options.find((option) => option.value === selectedItem.value),
        )
        .filter(Boolean) as CheckboxValue[];

      if (optSelected?.length) {
        optSelected.forEach((el) => {
          currentSelect.push(el);
        });
      }

      if (
        item?.id &&
        optSelected?.length === item.options.length &&
        item.options.some((opt) => optSelected.map((el) => el.value).includes(opt.value))
      ) {
        selectAllIds.push(item.id);
      } else if (item?.id) {
        selectAllIds.filter((id) => id !== item.id);
      }
    });

    setCurSelect(currentSelect);
    setSelectAll(selectAllIds);
  }, [selected]);

  useEffect(() => {
    return () => {
      setActiveKey([]);
      setOptionKey([]);
    };
  }, []);

  const handleSelectAll =
    (item: DropdownCheckboxItem, index: number) => (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();

      if (isNull(item.id) || isUndefined(item.id)) {
        message.error('ID required');
        return;
      }

      const isSelectedAll = !selectAll?.some((id) => item.id === id);

      const activeKeyClone = cloneDeep(activeKey);

      if (canActiveMultiKey) {
        setActiveKey(uniq([...(activeKeyClone as string[]), item?.id ?? String(index)]));
      } else {
        setActiveKey([item?.id ?? String(index)]);
      }

      const { options } = item;

      if (combinable && selected) {
        let otherSelected: CheckboxValue[] = [];

        otherSelected = selected.reduce((finalData, selectedItem) => {
          if (!options.find((option) => option.value === selectedItem.value)) {
            finalData.push(selectedItem);
          }
          return finalData;
        }, [] as CheckboxValue[]);

        const newData = [...options, ...otherSelected];

        const result = isSelectedAll ? [...otherSelected] : newData;

        ///
        setCurSelect(result);

        ///
        onChange?.(result);

        ///
        onOneChange?.({ isSelectedAll, options: options });

        const selectAllIdClone = cloneDeep(selectAll);

        const newIds = isSelectedAll
          ? selectAllIdClone.filter((id) => id !== item.id)
          : selectAllIdClone.concat(item.id);

        setSelectAll(newIds);
      } else {
        const result = isSelectedAll ? options : [];

        setCurSelect(result);

        ///
        onChange?.(result);

        ///
        setSelectAll(item.id);
      }
    };

  return {
    selectAll,
    curSelect,
    activeKey,
    optionKey,
    setActiveKey,
    setOptionKey,
    handleCollapseMain,
    handleCollapseOption,
    setActiveKeysToEnableCollapseOnCheckboxList,
    handleSelectAll,
  };
};

export const useDropdropRadioList = (params: DropdownRadioListProps) => {
  const {
    data,
    selected,
    collapseLevel = '1',
    canActiveMultiKey,
    forceEnableCollapse = true,
    chosenItem,
  } = params;

  const {
    activeKey,
    optionKey,
    setActiveKey,
    setOptionKey,
    handleCollapseMain,
    handleCollapseOption,
  } = useCheckCollapsible({
    data,
    curSelect: selected ? ([selected] as CheckboxValue[]) : undefined,
    collapseLevel,
    canActiveMultiKey,
    type: 'radio',
  });

  useEffect(() => {
    if (!forceEnableCollapse) {
      return;
    }

    data?.forEach((item, index) => {
      const checked = item.options.find((option) => {
        return chosenItem && option.value === chosenItem.value;
      });
      if (checked) {
        setActiveKey([index]);
      }
    });
  }, [chosenItem, forceEnableCollapse]);

  useEffect(() => {
    return () => {
      setActiveKey([]);
      setOptionKey([]);
    };
  }, []);

  return {
    activeKey,
    optionKey,
    setActiveKey,
    setOptionKey,
    handleCollapseMain,
    handleCollapseOption,
  };
};
