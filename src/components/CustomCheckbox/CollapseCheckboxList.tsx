import type { FC } from 'react';

import { CollapsibleType } from 'antd/lib/collapse/CollapsePanel';

import { CheckboxValue } from '@/components/CustomCheckbox/types';

import CustomCollapse from '@/components/Collapse';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { BodyText } from '@/components/Typography';

import styles from './styles/collapseCheckboxList.less';

interface CollapseCheckboxListProps {
  options: CheckboxValue[];
  checked?: CheckboxValue[];
  onChange?: (checked: CheckboxValue[]) => void;
  otherInput?: boolean;
  placeholder?: string;
  containerClass?: string;
  checkboxItemHeight?: string;
  inputPlaceholder?: string;
  collapsible?: CollapsibleType;
}

const CollapseCheckboxList: FC<CollapseCheckboxListProps> = ({
  options,
  checked,
  onChange,
  otherInput,
  placeholder = 'select all relevance',
  inputPlaceholder,
  containerClass = '',
  checkboxItemHeight = '36px',
  collapsible,
}) => {
  return (
    <CustomCollapse
      header={
        <BodyText level={5} customClass="function-type-placeholder" fontFamily="Roboto">
          {placeholder}
        </BodyText>
      }
      collapsible={collapsible}
      className={`${styles.functionTypeDropdown} ${containerClass}`}>
      <CustomCheckbox
        options={options}
        isCheckboxList
        heightItem={checkboxItemHeight}
        otherInput={otherInput}
        selected={checked}
        onChange={onChange}
        inputPlaceholder={inputPlaceholder}
      />
    </CustomCollapse>
  );
};

export default CollapseCheckboxList;
