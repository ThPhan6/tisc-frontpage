import React, { useEffect, useState } from 'react';

import { Radio } from 'antd';

import type { CheckboxValue } from '@/components/CustomCheckbox/types';

import { CustomCheckbox } from '@/components/CustomCheckbox';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import styles from './styles/checkboxList.less';

export interface CheckboxOption {
  options: CheckboxValue[];
  heading?: string | React.ReactNode;
  optionRadioLabel?: string | React.ReactNode;
  optionRadioValue?: string;
  hasAllOption?: boolean;
  isSelectAll?: boolean;
  customItemClass?: string;
  multipleSelectAll?: boolean;
  combinable?: boolean;
  disabledSelectAll?: boolean;
}

interface CheckboxListProps {
  data: CheckboxOption;
  selected?: CheckboxValue[];
  chosenItems?: CheckboxValue[];
  onChange?: (value: CheckboxValue[]) => void;
  disabled?: boolean;
  filterBySelected?: boolean;
}

export const CheckboxDynamic: React.FC<CheckboxListProps> = ({
  data,
  selected,
  onChange,
  disabled,
  filterBySelected,
  chosenItems,
}) => {
  const [curSelect, setCurSelect] = useState<CheckboxValue[] | undefined>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    setCurSelect(chosenItems);
    setSelectAll(chosenItems?.length === data.options.length);
  }, [JSON.stringify(chosenItems)]);

  const handleClickSelectAll = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectAll(false);
    setCurSelect([]);
    onChange?.([]);
  };

  const handleSelectOption = (opts: CheckboxValue[]) => {
    let otherSelected: CheckboxValue[] = [];

    if (data.combinable && selected) {
      otherSelected = selected.reduce((finalData, selectedItem) => {
        if (!data.options.find((option) => option.value === selectedItem.value)) {
          finalData.push(selectedItem);
        }
        return finalData;
      }, [] as CheckboxValue[]);
    }

    onChange?.([...opts, ...otherSelected]);
  };

  return (
    <div className={styles.checkboxListContainer}>
      <div className={styles.checkboxListItem}>
        {typeof data.heading === 'string' ? (
          <Title customClass="checkbox-list-heading" level={8}>
            {data.heading}
          </Title>
        ) : (
          data.heading
        )}
        {data.isSelectAll ? (
          <div className={`${styles.checkedAllRadio} selected-all-option-radio`}>
            <BodyText level={5} fontFamily="Roboto">
              {data.optionRadioLabel}
            </BodyText>

            <Radio
              checked={selectAll}
              disabled={data.disabledSelectAll}
              onClick={handleClickSelectAll}
              style={{ display: 'flex', flexDirection: 'row-reverse', marginRight: 0 }}
            >
              <MainTitle
                level={4}
                style={{ fontWeight: 600, textTransform: 'capitalize', color: '#000' }}
              >
                Select all
              </MainTitle>
            </Radio>
          </div>
        ) : null}

        <div className="checkbox-list-options">
          <CustomCheckbox
            options={data.options}
            selected={selected}
            onChange={handleSelectOption}
            heightItem="auto"
            checkboxClass={data.customItemClass}
            isCheckboxList
            disabled={disabled}
            filterBySelected={filterBySelected}
            chosenItems={curSelect}
          />
        </div>
      </div>
    </div>
  );
};
