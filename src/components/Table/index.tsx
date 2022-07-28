import { useEffect, useState, useImperativeHandle, forwardRef, ReactNode } from 'react';
import { Table } from 'antd';
import { useCustomTable } from './hooks';
import { forEach, isArray, isEmpty } from 'lodash';
import CustomPaginator from './components/CustomPaginator';
import TableSummary from './components/TableSummary';
import type { TablePaginationConfig } from 'antd/lib/table';
import type { SorterResult, ExpandableConfig, FilterValue } from 'antd/lib/table/interface';
import type {
  PaginationParams,
  PaginationRequestParams,
  SummaryResponse,
  TableColumnItem,
  DataTableResponse,
} from './types';
import styles from './styles/table.less';
import { TableHeader } from './TableHeader';

// start expandable table
interface ExpandableTableConfig {
  columns: TableColumnItem<any>[];
  childrenColumnName: string;
  expandable?: ExpandableConfig<any>;
  level?: number;
  rowKey?: string;
  gridView?: boolean;
  renderSubContent?: (data: any) => ReactNode;
}

export const GetExpandableTableConfig = (
  props: ExpandableTableConfig,
  data?: any,
): ExpandableConfig<any> => {
  const {
    expandable,
    childrenColumnName,
    level,
    rowKey = 'id',
    gridView,
    renderSubContent,
  } = props;
  const { columns, expanded } = useCustomTable(props.columns);
  return {
    expandRowByClick: false,
    showExpandColumn: false,
    expandedRowRender: (record: any, index: number) => {
      if (gridView && renderSubContent) {
        return renderSubContent(data[index]);
      }
      return (
        <Table
          pagination={false}
          columns={columns}
          rowKey={rowKey}
          rowClassName={level === 2 ? 'custom-expanded-level-2' : ''}
          tableLayout="auto"
          expandable={{
            ...expandable,
            expandedRowKeys: expanded ? [expanded] : undefined,
          }}
          dataSource={record[childrenColumnName]}
        />
      );
    },
  };
};

export interface CustomTableProps {
  columns: TableColumnItem<any>[];
  expandable?: ExpandableConfig<any>;
  expandableConfig?: ExpandableTableConfig;
  rightAction?: React.ReactNode;
  fetchDataFunc: (
    params: PaginationRequestParams,
    callback: (data: DataTableResponse) => void,
  ) => void;
  title: string;
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
    rowKey = 'id',
    autoLoad = true,
  } = props;

  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGESIZE = hasPagination ? 10 : 999999999999;

  const { columns, expanded } = useCustomTable(props.columns);
  const [data, setData] = useState<any>([]);
  const [summary, setSummary] = useState<SummaryResponse[]>([]);
  const [currentSorter, setCurrentSorter] = useState<SorterResult<any> | SorterResult<any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGESIZE,
    total: 0,
  });
  const customExpandable = props.expandableConfig
    ? GetExpandableTableConfig(props.expandableConfig, data)
    : undefined;

  const formatPaginationParams = (params: PaginationParams) => {
    const { sorter, filter } = params;
    const paginationParams: PaginationRequestParams = {
      page: params.pagination.current ?? DEFAULT_PAGE_NUMBER,
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
            paginationParams[multiSort[item['field']]] =
              item['order'] === 'descend' ? 'DESC' : 'ASC';
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
    setLoading(true);
    fetchDataFunc(formatPaginationParams(params), (response) => {
      setData(response.data ?? []);
      setSummary(response.summary ?? []);
      setLoading(false);
      setPagination(response.pagination);
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
    <div className={`${styles.customTable} ${customExpandable ? styles['sub-grid'] : ''}`}>
      <TableHeader
        title={title}
        rightAction={rightAction}
        customClass={customClass ? customClass : ''}
      />

      <Table
        columns={columns}
        rowKey={rowKey}
        rowClassName={(record) => {
          if (record[rowKey] === expanded) {
            return 'custom-expanded' as any;
          }
        }}
        dataSource={data}
        pagination={pagination}
        loading={loading}
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
