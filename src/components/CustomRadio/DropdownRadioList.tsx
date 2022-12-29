import React, { useEffect, useState } from 'react';

import { Collapse } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { isEmpty } from 'lodash';

import type { RadioValue } from '@/components/CustomRadio/types';

import { CustomRadio } from '@/components/CustomRadio';

import styles from './styles/dropdownList.less';

export interface DropdownRadioItem {
  [key: string]: any;
  margin?: 8 | 12;
  options: RadioValue[];
}

interface DropdownRadioListProps {
  selected?: RadioValue;
  chosenItem?: RadioValue;
  data: DropdownRadioItem[];
  renderTitle?: (data: DropdownRadioItem) => string | number | React.ReactNode;
  onChange?: (value: RadioValue) => void;
  noCollapse?: boolean;
  canActiveMultiKey?: boolean;
}
type ActiveKeyType = string | number | (string | number)[];

const DropdownRadioList: React.FC<DropdownRadioListProps> = (props) => {
  const { data, selected, onChange, renderTitle, chosenItem, canActiveMultiKey } = props;
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

  const renderHeader = (item: DropdownRadioItem, index: number) => {
    if (renderTitle) {
      return (
        <span>
          {renderTitle(item)}
          <span
            className={styles.dropdownCount}
            style={{
              marginLeft: item.margin ? item.margin : 8,
            }}>
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
      onChange={(keys) => {
        let newKeys = keys;
        if (!canActiveMultiKey) {
          newKeys = typeof keys === 'string' ? keys : [keys[keys.length - 1]];
        }
        setActiveKey(newKeys);
      }}
      activeKey={activeKey}>
      {data.map((item, index) => (
        <Collapse.Panel
          header={renderHeader(item, index)}
          key={index}
          collapsible={isEmpty(item.options) ? 'disabled' : undefined}
          className="site-collapse-custom-panel">
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
