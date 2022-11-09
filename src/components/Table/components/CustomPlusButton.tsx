import type { FC } from 'react';

import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon.svg';

import styles from '@/components/Table/styles/TableHeader.less';
import { MainTitle } from '@/components/Typography';

interface CustomPlusButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  size?: number;
  label?: string;
  customClass?: string;
  position?: 'start' | 'between' | 'center' | 'end';
}

const CustomPlusButton: FC<CustomPlusButtonProps> = ({
  onClick,
  disabled,
  size,
  label,
  customClass = '',
  position = 'end',
}) => {
  return (
    <div className={`flex-${position} ${customClass}`}>
      <div
        onClick={onClick}
        className={`${styles.customContent} ${
          disabled ? styles.customContentDisable : styles.customContent
        }`}>
        {label ? (
          <MainTitle level={4} customClass="label">
            {label}
          </MainTitle>
        ) : null}
        <div
          className={disabled ? styles.customButtonDisable : styles.customButton}
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
      </div>
    </div>
  );
};
export default CustomPlusButton;
