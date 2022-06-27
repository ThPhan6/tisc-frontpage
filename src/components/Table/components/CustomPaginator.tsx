import { ReactComponent as PaginationLeftIcon } from '@/assets/icons/pagination-left.svg';
import { ReactComponent as PaginationRightIcon } from '@/assets/icons/pagination-right.svg';
import type { ICustomPaginator } from '../types';
import styles from '../styles/table.less';

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
export default CustomPaginator;
