import React, { FC, useState } from 'react';

import { Dropdown } from 'antd';
import type { DropDownProps, DropdownProps } from 'antd/es/dropdown';

import { useScreen } from '@/helper/common';

import { DrawerMenu } from '../Menu/DrawerMenu';
import { FilterDrawer } from '../Modal/Drawer';
import { BodyText } from '../Typography';
import styles from './index.less';

export type HeaderDropdownProps = {
  arrow?: boolean;
  arrowPositionCenter?: boolean;
  containerClass?: string;
  overlayClassName?: string;
  items?: MenuIconProps[];
  placement?: DropdownProps['placement'];
  filterDropdown?: boolean;
  menuDropdown?: boolean;
} & Omit<DropDownProps, 'overlay'>;

export type MenuIconProps = {
  containerClass?: string;
  label?: string | React.ReactNode;
  icon?: JSX.Element | React.ReactNode;
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
      onClick={(e) => {
        e.stopPropagation();
        if (disabled) {
          return;
        }
        onParentClick?.();
        onClick();
      }}
      className={`${styles.item} ${containerClass} ${disabled ? styles.disabled : ''}`}
    >
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
  items = [],
  filterDropdown,
  menuDropdown,
  ...restProps
}) => {
  const { isMobile } = useScreen();

  const [visible, setVisible] = useState(false);

  const content = items ? (
    <MenuHeaderDropdown items={items} onParentClick={() => setVisible(false)} />
  ) : (
    <div />
  );

  return (
    <>
      <Dropdown
        className={styles.dropdownWrapper}
        overlayClassName={`${styles.container} ${
          arrowPositionCenter && styles[`arrow-center`]
        } ${cls} ${filterDropdown ? styles.filterDropdown : ''} ${containerClass}`}
        arrow={arrow}
        visible={visible && isMobile === false}
        onVisibleChange={(value) => setVisible(value)}
        overlay={content}
        {...restProps}
      />
      {!isMobile ? null : menuDropdown ? (
        <DrawerMenu visible={visible} onClose={() => setVisible(false)} items={items} />
      ) : (
        <FilterDrawer visible={visible} onClose={() => setVisible(false)}>
          {content}
        </FilterDrawer>
      )}
    </>
  );
};
