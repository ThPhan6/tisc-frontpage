import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';

import { ReactComponent as PaginationLeftIcon } from '@/assets/icons/pagination-left.svg';
import { ReactComponent as PaginationRightIcon } from '@/assets/icons/pagination-right.svg';

import { useScreen } from '@/helper/common';

import { PaginationParams } from '../types';

import styles from '../styles/table.less';

export interface CustomPaginatorProps {
  fetchData: (params: PaginationParams) => void;
  pagination: TablePaginationConfig;
  dataLength: number;
  sorter: SorterResult<any> | SorterResult<any>[];
  customClass?: string;
}

const CustomPaginator = (props: CustomPaginatorProps) => {
  const { fetchData, pagination, dataLength, sorter, customClass = '' } = props;
  const currentPage = pagination.current ?? 1;
  const currentPageSize = pagination.pageSize ?? 1;
  const currentTotal = pagination.total ?? 0;
  let firstRecord = (currentPage - 1) * currentPageSize + 1;
  if (currentPage && dataLength === 0) {
    firstRecord = 0;
  }
  const lastRecord = (currentPage - 1) * currentPageSize + dataLength;

  const { isMobile } = useScreen();

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
    <div
      className={`pagination-layout ${styles.customPaginator} ${customClass} ${
        isMobile ? styles.mobilePagination : ''
      } ${pagination ? styles.paginationFixed : ''}`}
    >
      {renderLeftPaginator()}
      <div>
        <span>
          {firstRecord}-{lastRecord}
        </span>
        <span className="divider">/</span>
        <span>{pagination.total}</span>
      </div>
      {renderRightPaginator()}
    </div>
  );
};
export default CustomPaginator;
