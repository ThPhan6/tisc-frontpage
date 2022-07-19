import type { FC } from 'react';
import { CustomRadio } from '@/components/CustomRadio';
import { RadioValue } from '@/components/CustomRadio/types';
import { BodyText } from '@/components/Typography';
import CustomCollapse from '@/components/Collapse';
import styles from './styles/collapseRadioList.less';

interface CollapseRadioListProps {
  options: RadioValue[];
  checked?: RadioValue;
  onChange?: (checked: RadioValue) => void;
  otherInput?: boolean;
  placeholder?: string;
  containerClass?: string;
  checkboxItemHeight?: string;
}

const CollapseRadioList: FC<CollapseRadioListProps> = ({
  options,
  checked,
  onChange,
  otherInput,
  placeholder = 'select from the list',
  containerClass = '',
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
      <CustomRadio
        options={options}
        isRadioList
        otherInput={otherInput}
        value={checked?.value}
        onChange={onChange}
      />
    </CustomCollapse>
  );
};

export default CollapseRadioList;
