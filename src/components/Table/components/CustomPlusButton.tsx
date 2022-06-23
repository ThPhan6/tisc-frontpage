import type { FC } from 'react';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon.svg';
import styles from '@/components/Table/styles/TableHeader.less';
interface ICustomPlusButton {
  onClick?: () => void;
  disabled?: boolean;
}

const CustomPlusButton: FC<ICustomPlusButton> = ({ onClick, disabled }) => {
  return (
    <div className={disabled ? styles.customButtonDisable : styles.customButton} onClick={onClick}>
      <PlusIcon />
    </div>
  );
};
export default CustomPlusButton;
