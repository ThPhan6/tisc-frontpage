import React, { useEffect, useRef, useState } from 'react';

import { PATH } from '@/constants/path';
import { useLocation } from 'umi';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import {
  copyPresetMiddleware,
  deletePresetMiddleware,
  getProductBasisPresetPagination,
} from '@/services';
import { isUndefined } from 'lodash';

import type { TableColumnItem } from '@/components/Table/types';
import type { BasisPresetListResponse, SubBasisPreset } from '@/types';

import { PresetHeader, PresetTabKey } from './components/PresetHeader';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';

import styles from './index.less';

const colTitle = {
  group: 'Group',
  main: 'Sub-group',
  sub: 'Preset',
};

const dataIndexDefault = 'name';

const colsDataIndex = {
  group: 'preset_group',
  // main: 'sub_group',
  main: 'main_group',
  sub: 'preset_name',
};

const BasisPresetList: React.FC = () => {
  useAutoExpandNestedTableColumn(3, [5]);

  const location = useLocation();

  const tableRef = useRef<any>();
  const tabRef = useRef<any>();

  const [selectedTab, setSelectedTab] = useState<PresetTabKey>();

  /// watch tab selected changed
  useEffect(() => {
    setSelectedTab(location.hash.split('#')[1] as PresetTabKey);
  }, [location.hash]);

  useEffect(() => {
    if (selectedTab) {
      tableRef.current.reload();
    }
  }, [selectedTab]);

  const handleUpdatePreset = (id: string) => {
    pushTo(PATH.updatePresets.replace(':id', id) + `#${selectedTab}`);

    /* don't push to like this when using hash on url.
     * * * When using hashes in URLs, it's important to note that changing only the hash portion of the URL does not trigger a page reload or a navigation event. This means that the browser history remains unchanged, and pressing the back button will not revert the hash changes.

    *** pushTo(PATH.updatePresets.replace(':id', id));
     */
  };

  const handleDeletePreset = (id: string) => {
    confirmDelete(() => {
      deletePresetMiddleware(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const handleCopyPreset = (id: string) => {
    copyPresetMiddleware(id);
  };

  const getSameColumns = (noBoxShadow?: boolean) => {
    const SameColumns: TableColumnItem<any>[] = [
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
        title: 'Count',
        dataIndex: 'count',
        width: '5%',
        align: 'center',
        noBoxShadow: noBoxShadow,
      },
    ];
    return SameColumns;
  };

  const MainColumns: TableColumnItem<BasisPresetListResponse>[] = [
    {
      title: colTitle.group,
      dataIndex: dataIndexDefault,
      sorter: {
        multiple: 1,
      },
      isExpandable: true,
      render: (value) => {
        return <span className="text-uppercase">{value}</span>;
      },
    },
    {
      title: colTitle.main,
      dataIndex: colsDataIndex.main,
      sorter: {
        multiple: 2,
      },
      // defaultSortOrder: 'ascend',
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
      render: (_value, record) => {
        if (record.master) {
          return null;
        }
        return (
          <ActionMenu
            containerClass={styles.actionLayout}
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdatePreset(record.id),
              },
              {
                type: 'copy',
                label: `Copy to ${
                  tabRef.current.tab === PresetTabKey.featurePresets ? 'General' : 'Feature'
                }`,
                onClick: () => handleCopyPreset(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeletePreset(record.id),
              },
            ]}
          />
        );
      },
    },
  ];

  const MainSubColumns: TableColumnItem<any>[] = [
    {
      title: colTitle.group,
      dataIndex: colsDataIndex.group,
      noBoxShadow: true,
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

  const SubColumns: TableColumnItem<SubBasisPreset>[] = [
    {
      title: colTitle.group,
      dataIndex: colsDataIndex.group,
      noBoxShadow: true,
    },
    {
      title: colTitle.main,
      dataIndex: colsDataIndex.main,
      noBoxShadow: true,
      isExpandable: true,
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

  const ChildColumns: TableColumnItem<BasisPresetListResponse>[] = [
    {
      title: colTitle.group,
      dataIndex: colsDataIndex.group,
      noBoxShadow: true,
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
      header={<PresetHeader ref={tabRef} />}
      columns={setDefaultWidthForEachColumn(MainColumns, 6)}
      ref={tableRef}
      fetchDataFunc={getProductBasisPresetPagination}
      autoLoad={false}
      multiSort={{
        name: 'group_order',
        main_group: 'sub_group_order',
        preset_name: 'preset_order',
      }}
      extraParams={{
        /// first loading selectedTab is undefined
        is_general: selectedTab === PresetTabKey.generalPresets || isUndefined(selectedTab),
      }}
      expandable={GetExpandableTableConfig({
        columns: setDefaultWidthForEachColumn(MainSubColumns, 6),
        childrenColumnName: 'subs',
        level: 2,
        expandable: GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(SubColumns, 6),
          childrenColumnName: 'subs',
          level: 3,
          expandable: GetExpandableTableConfig({
            columns: setDefaultWidthForEachColumn(ChildColumns, 6),
            childrenColumnName: 'subs',
            level: 4,
          }),
        }),
      })}
    />
  );
};

export default BasisPresetList;
