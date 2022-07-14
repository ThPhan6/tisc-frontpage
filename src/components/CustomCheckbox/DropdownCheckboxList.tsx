import React, { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import type { CheckboxValue } from '@/components/CustomCheckbox/types';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { isEmpty } from 'lodash';
import styles from './styles/dropdownList.less';

export interface IDropdownCheckboxItemList {
  [key: string]: any;
  margin?: 8 | 12;
  options: CheckboxValue[];
}

interface IDropdownCheckboxList {
  selected?: CheckboxValue[];
  chosenItem?: CheckboxValue[];
  data: IDropdownCheckboxItemList[];
  renderTitle?: (data: IDropdownCheckboxItemList) => string | number | React.ReactNode;
  onChange?: (value: CheckboxValue[]) => void;
  noCollapse?: boolean;
}
type ActiveKeyType = string | number | (string | number)[];

const DropdownCheckboxList: React.FC<IDropdownCheckboxList> = (props) => {
  const { data, selected, onChange, renderTitle, chosenItem } = props;

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

  const renderHeader = (item: IDropdownCheckboxItemList, index: number) => {
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
            selected={selected}
            onChange={onChange}
            isCheckboxList
          />
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default DropdownCheckboxList;
