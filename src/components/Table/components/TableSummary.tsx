import { useScreen } from '@/helper/common';

import type { SummaryResponse } from '../types';

import { BodyText, Title } from '@/components/Typography';

import styles from '../styles/table.less';

interface TableSummaryProps {
  summary: SummaryResponse[];
  customClass?: string;
}

const TableSummary = ({ summary, customClass = '' }: TableSummaryProps) => {
  const { isMobile } = useScreen();

  return (
    <div
      className={`${styles.customPaginator} ${styles.tableSummary} ${customClass} ${
        isMobile ? styles.mobileSummary : ''
      }`}>
      {summary.map((item, index) => (
        <div className="item" key={index}>
          <BodyText level={6} customClass="name" fontFamily="Roboto">
            {item.name}
            {item.name.indexOf(':') !== -1 ? '' : ':'}
          </BodyText>
          <Title level={9} customClass="value">
            {item.value}
          </Title>
        </div>
      ))}
    </div>
  );
};
export default TableSummary;
