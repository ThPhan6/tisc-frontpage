import React, { useEffect, useState } from 'react';

import { Collapse } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { isEmpty } from 'lodash';

import type { CheckboxValue } from '@/components/CustomCheckbox/types';

import { CustomCheckbox } from '@/components/CustomCheckbox';

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
  } = props;
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
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
  }, [chosenItem]);
  const renderHeader = (item: DropdownCheckboxItem, index: number) => {
    if (renderTitle) {
      return (
        <span>
          {renderTitle(item)}
          {showCount ? (
            <span
              className={styles.dropdownCount}
              style={{
                marginLeft: item.margin ? item.margin : 8,
              }}>
              ({item.options.length})
            </span>
          ) : (
            ''
          )}
        </span>
      );
    }
    return index;
  };
  return (
    <Collapse
      bordered={false}
      expandIconPosition="right"
      expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
      className={styles.dropdownList}
      onChange={setActiveKey}
      activeKey={activeKey}>
      {data.map((item, index) => (
        <Collapse.Panel
          header={renderHeader(item, index)}
          key={index}
          collapsible={isEmpty(item.options) || noCollapse ? 'disabled' : undefined}
          className="site-collapse-custom-panel">
          <CustomCheckbox
            options={item.options}
            selected={
              selected
                ? selected.filter((selectedItem) =>
                    item.options.find((option) => option.value === selectedItem.value),
                  )
                : undefined
            }
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
              if (onChange) {
                onChange([...changedData, ...otherSelected]);
              }
            }}
            isCheckboxList
          />
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};
export default DropdownCheckboxList;
