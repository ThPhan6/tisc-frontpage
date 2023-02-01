import { CSSProperties, FC } from 'react';

import { DropdownProps } from 'antd/es/dropdown';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';

import { CustomInputProps } from './types';

import { CustomDropDown } from '@/features/product/components';

import { CustomInput } from './CustomInput';
import styles from './DropdownSelectInput.less';

interface DropdownSelectInputProps extends CustomInputProps {
  overlay: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  overlayStyle?: CSSProperties;
  overlayClass?: string;
  noPadding?: boolean;
  placement?: DropdownProps['placement'];
}

export const DropdownSelectInput: FC<DropdownSelectInputProps> = ({
  overlay,
  value,
  overlayStyle,
  overlayClass = '',
  noPadding,
  placement = 'bottom',
  ...props
}) => {
  return (
    <CustomDropDown
      placement={placement}
      align={window.safari ? { offset: [24, 0] } : {}}
      hideDropdownIcon
      overlay={
        <div
          className={`${styles.overlayContainer} ${
            noPadding ? styles.noPadding : ''
          } ${overlayClass}`}>
          {overlay}
        </div>
      }
      overlayStyle={overlayStyle}
      className={styles.selectDropdown}>
      <CustomInput borderBottomColor="light" {...props} value={value || ''} />
      <DropdownIcon className="ic-select" />
    </CustomDropDown>
  );
};
