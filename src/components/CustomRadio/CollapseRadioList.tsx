import { FC, ReactNode } from 'react';

import { RadioValue } from '@/components/CustomRadio/types';

import CustomCollapse from '@/components/Collapse';
import { CustomRadio } from '@/components/CustomRadio';
import { BodyText } from '@/components/Typography';

import styles from './styles/collapseRadioList.less';

interface CollapseRadioListProps {
  options: RadioValue[];
  checked?: string | number;
  onChange?: (checked: RadioValue) => void;
  otherInput?: boolean;
  placeholder?: string | ReactNode;
  containerClass?: string;
  checkboxItemHeight?: string;
  onCollapseChange?: (key: string | string[]) => void;
  Header?: ReactNode;
  inputPlaceholder?: string;
}

const CollapseRadioList: FC<CollapseRadioListProps> = ({
  options,
  checked,
  onChange,
  otherInput,
  placeholder = 'select from the list',
  containerClass = '',
  onCollapseChange,
  Header,
  inputPlaceholder,
}) => {
  return (
    <CustomCollapse
      onChange={onCollapseChange}
      header={
        Header || (
          <BodyText level={5} customClass="function-type-placeholder" fontFamily="Roboto">
            {placeholder}
          </BodyText>
        )
      }
      className={`${styles.functionTypeDropdown} ${containerClass}`}>
      <CustomRadio
        options={options}
        isRadioList
        otherInput={otherInput}
        inputPlaceholder={inputPlaceholder}
        value={checked}
        onChange={onChange}
      />
    </CustomCollapse>
  );
};

export default CollapseRadioList;
