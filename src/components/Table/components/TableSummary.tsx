import { CSSProperties, FC, forwardRef, useImperativeHandle, useRef } from 'react';

import { useScreen } from '@/helper/common';

import type { SummaryResponse } from '../types';

import { BodyText, Title } from '@/components/Typography';

import styles from '../styles/table.less';

interface TableSummaryProps {
  summary: SummaryResponse[];
  customClass?: string;
  style?: CSSProperties;
}

const TableSummary: FC<TableSummaryProps> = forwardRef(
  ({ summary, customClass = '', style }, ref) => {
    const divRef = useRef<any>(null);

    const { isMobile } = useScreen();

    useImperativeHandle(
      ref,
      () => ({
        getTableSummaryWidth: () => divRef.current.clientWidth,
      }),
      [divRef],
    );

    return (
      <div
        className={`${styles.customPaginator} ${styles.tableSummary} ${customClass} ${
          isMobile ? styles.mobileSummary : ''
        }`}
        style={style}
      >
        <div
          ref={divRef}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
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
      </div>
    );
  },
);

export default TableSummary;
