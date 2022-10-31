import React, { useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useCheckPermission } from '@/helper/hook';
import { formatPhoneCode, getValueByCondition, setDefaultWidthForEachColumn } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { LocationDetail } from '@/features/locations/type';

import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

import { deleteLocationById, getLocationPagination } from '@/features/locations/api';

const LocationTable: React.FC = () => {
  useAutoExpandNestedTableColumn(0);
  const tableRef = useRef<any>();

  const isTISCAdmin = useCheckPermission('TISC Admin');
  const isBrandAdmin = useCheckPermission('Brand Admin');
  const isDesignAdmin = useCheckPermission('Design Admin');
  /// for user role path
  const userCreateRolePath = getValueByCondition(
    [
      [isTISCAdmin, PATH.tiscLocationCreate],
      [isBrandAdmin, PATH.brandLocationCreate],
      [isDesignAdmin, PATH.designFirmLocationCreate],
    ],
    '',
  );
  const userUpdateRolePath = getValueByCondition(
    [
      [isTISCAdmin, PATH.tiscLocationUpdate],
      [isBrandAdmin, PATH.brandLocationUpdate],
      [isDesignAdmin, PATH.designFirmLocationUpdate],
    ],
    '',
  );

  const handleUpdateLocation = (id: string) => {
    pushTo(userUpdateRolePath.replace(':id', id));
  };
  const handleCreateLocation = () => {
    pushTo(userCreateRolePath);
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

  const mainColumns: TableColumnItem<LocationDetail>[] = [
    {
      title: 'Name',
      dataIndex: 'business_name',
      sorter: true,
    },
    {
      title: 'Functional Type',
      dataIndex: 'functional_type',
      sorter: true,
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
      render: (_v, record) => `${formatPhoneCode(record.phone_code ?? '')} ${record.general_phone}`,
    },
    {
      title: 'General Email',
      dataIndex: 'general_email',
    },
    {
      title: 'Teams',
      dataIndex: 'teams',
      align: 'center',
      width: '5%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value: any, record: any) => {
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateLocation(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteLocation(record.id),
              },
            ]}
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
        columns={setDefaultWidthForEachColumn(mainColumns, 5)}
        fetchDataFunc={getLocationPagination}
        hasPagination
      />
    </div>
  );
};

export default LocationTable;
