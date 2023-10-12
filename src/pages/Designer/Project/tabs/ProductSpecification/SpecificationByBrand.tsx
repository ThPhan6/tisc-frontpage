import { FC, useRef, useState } from 'react';

import { COLUMN_WIDTH } from '@/constants/util';

import { ReactComponent as InfoIcon } from '@/assets/icons/warning-circle-icon.svg';

import {
  onCellCancelled,
  renderActionCell,
  renderAvailability,
  renderSpecifiedStatusDropdown,
  useSpecifyingModal,
} from '../../hooks';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { getSpecifiedProductsByBrand } from '@/features/project/services';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { ProjectProductItem } from '@/features/product/types';

import { AvailabilityModal } from '../../components/AvailabilityModal';
import { LogoIcon } from '@/components/LogoIcon';
import CustomTable, { GetExpandableTableConfig } from '@/components/Table';
import { RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

interface BrandListProps {
  projectId?: string;
}

const SpecificationByBrand: FC<BrandListProps> = ({ projectId }) => {
  useAutoExpandNestedTableColumn(1, [2, 3, 4]);
  const [visible, setVisible] = useState<boolean>(false);

  const tableRef = useRef<any>();
  const { setSpecifyingProduct, renderSpecifyingModal } = useSpecifyingModal(tableRef, {
    isSpecified: true,
  });

  const BrandColumns: TableColumnItem<ProjectProductItem>[] = [
    {
      title: 'Brand',
      dataIndex: 'brand_order',
      sorter: { multiple: 1 },
      isExpandable: true,
      render: (_value, record) => <span>{record.name}</span>,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '', // image
      render: () => <div style={{ width: 24 }} />,
    },
    {
      title: 'Collection',
    },
    {
      title: 'Product',
    },
    { title: 'Option/Variant' },
    {
      title: 'Product ID',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      width: '5%',
      align: 'center',
    },
    {
      title: (
        <div className="flex-start">
          <RobotoBodyText level={5} style={{ fontWeight: 500 }}>
            Availability
          </RobotoBodyText>
          <InfoIcon style={{ cursor: 'pointer' }} onClick={() => setVisible(true)} />
        </div>
      ),
      align: 'center',
      dataIndex: 'availability',
    },
    { title: 'Status', align: 'center', width: COLUMN_WIDTH.status },
    { title: 'Action', width: '5%', align: 'center' },
  ];

  const CollectionColumns: TableColumnItem<ProjectProductItem>[] = [
    {
      title: 'Brand',
      noBoxShadow: true,
      // dataIndex: 'brand',
      // align: 'right',
      // render: (_v, record) => {
      //   if (record.images.length) {
      //     return <LogoIcon logo={record.images[0]} size={24} />;
      //   }

      //   return null;
      // },
    },
    /// image
    {
      title: '',
      dataIndex: 'image',
      noBoxShadow: true,
      render: (_v, record) => {
        if (record.images.length) {
          return <LogoIcon logo={record.images[0]} size={24} />;
        }

        return null;
      },
    },
    {
      title: 'Collection',
      dataIndex: 'collection_name',
      noBoxShadow: true,
      onCell: onCellCancelled,
      render: (_value, record) => <span>{record.collection?.name}</span>,
    },
    {
      title: 'Product',
      dataIndex: 'name',
      noBoxShadow: true,
      onCell: onCellCancelled,
    },
    {
      title: 'Option/Variant',
      dataIndex: 'variant',
      noBoxShadow: true,
      onCell: onCellCancelled,
    },
    {
      title: 'Product ID',
      noBoxShadow: true,
      dataIndex: 'product_id',
      onCell: onCellCancelled,
    },
    {
      title: 'Count',
      noBoxShadow: true,
      width: '5%',
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      align: 'center',
      noBoxShadow: true,
      render: (_value, record) => renderAvailability(record),
    },
    {
      title: 'Status',
      noBoxShadow: true,
      dataIndex: 'specified_status',
      align: 'center',
      width: COLUMN_WIDTH.status,
      render: renderSpecifiedStatusDropdown(tableRef),
      onCell: onCellCancelled,
    },
    {
      title: 'Action',
      align: 'center',
      width: '5%',
      noBoxShadow: true,
      render: renderActionCell(setSpecifyingProduct, tableRef),
    },
  ];

  return (
    <>
      <CustomTable
        footerClass={styles.summaryFooter}
        columns={setDefaultWidthForEachColumn(BrandColumns, 5)}
        extraParams={{ projectId }}
        ref={tableRef}
        hasPagination={false}
        multiSort={{
          brand_order: 'brand_order',
        }}
        fetchDataFunc={getSpecifiedProductsByBrand}
        expandable={GetExpandableTableConfig({
          columns: setDefaultWidthForEachColumn(CollectionColumns, 5),
          childrenColumnName: 'products',
          level: 2,
        })}
      />

      {renderSpecifyingModal()}

      <AvailabilityModal visible={visible} setVisible={setVisible} />
    </>
  );
};

export default SpecificationByBrand;
