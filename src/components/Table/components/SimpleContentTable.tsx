import { CSSProperties, FC } from 'react';

import { Col, Row } from 'antd';

import { NameContentProps } from '@/pages/Designer/Products/CustomLibrary/types';

import styles from './SimpleContentTable.less';

export const SimpleContentTable: FC<{
  items: NameContentProps[];
  tdStyle?: CSSProperties;
  customClass?: string;
  flex?: '25-75' | '30-70';
  noPadding?: boolean;
}> = ({ items, tdStyle, customClass = '', flex = '25-75', noPadding }) => {
  return (
    <div className={`${styles.table} ${customClass} ${noPadding ? styles.noPadding : ''}`}>
      {items.map((item, index) => (
        <Row key={item.id || index}>
          <Col
            style={tdStyle}
            flex={flex == '25-75' ? '25%' : '30%'}
            className="text-overflow"
            title={item.name}>
            <span className="text-overflow">{item.name}</span>
          </Col>
          <Col
            style={tdStyle}
            flex={flex == '25-75' ? '75%' : '70%'}
            className="text-overflow"
            title={item.content}>
            <span className="text-overflow">{item.content}</span>
          </Col>
        </Row>
      ))}
    </div>
  );
};
