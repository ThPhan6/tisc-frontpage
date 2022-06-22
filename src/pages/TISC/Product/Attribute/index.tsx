import React, { useRef } from 'react';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import type { ICustomTableColumnType } from '@/components/Table/types';
import { MenuHeaderDropdown, HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';
import { getProductAttributePagination } from './services/api';
import { useLocation } from 'umi';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { ATTRIBUTE_PATH_TO_TYPE } from './utils';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-icon.svg';

import type { IAttributeListResponse, ISubAttribute } from './types';

const AttributeList: React.FC = () => {
  const tableRef = useRef<any>();
  const location = useLocation();
  const comingSoon = () => {
    alert('Coming Soon!');
  };
  const MainColumns: ICustomTableColumnType<IAttributeListResponse>[] = [
    {
      title: 'Attribute Group',
      dataIndex: 'name',
      sorter: {
        multiple: 1,
      },
      width: 200,
      isExpandable: true,
    },
    {
      title: 'Attribute Name',
      dataIndex: 'attribute_name',
      width: 150,
      sorter: {
        multiple: 2,
      },
    },
    {
      title: 'Content Type',
      dataIndex: 'content_type',
      width: 150,
      sorter: {
        multiple: 3,
      },
    },
    {
      title: 'Description',
      dataIndex: 'second_formula',
    },
    { title: 'Count', dataIndex: 'count', width: '5%', align: 'center' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: () => {
        return (
          <HeaderDropdown
            arrow={true}
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
  const SubColumns: ICustomTableColumnType<ISubAttribute>[] = [
    {
      title: 'Attribute Group',
      dataIndex: 'attribute_group',
      width: 200,
      noBoxShadow: true,
    },
    {
      title: 'Attribute Name',
      dataIndex: 'name',
      width: 150,
      isExpandable: true,
      noBoxShadow: true,
    },
    {
      title: 'Content Type',
      dataIndex: 'content_type',
      width: 150,
      noBoxShadow: true,
    },
    {
      title: 'Description',
      dataIndex: 'second_formula',
      noBoxShadow: true,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      width: '5%',
      align: 'center',
      noBoxShadow: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      noBoxShadow: true,
    },
  ];
  return (
    <>
      <CustomTable
        rightAction={
          <div style={{ cursor: 'pointer' }} onClick={() => pushTo(PATH.attributeGeneralCreate)}>
            <PlusIcon />
          </div>
        }
        title={ATTRIBUTE_PATH_TO_TYPE[location.pathname].NAME}
        columns={MainColumns}
        ref={tableRef}
        fetchDataFunc={getProductAttributePagination}
        extraParams={{
          type: ATTRIBUTE_PATH_TO_TYPE[location.pathname].TYPE,
        }}
        multiSort={{
          name: 'group_order',
          attribute_name: 'attribute_order',
          content_type: 'content_type_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: SubColumns,
          childrenColumnName: 'subs',
        })}
      />
    </>
  );
};

export default AttributeList;
