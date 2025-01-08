import React, { CSSProperties, FC, useState } from 'react';

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
  customVisible?: boolean;
} & Omit<DropDownProps, 'overlay'>;

export type MenuIconProps = {
  additionalStyle?: CSSProperties;
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
  const MenuItem = ({
    label,
    icon,
    onClick,
    containerClass,
    disabled,
    additionalStyle,
  }: MenuIconProps) => (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (disabled) {
          return;
        }
        onParentClick?.();
        onClick?.();
      }}
      className={`${styles.item} ${containerClass} ${disabled ? styles.disabled : ''}`}
      style={additionalStyle}
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
          containerClass={`${index !== items.length - 1 && styles.border} ${
            item.containerClass ?? ''
          }`}
          key={`${index}${item.label}`}
          onClick={item.onClick}
          label={item.label}
          icon={item.icon}
          disabled={item.disabled}
          additionalStyle={item.additionalStyle}
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
  customVisible = false,
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
        visible={customVisible || (visible && isMobile === false)}
        onVisibleChange={(value) => setVisible(value)}
        overlay={content}
        {...restProps}
      />
      {!isMobile ? null : menuDropdown ? (
        <DrawerMenu
          visible={visible}
          onClose={(e) => {
            e.stopPropagation();
            setVisible(false);
          }}
          items={items}
        />
      ) : (
        <FilterDrawer
          visible={visible}
          onClose={(e) => {
            e.stopPropagation();
            setVisible(false);
          }}
          className={styles.filterDropdown}
        >
          {content}
        </FilterDrawer>
      )}
    </>
  );
};
