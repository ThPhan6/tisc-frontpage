import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableColumnItem } from '@/components/Table/types';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { Distributor } from '@/types/distributor.type';
import { useRef } from 'react';
import { deleteDistributor, getDistributorPagination } from '@/services/distributor.api';
import { confirmDelete } from '@/helper/common';
import { useAppSelector } from '@/reducers';
import { ActionMenu } from '@/components/Action';

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
        return (
          <span>
            {record.first_name} {record.last_name}
          </span>
        );
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
      width: '3%',
      render: (_value, record) => {
        return (
          <ActionMenu
            handleUpdate={() => handleUpdateDistributor(record.id)}
            handleDelete={() => handleDeleteDistributor(record.id)}
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
      />
    </>
  );
};

export default Distributors;
