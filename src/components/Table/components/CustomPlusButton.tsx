import type { FC } from 'react';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon.svg';
import styles from '@/components/Table/styles/TableHeader.less';
import classNames from 'classnames';
interface ICustomPlusButton {
  onClick?: () => void;
  disabled?: boolean;
  containerClass?: string;
}

const CustomPlusButton: FC<ICustomPlusButton> = ({ onClick, disabled, containerClass }) => {
  return (
    <div
      className={classNames(
        disabled ? styles.customButtonDisable : styles.customButton,
        containerClass,
      )}
      onClick={onClick}
    >
      <PlusIcon />
    </div>
  );
};
export default CustomPlusButton;
