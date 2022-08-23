import { CSSProperties, FC } from 'react';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';

import { CustomInputProps } from './types';

import { CustomDropDown } from '@/features/product/components';

import { CustomInput } from './CustomInput';
import styles from './DropdownSelectInput.less';

interface DropdownSelectInputProps extends CustomInputProps {
  overlay: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  overlayStyle?: CSSProperties;
  noPadding?: boolean;
}

export const DropdownSelectInput: FC<DropdownSelectInputProps> = ({
  overlay,
  value,
  overlayStyle,
  noPadding,
  ...props
}) => {
  return (
    <CustomDropDown
      placement="bottom"
      hideDropdownIcon
      overlay={
        <div className={`${styles.overlayContainer} ${noPadding ? styles.noPadding : ''}`}>
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
