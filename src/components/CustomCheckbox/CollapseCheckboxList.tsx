import { FC, useEffect, useState } from 'react';

import { CheckboxValue, CustomCheckboxProps } from '@/components/CustomCheckbox/types';

import CustomCollapse from '@/components/Collapse';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { BodyText } from '@/components/Typography';

import styles from './styles/collapseCheckboxList.less';

interface CollapseCheckboxListProps extends CustomCheckboxProps {
  checked?: CheckboxValue[];
  placeholder?: string;
  containerClass?: string;
  checkboxItemHeight?: string;
  activeKey?: string | string[];
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
  activeKey,
  ...props
}) => {
  const [collapse, setCollapse] = useState<string | string[]>();

  useEffect(() => {
    setCollapse(activeKey);
  }, [activeKey]);

  return (
    <CustomCollapse
      activeKey={collapse}
      onChange={(key) => setCollapse(key)}
      header={
        <BodyText level={5} customClass="function-type-placeholder" fontFamily="Roboto">
          {placeholder}
        </BodyText>
      }
      className={`${styles.functionTypeDropdown} ${containerClass}`}>
      <CustomCheckbox
        {...props}
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
