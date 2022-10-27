import { ReactNode, forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { Table } from 'antd';
import type { TablePaginationConfig } from 'antd/lib/table';
import type { ExpandableConfig, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useCustomTable } from './hooks';
import { forEach, isArray, isEmpty } from 'lodash';

import type {
  DataTableResponse,
  PaginationParams,
  PaginationRequestParams,
  SummaryResponse,
  TableColumnItem,
} from './types';

import CustomPaginator from './components/CustomPaginator';
import TableSummary from './components/TableSummary';

import { TableHeader } from './TableHeader';
import styles from './styles/table.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

// start expandable table
interface ExpandableTableConfig {
  columns: TableColumnItem<any>[];
  childrenColumnName: string;
  subtituteChildrenColumnName?: string;
  expandable?: ExpandableConfig<any>;
  level?: number;
  rowKey?: string;
  gridView?: boolean | string;
  gridViewContentIndex?: string;
  renderGridContent?: (data: any) => ReactNode;
}

export const GetExpandableTableConfig = (props: ExpandableTableConfig): ExpandableConfig<any> => {
  const {
    expandable,
    childrenColumnName,
    subtituteChildrenColumnName,
    level,
    rowKey = 'id',
    gridView,
    gridViewContentIndex,
    renderGridContent,
  } = props;
  const { columns, expanded } = useCustomTable(props.columns);
  return {
    expandRowByClick: false,
    showExpandColumn: false,
    expandedRowRender: (record: any) => {
      if (
        gridView &&
        renderGridContent &&
        gridViewContentIndex &&
        record?.[gridViewContentIndex]?.length
      ) {
        return renderGridContent(record[gridViewContentIndex]);
      }

      return (
        <Table
          pagination={false}
          columns={columns}
          rowKey={rowKey}
          rowClassName={level && level > 1 ? `custom-expanded-level-${level}` : ''}
          tableLayout="auto"
          expandable={
            subtituteChildrenColumnName && record[subtituteChildrenColumnName]
              ? undefined
              : {
                  ...expandable,
                  expandedRowKeys: expanded ? [expanded] : undefined,
                }
          }
          dataSource={
            record[childrenColumnName] ||
            (subtituteChildrenColumnName ? record[subtituteChildrenColumnName] : [])
          }
        />
      );
    },
  };
};

type GetComponentProps<DataType> = (
  data: DataType,
  index?: number,
) => React.HTMLAttributes<any> | React.TdHTMLAttributes<any>;

export interface CustomTableProps {
  columns: TableColumnItem<any>[];
  expandable?: ExpandableConfig<any>;
  expandableConfig?: ExpandableTableConfig;
  rightAction?: React.ReactNode;
  fetchDataFunc: (
    params: PaginationRequestParams,
    callback: (data: DataTableResponse) => void,
  ) => void;
  title?: string;
  multiSort?: {
    [key: string]: any;
  };
  hasPagination?: boolean;
  extraParams?: {
    [key: string]: any;
  };
  customClass?: string;
  rowKey?: string;
  autoLoad?: boolean;
  onFilterLoad?: boolean;
  onRow?: GetComponentProps<any>;
}

const CustomTable = forwardRef((props: CustomTableProps, ref: any) => {
  const {
    expandable,
    fetchDataFunc,
    title,
    rightAction,
    multiSort,
    hasPagination,
    extraParams,
    customClass,
    onRow,
    rowKey = 'id',
    autoLoad = true,
    onFilterLoad = true,
  } = props;

  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGESIZE = hasPagination ? 10 : 999999999999;

  const { columns, expanded } = useCustomTable(props.columns);
  const [data, setData] = useState<any>([]);
  const [summary, setSummary] = useState<SummaryResponse[]>([]);
  const [currentSorter, setCurrentSorter] = useState<SorterResult<any> | SorterResult<any>[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGESIZE,
    total: 0,
  });
  const customExpandable = props.expandableConfig
    ? GetExpandableTableConfig(props.expandableConfig)
    : undefined;

  const formatPaginationParams = (params: PaginationParams) => {
    const { sorter, filter } = params;
    //show page number and return prev page when deleted last item in last page
    const haveOneRowLeft = Number(params.pagination.total) % DEFAULT_PAGESIZE === 1;
    const pageNumber =
      haveOneRowLeft && params.pagination.current !== 1
        ? Number(params.pagination.current) - 1
        : params.pagination.current ?? DEFAULT_PAGE_NUMBER;

    const paginationParams: PaginationRequestParams = {
      page: pageNumber,
      pageSize: params.pagination.pageSize ?? DEFAULT_PAGESIZE,
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
            const multiSortName = multiSort[item['field']];
            if (multiSortName) {
              paginationParams[multiSortName] = item['order'] === 'descend' ? 'DESC' : 'ASC';
            }
          });
        }
        return paginationParams;
      }
      /// normal case
      paginationParams.sort = sortName;
      paginationParams.order = sortOrder;
      return paginationParams;
    }
    return paginationParams;
  };

  const fetchData = (params: PaginationParams) => {
    showPageLoading();
    fetchDataFunc(formatPaginationParams(params), (response) => {
      setData(response.data ?? []);
      setSummary(response.summary ?? []);
      hidePageLoading();

      if (response.pagination) {
        setPagination(response.pagination);
      }
    });
  };

  useEffect(() => {
    if (autoLoad) {
      fetchData({ pagination, sorter: currentSorter });
    }
    // react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setCurrentSorter(sorter);
    if (onFilterLoad) {
      fetchData({
        pagination: newPagination,
        sorter,
        ...filters,
      });
    }
  };

  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    reload() {
      fetchData({ pagination, sorter: currentSorter });
    },
    reloadWithFilter() {
      fetchData({ pagination: {
        ...pagination,
        current: DEFAULT_PAGE_NUMBER,
        pageSize: DEFAULT_PAGESIZE
      }, sorter: currentSorter });
    },
  }));

  return (
    <div className={`${styles.customTable} ${customExpandable ? styles['sub-grid'] : ''}`}>
      {title ? (
        <TableHeader title={title} rightAction={rightAction} customClass={customClass || ''} />
      ) : null}

      <Table
        columns={columns}
        rowKey={rowKey}
        rowClassName={(record) => {
          if (record[rowKey] === expanded) {
            return 'custom-expanded' as any;
          }
          if (onRow) {
            return 'cursor-pointer';
          }
        }}
        onRow={onRow}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
        showSorterTooltip={false}
        sortDirections={['ascend', 'descend', 'ascend']}
        tableLayout="auto"
        scroll={{
          x: 'max-content',
        }}
        expandable={{
          ...(customExpandable ?? expandable),
          expandedRowKeys: expanded ? [expanded] : undefined,
        }}
      />

      {hasPagination && pagination ? (
        <CustomPaginator
          fetchData={fetchData}
          pagination={pagination}
          sorter={currentSorter}
          dataLength={data.length ?? 0}
        />
      ) : !isEmpty(summary) ? (
        <TableSummary summary={summary} />
      ) : null}
    </div>
  );
});

export default CustomTable;
