import { HeaderDropdown } from '@/components/HeaderDropdown';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ICustomTableColumnType } from '@/components/Table/types';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { IDistributorListResponse } from '@/types/distributor.type';
import { useRef } from 'react';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { deleteDistributor, getDistributorPagination } from '@/services/distributor.api';
import { confirmDelete } from '@/helper/common';

const Distributors = () => {
  const tableRef = useRef<any>();

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

  // const brand_id = '54bbfa0d-5fda-413b-81a9-1332081e2739';

  const MainColumns: ICustomTableColumnType<IDistributorListResponse>[] = [
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
      width: '5%',
      render: (_value, record) => {
        return (
          <HeaderDropdown
            arrow={true}
            align={{ offset: [-14, -10] }}
            items={[
              {
                onClick: () => handleUpdateDistributor(record.id),
                icon: <EditIcon />,
                label: 'Edit',
              },
              {
                onClick: () => handleDeleteDistributor(record.id),
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
    <>
      <CustomTable
        rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createDistributor)} />}
        title="DISTRIBUTORS"
        columns={MainColumns}
        ref={tableRef}
        fetchDataFunc={getDistributorPagination}
      />
    </>
  );
};

export default Distributors;
