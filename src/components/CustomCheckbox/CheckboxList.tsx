import React, { useEffect, useState } from 'react';

import Radio from 'antd/lib/radio';

import type { CheckboxValue } from '@/components/CustomCheckbox/types';

import { CustomCheckbox } from '@/components/CustomCheckbox';
import { MainTitle, Title } from '@/components/Typography';

import styles from './styles/checkboxList.less';

export interface CheckboxOption {
  options: CheckboxValue[];
  heading: string | React.ReactNode;
  hasAllOption?: boolean;
  isSelectAll?: boolean;
  customItemClass?: string;
  isLabel?: boolean;
}

interface CheckboxListProps {
  data: CheckboxOption;
  selected?: CheckboxValue[];
  chosenItem?: CheckboxValue[];
  onChange?: (value: CheckboxValue[]) => void;
  isExpanded?: boolean;
  onCollClick?: (value: string) => void;
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  data,
  selected,
  onChange,
  isExpanded,
  onCollClick,
}) => {
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    if (selected?.length === data.options.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selected]);

  const handleSelectAll = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const isSelectedAll = !selectAll;

    setSelectAll(isSelectedAll);

    if (isSelectedAll) {
      onChange?.(data.options);
    } else {
      onChange?.([]);
    }
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
            <Radio
              checked={selectAll}
              onClick={handleSelectAll}
              className="w-full row-reverse flex-between radio-select-all"
            >
              <MainTitle level={3} style={{ paddingLeft: 0 }}>
                Select All Components
              </MainTitle>
            </Radio>
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
            isExpanded={isExpanded}
            onCollClick={onCollClick ? onCollClick : undefined}
            isLabel={data.isLabel}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckboxList;
