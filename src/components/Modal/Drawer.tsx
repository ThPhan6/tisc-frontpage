import { FC, useEffect } from 'react';

import { Drawer, DrawerProps } from 'antd';

interface CustomDrawerProps extends DrawerProps {
  closeOnMask?: boolean; // Use when children content overlap drawer mask, click outside could not close drawer
}
export const CustomDrawer: FC<CustomDrawerProps> = ({
  closeOnMask,
  bodyStyle,
  onClose,
  ...props
}) => {
  useEffect(() => {
    if (props.visible === false || !closeOnMask) {
      return;
    }
    setTimeout(() => {
      const drawerMask = document.getElementsByClassName('ant-drawer-content-wrapper');
      console.log('drawerMask', drawerMask);
      drawerMask[0]?.addEventListener('click', (event: any) => {
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
      onClose={(event) => {
        onClose?.(event);
      }}
      {...props}
      bodyStyle={{ padding: 0, ...bodyStyle }}
    />
  );
};
