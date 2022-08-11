import { FC, ReactNode, useState } from 'react';
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
  Header?: ReactNode;
}

const CollapseRadioList: FC<CollapseRadioListProps> = ({
  options,
  checked,
  onChange,
  otherInput,
  placeholder = 'select from the list',
  containerClass = '',
  Header,
}) => {
  const [activeKey, setActiveKey] = useState<string | string[]>();
  const handleOpenDepartmentData = (key: string | string[]) => {
    setActiveKey(key === '' ? '1' : key);
  };

  return (
    <CustomCollapse
      onChange={handleOpenDepartmentData}
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
