import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { ICustomTableColumnType } from '@/components/Table';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { getProductBasisOptionPagination } from './services/api';
import { showImageUrl } from '@/helper/utils';
import type { IBasisOptionListResponse, ISubBasisOption } from './types';
import styles from './styles/index.less';

const BasisOptionList: React.FC = () => {
  const tableRef = useRef<any>();

  const comingSoon = () => {
    alert('Coming Soon!');
  };

  const SameColumn: ICustomTableColumnType<any>[] = [
    {
      title: 'Image',
      dataIndex: 'image',
      width: '5%',
      render: (value) => {
        if (value) {
          return <img src={showImageUrl(value)} style={{ width: 18 }} />;
        }
        return null;
      },
    },
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

  const MainColumns: ICustomTableColumnType<IBasisOptionListResponse>[] = [
    {
      title: 'Option Group',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: 300,
      isExpandable: true,
    },
    {
      title: 'Option Name',
      dataIndex: 'option_name',
      width: 150,
      sorter: {
        multiple: 2,
      },
    },
    ...SameColumn,
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

  const SubColumns: ICustomTableColumnType<ISubBasisOption>[] = [
    {
      title: 'Option Group',
      dataIndex: 'option_group',
      width: 300,
      noBoxShadow: true,
    },
    {
      title: 'Option Name',
      dataIndex: 'name',
      width: 150,
      isExpandable: true,
    },
    ...SameColumn,
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
    },
  ];

  const ChildColumns: ICustomTableColumnType<IBasisOptionListResponse>[] = [
    {
      title: 'Option Group',
      dataIndex: 'option_group',
      width: 300,
      noBoxShadow: true,
    },
    {
      title: 'Option Name',
      dataIndex: 'option_name',
      width: 150,
    },
    ...SameColumn,
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
        fetchDataFunc={getProductBasisOptionPagination}
        multiSort={{
          name: 'group_order',
          option_name: 'option_order',
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

export default BasisOptionList;
