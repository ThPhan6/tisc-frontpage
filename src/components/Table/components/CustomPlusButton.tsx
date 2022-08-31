import type { FC } from 'react';

import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon.svg';

import styles from '@/components/Table/styles/TableHeader.less';

interface CustomPlusButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  size?: number;
}

const CustomPlusButton: FC<CustomPlusButtonProps> = ({ onClick, disabled, size }) => {
  return (
    <div
      className={disabled ? styles.customButtonDisable : styles.customButton}
      onClick={onClick}
      style={
        size
          ? {
              width: size,
              height: size,
            }
          : undefined
      }>
      <PlusIcon />
    </div>
  );
};
export default CustomPlusButton;
