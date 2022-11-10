import { useRef } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';

import { TableColumnItem } from '@/components/Table/types';
import { RevenueServiceResponse } from '@/pages/TISC/Adminstration/Revenue/Services/type';

import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';

const RevenueService = () => {
  const tableRef = useRef<any>();

  const handleViewService = (id: string) => {
    pushTo(PATH.tiscRevenueServiceDetail.replace(':id', id));
  };

  //   useEffect(() => {
  //     tableRef.current.reload();
  //   }, []);

  const MainColumns: TableColumnItem<RevenueServiceResponse>[] = [
    {
      title: 'Billed Date',
      sorter: true,
    },
    {
      title: 'Service Type',
      sorter: true,
    },
    {
      title: 'Ordered By',
      sorter: true,
    },
    {
      title: 'Billing Number',
    },
    {
      title: 'Billed Amount',
    },
    {
      title: 'Due Date',
    },
    {
      title: 'Status',
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
      fetchDataFunc={() => {}}
      hasPagination
      autoLoad={false}
      title="BILLED SERVICES"
      ref={tableRef}
    />
  );
};

export default RevenueService;
