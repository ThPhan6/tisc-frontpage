import type { DropDownProps } from 'antd/es/dropdown';
import { Dropdown } from 'antd';
import React, { FC, useState } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { BodyText } from '../Typography';

export type HeaderDropdownProps = {
  arrow?: boolean;
  arrowPositionCenter?: boolean;
  containerClass?: string;
  overlayClassName?: string;
  overlay?: React.ReactNode | (() => React.ReactNode) | any;
  items?: MenuIconProp[];
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
  onParentClick?: () => void;
};

export const MenuHeaderDropdown: FC<MenuHeaderDropdownProp> = ({ items, onParentClick }) => {
  const MenuItem = ({ label, icon, onClick, containerClass }: MenuIconProp) => (
    <div
      onClick={() => {
        if (onParentClick) {
          onParentClick();
        }
        onClick();
      }}
      className={classNames(styles.item, containerClass)}
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
      overlayClassName={classNames(
        styles.container,
        arrowPositionCenter && styles[`arrow-center`],
        cls,
        containerClass,
      )}
      arrow={arrow}
      visible={visible}
      onVisibleChange={(value) => setVisible(value)}
      overlay={
        overlay ? (
          overlay
        ) : items ? (
          <MenuHeaderDropdown items={items} onParentClick={() => setVisible(false)} />
        ) : null
      }
      {...restProps}
    />
  );
};
