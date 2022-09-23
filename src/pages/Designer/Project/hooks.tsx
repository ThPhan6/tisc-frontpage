import { useState } from 'react';

import { ItemType } from 'antd/es/menu/hooks/useItems';
import { useParams } from 'umi';

import { ReactComponent as CancelIcon } from '@/assets/icons/ic-circle-cancel.svg';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';

import {
  removeSpecifiedPromConsider,
  updateProductSpecifiedStatus,
} from '@/features/project/services';
import { confirmDelete } from '@/helper/common';

import { ProductItem } from '@/features/product/types';
import { SpecifyStatus } from '@/features/project/types';

import { ActionMenu } from '@/components/TableAction';
import { CustomDropDown } from '@/features/product/components';

import { SpecifyingModal } from './tabs/ProductConsidered/SpecifyingModal';

export const useSpecifyingModal = (tableRef: any) => {
  const params = useParams<{ id: string }>();
  const [specifyingProduct, setSpecifyingProduct] = useState<ProductItem>();

  const renderSpecifyingModal = () =>
    specifyingProduct ? (
      <SpecifyingModal
        visible={Boolean(specifyingProduct)}
        product={specifyingProduct}
        projectId={params.id}
        setVisible={(visible) => (visible ? undefined : setSpecifyingProduct(undefined))}
        reloadTable={tableRef.current?.reload}
      />
    ) : null;

  return { renderSpecifyingModal, setSpecifyingProduct };
};

export const renderStatusDropdown =
  (tableRef: any, checkRoom?: boolean) => (_value: any, record: any) => {
    if (record.rooms && checkRoom) {
      return null;
    }
    const menuItems: ItemType[] = [
      {
        key: SpecifyStatus['Re-specified'],
        label: 'Re-specify',
        icon: <DispatchIcon style={{ width: 16, height: 16 }} />,
        disabled: record.status !== SpecifyStatus.Cancelled,
        onClick: () => {
          updateProductSpecifiedStatus(record.specified_product_id, {
            status: SpecifyStatus['Re-specified'],
          }).then((success) => (success ? tableRef.current.reload() : undefined));
        },
      },
      {
        key: SpecifyStatus.Cancelled,
        label: 'Cancel',
        icon: <CancelIcon style={{ width: 16, height: 16 }} />,
        disabled: record.status === SpecifyStatus.Cancelled,
        onClick: () => {
          updateProductSpecifiedStatus(record.specified_product_id, {
            status: SpecifyStatus.Cancelled,
          }).then((success) => (success ? tableRef.current.reload() : undefined));
        },
      },
    ];

    const renderStatus = () => {
      if (record.status === SpecifyStatus.Specified) {
        return 'Specified';
      }
      return record.status === SpecifyStatus['Re-specified'] ? 'Re-specified' : 'Cancelled';
    };

    return (
      <CustomDropDown
        arrow
        alignRight={false}
        textCapitalize={false}
        items={menuItems}
        menuStyle={{ width: 160, height: 'auto' }}
        labelProps={{ className: 'flex-between' }}>
        {renderStatus()}
      </CustomDropDown>
    );
  };

export const renderActionCell =
  (setSpecifyingProduct: (productItem: ProductItem) => void, tableRef: any, checkRoom?: boolean) =>
  (_value: any, record: any) => {
    if (record.rooms && checkRoom) {
      return null;
    }
    return (
      <ActionMenu
        actionItems={[
          {
            type: 'updated',
            label: 'Edit',
            disabled: record.status === SpecifyStatus.Cancelled,
            onClick: () => setSpecifyingProduct(record),
          },
          {
            type: 'deleted',
            onClick: () =>
              confirmDelete(() => {
                removeSpecifiedPromConsider(record.specified_product_id).then((success) =>
                  success ? tableRef.current.reload() : undefined,
                );
              }),
          },
        ]}
      />
    );
  };

export const onCellCancelled = (data: any) => ({
  className: data.status === SpecifyStatus.Cancelled ? 'strike-through' : undefined,
});
