import { FC, useEffect } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { formatCurrencyNumber } from '@/helper/utils';

import { useAppSelector } from '@/reducers';

import { Title } from '@/components/Typography';

import { getServicesSummary } from '../api';
import styles from '../index.less';

export const ServiceHeader: FC = ({ children }) => {
  const summaryData = useAppSelector((state) => state.service.summaryServices);

  useEffect(() => {
    getServicesSummary();
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
                <Title level={8}>
                  $
                  {formatCurrencyNumber(summaryData.offline_marketing_sale, 'en-us', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Title>
                <Title level={9}>Offline Marketing & Sales</Title>
              </div>
              <div className={styles.summary}>
                <Title level={8}>
                  $
                  {formatCurrencyNumber(summaryData.online_marketing_sale, 'en-us', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Title>
                <Title level={9}>Online Marketing & Sales</Title>
              </div>
              <div className={styles.summary}>
                <Title level={8}>
                  $
                  {formatCurrencyNumber(summaryData.product_card_conversion, 'en-us', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Title>
                <Title level={9}>Product Card Conversion</Title>
              </div>
              <div className={styles.summary}>
                <Title level={8}>
                  $
                  {formatCurrencyNumber(summaryData.others, 'en-us', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Title>
                <Title level={9}>Others</Title>
              </div>
            </div>
            <div className={styles.summary}>
              <Title level={8}>
                $
                {formatCurrencyNumber(summaryData.grandTotal, 'en-us', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Title>
              <Title level={9}>Grand Total</Title>
            </div>
          </div>
        );
      }}>
      {children}
    </PageContainer>
  );
};
