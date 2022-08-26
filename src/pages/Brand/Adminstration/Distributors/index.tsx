import { useRef } from 'react';

import { PATH } from '@/constants/path';

import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { getFullName } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { Distributor } from '@/features/distributors/type';
import { useAppSelector } from '@/reducers';

import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

import { deleteDistributor, getDistributorPagination } from '@/features/distributors/api';

const Distributors = () => {
  const tableRef = useRef<any>();
  const user = useAppSelector((state) => state.user.user);

  const handleUpdateDistributor = (id: string) => {
    pushTo(PATH.updateDistributor.replace(':id', id));
  };

  const handleDeleteDistributor = (id: string) => {
    confirmDelete(() => {
      deleteDistributor(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const MainColumns: TableColumnItem<Distributor>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      width: 168,
    },
    {
      title: 'Country',
      dataIndex: 'country_name',
      sorter: true,
      width: 101,
    },
    {
      title: 'City',
      dataIndex: 'city_name',
      sorter: true,
      width: 113,
    },
    {
      title: 'Contact Person',
      dataIndex: 'first_name',
      width: 125,
      render: (_value, record) => {
        return <span>{getFullName(record)}</span>;
      },
    },
    {
      title: 'Work email',
      dataIndex: 'email',
      width: 206,
    },
    {
      title: 'Authorised Country',
      dataIndex: 'authorized_country_name',
      width: 235,
    },
    {
      title: 'Coverage Beyond',
      dataIndex: 'coverage_beyond',
      width: 138,
      render: (value) => {
        return <span>{value === true ? 'Not Allow' : 'Allow'}</span>;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value, record) => {
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateDistributor(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteDistributor(record.id),
              },
            ]}
          />
        );
      },
    },
  ];

  if (!user?.brand) {
    return null;
  }
  return (
    <>
      <CustomTable
        rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createDistributor)} />}
        title="DISTRIBUTORS"
        columns={MainColumns}
        ref={tableRef}
        fetchDataFunc={getDistributorPagination}
        extraParams={{
          brand_id: user.brand.id,
        }}
        hasPagination
      />
    </>
  );
};

export default Distributors;
