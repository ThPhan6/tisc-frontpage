import { CSSProperties, FC, useEffect, useState } from 'react';

import { Drawer, DrawerProps } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';

import styles from './styles/index.less';

export interface CustomDrawerProps extends DrawerProps {
  closeOnMask?: boolean; // Use when children content overlap drawer mask, click outside could not close drawer
  darkTheme?: boolean;
}
export const CustomDrawer: FC<CustomDrawerProps> = ({
  closeOnMask,
  bodyStyle,
  headerStyle,
  onClose,
  darkTheme,
  style,
  title,
  className,
  ...props
}) => {
  useEffect(() => {
    if (props.visible === false || !closeOnMask) {
      return;
    }
    setTimeout(() => {
      const drawerMask = document.querySelectorAll('.ant-drawer-content-wrapper');
      drawerMask[drawerMask.length - 1]?.addEventListener('click', (event: any) => {
        if (
          typeof event.target?.className === 'string' &&
          event.target.className.includes('ant-drawer-content-wrapper')
        ) {
          onClose?.(event);
        }
      });
    }, 300);
  }, [props.visible]);

  return (
    <Drawer
      onClose={(event) => onClose?.(event)}
      closeIcon={
        <CloseIcon style={{ color: darkTheme ? '#fff' : '#000', width: 24, height: 24 }} />
      }
      bodyStyle={{ backgroundColor: darkTheme ? '#000' : undefined, ...bodyStyle }}
      headerStyle={{
        backgroundColor: darkTheme ? '#000' : undefined,
        ...headerStyle,
      }}
      className={`${styles.drawerContainer} ${className || ''}`}
      title={title}
      style={{
        transform: props.visible ? 'none' : undefined,
        ...style,
      }}
      {...props}
    />
  );
};

export const MobileDrawer: FC<
  CustomDrawerProps & { autoHeight?: boolean; noHeaderBorder?: boolean }
> = ({ noHeaderBorder, autoHeight, headerStyle, ...props }) => {
  const [height] = useState(autoHeight ? 'auto' : window.innerHeight - 48); // Prevent window.innerHeight changes

  return (
    <CustomDrawer
      placement="bottom"
      headerStyle={{
        position: 'relative',
        boxShadow: noHeaderBorder ? 'none' : undefined,
        ...headerStyle,
      }}
      height={height}
      {...props}
    />
  );
};

interface FilterDrawerProps extends DrawerProps {
  labelStyle?: CSSProperties;
}
export const FilterDrawer: FC<FilterDrawerProps> = ({ labelStyle, ...props }) => {
  return (
    <CustomDrawer
      placement="bottom"
      closable={false}
      height="auto"
      {...props}
      bodyStyle={{ padding: 0 }}
    />
  );
};
