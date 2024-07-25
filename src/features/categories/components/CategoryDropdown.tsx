import React, { useEffect, useState } from 'react';

import { Collapse } from 'antd';

import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { getAllProductCategory } from '@/features/categories/services';
import { capitalize, flatMap, isEmpty, upperCase } from 'lodash';

import type { CheckboxValue } from '@/components/CustomCheckbox/types';
import { CategoryNestedList } from '@/features/categories/types';
import { useAppSelector } from '@/reducers';
import { ActiveKeyType } from '@/types';

import { CustomCheckbox } from '@/components/CustomCheckbox';

import styles from './CategoryDropdown.less';

interface DropdownCategoryListProps {
  selected?: CheckboxValue[];
  chosenItem?: CheckboxValue[];
  onChange: (value: CheckboxValue[]) => void;
}
type CheckedCategories = { [key: string]: CheckboxValue[] };

export const DropdownCategoryList: React.FC<DropdownCategoryListProps> = (props) => {
  const { selected, onChange, chosenItem } = props;
  const categories = useAppSelector((state) => state.category.list);
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  const [secondActiveKey, setSecondActiveKey] = useState<ActiveKeyType>([]);
  const [checkedCategories, setCheckedCategories] = useState<CheckedCategories>({});

  useEffect(() => {
    onChange(flatMap(Object.values(checkedCategories)));
  }, [checkedCategories]);

  useEffect(() => {
    if (categories.length && chosenItem?.length) {
      const curCheckedCategories: CheckedCategories = {};
      categories.forEach((item) => {
        item.subs.forEach((sub) => {
          curCheckedCategories[sub.id] = sub.subs
            .filter((cate) => chosenItem.some((checked) => cate.id === checked.value))
            .map((checkedItem) => ({
              label: checkedItem.name,
              value: checkedItem.id,
            }));
        });
      });
      setCheckedCategories(curCheckedCategories);
    }
  }, [categories, chosenItem]);

  useEffect(() => {
    if (!chosenItem || chosenItem.length) {
      return;
    }
    categories.forEach((item, index) => {
      item.subs.forEach((sub, subIndex) => {
        const haveSelectedOption = sub.subs.some((categoryItem) =>
          chosenItem?.some((checked) => categoryItem.id === checked.value),
        );
        if (haveSelectedOption) {
          setActiveKey([index]);
          setSecondActiveKey([`${index}-${subIndex}`]);
        }
      });
    });
  }, [categories, chosenItem]);

  useEffect(() => {
    getAllProductCategory();
  }, []);

  const renderHeader = (item: CategoryNestedList) => {
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
  const renderSubHeader = (item: CategoryNestedList) => {
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
      {categories.map((item, index) => (
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
                  onChange={(value) => {
                    const otherSelected = selected?.reduce((finalData, selectedItem) => {
                      if (!sub.subs.find((option) => option.id === selectedItem.value)) {
                        finalData.push(selectedItem);
                      }
                      return finalData;
                    }, [] as any);

                    if (otherSelected) {
                      setCheckedCategories({ ...otherSelected, [sub.id]: value });
                    }

                    // setCheckedCategories((prev) => ({ ...prev, [sub.id]: value }));
                  }}
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
