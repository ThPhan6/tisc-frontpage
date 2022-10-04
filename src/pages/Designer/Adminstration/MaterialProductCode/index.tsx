import { useRef } from 'react';

import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { getProductBasisPresetPagination } from '@/services';

import { TableColumnItem } from '@/components/Table/types';
import {
  MaterialProductCodeItem,
  MaterialProductCodeMain,
  MaterialProductCodeSub,
} from '@/features/material-product-code/type';

// import { useAppSelector } from '@/reducers';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';

import { deleteMaterialProductCode } from '@/features/material-product-code/api';

// import { getMaterialProductCodeList } from '@/features/material-product-code/api';

const MaterialProductCode = () => {
  useAutoExpandNestedTableColumn(2);
  //   const user = useAppSelector((state) => state.user.user);
  const tableRef = useRef<any>();

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

  const SameColumns: TableColumnItem<any>[] = [
    { title: 'Code', sorter: { multiple: 3 }, dataIndex: 'code' },
    { title: 'Description', dataIndex: 'description' },
    { title: 'Count', dataIndex: 'count', align: 'center', width: '5%' },
  ];
  const MainColumns: TableColumnItem<MaterialProductCodeMain>[] = [
    {
      title: 'Main List',
      dataIndex: 'name',
      sorter: { multiple: 1 },
      isExpandable: true,
    },
    {
      title: 'Sub-List',
      sorter: { multiple: 2 },
    },
    ...SameColumns,

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
  const SubColumns: TableColumnItem<MaterialProductCodeSub>[] = [
    {
      title: 'Main List',
    },
    {
      title: 'Sub-List',
      dataIndex: 'name',
    },
    ...SameColumns,

    { title: 'Action', align: 'center', width: '5%' },
  ];

  const CodeColumns: TableColumnItem<MaterialProductCodeItem>[] = [
    {
      title: 'Main List',
    },
    {
      title: 'Sub-List',
    },
    ...SameColumns,

    { title: 'Action', align: 'center', width: '5%' },
  ];
  return (
    <>
      <CustomTable
        rightAction={
          <CustomPlusButton onClick={() => pushTo(PATH.designerMaterialProductCodeCreate)} />
        }
        title="MATERIAL/PRODUCT CODE"
        columns={setDefaultWidthForEachColumn(MainColumns, 2)}
        ref={tableRef}
        fetchDataFunc={getProductBasisPresetPagination}
        multiSort={{}}
        expandable={GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(SubColumns, 2),
          childrenColumnName: 'subs',
          level: 2,
          expandable: GetExpandableTableConfig({
            columns: setDefaultWidthForEachColumn(CodeColumns, 2),
            childrenColumnName: 'subs',
            level: 3,
          }),
        })}
      />
    </>
  );
};
export default MaterialProductCode;
