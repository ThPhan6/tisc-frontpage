import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Table } from 'antd';
import { Title, BodyText } from '@/components/Typography';
import { ReactComponent as SortIcon } from '@/assets/icons/sort-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as PaginationLeftIcon } from '@/assets/icons/pagination-left.svg';
import { ReactComponent as PaginationRightIcon } from '@/assets/icons/pagination-right.svg';
import type { TablePaginationConfig, ColumnType } from 'antd/lib/table';
import type { SorterResult, ExpandableConfig, FilterValue } from 'antd/lib/table/interface';
import styles from './styles/table.less';

export interface Params {
  pagination?: TablePaginationConfig;
  sorter?: SorterResult<any> | SorterResult<any>[];
  total?: number;
  sortField?: string;
  sortOrder?: string;
}

export interface IDataTableResponse {
  data: any;
  pagination: TablePaginationConfig;
}

export interface ICustomTableColumnType<T> extends ColumnType<T> {
  isExpandable?: boolean;
  noBoxShadow?: boolean;
  lightHeading?: boolean;
}

export interface ICustomTable {
  columns: ICustomTableColumnType<any>[];
  expandable?: ExpandableConfig<any>;
  rightAction?: React.ReactNode;
  fetchDataFunc: (
    params: TablePaginationConfig,
    callback: (data: IDataTableResponse) => void,
  ) => void;
  title: string;
}

export interface IExpandableTable {
  columns: ICustomTableColumnType<any>[];
  childrenColumnName: string;
  expandable?: ExpandableConfig<any>;
  level?: number;
}

interface ICustomPaginator {
  fetchData: (params: any) => void;
  pagination: TablePaginationConfig;
  dataLength: number;
}

type IExpended = number | undefined | string;

const useCustomTable = (columns: ICustomTableColumnType<any>[]) => {
  const [expended, setExpended] = useState<IExpended>();

  const expend = (index: IExpended) => {
    if (expended === index) setExpended(undefined);
    else setExpended(index);
  };
  const renderExpandedColumn = (value: any, index: number) => {
    if (!value) {
      return null;
    }
    return (
      <div onClick={() => expend(index)} className={styles.expandedCell}>
        <span>{value}</span>
        {index === expended ? <DropupIcon /> : <DropdownIcon />}
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
          render: column.render
            ? column.render
            : /* eslint-disable @typescript-eslint/no-unused-vars */
              (value: any, _record: any) => {
                return {
                  ...cellClassName,
                  children: value,
                };
              },
        };
      }
      return {
        ...column,
        /* eslint-disable @typescript-eslint/no-unused-vars */
        render: (value: any, _record: any, index: any) => {
          return {
            ...cellClassName,
            children: column.render ? column.render : renderExpandedColumn(value, index),
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

const CustomPaginator = (props: ICustomPaginator) => {
  const { fetchData, pagination, dataLength } = props;
  const currentPage = pagination.current ?? 1;
  const currentPageSize = pagination.pageSize ?? 1;
  const currentTotal = pagination.total ?? 0;
  const firstRecord = dataLength ? (currentPage - 1) * currentPageSize + 1 : 0;
  const lastRecord = (currentPage - 1) * currentPageSize + dataLength;

  const renderLeftPaginator = () => {
    return (
      <PaginationLeftIcon
        className={currentPage === 1 ? 'disabled' : ''}
        onClick={() => {
          if (currentPage === 1) {
            return;
          }
          fetchData({
            page: currentPage - 1,
            pageSize: currentPageSize,
          });
        }}
      />
    );
  };

  const renderRightPaginator = () => {
    return (
      <PaginationRightIcon
        className={currentTotal === lastRecord ? 'disabled' : ''}
        onClick={() => {
          if (currentTotal === lastRecord) {
            return;
          }
          fetchData({
            page: currentPage + 1,
            pageSize: currentPageSize,
          });
        }}
      />
    );
  };

  return (
    <div className={styles.customPaginator}>
      {renderLeftPaginator()}
      <span>
        {firstRecord}-{lastRecord}
      </span>
      <span className="divider">/</span>
      <span>{pagination.total}</span>
      {renderRightPaginator()}
    </div>
  );
};

const CustomTable = forwardRef((props: ICustomTable, ref: any) => {
  const { expandable, fetchDataFunc, title, rightAction } = props;
  const { columns, expended } = useCustomTable(props.columns);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = (params: any) => {
    setLoading(true);
    fetchDataFunc(params, (response) => {
      setData(response.data);
      setLoading(false);
      setPagination(response.pagination);
    });
  };

  useEffect(() => {
    fetchData({
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
    // react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    // sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    fetchData({
      // sortField: sorter.field as string,
      // sortOrder: sorter.order as string,
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      ...filters,
    });
  };

  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    reload() {
      fetchData({
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
    },
  }));

  return (
    <div className={styles.customTable}>
      <div className={styles.tableHeader}>
        <Title level={7}>{title}</Title>
        <div>{rightAction}</div>
      </div>

      <Table
        columns={columns}
        rowKey={(_record, index) => `${index}`}
        rowClassName={(_record, index: IExpended) => {
          if (index === expended) {
            return 'custom-expanded' as any;
          }
        }}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        showSorterTooltip={false}
        tableLayout="fixed"
        scroll={{
          x: 'max-content',
        }}
        expandable={expandable}
      />
      {pagination ? (
        <CustomPaginator
          fetchData={fetchData}
          pagination={pagination}
          dataLength={data.length ?? 0}
        />
      ) : null}
    </div>
  );
});

// start expandable table

export const ExpandableTable = (props: IExpandableTable) => {
  const { expandable, childrenColumnName, level } = props;
  const { columns } = useCustomTable(props.columns);

  return {
    expandRowByClick: true,
    showExpandColumn: false,
    childrenColumnName: 'subs',
    expandedRowRender: (record: any) => {
      <Table
        showHeader={false}
        pagination={false}
        columns={columns}
        rowKey={(_expandableRecord, index) => `${index}`}
        rowClassName={level === 2 ? 'custom-expanded-level-2' : ''}
        tableLayout="fixed"
        expandable={expandable}
        dataSource={record[childrenColumnName]}
      />;
    },
  };
};

export default CustomTable;
