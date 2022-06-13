import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Table } from 'antd';
import { Title, BodyText } from '@/components/Typography';
import { ReactComponent as SortIcon } from '@/assets/icons/sort-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as PaginationLeftIcon } from '@/assets/icons/pagination-left.svg';
import { ReactComponent as PaginationRightIcon } from '@/assets/icons/pagination-right.svg';
import type { ColumnsType, TablePaginationConfig, ColumnType } from 'antd/lib/table';
import type { SorterResult, ExpandableConfig } from 'antd/lib/table/interface';
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

export interface ICustomTableColumnsType extends ColumnsType {
  isExpandable?: boolean;
  noBoxShadow?: boolean;
  lightHeading?: boolean;
}

export interface ICustomTable {
  columns: ICustomTableColumnsType;
  expandable?: ExpandableConfig;
  rightAction?: React.ReactNode;
  fetchDataFunc: (
    params: TablePaginationConfig,
    callback: (data: IDataTableResponse) => void,
  ) => void;
  title: string;
}

export interface IExpandableTable {
  columns: ICustomTableColumnsType;
  childrenColumnName: string;
  expandable?: ExpandableConfig;
  level?: number;
}

interface ICustomPaginator {
  fetchData: (params: any) => void;
  pagination: TablePaginationConfig;
  dataLength: number;
}

const useCustomTable = (columns: ICustomTableColumnsType) => {
  const [expended, setExpended] = useState<number | undefined | string>();

  const expend = (index) => {
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
  const formatTitleColumn = (column: ColumnType) => {
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

  const formatColumns = () => {
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
              (value, _record, index) => {
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
        render: (value, _record, index) => {
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
  const firstRecord = dataLength ? (pagination.current - 1) * pagination.pageSize + 1 : 0;
  const lastRecord = (pagination.current - 1) * pagination.pageSize + dataLength;

  const renderLeftPaginator = () => {
    return (
      <PaginationLeftIcon
        className={pagination.current === 1 ? 'disabled' : ''}
        onClick={() => {
          if (pagination.current === 1) {
            return;
          }
          fetchData({
            page: pagination.current - 1,
            pageSize: pagination.pageSize,
          });
        }}
      />
    );
  };

  const renderRightPaginator = () => {
    return (
      <PaginationRightIcon
        className={pagination.total === lastRecord ? 'disabled' : ''}
        onClick={() => {
          if (pagination.total === lastRecord) {
            return;
          }
          fetchData({
            page: pagination.current + 1,
            pageSize: pagination.pageSize,
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
    filters: Record<string, FilterValue>,
    sorter: SorterResult<DataType>,
  ) => {
    console.log('newPagination', newPagination);
    fetchData({
      sortField: sorter.field as string,
      sortOrder: sorter.order as string,
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
        rowKey={(_record, index) => index}
        rowClassName={(_record, index) => {
          if (index === expended) {
            return 'custom-expanded';
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
        rowKey={(_expandableRecord, index) => {
          return index;
        }}
        rowClassName={level === 2 ? 'custom-expanded-level-2' : ''}
        tableLayout="fixed"
        expandable={expandable}
        dataSource={record[childrenColumnName]}
      />;
    },
  };
};

export default CustomTable;
