import React, { useEffect, useState } from 'react';

import { Collapse, Radio } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { isEmpty } from 'lodash';

import type { CheckboxValue } from '@/components/CustomCheckbox/types';

import { CustomCheckbox } from '@/components/CustomCheckbox';

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
  noCollapse?: boolean;
  combinable?: boolean;
  showCount?: boolean;
  customClass?: string;
  canActiveMultiKey?: boolean;
  isSelectAll?: boolean;
}
const DropdownCheckboxList: React.FC<DropdownCheckboxListProps> = (props) => {
  const {
    data,
    selected,
    onChange,
    renderTitle,
    chosenItem,
    combinable,
    noCollapse,
    showCount = true,
    customClass = '',
    canActiveMultiKey,
    isSelectAll,
  } = props;
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  const [activeIcon, setActiveIcon] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<number | undefined>(); // set by index

  const [curSelect, setCurSelect] = useState(selected);

  useEffect(() => {
    const currentSelect: CheckboxValue[] = [];
    let selectAllIndex;

    data.forEach((item, index) => {
      const optSelected: CheckboxValue[] = selected
        ?.filter((selectedItem) =>
          item.options.find((option) => option.value === selectedItem.value),
        )
        .filter(Boolean) as CheckboxValue[];

      if (
        optSelected?.length === item.options.length &&
        item.options.some((opt) => optSelected.map((el) => el.value).includes(opt.value))
      ) {
        selectAllIndex = index;
      }

      if (optSelected?.length) {
        optSelected.forEach((el) => {
          currentSelect.push(el);
        });
      }
    });

    setCurSelect(currentSelect);
    setSelectAll(selectAllIndex);
  }, [selected]);

  useEffect(() => {
    let activeKeys: number[] = [];
    data.forEach((item, index) => {
      const selectedOption = item.options.find((option) => {
        return chosenItem && chosenItem.find((checked) => option.value === checked.value);
      });

      if (selectedOption) {
        if (combinable) {
          activeKeys.push(index);
        } else {
          activeKeys = [index];
        }
      }
    });

    setActiveKey(activeKeys);

    setActiveIcon(activeKeys);
  }, [chosenItem]);

  const handleSelectAll =
    (item: DropdownCheckboxItem, index: number) => (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();

      /// set active collapse
      setActiveKey(index);

      /// set select all options
      setSelectAll(selectAll === index ? undefined : index);

      const { options } = item;

      /// set current option select
      setCurSelect(selectAll === index ? [] : options);

      ///
      onChange?.(selectAll === index ? [] : options);
    };

  const renderHeader = (item: DropdownCheckboxItem, index: number) => {
    if (renderTitle) {
      return (
        <div className="flex-start w-full">
          <div className="flex-start w-full">
            {renderTitle(item)}
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
            {isSelectAll ? (
              activeIcon.includes(index) ? (
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
                  selectAll === index ||
                  (selected?.length === item.options?.length && selectAll === index)
                }
                onClick={handleSelectAll(item, index)}
              >
                <MainTitle level={4} customClass="select-label">
                  Select all
                </MainTitle>
              </Radio>
            </div>
          ) : null}
        </div>
      );
    }
    return index;
  };

  return (
    <Collapse
      bordered={false}
      expandIconPosition="right"
      expandIcon={({ isActive }) =>
        isSelectAll ? undefined : isActive ? <DropupIcon /> : <DropdownIcon />
      }
      className={`${styles.dropdownList} ${
        isSelectAll ? styles.collapseSelectAll : ''
      } ${customClass}`}
      onChange={(keys) => {
        let newKeys = keys;
        if (!canActiveMultiKey) {
          newKeys = typeof keys === 'string' ? keys : [keys[keys.length - 1]];
        }
        setActiveKey(newKeys);

        setActiveIcon([Number(keys[keys.length - 1])]);
      }}
      activeKey={activeKey}
    >
      {data.map((item, index) => (
        <Collapse.Panel
          header={renderHeader(item, index)}
          key={index}
          collapsible={isEmpty(item.options) || noCollapse ? 'disabled' : undefined}
          className="site-collapse-custom-panel"
        >
          <CustomCheckbox
            options={item.options}
            selected={curSelect}
            isCheckboxList
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
          />
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};
export default DropdownCheckboxList;
