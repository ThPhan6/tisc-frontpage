import { useEffect, useRef } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';

import { deleteCustomResource, getListVendorByBrandOrDistributor } from './services';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import { CustomResources } from './types';
import { TableColumnItem } from '@/components/Table/types';
import store, { useAppSelector } from '@/reducers';

import { CustomResourceTopBar } from './components/TopBar/CustomResourceTopBar';
import { CustomRadio } from '@/components/CustomRadio';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { MainTitle } from '@/components/Typography';

import styles from './CustomResource.less';
import { setCustomResourceValue } from './slice';

export enum CustomResourceValue {
  'Brand',
  'Distributor',
}

export const optionValue = [
  { label: 'Brand', value: CustomResourceValue.Brand },
  { label: 'Distributor', value: CustomResourceValue.Distributor },
];
const CustomResource = () => {
  const viewBy = useAppSelector((state) => state.officeProduct.customResourceValue);

  const tableRef = useRef<any>();

  const handleDeleteCustomResource = (id: string) => {
    confirmDelete(() => {
      deleteCustomResource(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const goToUpdateCustomResource = (id: string) => {
    pushTo(PATH.designerCustomResourceUpdate.replace(':id', id));
  };

  const MainColumns: TableColumnItem<CustomResources>[] = [
    {
      title: viewBy === CustomResourceValue.Brand ? 'Brand Name' : 'Distributor Name',
      sorter: true,
      dataIndex: 'business_name',
    },
    {
      title: 'Location',
      sorter: true,
      dataIndex: 'location',
    },
    {
      title: 'General Phone',
      dataIndex: 'general_phone',
    },
    {
      title: 'General Email',
      dataIndex: 'general_email',
    },
    {
      title: 'Contacts',
      dataIndex: 'contacts',
      align: 'center',
    },
    {
      title: viewBy === CustomResourceValue.Brand ? 'Distributors' : 'Brands',
      dataIndex: viewBy === CustomResourceValue.Brand ? 'distributors' : 'brands',
      align: 'center',
    },
    viewBy === CustomResourceValue.Brand
      ? {
          title: 'Cards',
          dataIndex: 'cards',
          align: 'center',
        }
      : {},
    {
      title: 'Action',
      width: '5%',
      align: 'center',
      render: (_value, record) => {
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => goToUpdateCustomResource(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteCustomResource(record.id),
              },
            ]}
          />
        );
      },
    },
  ];

  useEffect(() => {
    tableRef.current.reload();
  }, [viewBy]);

  return (
    <PageContainer pageHeaderRender={() => <CustomResourceTopBar />}>
      <CustomTable
        fetchDataFunc={getListVendorByBrandOrDistributor}
        extraParams={{ type: viewBy }}
        title="VENDOR INFORMATION MANAGEMENT"
        columns={setDefaultWidthForEachColumn(MainColumns, 3)}
        ref={tableRef}
        rightAction={
          <div style={{ display: 'flex', alignItems: 'center', textTransform: 'capitalize' }}>
            <MainTitle level={4}>View By:</MainTitle>
            <CustomRadio
              options={optionValue}
              containerClass={styles.customRadio}
              value={viewBy}
              onChange={(radioValue) =>
                store.dispatch(setCustomResourceValue(radioValue.value as number))
              }
            />
            <CustomPlusButton
              customClass={styles.button}
              onClick={() => pushTo(PATH.designerCustomResourceCreate)}
            />
          </div>
        }
      />
    </PageContainer>
  );
};
export default CustomResource;
