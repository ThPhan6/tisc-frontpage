import React, { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import type { CheckboxValue } from '@/components/CustomCheckbox/types';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { isEmpty } from 'lodash';
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
}

const DropdownCheckboxList: React.FC<DropdownCheckboxListProps> = (props) => {
  const { data, selected, onChange, renderTitle, chosenItem, combinable } = props;

  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  useEffect(() => {
    data.forEach((item, index) => {
      const selectedOption = item.options.find((option) => {
        return chosenItem && chosenItem.find((checked) => option.value === checked.value);
      });
      if (selectedOption) {
        setActiveKey([index]);
      }
    });
  }, [chosenItem]);

  const renderHeader = (item: DropdownCheckboxItem, index: number) => {
    if (renderTitle) {
      return (
        <span>
          {renderTitle(item)}
          <span
            className={styles.dropdownCount}
            style={{
              marginLeft: item.margin ? item.margin : 8,
            }}
          >
            ({item.options.length})
          </span>
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
      activeKey={activeKey}
    >
      {data.map((item, index) => (
        <Collapse.Panel
          header={renderHeader(item, index)}
          key={index}
          collapsible={isEmpty(item.options) ? 'disabled' : undefined}
          className="site-collapse-custom-panel"
        >
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
                  if (item.options.find((option) => option.value !== selectedItem.value)) {
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
