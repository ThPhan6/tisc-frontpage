import { FC } from 'react';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';

import { CustomInputProps } from './types';

import { CustomDropDown } from '@/features/product/components';

import { CustomInput } from './CustomInput';
import styles from './DropdownSelectInput.less';

interface DropdownSelectInputProps extends CustomInputProps {
  overlay: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export const DropdownSelectInput: FC<DropdownSelectInputProps> = ({ overlay, value, ...props }) => {
  return (
    <CustomDropDown
      placement="bottom"
      hideDropdownIcon
      overlay={<div className={styles.overlayContainer}>{overlay}</div>}
      className={styles.selectDropdown}>
      <CustomInput borderBottomColor="light" {...props} value={value || ''} />
      <DropdownIcon className="ic-select" />
    </CustomDropDown>
  );
};

// export const DropdownRadioGroupSelectInput: FC<CustomRadioProps> = ({  ...props }) => {
//   return (
//     <CustomDropDown placement="bottom" hideDropdownIcon overlay={
//       <CustomRadio
//     />
//     }>
//       <CustomInput borderBottomColor="light" {...props} />
//     </CustomDropDown>
//   );
// };
