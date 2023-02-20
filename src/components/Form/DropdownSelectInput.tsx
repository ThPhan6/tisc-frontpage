import { CSSProperties, FC } from 'react';

import { DropdownProps } from 'antd/es/dropdown';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';

import { checkBrowser } from '@/helper/utils';

import { CustomInputProps } from './types';

import { CustomDropDown } from '@/features/product/components';

import { CustomInput } from './CustomInput';
import styles from './styles/DropdownSelectInput.less';

interface DropdownSelectInputProps extends CustomInputProps {
  overlay: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  overlayStyle?: CSSProperties;
  overlayClass?: string;
  noPadding?: boolean;
  placement?: DropdownProps['placement'];
  showCloseFooter?: boolean;
  offsetAlign?: [number, number];
}

export const DropdownSelectInput: FC<DropdownSelectInputProps> = ({
  overlay,
  value,
  overlayStyle,
  overlayClass = '',
  noPadding,
  placement = 'bottom',
  showCloseFooter,
  offsetAlign,
  ...props
}) => {
  return (
    <CustomDropDown
      placement={placement}
      align={{ offset: offsetAlign ? offsetAlign : checkBrowser().isSafari ? [36, 0] : undefined }}
      hideDropdownIcon
      overlay={
        <div
          className={`${styles.overlayContainer} ${
            noPadding ? styles.noPadding : ''
          } ${overlayClass}`}
        >
          {overlay}
        </div>
      }
      overlayStyle={overlayStyle}
      className={styles.selectDropdown}
      autoHeight={false}
      showCloseFooter={showCloseFooter}
    >
      <CustomInput borderBottomColor="light" {...props} value={value || ''} />
      <DropdownIcon className="ic-select" />
    </CustomDropDown>
  );
};
