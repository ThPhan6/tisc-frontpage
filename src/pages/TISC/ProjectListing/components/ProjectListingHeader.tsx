import { FC, useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { formatNumber } from '@/helper/utils';

import { ProjectListingSummary } from '../type';

import { MenuSummary } from '@/components/MenuSummary';

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
          <MenuSummary
            menuSummaryData={summaryData.data}
            typeMenuData={[
              { id: '1', quantity: formatNumber(summaryData.area.metric), label: 'Total sq.m.' },
              {
                id: '2',
                quantity: formatNumber(summaryData.area.imperial),
                label: 'Total sq.ft.',
              },
            ]}
            typeMenu="project"
            containerClass={styles.customHeader}
          />
        );
      }}
    >
      {children}
    </PageContainer>
  );
};
