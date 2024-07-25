import React, { useRef, useState } from 'react';

import { useParams } from 'umi';

import { useCheckBrandAttributePath } from '../../BrandAttribute/hook';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { getProductBasisOptionPaginationForTable, updateBasisOption } from '@/services';

import { BrandAttributeParamProps } from '../../BrandAttribute/types';
import type {
  DataTableResponse,
  PaginationRequestParams,
  TableColumnItem,
} from '@/components/Table/types';
import type {
  BasisOptionForm,
  BasisOptionListResponse,
  BasisOptionListResponseForTable,
  MainBasisOptionSubForm,
  SubBasisOption,
} from '@/types';

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
  useAutoExpandNestedTableColumn(2, [7]);

  const param = useParams<BrandAttributeParamProps>();

  const tableRef = useRef<any>();

  const [data, setData] = useState<BasisOptionListResponseForTable[]>([]);
  const hasSubs = !!data?.[0]?.subs?.length;
  const subs = data.map((el) => ({
    id: el.id,
    name: el.name,
    count: el.count,
    subs: el.subs,
  })) as unknown as MainBasisOptionSubForm[];

  const { componentUpdatePath, linkagePath } = useCheckBrandAttributePath();

  const handleGetData = (
    params: PaginationRequestParams,
    callback: (newData: DataTableResponse<BasisOptionListResponseForTable[]>) => void,
  ) => {
    getProductBasisOptionPaginationForTable(params, (res) => {
      setData(res.data);
      callback(res);
    });
  };

  const handleUpdateBasisOption = (group: BasisOptionListResponseForTable) => {
    pushTo(componentUpdatePath.replace(':id', group.group_id).replace(':subId', group.id));
  };
  const handleLinkageBasisOption = (id: string) => {
    pushTo(linkagePath.replace(':id', id));
  };
  const handleDeleteBasisOption = (group: BasisOptionListResponseForTable) => {
    confirmDelete(() => {
      const subIdx = subs.findIndex((el) => el.id === group.id);
      const newSubs = [...subs];
      newSubs.splice(subIdx, 1);

      const payload: BasisOptionForm = {
        id: group.group_id,
        name: group.group_name,
        count: newSubs.length,
        subs: newSubs,
      };

      updateBasisOption(payload.id, payload, 'delete').then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
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

  const MainSubColumns: TableColumnItem<BasisOptionListResponseForTable>[] = [
    {
      title: colTitle.main,
      dataIndex: dataIndexDefault,
      isExpandable: hasSubs,
      sorter: {
        multiple: 1,
      },
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: colTitle.sub,
      dataIndex: colsDataIndex.sub,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
      sorter: {
        multiple: 2,
      },
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value: any, record: BasisOptionListResponseForTable) => {
        if (record.master || !hasSubs) {
          return null;
        }
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateBasisOption(record),
              },
              {
                type: 'linkage',
                onClick: () => handleLinkageBasisOption(record.group_id),
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

  const SubColumns: TableColumnItem<SubBasisOption>[] = !hasSubs
    ? []
    : [
        {
          title: colTitle.main,
          dataIndex: colsDataIndex.main,
          // isExpandable: true,
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

  const ChildColumns: TableColumnItem<BasisOptionListResponse>[] = !hasSubs
    ? []
    : [
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
      header={<BranchHeader groupId={data?.[0]?.group_id} groupName={data?.[0]?.group_name} />}
      title="OPTIONS"
      columns={setDefaultWidthForEachColumn(MainSubColumns, 7)}
      ref={tableRef}
      fetchDataFunc={handleGetData}
      multiSort={{
        // colsDataIndex is sort keys
        name: 'main_order',
        sub_group: 'option_order',
      }}
      extraParams={{
        filter: { brand_id: param.brandId },
      }}
      expandable={GetExpandableTableConfig({
        columns: setDefaultWidthForEachColumn(SubColumns, 7),
        childrenColumnName: 'subs',
        level: 2,
        expandable: GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(ChildColumns, 7),
          childrenColumnName: 'subs',
          level: 3,
        }),
      })}
    />
  );
};

export default BasisOptionList;
