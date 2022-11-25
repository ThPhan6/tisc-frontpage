import { FC, useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { formatNumberDisplay } from '@/helper/utils';

import { SummaryService } from '../type';

import { Title } from '@/components/Typography';

import { getServicesSummary } from '../api';
import styles from '../index.less';

export const ServiceHeader: FC = ({ children }) => {
  const [summaryData, setSummaryData] = useState<SummaryService>({
    grandTotal: 0,
    offline_marketing_sale: 0,
    online_marketing_sale: 0,
    product_card_conversion: 0,
    others: 0,
  });

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
                <Title level={8}>${formatNumberDisplay(summaryData.offline_marketing_sale)}</Title>
                <Title level={9}>Offline Marketing & Sales</Title>
              </div>
              <div className={styles.summary}>
                <Title level={8}>${formatNumberDisplay(summaryData.online_marketing_sale)}</Title>
                <Title level={9}>Online Marketing & Sales</Title>
              </div>
              <div className={styles.summary}>
                <Title level={8}>${formatNumberDisplay(summaryData.product_card_conversion)}</Title>
                <Title level={9}>Product Card Conversion</Title>
              </div>
              <div className={styles.summary}>
                <Title level={8}>${formatNumberDisplay(summaryData.others)}</Title>
                <Title level={9}>Others</Title>
              </div>
            </div>
            <div className={styles.summary}>
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
