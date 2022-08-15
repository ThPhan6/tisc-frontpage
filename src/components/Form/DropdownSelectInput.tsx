import { CustomDropDown } from '@/features/product/components';
import { FC } from 'react';
import { CustomInput } from './CustomInput';
import styles from './DropdownSelectInput.less';
import { CustomInputProps } from './types';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';

interface DropdownSelectInputProps extends CustomInputProps {
  overlay: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export const DropdownSelectInput: FC<DropdownSelectInputProps> = ({ overlay, value, ...props }) => {
  return (
    <CustomDropDown
      placement="bottom"
      hideDropdownIcon
      overlay={<div className={styles.overlayContainer}>{overlay}</div>}
      className={styles.selectDropdown}
    >
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
