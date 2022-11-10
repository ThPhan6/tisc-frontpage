import { FC } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { Title } from '@/components/Typography';

import styles from '../index.less';

export const ServiceHeader: FC = ({ children }) => {
  return (
    <PageContainer
      pageHeaderRender={() => {
        return (
          <div className={styles.header}>
            <div
              style={{
                padding: '0 12px',
                boxShadow: 'inset 0.5px 0 0 rgba(0, 0, 0, 0.3)',
              }}>
              <Title level={8}>$650</Title>
              <Title level={9}>Grand Total</Title>
            </div>
          </div>
        );
      }}>
      {children}
    </PageContainer>
  );
};
