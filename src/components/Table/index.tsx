import { ReactNode, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Table } from 'antd';
import type { TablePaginationConfig } from 'antd/lib/table';
import type {
  ExpandableConfig,
  FilterValue,
  SortOrder,
  SorterResult,
} from 'antd/lib/table/interface';

import { useCustomTable } from './hooks';
import { useScreen } from '@/helper/common';
import { isArray, isEmpty, isNumber, isUndefined, reverse, uniqBy } from 'lodash';

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
  header?: ReactNode | string;
  multiSort?: {
    [key: string]: any;
  };
  hasPagination?: boolean;
  extraParams?: {
    [key: string]: any;
  };
  headerClass?: string;
  tableClass?: string;
  footerClass?: string;
  rowKey?: string;
  autoLoad?: boolean;
  onFilterLoad?: boolean;
  onRow?: GetComponentProps<any>;
  isActiveOnRow?: boolean;
  dynamicPageSize?: boolean;
  hasSummary?: boolean;
}

/// update order compared to BE
const converseOrder = (order: SortOrder | undefined) =>
  order ? (order === 'descend' ? 'ASC' : 'DESC') : undefined;

const CustomTable = forwardRef((props: CustomTableProps, ref: any) => {
  const {
    expandable,
    fetchDataFunc,
    title,
    header,
    rightAction,
    multiSort,
    hasPagination,
    extraParams,
    headerClass = '',
    tableClass = '',
    footerClass = '',
    onRow,
    isActiveOnRow,
    rowKey = 'id',
    autoLoad = true,
    onFilterLoad = true,
    dynamicPageSize,
    hasSummary,
  } = props;

  const DEFAULT_TABLE_ROW = 44;
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGESIZE = hasPagination ? 10 : 999999999999;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGESIZE,
    total: 0,
  });

  const tableSummaryRef = useRef<any>(null);
  const [tableSummaryWidth, setTableSummaryWidth] = useState<number>();
  const { isMobile } = useScreen();

  const { columns, expanded } = useCustomTable(props.columns);
  const [data, setData] = useState<any>([]);
  const [summary, setSummary] = useState<SummaryResponse[]>([]);
  const [currentSorter, setCurrentSorter] = useState<SorterResult<any> | SorterResult<any>[]>([]);
  const customExpandable = props.expandableConfig
    ? GetExpandableTableConfig(props.expandableConfig)
    : undefined;

  const getTablePaginationSize = (): number => {
    if (!dynamicPageSize) return DEFAULT_PAGESIZE;

    const headerLayout = document.querySelector('.ant-layout-header');
    const headerHeight = headerLayout?.clientHeight || 48;

    const paginationLayout = document.querySelector('.pagination-layout');
    const paginationHeight = paginationLayout?.clientHeight || 40;

    const marginSpace = isMobile ? 12 : 24;
    const tableHeaderHeight = 48;
    const tableThreadHeight = 36;
    const paddingBottom = 40;
    const totalHeight = tableHeaderHeight + tableThreadHeight + marginSpace + headerHeight;

    const tableTBodyHeight = window.innerHeight - totalHeight - paddingBottom - paginationHeight;

    return Number((tableTBodyHeight / DEFAULT_TABLE_ROW || DEFAULT_PAGESIZE).toFixed(0));
  };

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

    if (isEmpty(sorter)) {
      return paginationParams;
    }

    // Multiple sort
    if (isArray(sorter)) {
      const reverseSorter = uniqBy(reverse(sorter), 'column.sorter.multiple');

      reverseSorter.forEach((sort) => {
        if (sort?.field && multiSort) {
          paginationParams[multiSort[sort.field.toString()]] = converseOrder(sort?.order);
        }
      });
    } else {
      // Multiple sort for the first one but it is an object, not array
      if (isNumber((sorter as any)?.column?.sorter?.multiple) && sorter?.field && multiSort) {
        paginationParams[multiSort[sorter.field.toString()]] = converseOrder(sorter?.order);
      } else {
        // Normal sort
        paginationParams.sort = sorter?.field?.toString();
        paginationParams.order = converseOrder(sorter?.order);
      }
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
    if (!isUndefined(tableSummaryRef.current?.getTableSummaryWidth)) {
      setTableSummaryWidth(tableSummaryRef.current.getTableSummaryWidth());
    }
  }, [tableSummaryRef]);

  useEffect(() => {
    if (autoLoad) {
      const newPagination: TablePaginationConfig = {
        ...pagination,
        pageSize: getTablePaginationSize(),
      };

      fetchData({
        pagination: newPagination,
        sorter: currentSorter,
      });
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
      const lastestPagination = { ...newPagination, pageSize: getTablePaginationSize() };

      fetchData({
        pagination: lastestPagination,
        sorter,
        ...filters,
      });
    }
  };
  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(
    ref,
    () => {
      const newPagination: TablePaginationConfig = {
        ...pagination,
        pageSize: getTablePaginationSize(),
      };
      return {
        reload() {
          fetchData({
            pagination: newPagination,
            sorter: currentSorter,
            ...extraParams,
          });
        },

        reloadWithFilter(payload?: PaginationRequestParams) {
          fetchData({
            pagination: {
              ...newPagination,
              current: DEFAULT_PAGE_NUMBER,
            },
            sorter: currentSorter,
            ...extraParams,
            ...payload,
          });
        },
      };
    },

    [pagination.pageSize, extraParams],
  );

  const renderHeaderTable = () => {
    if (header) {
      return header;
    }

    if (title) {
      return <TableHeader title={title} rightAction={rightAction} customClass={headerClass} />;
    }

    return null;
  };

  return (
    <div
      className={`ttable-layout ${styles.customTable} ${
        customExpandable ? styles['sub-grid'] : ''
      }`}
    >
      {renderHeaderTable()}

      <Table
        className={tableClass}
        columns={columns}
        rowKey={rowKey}
        rowClassName={(record) => {
          if (record[rowKey] === expanded) {
            return `custom-expanded ${isActiveOnRow ? 'hover-on-row hover-table-on-row' : ''} ${
              onRow ? 'cursor-pointer hover-on-row' : ''
            } ` as any;
          }
          if (onRow) {
            return 'cursor-pointer hover-on-row';
          }
          return isActiveOnRow ? 'hover-on-row' : '';
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

      {hasPagination && pagination && !hasSummary ? (
        <CustomPaginator
          fetchData={fetchData}
          pagination={pagination}
          sorter={currentSorter}
          dataLength={data.length ?? 0}
          customClass={footerClass}
        />
      ) : !isEmpty(summary) ? (
        <TableSummary summary={summary} customClass={footerClass} />
      ) : null}

      {/* show both pagination and summary */}
      {hasPagination && pagination && hasSummary && !isEmpty(summary) ? (
        <div>
          <CustomPaginator
            fetchData={fetchData}
            pagination={pagination}
            sorter={currentSorter}
            dataLength={data.length ?? 0}
            customClass={footerClass}
            style={{
              width: `calc(100% - ${(tableSummaryWidth ? tableSummaryWidth : 252) - 48}px`,
              zIndex: 1,
            }}
          />

          <TableSummary
            ref={tableSummaryRef}
            summary={summary}
            customClass={footerClass}
            style={{ width: 'fit-content' }}
          />
        </div>
      ) : null}
    </div>
  );
});

export default CustomTable;
