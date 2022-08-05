import { ReactComponent as PaginationLeftIcon } from '@/assets/icons/pagination-left.svg';
import { ReactComponent as PaginationRightIcon } from '@/assets/icons/pagination-right.svg';
import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import styles from '../styles/table.less';
import { PaginationParams } from '../types';

export interface CustomPaginatorProps {
  fetchData: (params: PaginationParams) => void;
  pagination: TablePaginationConfig;
  dataLength: number;
  sorter: SorterResult<any> | SorterResult<any>[];
}

const CustomPaginator = (props: CustomPaginatorProps) => {
  const { fetchData, pagination, dataLength, sorter } = props;
  const currentPage = pagination.current ?? 1;
  const currentPageSize = pagination.pageSize ?? 1;
  const currentTotal = pagination.total ?? 0;
  let firstRecord = (currentPage - 1) * currentPageSize + 1;
  if (currentPage && dataLength === 0) {
    firstRecord = 0;
  }
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
export default CustomPaginator;
