import type { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import type { SorterResult } from 'antd/lib/table/interface';

export interface PaginationParams {
  pagination: TablePaginationConfig;
  sorter?: SorterResult<any> | SorterResult<any>[];
  filter?: {
    [key: string]: any;
  };
}

export interface PaginationRequestParams {
  page: number;
  pageSize: number;
  filter?: {
    [key: string]: any;
  };
  sort?: string;
  order?: string;
  [key: string]: any;
}

export interface TableColumnItem<T> extends ColumnType<T> {
  isExpandable?: boolean;
  noBoxShadow?: boolean;
  lightHeading?: boolean;
}

export interface PaginationResponse {
  page: number;
  page_count: number;
  page_size: number;
  total: number;
}

export interface SummaryResponse {
  name: string;
  value: string | number;
}

export interface DataTableResponse {
  data: any;
  pagination: TablePaginationConfig;
  summary?: SummaryResponse[];
}

export type GetDataListResponse = {
  pagination: PaginationResponse;
  summary: SummaryResponse[];
};
