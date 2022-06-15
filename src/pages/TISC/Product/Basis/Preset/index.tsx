import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { ICustomTableColumnType } from '@/components/Table';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { getProductBasisPresetPagination } from './services/api';
import type { IBasisPresetListResponse, ISubBasisPreset } from './types';
import styles from './styles/index.less';

const BasisPresetList: React.FC = () => {
  const tableRef = useRef<any>();

  const comingSoon = () => {
    alert('Coming Soon!');
  };

  const SameColumns: ICustomTableColumnType<any>[] = [
    {
      title: '1st Value',
      dataIndex: 'value_1',
      width: '5%',
    },
    {
      title: 'Unit',
      dataIndex: 'unit_1',
      width: '5%',
      lightHeading: true,
    },
    {
      title: '2nd Value',
      dataIndex: 'value_2',
      width: '5%',
    },
    {
      title: 'Unit',
      dataIndex: 'unit_2',
      lightHeading: true,
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
  ];

  const MainColumns: ICustomTableColumnType<IBasisPresetListResponse>[] = [
    {
      title: 'Preset Group',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: 250,
      isExpandable: true,
    },
    {
      title: 'Preset Name',
      dataIndex: 'preset_name',
      width: 150,
      sorter: {
        multiple: 2,
      },
    },
    ...SameColumns,
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: () => {
        return (
          <HeaderDropdown
            className={styles.customAction}
            arrow={{
              pointAtCenter: true,
            }}
            overlay={
              <MenuHeaderDropdown
                items={[
                  {
                    onClick: comingSoon,
                    icon: <ViewIcon />,
                    label: 'Edit',
                  },
                ]}
              />
            }
            trigger={['click']}
          >
            <ActionIcon />
          </HeaderDropdown>
        );
      },
    },
  ];

  const SubColumns: ICustomTableColumnType<ISubBasisPreset>[] = [
    {
      title: 'Preset Group',
      dataIndex: 'preset_group',
      width: 250,
      noBoxShadow: true,
    },
    {
      title: 'Preset Name',
      dataIndex: 'name',
      width: 150,
      isExpandable: true,
    },
    ...SameColumns,
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  const ChildColumns: ICustomTableColumnType<IBasisPresetListResponse>[] = [
    {
      title: 'Preset Group',
      dataIndex: 'preset_group',
      width: 250,
      noBoxShadow: true,
    },
    {
      title: 'Preset Name',
      dataIndex: 'preset_name',
      width: 150,
    },
    ...SameColumns,
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  return (
    <>
      <CustomTable
        title="PRESET"
        columns={MainColumns}
        ref={tableRef}
        fetchDataFunc={getProductBasisPresetPagination}
        multiSort={{
          name: 'group_order',
          preset_name: 'preset_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: SubColumns,
          childrenColumnName: 'subs',
          level: 2,
          expandable: GetExpandableTableConfig({
            columns: ChildColumns,
            childrenColumnName: 'subs',
          }),
        })}
      />
    </>
  );
};

export default BasisPresetList;
