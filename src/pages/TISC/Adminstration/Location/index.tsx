import React, { useRef } from 'react';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import CustomTable from '@/components/Table';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableColumnItem } from '@/components/Table/types';
import { ILocationDetail } from '@/types';
import { getLocationPagination, deleteLocationById } from '@/services';
import { confirmDelete } from '@/helper/common';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';

const TISCLocation: React.FC = () => {
  const tableRef = useRef<any>();

  const handleUpdateLocation = (id: string) => {
    pushTo(PATH.tiscLocationUpdate.replace(':id', id));
  };
  const handleCreateLocation = () => {
    pushTo(PATH.tiscLocationCreate);
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
      width: '5%',
      render: (_value: any, record: any) => {
        return (
          <HeaderDropdown
            arrow={true}
            align={{ offset: [-14, -10] }}
            items={[
              {
                onClick: () => handleUpdateLocation(record.id),
                icon: <EditIcon />,
                label: 'Edit',
              },
              {
                onClick: () => handleDeleteLocation(record.id),
                icon: <DeleteIcon />,
                label: 'Delete',
              },
            ]}
            trigger={['click']}
          >
            <ActionIcon />
          </HeaderDropdown>
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
        hasPagination
      />
    </div>
  );
};

export default TISCLocation;
