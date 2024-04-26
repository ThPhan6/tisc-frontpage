import React, { useEffect, useMemo, useState } from 'react';

import { Collapse, Radio, message } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { cloneDeep, isEmpty, isNull, isUndefined, uniq } from 'lodash';

import type { CheckboxValue } from '@/components/CustomCheckbox/types';

import { CustomCheckbox } from '@/components/CustomCheckbox';

import { CollapseLevel2Props } from '../Collapse/Expand';
import { MainTitle } from '../Typography';
import styles from './styles/dropdownList.less';

export interface DropdownCheckboxItem {
  [key: string]: any;
  margin?: 8 | 12;
  options: CheckboxValue[];
}
type ActiveKeyType = string | number | (string | number)[];
interface DropdownCheckboxListProps {
  selected?: CheckboxValue[];
  chosenItem?: CheckboxValue[];
  data: DropdownCheckboxItem[];
  renderTitle?: (data: DropdownCheckboxItem) => string | number | React.ReactNode;
  onChange?: (value: CheckboxValue[]) => void;
  onOneChange?: (e: any | { isSelectedAll: boolean; optionIds: string[] }) => void;
  noCollapse?: boolean;
  combinable?: boolean;
  showCount?: boolean;
  customClass?: string;
  canActiveMultiKey?: boolean;
  isSelectAll?: boolean;
  forceEnableCollapse?: boolean;
  showCollapseIcon?: boolean;
  additionalSelected?: string[];
  onChangeAdditionalSelected?: (value: string) => void;
  collapseLevel?: '1' | '2';
}
const DropdownCheckboxList: React.FC<DropdownCheckboxListProps> = (props) => {
  const {
    data,
    selected,
    onChange,
    onOneChange,
    renderTitle,
    chosenItem,
    combinable,
    noCollapse,
    showCount = true,
    customClass = '',
    canActiveMultiKey,
    forceEnableCollapse = true,
    isSelectAll,
    showCollapseIcon,
    additionalSelected,
    onChangeAdditionalSelected,
    collapseLevel = '1',
  } = props;
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  const [optionKey, setOptionKey] = useState<ActiveKeyType>([]);

  const [selectAll, setSelectAll] = useState<string[]>([]);

  const [curSelect, setCurSelect] = useState(selected);

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
    if (!forceEnableCollapse) {
      return;
    }

    let activeKeys: string[] = [];
    let optionKeys: string[] = [];

    if (collapseLevel === '1') {
      data.forEach((item, index) => {
        const selectedOption = item.options.find((option) => {
          return chosenItem && chosenItem.find((checked) => option.value === checked.value);
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
      data.forEach((item, index) => {
        item.subs.forEach((sub: any, subIdx: number) => {
          const selectedOption = sub.options.find((option: DropdownCheckboxItem) => {
            return chosenItem && chosenItem.find((checked) => option.value === checked.value);
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
  }, [chosenItem, forceEnableCollapse]);

  useEffect(() => {
    return () => {
      setActiveKey([]);
      setOptionKey([]);
    };
  }, []);

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

      /// find index to open collapse if has option selected
      if (collapseLevel === '2') {
        const optSelected: string[] = curSelect?.map((el) => String(el.value)) ?? [];
        data[index].subs.some((sub: any, subIdx: number) => {
          sub.options.some((opt: CheckboxValue) => {
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

  const renderHeader = (item: DropdownCheckboxItem, index: number) => {
    return (
      <div className="flex-start w-full">
        <div className="flex-start w-full">
          {renderTitle?.(item) ?? index}

          {showCount ? (
            <span
              className={styles.dropdownCount}
              style={{
                marginLeft: item.margin ? item.margin : 8,
              }}
            >
              ({item.options.length})
            </span>
          ) : (
            ''
          )}

          {showCollapseIcon ? (
            (
              typeof activeKey === 'string' || typeof activeKey === 'number'
                ? String(activeKey) === item?.id ?? String(index)
                : activeKey.includes(item?.id ?? String(index))
            ) ? (
              <div className="flex-start drop-up-icon">
                <DropupIcon />
              </div>
            ) : (
              <div className="flex-start drop-down-icon">
                <DropdownIcon />
              </div>
            )
          ) : null}
        </div>

        {isSelectAll ? (
          <div
            className={styles.selectAll}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Radio
              className="select-all-radio"
              checked={
                selectAll?.includes(item?.id) ||
                (selected?.length === item.options.length && selectAll?.includes(item?.id))
              }
              onClick={handleSelectAll(item, index)}
            >
              <MainTitle level={4} customClass="select-label">
                Select all
              </MainTitle>
            </Radio>
          </div>
        ) : null}
        {item.rightHeader}
      </div>
    );
  };

  const renderItemCheckbox = (item: DropdownCheckboxItem) => {
    return (
      <CustomCheckbox
        options={item.options}
        selected={curSelect}
        isCheckboxList
        onOneChange={onOneChange}
        onChange={(changedData) => {
          let otherSelected: CheckboxValue[] = [];

          if (combinable && selected) {
            otherSelected = selected.reduce((finalData, selectedItem) => {
              if (!item.options.find((option) => option.value === selectedItem.value)) {
                finalData.push(selectedItem);
              }
              return finalData;
            }, [] as CheckboxValue[]);
          }

          onChange?.([...changedData, ...otherSelected]);
        }}
        additionalSelected={additionalSelected}
        onChangeAdditionalSelected={onChangeAdditionalSelected}
      />
    );
  };

  if (collapseLevel === '1') {
    return (
      <Collapse
        bordered={false}
        expandIconPosition="right"
        expandIcon={({ isActive }) =>
          showCollapseIcon ? undefined : isActive ? <DropupIcon /> : <DropdownIcon />
        }
        className={`${styles.dropdownList} ${
          isSelectAll ? styles.collapseSelectAll : ''
        } ${customClass}`}
        onChange={handleCollapseMain}
        activeKey={activeKey}
      >
        {data.map((item, index) => (
          <Collapse.Panel
            header={renderHeader(item, index)}
            key={item?.id ?? index}
            collapsible={isEmpty(item.options) || noCollapse ? 'disabled' : undefined}
            className="site-collapse-custom-panel"
          >
            {renderItemCheckbox(item)}
          </Collapse.Panel>
        ))}
      </Collapse>
    );
  }

  return (
    <Collapse
      bordered={false}
      expandIconPosition="right"
      expandIcon={({ isActive }) =>
        showCollapseIcon ? undefined : isActive ? <DropupIcon /> : <DropdownIcon />
      }
      className={`${styles.dropdownList} ${styles.dropdownListV2} ${
        isSelectAll ? styles.collapseSelectAll : ''
      } ${customClass}`}
      onChange={handleCollapseMain}
      activeKey={activeKey}
    >
      {data.map((item, index) => (
        <Collapse.Panel
          header={renderHeader(item, index)}
          key={item?.id ?? index}
          collapsible={isEmpty(item.options) || noCollapse ? 'disabled' : undefined}
          className="site-collapse-custom-panel"
        >
          <Collapse
            {...CollapseLevel2Props}
            accordion
            activeKey={optionKey}
            onChange={handleCollapseOption}
            className={`${styles.dropdownListLevelTwo}`}
          >
            {item?.subs?.map((opt: DropdownCheckboxItem, optIndex: number) => (
              <Collapse.Panel
                // className="site-collapse-custom-panel"
                key={opt?.id ?? optIndex}
                collapsible={opt?.count === 0 || isEmpty(item.subs) ? 'disabled' : undefined}
                header={
                  <div className="flex-center">
                    <span className="text-uppercase">{opt.name}</span>
                    <span style={{ marginLeft: 8, fontWeight: 300 }}>({opt.count})</span>
                  </div>
                }
              >
                {renderItemCheckbox(opt)}
              </Collapse.Panel>
            ))}
          </Collapse>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default DropdownCheckboxList;
