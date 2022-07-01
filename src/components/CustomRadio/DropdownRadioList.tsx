import React, { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import { CustomRadio } from '@/components/CustomRadio';
import type { RadioValue } from '@/components/CustomRadio/types';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { isEmpty } from 'lodash';
import styles from './styles/dropdownList.less';

export interface IDropdownRadioItemList {
  [key: string]: any;
  margin?: 8 | 12;
  options: RadioValue[];
}

interface IDropdownRadioList {
  selected?: RadioValue;
  chosenItem?: RadioValue;
  data: IDropdownRadioItemList[];
  renderTitle?: (data: IDropdownRadioItemList) => string | number | React.ReactNode;
  onChange?: (value: RadioValue) => void;
}
type ActiveKeyType = string | number | (string | number)[];

const DropdownRadioList: React.FC<IDropdownRadioList> = (props) => {
  const { data, selected, onChange, renderTitle, chosenItem } = props;
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);

  useEffect(() => {
    data.forEach((item, index) => {
      const checked = item.options.find((option) => {
        return chosenItem && option.value === chosenItem.value;
      });
      if (checked) {
        setActiveKey([index]);
      }
    });
  }, [chosenItem]);

  const renderHeader = (item: IDropdownRadioItemList, index: number) => {
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
          <CustomRadio
            options={item.options}
            value={selected?.value}
            onChange={onChange}
            isRadioList
          />
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default DropdownRadioList;
