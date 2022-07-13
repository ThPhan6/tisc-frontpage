import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Table } from 'antd';
// import { Title } from '@/components/Typography';
import { useCustomTable } from './hooks';
import { forEach, isArray, isEmpty } from 'lodash';
import CustomPaginator from './components/CustomPaginator';
import TableSummary from './components/TableSummary';
import type { TablePaginationConfig } from 'antd/lib/table';
import type { SorterResult, ExpandableConfig, FilterValue } from 'antd/lib/table/interface';
import type {
  IPaginationParams,
  IPaginationRequest,
  ICustomTable,
  IExpandableTable,
  ISummaryResponse,
} from './types';
import styles from './styles/table.less';
import { TableHeader } from './TableHeader';

const CustomTable = forwardRef((props: ICustomTable, ref: any) => {
  const { expandable, fetchDataFunc, title, rightAction, multiSort, hasPagination, extraParams } =
    props;

  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGESIZE = hasPagination ? 10 : 999999999999;

  const { columns, expended } = useCustomTable(props.columns);
  const [data, setData] = useState<any>([]);
  const [summary, setSummary] = useState<ISummaryResponse[]>([]);
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
      paginationParams.sort = sortName;
      paginationParams.order = sortOrder;
      return paginationParams;
    }
    return paginationParams;
  };

  const fetchData = (params: IPaginationParams) => {
    setLoading(true);
    fetchDataFunc(formatPaginationParams(params), (response) => {
      setData(response.data ?? []);
      setSummary(response.summary ?? []);
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
      <TableHeader title={title} rightAction={rightAction} />

      <Table
        columns={columns}
        rowKey="id"
        rowClassName={(record) => {
          if (record.id === expended) {
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
      ) : !isEmpty(summary) ? (
        <TableSummary summary={summary} />
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
          rowKey="id"
          rowClassName={level === 2 ? 'custom-expanded-level-2' : ''}
          tableLayout="auto"
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
