import React, { FC, useState } from 'react';

import { Dropdown } from 'antd';
import type { DropDownProps, DropdownProps } from 'antd/es/dropdown';

import { BodyText } from '../Typography';
import styles from './index.less';

export type HeaderDropdownProps = {
  arrow?: boolean;
  arrowPositionCenter?: boolean;
  containerClass?: string;
  overlayClassName?: string;
  overlay?: React.ReactNode | (() => React.ReactNode) | any;
  items?: MenuIconProps[];
  placement?: DropdownProps['placement'];
} & Omit<DropDownProps, 'overlay'>;

export type MenuIconProps = {
  containerClass?: string;
  label?: string | React.ReactNode;
  icon?: JSX.Element;
  onClick: () => void;
  disabled?: boolean;
};

type MenuHeaderDropdownProps = {
  items: MenuIconProps[];
  onParentClick?: () => void;
};

export const MenuHeaderDropdown: FC<MenuHeaderDropdownProps> = ({ items, onParentClick }) => {
  const MenuItem = ({ label, icon, onClick, containerClass, disabled }: MenuIconProps) => (
    <div
      onClick={() => {
        if (disabled) {
          return;
        }
        onParentClick?.();
        onClick();
      }}
      className={`${styles.item} ${containerClass} ${disabled ? styles.disabled : ''}`}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <BodyText fontFamily="Roboto" level={6}>
        {label}
      </BodyText>
    </div>
  );

  return (
    <div className={`${styles['menu-header']} tisc-dropdown-item`}>
      {items.map((item, index) => (
        <MenuItem
          containerClass={index !== items.length - 1 && styles.border}
          key={`${index}${item.label}`}
          onClick={item.onClick}
          label={item.label}
          icon={item.icon}
          disabled={item.disabled}
        />
      ))}
    </div>
  );
};

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  containerClass,
  arrowPositionCenter,
  arrow,
  items,
  overlay,
  ...restProps
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Dropdown
      className={styles.dropdownWrapper}
      overlayClassName={`${styles.container} ${
        arrowPositionCenter && styles[`arrow-center`]
      } ${cls} ${containerClass}`}
      arrow={arrow}
      visible={visible}
      onVisibleChange={(value) => setVisible(value)}
      overlay={
        overlay ||
        (items ? (
          <MenuHeaderDropdown items={items} onParentClick={() => setVisible(false)} />
        ) : null)
      }
      {...restProps}
    />
  );
};
