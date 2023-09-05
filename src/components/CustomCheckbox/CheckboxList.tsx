import React, { useEffect, useState } from 'react';

import type { CheckboxValue } from '@/components/CustomCheckbox/types';

import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomRadio } from '@/components/CustomRadio';
import { MainTitle, Title } from '@/components/Typography';

import styles from './styles/checkboxList.less';

export interface CheckboxOption {
  options: CheckboxValue[];
  heading?: string | React.ReactNode;
  label?: string | React.ReactNode;
  hasAllOption?: boolean;
  isSelectAll?: boolean;
  customItemClass?: string;
}

interface CheckboxListProps {
  data: CheckboxOption;
  selected?: CheckboxValue[];
  chosenItem?: CheckboxValue[];
  onChange?: (value: CheckboxValue[]) => void;
}

const CheckboxList: React.FC<CheckboxListProps> = (props) => {
  const [selectAll, setSelectAll] = useState(false);
  const { data, selected, onChange } = props;

  useEffect(() => {
    if (selected?.length === data.options?.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selected, data]);

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
            onClick={(e) => {
              e.preventDefault();
              let checkedAll = !selectAll;
              if (selected?.length === data.options.length) {
                checkedAll = false;
              }
              if (onChange) {
                if (checkedAll) {
                  onChange(data.options);
                } else {
                  onChange([]);
                }
              }
            }}
          >
            <CustomRadio
              noPaddingLeft
              options={[
                {
                  label: data.label ?? (
                    <MainTitle level={3} customClass="select-all-option">
                      Select All Options
                    </MainTitle>
                  ),
                  value: 'all',
                },
              ]}
              value={selected?.length === data.options.length ? 'all' : undefined}
              isRadioList
            />
          </div>
        ) : null}

        <div className="checkbox-list-options">
          <CustomCheckbox
            options={data.options}
            selected={selected}
            onChange={onChange}
            heightItem="auto"
            checkboxClass={data.customItemClass}
            isCheckboxList
          />
        </div>
      </div>
    </div>
  );
};

export default CheckboxList;
