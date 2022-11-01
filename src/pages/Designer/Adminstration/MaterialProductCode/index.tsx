import { useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import {
  MaterialProductCodeItem,
  MaterialProductCodeMainList,
  MaterialProductCodeSubList,
} from '@/features/material-product-code/type';
import { useAppSelector } from '@/reducers';

import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

import {
  deleteMaterialProductCode,
  getMaterialProductCodeList,
} from '@/features/material-product-code/api';

const MaterialProductCode = () => {
  useAutoExpandNestedTableColumn(2);
  const tableRef = useRef<any>();

  const user = useAppSelector((state) => state.user.user);

  const handleUpdateMaterialProductCode = (id: string) => {
    pushTo(PATH.designerMaterialProductCodeUpdate.replace(':id', id));
  };

  const handleDeleteMaterialProductCode = (id: string) => {
    confirmDelete(() => {
      deleteMaterialProductCode(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const getSameColumns = (noBoxShadow?: boolean) => {
    const SameColumns: TableColumnItem<any>[] = [
      {
        title: 'Code',
        sorter: true,
        dataIndex: 'code',
        noBoxShadow: noBoxShadow,
      },
      { title: 'Description', dataIndex: 'description', noBoxShadow: noBoxShadow },
      {
        title: 'Count',
        dataIndex: 'count',
        align: 'center',
        width: '5%',
        noBoxShadow: noBoxShadow,
      },
    ];
    return SameColumns;
  };

  const MainColumns: TableColumnItem<MaterialProductCodeMainList>[] = [
    {
      title: 'Main List',
      dataIndex: 'name',
      sorter: true,
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: 'Sub-List',
      dataIndex: 'sub_list',
      sorter: true,
    },
    ...getSameColumns(false),

    {
      title: 'Action',
      align: 'center',
      width: '5%',
      render: (_value, record) => {
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateMaterialProductCode(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteMaterialProductCode(record.id),
              },
            ]}
          />
        );
      },
    },
  ];
  const SubColumns: TableColumnItem<MaterialProductCodeSubList>[] = [
    {
      title: 'Main List',
      noBoxShadow: true,
    },
    {
      title: 'Sub-List',
      dataIndex: 'name',
      isExpandable: true,
    },
    ...getSameColumns(false),

    { title: 'Action', align: 'center', width: '5%' },
  ];

  const CodeColumns: TableColumnItem<MaterialProductCodeItem>[] = [
    {
      title: 'Main List',
      noBoxShadow: true,
    },
    {
      title: 'Sub-List',
      noBoxShadow: true,
    },

    ...getSameColumns(true),

    { title: 'Action', align: 'center', width: '5%', noBoxShadow: true },
  ];
  return (
    <>
      <CustomTable
        rightAction={
          <CustomPlusButton onClick={() => pushTo(PATH.designerMaterialProductCodeCreate)} />
        }
        title="MATERIAL/PRODUCT CODE"
        columns={setDefaultWidthForEachColumn(MainColumns, 3)}
        ref={tableRef}
        fetchDataFunc={getMaterialProductCodeList}
        extraParams={{ designId: user?.relation_id }}
        sortDirections="descend"
        multiSort={{
          name: 'main_material_code_order',
          sub_list: 'sub_material_code_order',
          code: 'material_code_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(SubColumns, 2),
          childrenColumnName: 'subs',
          level: 2,
          expandable: GetExpandableTableConfig({
            columns: setDefaultWidthForEachColumn(CodeColumns, 2),
            childrenColumnName: 'codes',
            level: 3,
          }),
        })}
      />
    </>
  );
};
export default MaterialProductCode;
