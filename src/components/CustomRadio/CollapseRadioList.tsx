import { FC, ReactNode, useEffect, useState } from 'react';

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
  clearOtherInput?: boolean;
  placeholder?: string | ReactNode;
  containerClass?: string;
  checkboxItemHeight?: string;
  Header?: ReactNode;
  inputPlaceholder?: string;
  noDataMessage?: string;
  collapsible?: boolean;
  activeKey?: string | string[];
}

const CollapseRadioList: FC<CollapseRadioListProps> = ({
  options,
  checked,
  onChange,
  otherInput,
  clearOtherInput,
  activeKey,
  placeholder = 'select from the list',
  containerClass = '',
  Header,
  inputPlaceholder,
  noDataMessage = 'No options',
  collapsible = false,
  ...props
}) => {
  const [collapse, setCollapse] = useState<string | string[]>();

  useEffect(() => {
    setCollapse(activeKey);
  }, [activeKey]);

  return (
    <CustomCollapse
      {...props}
      activeKey={collapse}
      onChange={setCollapse}
      collapsible={collapsible ? 'disabled' : undefined}
      header={
        Header || (
          <BodyText level={5} customClass="function-type-placeholder" fontFamily="Roboto">
            {placeholder}
          </BodyText>
        )
      }
      className={`${styles.functionTypeDropdown} ${containerClass}`}>
      {options.length ? (
        <CustomRadio
          options={options}
          isRadioList
          otherInput={otherInput}
          clearOtherInput={clearOtherInput}
          inputPlaceholder={inputPlaceholder}
          value={checked}
          onChange={onChange}
        />
      ) : (
        <span style={{ paddingLeft: 16 }}>{noDataMessage}</span>
      )}
    </CustomCollapse>
  );
};

export default CollapseRadioList;
