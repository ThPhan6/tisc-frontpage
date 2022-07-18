import type { TablePaginationConfig, ColumnType } from 'antd/lib/table';
import type { SorterResult, ExpandableConfig } from 'antd/lib/table/interface';

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
  sort?: string;
  order?: string;
  [key: string]: any;
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

export interface ICustomPaginator {
  fetchData: (params: IPaginationParams) => void;
  pagination: TablePaginationConfig;
  dataLength: number;
  sorter: SorterResult<any> | SorterResult<any>[];
}

export interface IPaginationResponse {
  page: number;
  page_count: number;
  page_size: number;
  total: number;
}

export interface ISummaryResponse {
  name: string;
  value: string | number;
}

export interface IDataTableResponse {
  data: any;
  pagination: TablePaginationConfig;
  summary?: ISummaryResponse[];
}

export type IExpended = number | undefined | string;
