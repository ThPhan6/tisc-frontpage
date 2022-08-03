import React, { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import type { CheckboxValue } from '@/components/CustomCheckbox/types';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { isEmpty, upperCase, capitalize } from 'lodash';
import { getAllProductCategory } from '@/services';
import { useAppSelector } from '@/reducers';
import { CategoryListResponse } from '@/types';
import styles from './CategoryDropdown.less';

interface DropdownCategoryListProps {
  selected?: CheckboxValue[];
  chosenItem?: CheckboxValue[];
  onChange?: (value: CheckboxValue[]) => void;
}
type ActiveKeyType = string | number | (string | number)[];

export const DropdownCategoryList: React.FC<DropdownCategoryListProps> = (props) => {
  const { selected, onChange, chosenItem } = props;
  const category = useAppSelector((state) => state.category);
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  const [secondActiveKey, setSecondActiveKey] = useState<ActiveKeyType>([]);

  useEffect(() => {
    category.list.forEach((item, index) => {
      item.subs.forEach((sub, subIndex) => {
        const selectedOption = sub.subs.find((categoryItem) => {
          return chosenItem && chosenItem.find((checked) => categoryItem.id === checked.value);
        });
        if (selectedOption) {
          setActiveKey([index]);
          setSecondActiveKey([`${index}-${subIndex}`]);
        }
      });
    });
  }, [category, chosenItem]);

  useEffect(() => {
    getAllProductCategory();
  }, []);

  const renderHeader = (item: CategoryListResponse) => {
    return (
      <span>
        {upperCase(item.name)}
        <span
          className={styles.dropdownCount}
          style={{
            marginLeft: 8,
          }}
        >
          ({item.subs.length})
        </span>
      </span>
    );
  };
  const renderSubHeader = (item: CategoryListResponse) => {
    return (
      <span>
        {capitalize(item.name)}
        <span
          className={styles.dropdownCount}
          style={{
            marginLeft: 8,
          }}
        >
          ({item.subs.length})
        </span>
      </span>
    );
  };

  return (
    <Collapse
      bordered={false}
      expandIconPosition="right"
      expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
      className={styles.dropdownList}
      onChange={(key) => {
        setSecondActiveKey([]);
        setActiveKey(key);
      }}
      activeKey={activeKey}
    >
      {category.list.map((item, index) => (
        <Collapse.Panel
          header={renderHeader(item)}
          key={index}
          collapsible={isEmpty(item.subs) ? 'disabled' : undefined}
          className="site-collapse-custom-panel"
        >
          <Collapse
            bordered={false}
            expandIconPosition="right"
            expandIcon={({ isActive }) => (isActive ? <DropupV2Icon /> : <DropdownV2Icon />)}
            className={styles.secondDropdownList}
            onChange={setSecondActiveKey}
            activeKey={secondActiveKey}
          >
            {item.subs.map((sub, subIndex) => (
              <Collapse.Panel
                header={renderSubHeader(sub)}
                key={`${index}-${subIndex}`}
                collapsible={isEmpty(sub.subs) ? 'disabled' : undefined}
                className="site-collapse-custom-panel"
              >
                <CustomCheckbox
                  options={sub.subs.map((categoryItem) => {
                    return {
                      label: categoryItem.name,
                      value: categoryItem.id,
                    };
                  })}
                  selected={selected}
                  onChange={onChange}
                  isCheckboxList
                  heightItem="36px"
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};
