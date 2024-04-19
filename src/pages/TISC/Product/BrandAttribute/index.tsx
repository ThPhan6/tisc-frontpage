import React, { useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { getBrandPagination } from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import type { TableColumnItem } from '@/components/Table/types';
import { BrandListItem } from '@/features/user-group/types';
import { ActiveStatus } from '@/types';

import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';
import { BodyText } from '@/components/Typography';

const BrandAttributeList: React.FC = () => {
  useAutoExpandNestedTableColumn(0, [2]);
  const tableRef = useRef<any>();

  const handleCompose = (brandId: string) => {
    pushTo(PATH.options.replace(':brandId', brandId));
  };

  const MainColumns: TableColumnItem<BrandListItem>[] = [
    {
      title: 'Brand Name',
      dataIndex: 'name',
      sorter: true,

      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: 'Origin',
      dataIndex: 'origin',
      sorter: true,
    },
    {
      title: 'Main Category',
      dataIndex: 'main_categories',
      render: (value) => {
        return <span className="text-capitalize">{value.join(', ')}</span>;
      },
    },

    {
      title: 'Status',
      dataIndex: 'status',
      width: '5%',
      sorter: true,
      render: (_v, record) => {
        return (
          <BodyText level={5} fontFamily="Roboto">
            {ActiveStatus[record.status]}
          </BodyText>
        );
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
                type: 'compose',
                onClick: () => handleCompose(record.id),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <CustomTable
      title="Brand Attributes"
      columns={setDefaultWidthForEachColumn(MainColumns, 2)}
      ref={tableRef}
      fetchDataFunc={getBrandPagination}
      dynamicPageSize
      hasPagination
      hasSummary
      onRow={(rowRecord: BrandListItem) => ({
        onClick: () => {
          handleCompose(rowRecord.id);
        },
      })}
    />
  );
};

export default BrandAttributeList;
