import React, { useEffect, useState } from 'react';

import { Radio, RadioChangeEvent } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { cloneDeep } from 'lodash';

import type { CheckboxValue } from '@/components/CustomCheckbox/types';

import { CustomCheckbox } from '@/components/CustomCheckbox';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import styles from './styles/checkboxDynamic.less';

export interface CheckBoxOptionProps extends CheckboxValue {
  pre_option?: string;
  select_id?: string;
}

export interface CheckboxOption {
  options: CheckBoxOptionProps[];
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
  selected?: CheckBoxOptionProps[];
  chosenItems?: CheckBoxOptionProps[];
  onChange?: (value: CheckboxValue[]) => void;
  onOneChange?: (e: CheckboxChangeEvent | RadioChangeEvent) => void;
  disabled?: boolean;
  isRadio?: boolean;
  isCheckbox?: boolean;
}

export const CheckboxDynamic: React.FC<CheckboxListProps> = ({
  data,
  selected,
  onChange,
  onOneChange,
  disabled,
  chosenItems,
  isRadio,
  isCheckbox,
}) => {
  const [curSelect, setCurSelect] = useState<CheckboxValue[] | undefined>([]);
  const [selectAll, setSelectAll] = useState<string[]>([]);

  useEffect(() => {
    const currentSelect: CheckboxValue[] = [];
    const selectAllIds: string[] = [];

    data.options.forEach((item) => {
      const optSelected: CheckboxValue[] = chosenItems?.filter(
        (selectedItem) => item.select_id === selectedItem.value,
      ) as CheckboxValue[];

      if (optSelected?.length) {
        optSelected.forEach((el) => {
          currentSelect.push(el);
        });
      }

      if (
        data.optionRadioValue &&
        currentSelect?.length === data.options.length &&
        data.options.some((opt) => currentSelect.map((el) => el.value).includes(opt.value))
      ) {
        selectAllIds.push(data.optionRadioValue);
      } else if (data.optionRadioValue) {
        selectAllIds.filter((id) => id !== data.optionRadioValue);
      }
    });

    setCurSelect(currentSelect);
    setSelectAll(selectAllIds);
  }, [chosenItems]);

  const handleClickSelectAll = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const isSelectedAll = !selectAll?.some((id) => data.optionRadioValue === id);

    const selectAllIdClone = cloneDeep(selectAll);

    const newIds = isSelectedAll
      ? selectAllIdClone.filter((id) => id !== data.optionRadioValue)
      : selectAllIdClone.concat(data.optionRadioValue as string);

    setSelectAll(newIds);
    setCurSelect([]);
    onChange?.([]);
  };

  const handleSelectOptions = (opts: CheckboxValue[]) => {
    let otherSelected: CheckboxValue[] = [];

    const isSelectedAll = !selectAll?.some((id) => data.optionRadioValue === id);

    if (data.combinable && selected) {
      otherSelected = selected.reduce((finalData, selectedItem) => {
        if (!data.options.find((option) => option.value === selectedItem.value)) {
          finalData.push(selectedItem);
        }
        return finalData;
      }, [] as CheckboxValue[]);

      const selectAllIdClone = cloneDeep(selectAll);

      const newIds = isSelectedAll
        ? selectAllIdClone.filter((id) => id !== data.optionRadioValue)
        : selectAllIdClone.concat(data.optionRadioValue as string);

      setSelectAll(newIds);
    }

    onChange?.([...opts, ...otherSelected]);
  };

  const handleSelectSingleOption = (e: CheckboxChangeEvent | RadioChangeEvent) => {
    if (isCheckbox) {
      onOneChange?.(e);
    }

    if (isRadio) {
      onOneChange?.(e);
    }
  };

  return (
    <div className={styles.checkboxListContainer}>
      <div className={`${styles.checkboxListItem} ${isRadio ? styles.radioListItem : ''}`}>
        {typeof data.heading === 'string' ? (
          <Title customClass="checkbox-list-heading" level={8}>
            {data.heading}
          </Title>
        ) : (
          data.heading
        )}
        <div className={`${styles.checkedAllRadio} selected-all-option-radio`}>
          <BodyText level={5} fontFamily="Roboto">
            {data.optionRadioLabel}
          </BodyText>

          {data.isSelectAll ? (
            <Radio
              checked={
                selectAll?.includes(data.optionRadioValue as string) ||
                (selected?.length === data.options.length &&
                  selectAll?.includes(data.optionRadioValue as string))
              }
              disabled={data.disabledSelectAll ?? chosenItems?.length !== data.options.length}
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
          ) : null}
        </div>

        {isCheckbox ? (
          <div className="checkbox-list-options">
            <CustomCheckbox
              options={data.options}
              // selected={selected}
              onChange={handleSelectOptions}
              onOneChange={handleSelectSingleOption}
              heightItem="auto"
              checkboxClass={data.customItemClass}
              isCheckboxList
              disabled={disabled}
              chosenItems={curSelect}
            />
          </div>
        ) : null}

        {isRadio
          ? data.options.map((el) => (
              <Radio
                className="flex-start row-reverse radio-item"
                checked={el.value === selected?.[0].value}
                value={el.value}
                onChange={handleSelectSingleOption}
              >
                {el.label}
              </Radio>
            ))
          : null}
      </div>
    </div>
  );
};
