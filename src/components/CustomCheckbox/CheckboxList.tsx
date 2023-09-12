import React, { useEffect, useState } from 'react';

import { cloneDeep } from 'lodash';

import type { CheckboxValue } from '@/components/CustomCheckbox/types';

import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomRadio } from '@/components/CustomRadio';
import { MainTitle, Title } from '@/components/Typography';

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
  unTick?: boolean;
}

interface CheckboxListProps {
  data: CheckboxOption;
  selected?: CheckboxValue[];
  chosenItem?: CheckboxValue[];
  onChange?: (value: CheckboxValue[]) => void;
  disabled?: boolean;
  filterBySelected?: boolean;
}

const CheckboxList: React.FC<CheckboxListProps> = (props) => {
  const { data, selected, onChange, disabled, filterBySelected } = props;

  const [selectAll, setSelectAll] = useState<string[] | string>([]);

  useEffect(() => {
    // if (data?.multipleSelectAll && data?.optionRadioValue) {
    //   const pickedOptions: CheckboxValue[] =
    //     selected?.reduce((finalData, selectedItem) => {
    //       if (data.options.some((option) => option.value === selectedItem.value)) {
    //         finalData.push(selectedItem);
    //       }
    //       return finalData;
    //     }, [] as CheckboxValue[]) ?? [];
    //   if (pickedOptions.length === data.options.length) {
    //     if (data?.combinable) {
    //       setSelectAll([...selectAll, data.optionRadioValue]);
    //     } else {
    //       setSelectAll([data.optionRadioValue]);
    //     }
    //   }
    //   return;
    // }
    // if (selected?.length === data.options.length) {
    //   setSelectAll('all');
    // } else {
    //   setSelectAll([]);
    // }
  }, [selected, data]);

  useEffect(() => {
    return () => {
      setSelectAll([]);
    };
  }, []);

  const handleSelectAll = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const checkedAll = !selectAll.length;

    const otherDataOption: CheckboxValue[] =
      selected?.reduce((finalData, selectedItem) => {
        if (!data.options.some((option) => option.value === selectedItem.value)) {
          finalData.push(selectedItem);
        }
        return finalData;
      }, [] as CheckboxValue[]) ?? [];

    // console.log(checkedAll, data?.combinable, data.optionRadioValue, selectAll);

    if (checkedAll) {
      if (data?.combinable) {
        setSelectAll([...selectAll, data.optionRadioValue as string]);

        onChange?.([...data.options, ...otherDataOption]);
      } else {
        onChange?.([...data.options]);

        setSelectAll([data.optionRadioValue as string]);
      }
    } else {
      if (data?.combinable) {
        setSelectAll((selectAll as string[])?.filter((id) => id !== data.optionRadioValue));

        onChange?.([...otherDataOption]);
      } else {
        setSelectAll([]);

        onChange?.([]);
      }
    }
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

    if (opts.length === data.options.length) {
      if (data.combinable) {
        setSelectAll([...selectAll, data.optionRadioValue as string]);
      } else {
        setSelectAll([data.optionRadioValue as string]);
      }
    } else {
      if (data.combinable) {
        setSelectAll((selectAll as string[])?.filter((id) => id !== data.optionRadioValue));
      } else {
        setSelectAll([]);
      }
    }
  };

  const setRadioValue = () => {
    if (selected?.length === data.options.length && !data.multipleSelectAll) {
      return 'all';
    }

    if (data.multipleSelectAll && cloneDeep(selectAll).includes(data.optionRadioValue as string)) {
      return data.optionRadioValue;
    }

    return undefined;
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
          <div
            className={`${styles.checkedAllRadio} selected-all-option-radio`}
            onClick={handleSelectAll}
          >
            <CustomRadio
              noPaddingLeft
              options={[
                {
                  label: data.optionRadioLabel ?? (
                    <MainTitle level={3} customClass="select-all-option">
                      Select All Options
                    </MainTitle>
                  ),
                  value: data.multipleSelectAll ? (data.optionRadioValue as string) : 'all',
                },
              ]}
              value={setRadioValue()}
              isRadioList
            />
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
            unTick={data.unTick}
            filterBySelected={filterBySelected}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckboxList;
