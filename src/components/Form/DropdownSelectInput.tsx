import { CSSProperties, FC } from 'react';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';

import { CustomInputProps } from './types';

import { CustomDropDown } from '@/features/product/components';

import { CustomInput } from './CustomInput';
import styles from './DropdownSelectInput.less';

interface DropdownSelectInputProps extends CustomInputProps {
  overlay: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  overlayStyle?: CSSProperties;
  overlayClass?: CSSProperties;
  noPadding?: boolean;
  placement?:
    | 'bottom'
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomCenter'
    | 'bottomRight'
    | 'top';
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
      hideDropdownIcon
      overlay={
        <div
          className={`${styles.overlayContainer} ${
            noPadding ? styles.noPadding : ''
          } ${overlayClass} `}>
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
