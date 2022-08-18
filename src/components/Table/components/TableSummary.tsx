import { Title, BodyText } from '@/components/Typography';
import type { SummaryResponse } from '../types';
import styles from '../styles/table.less';

interface TableSummaryProps {
  summary: SummaryResponse[];
}

const TableSummary = ({ summary }: TableSummaryProps) => {
  return (
    <div className={`${styles.customPaginator} ${styles.tableSummary}`}>
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
