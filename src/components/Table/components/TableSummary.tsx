import { FC } from 'react';

import type { SummaryResponse } from '../types';
import { NameContentProps } from '@/pages/Designer/Products/CustomLibrary/types';

import { BodyText, Title } from '@/components/Typography';

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

export const SimpleContentTable: FC<{ items: NameContentProps[] }> = ({ items }) => {
  const style = {
    backgroundColor: '#fff',
    padding: '8px 12px 8px 16px',
    borderBottom: '8px solid #e6e6e6',
    boxShadow: 'inset 0px -0.7px 0px rgba(0, 0, 0, 0.3)',
  };
  return (
    <table style={{ width: '100%', tableLayout: 'auto' }}>
      {items.map((item, index) => (
        <tr key={item.id || index}>
          <td style={{ ...style, width: '20%' }} className="text-overflow">
            {item.name}
          </td>
          <td style={{ ...style, width: '80%' }} className="text-overflow">
            {item.content}
          </td>
        </tr>
      ))}
    </table>
  );
};
