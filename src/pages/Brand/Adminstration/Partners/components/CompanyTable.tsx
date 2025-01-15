import { PartnerTableContext } from '..';

import { useContext, useMemo } from 'react';

import { PATH } from '@/constants/path';
import { TableColumnProps } from 'antd';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { deletePartner, getListPartnerCompanies } from '@/services';

import { useAppSelector } from '@/reducers';
import { Company } from '@/types';

import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';

interface CompanyTableProps {
  tableRef: React.MutableRefObject<any>;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({ tableRef }) => {
  useAutoExpandNestedTableColumn(0, [8], Date.now());

  const { filters } = useContext(PartnerTableContext);

  const companiesPage = useAppSelector((state) => state.partner.companiesPage);

  const handlePushToUpdate = (id: string) => () => {
    pushTo(PATH.brandUpdatePartner.replace(':id', id));
  };

  const handleDeletePartner = (id: string) => () => {
    confirmDelete(async () => {
      const res = await deletePartner(id);
      if (res) tableRef.current.reload();
    });
  };

  const columns: TableColumnProps<Company>[] = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        render: (_, record) => <span className="text-capitalize ">{record.name}</span>,
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
        title: 'Contact',
        dataIndex: 'contact',
      },
      {
        title: 'Affiliation',
        dataIndex: 'affiliation_name',
        render: (_, record) => <span className="text-capitalize ">{record.affiliation_name}</span>,
      },
      {
        title: 'Relation',
        dataIndex: 'relation_name',
        render: (_, record) => <span className="text-capitalize ">{record.relation_name}</span>,
      },
      {
        title: 'Acquisition',
        dataIndex: 'acquisition_name',
        render: (_, record) => {
          switch (record.acquisition_name) {
            case 'Active':
              return <span className="indigo-dark-variant text-capitalize">Active</span>;
            case 'Inactive':
              return <span className="red-magenta text-capitalize">Inactive</span>;
            case 'Freeze':
              return <span className="orange text-capitalize">Freeze</span>;
            default:
              return <span className="text-capitalize">{record.acquisition_name}</span>;
          }
        },
      },
      {
        title: 'Price Rate',
        dataIndex: 'price_rate',
        render: (_, record) => parseFloat(record.price_rate?.toString()).toFixed(2),
      },
      {
        title: 'Authorised Country',
        dataIndex: 'authorized_country_name',
      },
      {
        title: 'Beyond',
        dataIndex: 'coverage_beyond',
        align: 'center',
        width: '5%',
        render: (_, record) => (record.coverage_beyond ? 'Allow' : 'Not Allow'),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        align: 'center',
        width: '5%',
        render: (_, record) => {
          return (
            <ActionMenu
              actionItems={[
                {
                  type: 'updated',
                  onClick: handlePushToUpdate(record.id),
                },
                {
                  type: 'deleted',
                  onClick: handleDeletePartner(record.id),
                },
              ]}
            />
          );
        },
      },
    ],
    [handleDeletePartner, handlePushToUpdate],
  );

  return (
    <CustomTable
      columns={setDefaultWidthForEachColumn(columns, 8)}
      fetchDataFunc={getListPartnerCompanies}
      hasPagination
      ref={tableRef}
    />
  );
};
