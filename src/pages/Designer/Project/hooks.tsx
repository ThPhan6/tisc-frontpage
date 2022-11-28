import { useState } from 'react';

import { ItemType } from 'antd/es/menu/hooks/useItems';
import { useParams } from 'umi';

import { ReactComponent as AvailableIcon } from '@/assets/icons/availability-available.svg';
import { ReactComponent as DiscontinuedIcon } from '@/assets/icons/availability-discontinued.svg';
import { ReactComponent as DiscrepancyIcon } from '@/assets/icons/availability-discrepancy.svg';
import { ReactComponent as OutOfStockIcon } from '@/assets/icons/availability-out-of-stock.svg';
import { ReactComponent as CancelIcon } from '@/assets/icons/ic-circle-cancel.svg';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';

import {
  removeProductFromProject,
  updateProductSpecifiedStatus,
} from '@/features/project/services';
import { confirmDelete } from '@/helper/common';

import {
  setPartialProductDetail,
  setPartialProductSpecifiedData,
  setReferToDesignDocument,
} from '@/features/product/reducers';
import { Availability, ProductItem, ProjectProductItem } from '@/features/product/types';
import { ProductSpecifyStatus } from '@/features/project/types';
import store from '@/reducers';

import { ActionMenu } from '@/components/TableAction';
import { CustomDropDown } from '@/features/product/components';

import { setCustomProductDetail } from '../Products/CustomLibrary/slice';
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

export const renderSpecifiedStatusDropdown =
  (tableRef: any, checkRoom?: boolean) => (_value: any, record: ProjectProductItem) => {
    if (record.rooms && checkRoom) {
      return null;
    }
    const menuItems: ItemType[] = [
      {
        key: ProductSpecifyStatus['Re-specified'],
        label: 'Re-specify',
        icon: <DispatchIcon style={{ width: 16, height: 16 }} />,
        disabled: record.specifiedDetail?.specified_status !== ProductSpecifyStatus.Cancelled,
        onClick: () => {
          updateProductSpecifiedStatus(record.specifiedDetail?.id ?? '', {
            specified_status: ProductSpecifyStatus['Re-specified'],
          }).then((success) => (success ? tableRef.current.reload() : undefined));
        },
      },
      {
        key: ProductSpecifyStatus.Cancelled,
        label: 'Cancel',
        icon: <CancelIcon style={{ width: 16, height: 16 }} />,
        disabled: record.specifiedDetail?.specified_status === ProductSpecifyStatus.Cancelled,
        onClick: () => {
          updateProductSpecifiedStatus(record.specifiedDetail?.id ?? '', {
            specified_status: ProductSpecifyStatus.Cancelled,
          }).then((success) => (success ? tableRef.current.reload() : undefined));
        },
      },
    ];

    return (
      <CustomDropDown
        arrow
        alignRight={false}
        textCapitalize={false}
        items={menuItems}
        menuStyle={{ width: 160, height: 'auto' }}
        labelProps={{ className: 'flex-between' }}>
        {typeof record.specifiedDetail?.specified_status === 'number'
          ? ProductSpecifyStatus[record.specifiedDetail.specified_status]
          : ''}
      </CustomDropDown>
    );
  };

export const onOpenSpecifiyingProductModal = (record: ProjectProductItem) => {
  if (!record.specifiedDetail) {
    return;
  }
  if (record.specifiedDetail.custom_product) {
    store.dispatch(
      setCustomProductDetail({
        specifiedDetail: {
          ...record.specifiedDetail,
          specification: {
            is_refer_document: record.specifiedDetail.specification.is_refer_document,
            attribute_groups: record.specifiedDetail.specification.attribute_groups.map((el) => ({
              ...el,
              isChecked: true,
            })),
          },
        },
      }),
    );
  } else {
    store.dispatch(setPartialProductSpecifiedData(record.specifiedDetail));
    store.dispatch(
      setPartialProductDetail({
        distributor_location_id: record.specifiedDetail.distributor_location_id,
        brand_location_id: record.specifiedDetail.brand_location_id,
      }),
    );
    store.dispatch(
      setReferToDesignDocument(
        typeof record.specifiedDetail?.specification?.is_refer_document === 'boolean'
          ? record.specifiedDetail?.specification?.is_refer_document
          : true,
      ),
    );
  }
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
            disabled: record.specifiedDetail?.specified_status === ProductSpecifyStatus.Cancelled,
            onClick: () => {
              setSpecifyingProduct(record);
              onOpenSpecifiyingProductModal(record);
            },
          },
          {
            type: 'deleted',
            onClick: () =>
              confirmDelete(() => {
                removeProductFromProject(record.specifiedDetail?.id).then((success) =>
                  success ? tableRef.current.reload() : undefined,
                );
              }),
          },
        ]}
      />
    );
  };

export const onCellCancelled = (data: any) => ({
  className:
    data.specifiedDetail?.specified_status === ProductSpecifyStatus.Cancelled
      ? 'strike-through'
      : undefined,
});

export const renderAvailability = (record: any) => {
  if (record.rooms) return null;

  if (record.availability === Availability.Available) {
    return <AvailableIcon />;
  }
  if (record.availability === Availability.Discontinued) {
    return <DiscontinuedIcon />;
  }
  if (record.availability === Availability.Discrepancy) {
    return <DiscrepancyIcon />;
  }

  return <OutOfStockIcon />;
};
