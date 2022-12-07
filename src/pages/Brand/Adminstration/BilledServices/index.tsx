import { useEffect, useRef } from 'react';

import { PATH } from '@/constants/path';

import { getServicesPagination } from '@/features/services/api';
import styles from '@/features/services/index.less';
import { InvoiceStatus, ServicesResponse } from '@/features/services/type';
import { checkShowBillingAmount } from '@/features/services/util';
import { pushTo } from '@/helper/history';
import { formatCurrencyNumber, getFullName } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';

import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';

import moment from 'moment';

const BilledServices = () => {
  const tableRef = useRef<any>();

  const handleViewService = (id: string) => {
    pushTo(PATH.brandBilledServicesView.replace(':id', id));
  };

  useEffect(() => {
    tableRef.current.reload();
  }, []);

  const MainColumns: TableColumnItem<ServicesResponse>[] = [
    {
      title: 'Billed Date',
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
      title: 'Ordered By',
      sorter: true,
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
            {formatCurrencyNumber(
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
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'view',
                onClick: () => handleViewService(record.id),
              },
            ]}
          />
        );
      },
    },
  ];
  return (
    <CustomTable
      columns={MainColumns}
      fetchDataFunc={getServicesPagination}
      hasPagination
      autoLoad={false}
      title="BILLED SERVICES"
      ref={tableRef}
    />
  );
};

export default BilledServices;
