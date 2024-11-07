import React, { useEffect, useRef, useState } from 'react';

import { message } from 'antd';
import { useParams } from 'umi';

import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';

import { useCheckBranchAttributeTab } from '../BrandAttribute/hook';
import { useAttributeLocation } from './hooks/location';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { copyAttributeToBrand, getBrandPagination } from '@/features/user-group/services';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { deleteAttribute, getProductAttributePagination } from '@/services';
import { startCase } from 'lodash';

import { BrandAttributeParamProps } from '../BrandAttribute/types';
import { RadioValue } from '@/components/CustomRadio/types';
import type { TableColumnItem } from '@/components/Table/types';
import { BrandListItem } from '@/features/user-group/types';
import type { AttributeListResponse, SubAttribute } from '@/types';
import { EAttributeContentType } from '@/types';

import Popover from '@/components/Modal/Popover';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';
import { BodyText } from '@/components/Typography';

import { BranchHeader, BranchTabKey } from '../BrandAttribute/BranchHeader';
import styles from './styles/index.less';

const colTitle = {
  group: 'Main Attribute',
  main: 'Sub Attribute',
  sub: 'Attribute Name',
};

const dataIndexDefault = 'name';

const colsDataIndex = {
  group: 'attribute_group',
  main: 'name 1',
  sub: 'attribute_name',
};

const AttributeList: React.FC = () => {
  useAutoExpandNestedTableColumn(3, [4]);
  const param = useParams<BrandAttributeParamProps>();
  const tableRef = useRef<any>();

  const { currentTab } = useCheckBranchAttributeTab();
  const { activePath, attributeLocation } = useAttributeLocation();

  const [brands, setBrands] = useState<BrandListItem[]>([]);
  const [attrSelected, setAttrSelected] = useState<string>();

  const [visible, setVisible] = useState<boolean>(false);
  /// set to call api one time
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    if (!dirty) {
      return;
    }

    getBrandPagination(
      {
        page: 1,
        pageSize: 99999999,
      },
      (data) => {
        setBrands(data.data);
      },
    );
  }, [dirty]);

  const handleUpdateAttribute = (id: string) => {
    pushTo(`${activePath}/${id}`);
  };
  const handleDeleteAttribute = (id: string) => {
    confirmDelete(() => {
      deleteAttribute(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const handleSelectAttribute = (id: string) => {
    setAttrSelected(id);
    setVisible(true);

    ///
    setDirty(true);
  };

  const handleCopyAttribute = async (brandChosen: RadioValue) => {
    if (!brandChosen?.value || !attrSelected) {
      message.error('Brand or Attribute not found');
      return;
    }

    const dataRes = await copyAttributeToBrand(attrSelected, brandChosen.value as string);
    const brandId = param.brandId;

    if (dataRes && dataRes?.brand_id === brandId) {
      tableRef.current.reload();
    }

    setVisible(false);
  };

  const getSameColumns = (noBoxShadow?: boolean) => {
    const SameColumns: TableColumnItem<any>[] = [
      {
        title: 'Description',
        dataIndex: 'description',
        noBoxShadow: noBoxShadow,
        render: (value, record) => {
          if (record.description_1) {
            return (
              <span className="basis-conversion-group">
                {record.description_1}
                <SwapIcon />
                {record.description_2}
              </span>
            );
          }
          return value;
        },
      },
      {
        title: 'Count',
        dataIndex: 'count',
        width: 63,
        align: 'center',
        noBoxShadow: noBoxShadow,
      },
    ];
    return SameColumns;
  };

  const MainColumns: TableColumnItem<AttributeListResponse>[] = [
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
    {
      title: 'Content Type',
      dataIndex: 'content_type',
      sorter: {
        multiple: 4,
      },
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '66px',
      render: (_value, record) => {
        if (record.master) {
          return null;
        }
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                onClick: () => handleUpdateAttribute(record.id),
              },
              {
                type: 'copy',
                label: 'Copy to',
                onClick: () => handleSelectAttribute(record.id),
              },
              {
                type: 'deleted',
                onClick: () => handleDeleteAttribute(record.id),
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
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: colTitle.sub,
      dataIndex: colsDataIndex.sub,
    },
    {
      title: 'Content Type',
      dataIndex: 'content_type',
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '66px',
    },
  ];

  const SubColumns: TableColumnItem<SubAttribute>[] = [
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
      dataIndex: dataIndexDefault,
      render: (value) => {
        return <span className="text-capitalize">{value}</span>;
      },
    },
    {
      title: 'Content Type',
      dataIndex: 'content_type',
      noBoxShadow: false,
      render: (value: EAttributeContentType, record) => {
        if (!record || !value) {
          return null;
        }

        if (value.toLowerCase() === EAttributeContentType.presets) {
          if (currentTab === BranchTabKey.general) {
            return <span>General Presets</span>;
          }

          if (currentTab === BranchTabKey.feature) {
            return <span>Feature Presets</span>;
          }
        }

        if (value.toLowerCase() === EAttributeContentType.options) {
          return <span>Component</span>;
        }

        return <span>{startCase(value)}</span>;
      },
    },
    ...getSameColumns(false),
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '66px',
    },
  ];

  return (
    <>
      <CustomTable
        header={<BranchHeader />}
        title={attributeLocation.NAME}
        columns={setDefaultWidthForEachColumn(MainColumns, 4)}
        ref={tableRef}
        fetchDataFunc={getProductAttributePagination}
        extraParams={{
          type: attributeLocation.TYPE,
          filter: { brand_id: param.brandId },
        }}
        multiSort={{
          name: 'group_order',
          'name 1': 'sub_group_order',
          attribute_name: 'attribute_order',
          content_type: 'content_type_order',
        }}
        expandable={GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(MainSubColumns, 4),
          childrenColumnName: 'subs',
          level: 2,
          expandable: GetExpandableTableConfig({
            columns: setDefaultWidthForEachColumn(SubColumns, 4),
            childrenColumnName: 'subs',
            level: 3,
          }),
        })}
      />

      <Popover
        title="COPY DATASET TO"
        titlePosition="center"
        className={styles.popover}
        cancelSaveFooter
        clearOnClose
        visible={visible}
        setVisible={setVisible}
        onFormSubmit={handleCopyAttribute}
        groupRadioList={[
          {
            options: brands.map((brand) => {
              return {
                value: brand.id,
                label: (
                  <div className="flex-start" style={{ gap: 24 }}>
                    <BodyText fontFamily="Roboto" level={5}>
                      {brand.name}
                    </BodyText>
                    <BodyText fontFamily="Roboto" level={5} color="mono-color-medium">
                      {brand.origin}
                    </BodyText>
                  </div>
                ),
              };
            }),
          },
        ]}
      />
    </>
  );
};

export default AttributeList;
