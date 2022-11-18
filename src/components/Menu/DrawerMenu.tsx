import { CSSProperties, FC } from 'react';

import { Drawer, DrawerProps, Row } from 'antd';

import { MenuIconProps } from '../HeaderDropdown';
import { BodyText } from '../Typography';

interface Props extends DrawerProps {
  items: MenuIconProps[];
  labelStyle?: CSSProperties;
}
export const DrawerMenu: FC<Props> = ({ items, labelStyle, ...props }) => {
  return (
    <Drawer placement="bottom" closable={false} height="auto" {...props} bodyStyle={{ padding: 0 }}>
      {items.map((el) => (
        <Row
          align="middle"
          onClick={el.onClick}
          style={{ padding: '14px 26px', boxShadow: 'inset 0 -.7px 0 rgba(0,0,0,0.3)' }}>
          {el.icon}

          <BodyText fontFamily="Roboto" level={4} style={{ marginLeft: 26, ...labelStyle }}>
            {el.label}
          </BodyText>
        </Row>
      ))}
    </Drawer>
  );
};
