import { useEffect, useRef } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';

import { confirmDelete, useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import { setCustomResourceType } from './reducer';
import { CustomResourceType, CustomResources } from './type';
import { TableColumnItem } from '@/components/Table/types';
import store, { useAppSelector } from '@/reducers';

import { CustomResourceTableHeader } from './component/CustomResourceHeader';
import { CustomResourceTopBar } from './component/CustomResourceTopBar';
import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';
import { BodyText } from '@/components/Typography';

import styles from './CustomResource.less';
import {
  deleteCustomResource,
  getCustomResourceSummary,
  getListVendorByBrandOrDistributor,
} from './api';

export const optionValue = [
  { label: 'Brands', value: CustomResourceType.Brand },
  { label: 'Distributor', value: CustomResourceType.Distributor },
];
const CustomResource = () => {
  const customResourceType = useAppSelector((state) => state.customResource.customResourceType);

  const tableRef = useRef<any>();

  const handleDeleteCustomResource = (id: string) => {
    confirmDelete(() => {
      deleteCustomResource(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
          getCustomResourceSummary();
        }
      });
    });
  };

  const goToUpdateCustomResource = (id: string) => {
    pushTo(PATH.designerCustomResourceUpdate.replace(':id', id));
  };

  const MainColumns: TableColumnItem<CustomResources>[] = [
    {
      title: 'Code',
      sorter: true,
      dataIndex: 'type_code',
    },
    {
      title: customResourceType === CustomResourceType.Brand ? 'Brand Name' : 'Distributor Name',
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
      render: (_value, record) => {
        return (
          <BodyText fontFamily="Roboto" level={5}>
            +{record.phone_code} {record.general_phone}
          </BodyText>
        );
      },
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
      title: customResourceType === CustomResourceType.Brand ? 'Distributors' : 'Brands',
      dataIndex: customResourceType === CustomResourceType.Brand ? 'distributors' : 'brands',
      align: 'center',
    },
    customResourceType === CustomResourceType.Brand
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
  }, [customResourceType]);

  const { isMobile, isTablet } = useScreen();
  return (
    <PageContainer pageHeaderRender={() => <CustomResourceTopBar />}>
      <CustomTable
        fetchDataFunc={getListVendorByBrandOrDistributor}
        title={isTablet ? ' ' : 'VENDOR INFORMATION MANAGEMENT'}
        columns={setDefaultWidthForEachColumn(MainColumns, 3)}
        ref={tableRef}
        rightAction={
          <CustomResourceTableHeader
            onChange={(radioValue) =>
              store.dispatch(setCustomResourceType(radioValue.value as number))
            }
            onClick={() => pushTo(PATH.designerCustomResourceCreate)}
          />
        }
        extraParams={{ type: customResourceType }}
        onRow={(rowRecord: CustomResources) => ({
          onClick: () => {
            pushTo(PATH.designerCustomResourceDetail.replace(':id', rowRecord.id));
          },
        })}
        hasPagination
        headerClass={isMobile ? styles.customHeader : ''}
      />
    </PageContainer>
  );
};
export default CustomResource;
