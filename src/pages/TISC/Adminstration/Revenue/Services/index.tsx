import { useRef } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';

import { RevenueServiceResponse } from './type';
import { TableColumnItem } from '@/components/Table/types';

import { ServiceHeader } from './components/ServiceHeader';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
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
      title: 'Date',
      sorter: true,
    },
    {
      title: 'Service Type',
      sorter: true,
    },
    {
      title: 'Company Name',
      sorter: true,
    },
    {
      title: 'Ordered By',
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
    <ServiceHeader>
      <CustomTable
        columns={MainColumns}
        fetchDataFunc={() => {}}
        hasPagination
        autoLoad={false}
        title="SERVICES"
        ref={tableRef}
        rightAction={<CustomPlusButton onClick={() => pushTo(PATH.tiscRevenueServiceCreate)} />}
      />
    </ServiceHeader>
  );
};

export default RevenueService;
