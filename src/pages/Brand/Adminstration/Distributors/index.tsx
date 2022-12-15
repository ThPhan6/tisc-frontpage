import { useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { getFullName, setDefaultWidthForEachColumn } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { Distributor } from '@/features/distributors/type';
import { useAppSelector } from '@/reducers';

import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

import { deleteDistributor, getDistributorPagination } from '@/features/distributors/api';

const Distributors = () => {
  useAutoExpandNestedTableColumn(0, [5]);
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

  const mainColumns: TableColumnItem<Distributor>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Country',
      dataIndex: 'country_name',
      sorter: true,
    },
    {
      title: 'City',
      dataIndex: 'city_name',
      sorter: true,
    },
    {
      title: 'Contact Person',
      dataIndex: 'first_name',
      render: (_value, record) => {
        return <span>{getFullName(record)}</span>;
      },
    },
    {
      title: 'Work email',
      dataIndex: 'email',
    },
    {
      title: 'Authorised Country',
      dataIndex: 'authorized_country_name',
    },
    {
      title: 'Coverage Beyond',
      dataIndex: 'coverage_beyond',
      render: (value) => {
        return <span>{value === true ? 'Allow' : 'Not Allow'}</span>;
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
        columns={setDefaultWidthForEachColumn(mainColumns, 5)}
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
