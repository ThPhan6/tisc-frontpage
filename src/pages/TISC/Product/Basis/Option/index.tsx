import React, { useRef } from 'react';

import { useParams } from 'umi';

import { useCheckBrandAttributePath } from '../../BrandAttribute/hook';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { deleteBasisOption, getProductBasisOptionPagination, updateBasisOption } from '@/services';

import { BrandAttributeParamProps } from '../../BrandAttribute/types';
import type { TableColumnItem } from '@/components/Table/types';
import type { BasisOptionForm, BasisOptionListResponse, SubBasisOption } from '@/types';

import { LogoIcon } from '@/components/LogoIcon';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';

import { BranchHeader } from '../../BrandAttribute/BranchHeader';

const colTitle = {
  group: 'Group Name',
  main: 'Main Classification',
  sub: 'Sub Classification',
};

const dataIndexDefault = 'name';

const colsDataIndex = {
  group: 'option_group',
  main: 'main_group',
  sub: 'sub_group',
};

const BasisOptionList: React.FC = () => {
  useAutoExpandNestedTableColumn(3, [7]);

  const param = useParams<BrandAttributeParamProps>();

  const tableRef = useRef<any>();

  const { componentUpdatePath, linkagePath } = useCheckBrandAttributePath();

  const handleUpdateBasisOption = (id: string) => {
    pushTo(componentUpdatePath.replace(':id', id));
  };
  const handleLinkageBasisOption = (id: string) => {
    pushTo(linkagePath.replace(':id', id));
  };
  const handleDeleteBasisOption = (option: SubBasisOption) => {
    confirmDelete(() => {
      // deleteBasisOption(id).then((isSuccess) => {
      //   if (isSuccess) {
      //     tableRef.current.reload();
      //   }
      // });

      updateBasisOption(option.id, { ...option, subs: [] } as unknown as BasisOptionForm).then(
        (isSuccess) => {
          if (isSuccess) {
            tableRef.current.reload();
          }
        },
      );
    });
  };
  const getSameColumns = (noBoxShadow?: boolean) => {
    const SameColumn: TableColumnItem<any>[] = [
      {
        title: 'Image',
        dataIndex: 'image',
        width: '5%',
        noBoxShadow: noBoxShadow,
        render: (value) => (value ? <LogoIcon logo={value} size={18} /> : null),
      },
      {
        title: '1st Value',
        dataIndex: 'value_1',
        noBoxShadow: noBoxShadow,
      },
      {
        title: 'Unit',
        dataIndex: 'unit_1',
        lightHeading: true,
        noBoxShadow: noBoxShadow,
      },
      {
        title: '2nd Value',
        dataIndex: 'value_2',
        noBoxShadow: noBoxShadow,
      },
      {
        title: 'Unit',
        dataIndex: 'unit_2',
        lightHeading: true,
        noBoxShadow: noBoxShadow,
      },
      {
        title: 'Product ID',
        dataIndex: 'product_id',
        noBoxShadow: noBoxShadow,
      },
      {
        title: 'Count',
        dataIndex: 'count',
        width: '5%',
        align: 'center',
        noBoxShadow: noBoxShadow,
      },
    ];
    return SameColumn;
  };

  const MainColumns: TableColumnItem<BasisOptionListResponse>[] = [
    {
      title: colTitle.group,
      dataIndex: dataIndexDefault, // key in data
      sorter: {
        multiple: 1,
      },
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
      hidden: true,
    },
    {
      title: colTitle.main,
      dataIndex: colsDataIndex.main,
      sorter: {
        multiple: 2,
      },
      // defaultSortOrder: 'descend',
    },
    {
      title: colTitle.sub,
      dataIndex: colsDataIndex.sub,
      sorter: {
        multiple: 3,
      },
      // defaultSortOrder: 'ascend',
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value: any, record: any) => {
        if (record.master) {
          return null;
        }
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateBasisOption(record.id),
              },
              {
                type: 'linkage',
                onClick: () => handleLinkageBasisOption(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteBasisOption(record),
              },
            ]}
          />
        );
      },
    },
  ];

  const MainSubColumns: TableColumnItem<SubBasisOption>[] = [
    {
      title: colTitle.group,
      dataIndex: colsDataIndex.group,
      noBoxShadow: true,
      hidden: true,
    },
    {
      title: colTitle.main,
      dataIndex: dataIndexDefault,
      isExpandable: true,
    },
    {
      title: colTitle.sub,
      dataIndex: colsDataIndex.sub,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  const SubColumns: TableColumnItem<SubBasisOption>[] = [
    {
      title: colTitle.group,
      dataIndex: colsDataIndex.group,
      noBoxShadow: true,
      hidden: true,
    },
    {
      title: colTitle.main,
      dataIndex: colsDataIndex.main,
      isExpandable: true,
      noBoxShadow: true,
    },
    {
      title: colTitle.sub,
      dataIndex: dataIndexDefault,
      isExpandable: true,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  const ChildColumns: TableColumnItem<BasisOptionListResponse>[] = [
    {
      title: colTitle.group,
      dataIndex: colsDataIndex.group,
      noBoxShadow: true,
      hidden: true,
    },
    {
      title: colTitle.main,
      dataIndex: colsDataIndex.main,
      noBoxShadow: true,
    },
    {
      title: colTitle.sub,
      dataIndex: colsDataIndex.sub,
      noBoxShadow: true,
    },
    ...getSameColumns(true),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      noBoxShadow: true,
    },
  ];

  return (
    <CustomTable
      header={<BranchHeader />}
      title="OPTIONS"
      columns={setDefaultWidthForEachColumn(MainColumns, 7)}
      ref={tableRef}
      fetchDataFunc={getProductBasisOptionPagination}
      multiSort={{
        // colsDataIndex is sort keys
        name: 'group_order',
        main_group: 'main_order',
        sub_group: 'option_order',
      }}
      extraParams={{
        filter: { brand_id: param.brandId },
      }}
      expandable={GetExpandableTableConfig({
        columns: setDefaultWidthForEachColumn(MainSubColumns, 7),
        childrenColumnName: 'subs',
        level: 2,
        expandable: GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(SubColumns, 7),
          childrenColumnName: 'subs',
          level: 3,
          expandable: GetExpandableTableConfig({
            columns: setDefaultWidthForEachColumn(ChildColumns, 7),
            childrenColumnName: 'subs',
            level: 4,
          }),
        }),
      })}
    />
  );
};

export default BasisOptionList;
