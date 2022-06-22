import { useState } from 'react';
import { Title, BodyText } from '@/components/Typography';
import { ReactComponent as SortIcon } from '@/assets/icons/sort-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import styles from '../styles/table.less';
import type { ColumnType } from 'antd/lib/table';
import type { ICustomTableColumnType, IExpended } from '../types';

export const useCustomTable = (columns: ICustomTableColumnType<any>[]) => {
  const [expended, setExpended] = useState<IExpended>();

  const expend = (index: IExpended) => {
    if (expended === index) setExpended(undefined);
    else setExpended(index);
  };
  const renderExpandedColumn = (value: any, record: any) => {
    if (!value) {
      return null;
    }
    const expendedKey = `${record.id}`;
    return (
      <div onClick={() => expend(expendedKey)} className={styles.expandedCell}>
        <span className={expendedKey === expended ? styles.expandedColumn : ''}>{value}</span>
        {expendedKey === expended ? <DropupIcon /> : <DropdownIcon />}
      </div>
    );
  };
  const formatTitleColumn = (column: ICustomTableColumnType<any>) => {
    return () => {
      return (
        <div className={styles.titleTable}>
          {column.lightHeading ? (
            <BodyText fontFamily="Roboto" level={5}>
              {column.title}
            </BodyText>
          ) : (
            <Title level={8}>{column.title}</Title>
          )}
          {column.sorter ? <SortIcon /> : null}
        </div>
      );
    };
  };

  const formatColumns = (): ColumnType<any>[] => {
    return columns.map((column) => {
      const noBoxShadow = column.noBoxShadow ? 'no-box-shadow' : '';
      const cellClassName = {
        props: {
          className: `${noBoxShadow}`,
        },
      };
      if (column.isExpandable === undefined || column.isExpandable !== true) {
        return {
          ...column,
          title: formatTitleColumn(column),
          render: (value: any, record: any, index: any) => {
            return {
              ...cellClassName,
              children: column.render ? column.render(value, record, index) : value,
            };
          },
        };
      }
      return {
        ...column,
        /* eslint-disable @typescript-eslint/no-unused-vars */
        render: (value: any, record: any, index: any) => {
          return {
            ...cellClassName,
            children: column.render
              ? column.render(value, record, index)
              : renderExpandedColumn(value, record),
          };
        },
        title: formatTitleColumn(column),
      };
    });
  };

  return {
    expended,
    columns: formatColumns(),
  };
};
