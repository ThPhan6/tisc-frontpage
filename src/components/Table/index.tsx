import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Table } from 'antd';
import { Title, BodyText } from '@/components/Typography';
import { forEach, isArray, isEmpty } from 'lodash';
import { ReactComponent as SortIcon } from '@/assets/icons/sort-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as PaginationLeftIcon } from '@/assets/icons/pagination-left.svg';
import { ReactComponent as PaginationRightIcon } from '@/assets/icons/pagination-right.svg';
import type { TablePaginationConfig, ColumnType } from 'antd/lib/table';
import type { SorterResult, ExpandableConfig, FilterValue } from 'antd/lib/table/interface';
import styles from './styles/table.less';

export interface IPaginationParams {
  pagination: TablePaginationConfig;
  sorter?: SorterResult<any> | SorterResult<any>[];
  filter?: {
    [key: string]: any;
  };
}

export interface IPaginationRequest {
  page: number;
  pageSize: number;
  filter?: {
    [key: string]: any;
  };
  sort_name?: string;
  sort_order?: string;
  [key: string]: any;
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
  fetchDataFunc: (params: IPaginationRequest, callback: (data: IDataTableResponse) => void) => void;
  title: string;
  multiSort?: {
    [key: string]: any;
  };
  hasPagination?: boolean;
  extraParams?: {
    [key: string]: any;
  };
}

export interface IExpandableTable {
  columns: ICustomTableColumnType<any>[];
  childrenColumnName: string;
  expandable?: ExpandableConfig<any>;
  level?: number;
}

interface ICustomPaginator {
  fetchData: (params: IPaginationParams) => void;
  pagination: TablePaginationConfig;
  dataLength: number;
  sorter: SorterResult<any> | SorterResult<any>[];
}

type IExpended = number | undefined | string;

const useCustomTable = (columns: ICustomTableColumnType<any>[]) => {
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
        render: (value: any, record: any) => {
          return {
            ...cellClassName,
            children: column.render ? column.render : renderExpandedColumn(value, record),
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
  const { fetchData, pagination, dataLength, sorter } = props;
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
            pagination: {
              current: currentPage - 1,
              pageSize: currentPageSize,
            },
            sorter,
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
            pagination: {
              current: currentPage + 1,
              pageSize: currentPageSize,
            },
            sorter,
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
  const { expandable, fetchDataFunc, title, rightAction, multiSort, hasPagination, extraParams } =
    props;

  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGESIZE = hasPagination ? 10 : 999999999999;

  const { columns, expended } = useCustomTable(props.columns);
  const [data, setData] = useState<any>([]);
  const [currentSorter, setCurrentSorter] = useState<SorterResult<any> | SorterResult<any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGESIZE,
    total: 0,
  });

  const formatPaginationParams = (params: IPaginationParams) => {
    const { sorter, filter } = params;
    const paginationParams: IPaginationRequest = {
      page: data.pagination?.current ?? DEFAULT_PAGE_NUMBER,
      pageSize: data.pagination?.pageSize ?? DEFAULT_PAGESIZE,
      ...extraParams,
    };
    /// if enable filter
    if (filter) {
      paginationParams.filter = filter;
    }
    if (sorter && !isEmpty(sorter)) {
      // if enable sorter
      let sortName: any = '';
      let sortOrder: any = '';
      ///
      if (!isArray(sorter)) {
        console.log('go here');
        sortName = sorter.field;
        sortOrder = sorter.order === 'descend' ? 'DESC' : 'ASC';
      }
      ///
      if (multiSort) {
        // if enable multiple sorter
        if (!isArray(sorter)) {
          paginationParams[multiSort[sortName]] = sortOrder;
        } else {
          forEach(sorter, (item: any) => {
            paginationParams[multiSort[item['field']]] =
              item['order'] === 'descend' ? 'DESC' : 'ASC';
          });
        }
        return paginationParams;
      }
      /// normal case
      paginationParams.sort_name = sortName;
      paginationParams.sort_order = sortOrder;
      return paginationParams;
    }
    return paginationParams;
  };

  const fetchData = (params: IPaginationParams) => {
    setLoading(true);
    fetchDataFunc(formatPaginationParams(params), (response) => {
      setData(response.data);
      setLoading(false);
      setPagination(response.pagination);
    });
  };

  useEffect(() => {
    fetchData({ pagination, sorter: currentSorter });
    // react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setCurrentSorter(sorter);
    fetchData({
      pagination: newPagination,
      sorter,
      ...filters,
    });
  };

  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    reload() {
      fetchData({ pagination, sorter: currentSorter });
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
        rowKey="id"
        rowClassName={(record) => {
          if (record.id === expended) {
            return 'custom-expanded' as any;
          }
        }}
        dataSource={data}
        pagination={hasPagination ? pagination : undefined}
        loading={loading}
        onChange={handleTableChange}
        showSorterTooltip={false}
        sortDirections={['ascend', 'descend', 'ascend']}
        tableLayout="fixed"
        scroll={{
          x: 'max-content',
        }}
        expandable={{
          ...expandable,
          expandedRowKeys: expended ? [expended] : undefined,
        }}
      />
      {hasPagination && pagination ? (
        <CustomPaginator
          fetchData={fetchData}
          pagination={pagination}
          sorter={currentSorter}
          dataLength={data.length ?? 0}
        />
      ) : null}
    </div>
  );
});

// start expandable table

export const GetExpandableTableConfig = (props: IExpandableTable): ExpandableConfig<any> => {
  const { expandable, childrenColumnName, level } = props;
  const { columns, expended } = useCustomTable(props.columns);

  return {
    expandRowByClick: false,
    showExpandColumn: false,
    expandedRowRender: (record: any) => {
      return (
        <Table
          pagination={false}
          columns={columns}
          scroll={{
            x: 'max-content',
          }}
          rowKey="id"
          rowClassName={level === 2 ? 'custom-expanded-level-2' : ''}
          tableLayout="fixed"
          expandable={{
            ...expandable,
            expandedRowKeys: expended ? [expended] : undefined,
          }}
          dataSource={record[childrenColumnName]}
        />
      );
    },
  };
};

export default CustomTable;
