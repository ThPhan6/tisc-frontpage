import type { FC, ReactNode } from 'react';
import { CustomRadio } from '@/components/CustomRadio';
import { RadioValue } from '@/components/CustomRadio/types';
import { BodyText } from '@/components/Typography';
import CustomCollapse from '@/components/Collapse';
import styles from './styles/collapseRadioList.less';

interface CollapseRadioListProps {
  options: RadioValue[];
  checked?: string | number;
  onChange?: (checked: RadioValue) => void;
  otherInput?: boolean;
  placeholder?: string | ReactNode;
  containerClass?: string;
  checkboxItemHeight?: string;
  activeKey?: string | string[];
  onCollapseChange?: (key: string | string[]) => void;
  Header?: ReactNode;
}

const CollapseRadioList: FC<CollapseRadioListProps> = ({
  options,
  checked,
  onChange,
  otherInput,
  placeholder = 'select from the list',
  containerClass = '',
  activeKey = '',
  onCollapseChange,
  Header,
}) => {
  return (
    <CustomCollapse
      onChange={onCollapseChange}
      activeKey={activeKey}
      header={
        Header || (
          <BodyText level={5} customClass="function-type-placeholder" fontFamily="Roboto">
            {placeholder}
          </BodyText>
        )
      }
      className={`${styles.functionTypeDropdown} ${containerClass}`}
    >
      <CustomRadio
        options={options}
        isRadioList
        otherInput={otherInput}
        value={checked}
        onChange={onChange}
      />
    </CustomCollapse>
  );
};

export default CollapseRadioList;
