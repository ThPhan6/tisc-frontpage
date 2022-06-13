import type { DropDownProps } from 'antd/es/dropdown';
import { Dropdown } from 'antd';
import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { BodyText } from '../Typography';

export type HeaderDropdownProps = {
  arrowPositionCenter?: boolean;
  containerClass?: string;
  overlayClassName?: string;
  overlay: React.ReactNode | (() => React.ReactNode) | any;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
} & Omit<DropDownProps, 'overlay'>;

type MenuIconProp = {
  containerClass?: string;
  label: string;
  icon?: JSX.Element;
  onClick: () => void;
};

type MenuHeaderDropdownProp = {
  items: MenuIconProp[];
};

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  containerClass,
  arrowPositionCenter,
  ...restProps
}) => (
  <Dropdown
    getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
    overlayClassName={classNames(
      styles.container,
      arrowPositionCenter && styles[`arrow-center`],
      cls,
      containerClass,
    )}
    {...restProps}
  />
);

export const MenuHeaderDropdown: FC<MenuHeaderDropdownProp> = ({ items }) => {
  const MenuItem = ({ label, icon, onClick, containerClass }: MenuIconProp) => (
    <div onClick={() => onClick()} className={classNames(styles.item, containerClass)}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <BodyText fontFamily="Roboto" level={6}>
        {label}
      </BodyText>
    </div>
  );

  return (
    <div className={styles['menu-header']}>
      {items.map((item, index) => (
        <MenuItem
          containerClass={index !== items.length - 1 && styles.border}
          key={`${index}${item.label}`}
          onClick={item.onClick}
          label={item.label}
          icon={item.icon}
        />
      ))}
    </div>
  );
};
