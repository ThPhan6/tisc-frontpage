import { FC, useEffect } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { useScreen } from '@/helper/common';

import { useAppSelector } from '@/reducers';

import { Title } from '@/components/Typography';

import { getServicesSummary } from '../api';
import styles from '../index.less';
import { formatToMoneyValue } from '../util';

export const ServiceHeader: FC = ({ children }) => {
  const summaryData = useAppSelector((state) => state.service.summaryServices);
  const { isMobile } = useScreen();
  useEffect(() => {
    getServicesSummary();
  }, []);

  return (
    <PageContainer
      pageHeaderRender={() => {
        return (
          <div className={`${styles.header} ${isMobile ? 'border-top' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  padding: '0 12px',
                }}>
                <Title level={8}>${formatToMoneyValue(summaryData.offline_marketing_sale)}</Title>
                <Title level={9} style={{ whiteSpace: 'nowrap' }}>
                  Offline Marketing & Sales
                </Title>
              </div>
              <div className={styles.summary}>
                <Title level={8}>${formatToMoneyValue(summaryData.online_marketing_sale)}</Title>
                <Title level={9} style={{ whiteSpace: 'nowrap' }}>
                  Online Marketing & Sales
                </Title>
              </div>
              <div className={styles.summary}>
                <Title level={8}>${formatToMoneyValue(summaryData.product_card_conversion)}</Title>
                <Title level={9} style={{ whiteSpace: 'nowrap' }}>
                  Product Card Conversion
                </Title>
              </div>
              <div className={styles.summary}>
                <Title level={8}>${formatToMoneyValue(summaryData.others)}</Title>
                <Title level={9} style={{ whiteSpace: 'nowrap' }}>
                  Others
                </Title>
              </div>
            </div>
            <div className={styles.summary}>
              <Title level={8}>${formatToMoneyValue(summaryData.grandTotal)}</Title>
              <Title level={9} style={{ whiteSpace: 'nowrap' }}>
                Grand Total
              </Title>
            </div>
          </div>
        );
      }}>
      {children}
    </PageContainer>
  );
};
