import { FC, memo } from 'react';

import { useScreen } from '@/helper/common';

import { Title } from '../Typography';
import styles from './styles/TableHeader.less';

interface TableHeaderProps {
  title: string | React.ReactNode;
  rightAction?: React.ReactNode;
  customClass?: string;
}

export const TableHeader: FC<TableHeaderProps> = memo(
  ({ title, rightAction, customClass = '' }) => {
    const { isMobile } = useScreen();
    return (
      <div className={`${styles.tableHeader} ${customClass}`}>
        <Title level={7} customClass="text-overflow">
          {title}
        </Title>
        <div
          className={`${styles.tableHeader__iconWrapper} rightAction`}
          style={{ width: isMobile && title === ' ' ? '100%' : '' }}
        >
          {rightAction}
        </div>
      </div>
    );
  },
);

export const MemorizeTableHeader = memo(TableHeader);
