import { FC, useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { formatNumberDisplay } from '@/helper/utils';

import { Title } from '@/components/Typography';

import { getServicesSummary } from '../api';
import styles from '../index.less';

export const ServiceHeader: FC = ({ children }) => {
  const [summaryData, setSummaryData] = useState<{ grandTotal: number }>({ grandTotal: 0 });

  useEffect(() => {
    getServicesSummary().then((res) => {
      if (res) {
        setSummaryData(res);
      }
    });
  }, []);

  return (
    <PageContainer
      pageHeaderRender={() => {
        return (
          <div className={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  padding: '0 12px',
                }}>
                <Title level={8}>${formatNumberDisplay(summaryData.grandTotal)}</Title>
                <Title level={9}>Offline Marketing & Sales</Title>
              </div>
              <div
                style={{
                  padding: '0 12px',
                  boxShadow: 'inset 0.5px 0 0 rgba(0, 0, 0, 0.3)',
                }}>
                <Title level={8}>${formatNumberDisplay(summaryData.grandTotal)}</Title>
                <Title level={9}>Online Marketing & Sales</Title>
              </div>
              <div
                style={{
                  padding: '0 12px',
                  boxShadow: 'inset 0.5px 0 0 rgba(0, 0, 0, 0.3)',
                }}>
                <Title level={8}>${formatNumberDisplay(summaryData.grandTotal)}</Title>
                <Title level={9}>Product Card Conversion</Title>
              </div>
            </div>
            <div
              style={{
                padding: '0 12px',
                boxShadow: 'inset 0.5px 0 0 rgba(0, 0, 0, 0.3)',
              }}>
              <Title level={8}>${formatNumberDisplay(summaryData.grandTotal)}</Title>
              <Title level={9}>Grand Total</Title>
            </div>
          </div>
        );
      }}>
      {children}
    </PageContainer>
  );
};
