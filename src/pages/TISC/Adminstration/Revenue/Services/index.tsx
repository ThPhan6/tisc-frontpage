import { useEffect, useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { deleteService, getServicesPagination, getServicesSummary } from '@/features/services/api';
import { ServiceHeader } from '@/features/services/components/ServiceHeader';
import styles from '@/features/services/index.less';
import { InvoiceStatus, ServicesResponse } from '@/features/services/type';
import { checkShowBillingAmount, formatToMoneyValue } from '@/features/services/util';
import { confirmDelete, useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { getFullName, setDefaultWidthForEachColumn } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';

import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

import moment from 'moment';

const RevenueService = () => {
  useAutoExpandNestedTableColumn(0, [7]);

  const tableRef = useRef<any>();
  const { isTablet } = useScreen();

  const handleViewService = (id: string) => {
    pushTo(PATH.tiscRevenueServiceDetail.replace(':id', id));
  };

  const handleUpdateService = (id: string) => {
    pushTo(PATH.tiscRevenueServiceUpdate.replace(':id', id));
  };

  const handleDeleteService = (id: string) => {
    confirmDelete(() => {
      deleteService(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
          getServicesSummary();
        }
      });
    });
  };

  useEffect(() => {
    tableRef.current.reload();
  }, []);

  const mainColumns: TableColumnItem<ServicesResponse>[] = [
    {
      title: 'Date',
      sorter: true,
      dataIndex: 'created_at',
      render: (_value, record) => {
        return <span>{moment(record.created_at).format('YYYY-MM-DD')}</span>;
      },
    },
    {
      title: 'Service Type',
      sorter: true,
      dataIndex: 'service_type_name',
    },
    {
      title: 'Company Name',
      sorter: true,
      dataIndex: 'brand_name',
    },
    {
      title: 'Ordered By',
      dataIndex: 'ordered_by',
      render: (_value, record) => {
        return <span>{getFullName(record)}</span>;
      },
    },
    {
      title: 'Billing Number',
      dataIndex: 'name',
    },
    {
      title: 'Billed Amount',
      dataIndex: 'billing_amount',
      render: (_value, record) => {
        return (
          <span>
            $
            {formatToMoneyValue(
              checkShowBillingAmount(record)
                ? record.billing_amount + record.overdue_amount
                : record.billing_amount,
            )}
          </span>
        );
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      render: (_value, record) => {
        return <span>{record.due_date ? record.due_date : '-'}</span>;
      },
    },
    {
      title: 'Status',
      render: (_value, record) => {
        return (
          <span className={`${record.status === InvoiceStatus.Overdue ? styles.overdue : ''}`}>
            {InvoiceStatus[record.status]}
          </span>
        );
      },
    },
    {
      title: 'Action',
      width: '5%',
      align: 'center',
      render: (_value, record) => {
        const isPendingStatus = record.status !== InvoiceStatus.Pending;

        return (
          <ActionMenu
            actionItems={[
              {
                type: 'billing',
                onClick: () => handleViewService(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteService(record.id),
                disabled: isPendingStatus,
              },
              {
                type: 'updated',
                label: 'Edit/View',
                onClick: () => handleUpdateService(record.id),
                disabled: isPendingStatus,
              },
            ]}
          />
        );
      },
    },
  ];
  return (
    <ServiceHeader>
      <CustomTable
        columns={setDefaultWidthForEachColumn(mainColumns, 7)}
        fetchDataFunc={getServicesPagination}
        hasPagination
        autoLoad={false}
        title="SERVICES"
        ref={tableRef}
        rightAction={
          isTablet ? null : (
            <CustomPlusButton onClick={() => pushTo(PATH.tiscRevenueServiceCreate)} />
          )
        }
      />
    </ServiceHeader>
  );
};

export default RevenueService;
