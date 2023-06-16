import { FC } from 'react';

import { Switch, SwitchProps } from 'antd';

import styles from './index.less';

export interface SwitchDynamicProps extends SwitchProps {
  checked: boolean | undefined;
  onClick?: (toggle: boolean, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}

export const SwitchDynamic: FC<SwitchDynamicProps> = ({
  checked,
  onClick,
  size = 'small',
  checkedChildren = 'ON',
  unCheckedChildren = 'OFF',
  className = '',
  ...props
}) => {
  return (
    <Switch
      size={size}
      checkedChildren={checkedChildren}
      unCheckedChildren={unCheckedChildren}
      className={`${styles.switchBtn} ${className}`}
      checked={checked}
      onClick={(toggle, e) => {
        e.stopPropagation();

        onClick?.(toggle, e);
      }}
      {...props}
    />
  );
};
