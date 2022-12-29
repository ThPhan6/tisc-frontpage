import { FC, ReactNode } from 'react';

import { RadioValue } from '@/components/CustomRadio/types';
import { CollapseGroup, useCollapseGroupActiveCheck } from '@/reducers/active';

import CustomCollapse from '@/components/Collapse';
import { CustomRadio } from '@/components/CustomRadio';
import { BodyText } from '@/components/Typography';

import styles from './styles/collapseRadioList.less';

export interface CollapseRadioListProps {
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
  groupType?: CollapseGroup;
  groupIndex?: number; // distinct index for handling active collapse item
}

const CollapseRadioList: FC<CollapseRadioListProps> = ({
  options,
  checked,
  onChange,
  otherInput,
  clearOtherInput,
  activeKey,
  groupType,
  groupIndex,
  placeholder = 'select from the list',
  containerClass = '',
  Header,
  inputPlaceholder,
  noDataMessage = 'No options',
  collapsible = false,
  ...props
}) => {
  const { curActiveKey, onKeyChange } = useCollapseGroupActiveCheck(
    groupType,
    groupIndex,
    activeKey,
  );

  return (
    <CustomCollapse
      activeKey={curActiveKey}
      onChange={onKeyChange}
      collapsible={collapsible ? 'disabled' : undefined}
      header={
        Header || (
          <BodyText level={5} customClass="function-type-placeholder" fontFamily="Roboto">
            {placeholder}
          </BodyText>
        )
      }
      className={`${styles.functionTypeDropdown} ${containerClass}`}
      {...props}>
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
