import type { FC } from 'react';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { BodyText } from '@/components/Typography';
import CustomCollapse from '@/components/Collapse';
import styles from './styles/collapseCheckboxList.less';

interface CollapseCheckboxListProps {
  options: CheckboxValue[];
  checked?: CheckboxValue[];
  onChange?: (checked: CheckboxValue[]) => void;
  otherInput?: boolean;
  placeholder?: string;
  containerClass?: string;
  checkboxItemHeight?: string;
}

const CollapseCheckboxList: FC<CollapseCheckboxListProps> = ({
  options,
  checked,
  onChange,
  otherInput,
  placeholder = 'select all relevance',
  containerClass = '',
  checkboxItemHeight = '36px',
}) => {
  return (
    <CustomCollapse
      header={
        <BodyText level={5} customClass="function-type-placeholder" fontFamily="Roboto">
          {placeholder}
        </BodyText>
      }
      className={`${styles.functionTypeDropdown} ${containerClass}`}
    >
      <CustomCheckbox
        options={options}
        isCheckboxList
        heightItem={checkboxItemHeight}
        otherInput={otherInput}
        selected={checked}
        onChange={onChange}
      />
    </CustomCollapse>
  );
};

export default CollapseCheckboxList;
