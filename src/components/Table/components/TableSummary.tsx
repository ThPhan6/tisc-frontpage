import { Title, BodyText } from '@/components/Typography';
import classnames from 'classnames';
import type { ISummaryResponse } from '../types';
import styles from '../styles/table.less';

interface ITableSummary {
  summary: ISummaryResponse[];
}

const TableSummary = ({ summary }: ITableSummary) => {
  return (
    <div className={classnames(styles.customPaginator, styles.tableSummary)}>
      {summary.map((item, index) => (
        <div className="item" key={index}>
          <BodyText level={6} customClass="name" fontFamily="Roboto">
            {item.name}
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
