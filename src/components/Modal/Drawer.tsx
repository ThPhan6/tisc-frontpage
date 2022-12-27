import { FC, useEffect } from 'react';

import { Drawer, DrawerProps } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';

import { useAppSelector } from '@/reducers';

import styles from './styles/index.less';

interface CustomDrawerProps extends DrawerProps {
  closeOnMask?: boolean; // Use when children content overlap drawer mask, click outside could not close drawer
}
export const CustomDrawer: FC<CustomDrawerProps> = ({
  closeOnMask,
  bodyStyle,
  headerStyle,
  onClose,
  ...props
}) => {
  const darkTheme = useAppSelector((state) => state.modal.theme === 'dark');

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
        borderRadius: 0,
        ...headerStyle,
      }}
      className={styles.drawerContainer}
      {...props}
    />
  );
};
