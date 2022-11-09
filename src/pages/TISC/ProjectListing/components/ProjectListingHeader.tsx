import { FC, useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { ProjectListingSummary } from '../type';

import { MenuSummary } from '@/components/MenuSummary';
import { BodyText } from '@/components/Typography';

import { getProjectListingSummary } from '../api';
import styles from '../index.less';

export const ProjectListingHeader: FC = ({ children }) => {
  const [summaryData, setSummaryData] = useState<ProjectListingSummary>({
    data: [],
    area: { metric: 0, imperial: 0 },
  });

  useEffect(() => {
    getProjectListingSummary().then((res) => {
      if (res) {
        setSummaryData(res);
      }
    });
  }, []);

  return (
    <PageContainer
      pageHeaderRender={() => {
        return (
          <div className={styles.customHeader}>
            <MenuSummary menuSummaryData={summaryData.data} typeMenu="brand" />
            <div className={styles.rightMenu}>
              <div style={{ padding: '0 12px', marginRight: '12px' }}>
                <BodyText fontFamily="Roboto" level={5}>
                  {summaryData.area.metric}
                </BodyText>
                <BodyText fontFamily="Roboto" level={6}>
                  Total sq.m.
                </BodyText>
              </div>
              <div style={{ padding: '0 12px' }}>
                <BodyText fontFamily="Roboto" level={5}>
                  {summaryData.area.imperial}
                </BodyText>
                <BodyText fontFamily="Roboto" level={6}>
                  Total sq.ft.
                </BodyText>
              </div>
            </div>
          </div>
        );
      }}>
      {children}
    </PageContainer>
  );
};
