import { CSSProperties, FC } from 'react';

import { DrawerProps, Row } from 'antd';

import { MenuIconProps } from '../HeaderDropdown';
import { CustomDrawer } from '../Modal/Drawer';
import { BodyText } from '../Typography';

interface Props extends DrawerProps {
  items: MenuIconProps[];
  labelStyle?: CSSProperties;
}
export const DrawerMenu: FC<Props> = ({ items, labelStyle, ...props }) => {
  return (
    <CustomDrawer
      placement="bottom"
      closable={false}
      height="auto"
      {...props}
      bodyStyle={{ padding: 0 }}>
      {items.map((el, index) => (
        <Row
          key={index}
          align="middle"
          onClick={el.onClick}
          style={{ padding: '12px 24px', boxShadow: 'inset 0 -.7px 0 rgba(0,0,0,0.3)' }}>
          {el.icon}

          <BodyText fontFamily="Roboto" level={4} style={{ marginLeft: 24, ...labelStyle }}>
            {el.label}
          </BodyText>
        </Row>
      ))}
    </CustomDrawer>
  );
};
