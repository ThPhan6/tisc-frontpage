import { FC, useRef, useState } from 'react';

import { COLUMN_WIDTH } from '@/constants/util';
import { useParams } from 'umi';

import { ReactComponent as InfoIcon } from '@/assets/icons/warning-circle-icon.svg';

import {
  onCellCancelled,
  renderActionCell,
  renderAvailability,
  renderSpecifiedStatusDropdown,
  useSpecifyingModal,
} from '../../hooks';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { getSpecifiedProductByMaterial } from '@/features/project/services';
import { setDefaultWidthForEachColumn, showImageUrl } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { ProjectProductItem } from '@/features/product/types';
import { OrderMethod } from '@/features/project/types';

import { AvailabilityModal } from '../../components/AvailabilityModal';
import CustomTable from '@/components/Table';
import { RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

export const SpecificationByMaterial: FC = () => {
  useAutoExpandNestedTableColumn(0, [7]);
  const tableRef = useRef<any>();
  const [visible, setVisible] = useState<boolean>(false);

  const params = useParams<{ id: string }>();
  const { setSpecifyingProduct, renderSpecifyingModal } = useSpecifyingModal(tableRef);

  const MaterialColumns: TableColumnItem<ProjectProductItem>[] = [
    {
      title: 'Material Code',
      dataIndex: 'material_order',
      sorter: { multiple: 1 },
      render: (_value, record) => <span>{record.specifiedDetail?.material_code}</span>,
      onCell: onCellCancelled,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      onCell: onCellCancelled,
      render: (_value, record) => record.specifiedDetail?.description,
    },
    {
      title: 'Image',
      dataIndex: 'images',
      width: '5%',
      align: 'center',
      render: (value) => {
        if (value) {
          return (
            <img
              src={showImageUrl(value[0])}
              style={{ width: 24, height: 24, objectFit: 'contain' }}
            />
          );
        }
        return null;
      },
    },
    {
      title: 'Brand',
      dataIndex: 'brand_order',
      sorter: { multiple: 1 },
      render: (_value, record) => <span>{record.brand?.name}</span>,
      onCell: onCellCancelled,
    },
    {
      title: 'Product',
      dataIndex: 'name',
      onCell: onCellCancelled,
    },
    {
      title: 'Quantities',
      dataIndex: 'quantity',
      align: 'center',
      onCell: onCellCancelled,
      render: (_value, record) => <span>{record.specifiedDetail?.quantity}</span>,
    },
    {
      title: 'Unit',
      dataIndex: 'unit_type',
      onCell: onCellCancelled,
      render: (_value, record) => record.specifiedDetail?.unit_type,
    },
    {
      title: 'Order Method',
      dataIndex: 'order_method',
      render: (_value, record) => (
        <span>
          {record.specifiedDetail?.order_method === OrderMethod['Direct Purchase']
            ? 'Direct Purchase'
            : 'Custom Order'}
        </span>
      ),
      onCell: onCellCancelled,
    },
    {
      title: (
        <div className="flex-start">
          <RobotoBodyText level={5} style={{ fontWeight: 500 }}>
            Availability
          </RobotoBodyText>
          <InfoIcon
            style={{ marginLeft: '8px', cursor: 'pointer' }}
            onClick={() => setVisible(true)}
          />
        </div>
      ),
      dataIndex: 'availability',
      align: 'center',
      render: (_value, record) => renderAvailability(record),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: COLUMN_WIDTH.status,
      render: renderSpecifiedStatusDropdown(tableRef),
      onCell: onCellCancelled,
    },
    {
      title: 'Action',
      width: '5%',
      align: 'center',
      render: renderActionCell(setSpecifyingProduct, tableRef),
    },
  ];

  return (
    <>
      <CustomTable
        footerClass={styles.summaryFooter}
        columns={setDefaultWidthForEachColumn(MaterialColumns, 7)}
        rowKey="specified_product_id"
        ref={tableRef}
        hasPagination={false}
        multiSort={{
          brand_order: 'brand_order',
          material_order: 'material_order',
        }}
        extraParams={{ projectId: params.id }}
        fetchDataFunc={getSpecifiedProductByMaterial}
      />
      {renderSpecifyingModal()}

      <AvailabilityModal visible={visible} setVisible={setVisible} />
    </>
  );
};
