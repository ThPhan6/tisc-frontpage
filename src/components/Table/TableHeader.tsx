import classNames from 'classnames';
import { FC } from 'react';
import { Title } from '../Typography';
import styles from './styles/TableHeader.less';

interface TableHeaderProps {
  title: string;
  rightAction?: React.ReactNode;
  customClass?: string;
}

export const TableHeader: FC<TableHeaderProps> = ({ title, rightAction, customClass }) => {
  return (
    <div className={classNames(styles.tableHeader, customClass)}>
      <Title level={7}>{title}</Title>
      <div className={styles.tableHeader__iconWrapper}>{rightAction}</div>
    </div>
  );
};
