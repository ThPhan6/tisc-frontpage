import React, { useRef } from 'react';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableColumnItem } from '@/components/Table/types';
import { ILocationDetail } from '@/types';
import { getLocationPagination, deleteLocationById } from '@/services';
import { confirmDelete } from '@/helper/common';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { ActionMenu } from '@/components/Action';

const BrandLocation: React.FC = () => {
  const tableRef = useRef<any>();

  const handleUpdateLocation = (id: string) => {
    pushTo(PATH.brandLocationUpdate.replace(':id', id));
  };
  const handleCreateLocation = () => {
    pushTo(PATH.brandLocationCreate);
  };

  const handleDeleteLocation = (id: string) => {
    confirmDelete(() => {
      deleteLocationById(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const mainColumns: TableColumnItem<ILocationDetail>[] = [
    {
      title: 'Name',
      dataIndex: 'business_name',
      sorter: true,
    },
    {
      title: 'Functional Type',
      dataIndex: 'business_name',
      sorter: true,
      render: (_v, record) => {
        return record.functional_types[0]?.name ?? 'N/A';
      },
    },
    {
      title: 'Country',
      dataIndex: 'country_name',
      sorter: true,
    },
    {
      title: 'City/Town',
      dataIndex: 'city_name',
      sorter: true,
    },
    {
      title: 'General Phone',
      dataIndex: 'general_phone',
    },
    {
      title: 'General Email',
      dataIndex: 'general_email',
      width: '30%',
    },
    {
      title: 'Teams',
      dataIndex: 'teams',
      width: '5%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5px',
      render: (_value: any, record: any) => {
        return (
          <ActionMenu
            handleUpdate={() => handleUpdateLocation(record.id)}
            handleDelete={() => handleDeleteLocation(record.id)}
          />
        );
      },
    },
  ];
  return (
    <div>
      <CustomTable
        ref={tableRef}
        rightAction={<CustomPlusButton onClick={handleCreateLocation} />}
        title={'LOCATIONS'}
        columns={mainColumns}
        fetchDataFunc={getLocationPagination}
      />
    </div>
  );
};

export default BrandLocation;
