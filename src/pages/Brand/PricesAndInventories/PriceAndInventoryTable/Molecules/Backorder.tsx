import { useMemo, useState } from 'react';

import { Modal, Table, TableColumnsType } from 'antd';

import { ReactComponent as CDownLeftIcon } from '@/assets/icons/c-down-left.svg';

import { convertToNegative } from '@/helper/utils';
import { cloneDeep, forEach, isEmpty, sum } from 'lodash';

import { PriceAndInventoryColumn } from '@/types';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { CustomInput } from '@/components/Form/CustomInput';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/Backorder.less';

export interface BackorderPayload {
  inventoryId: string;
  warehouses: {
    changeQuantity: number;
  }[];
}

interface BackorderProps {
  onCancel: () => void;
  isShowBackorder: boolean;
  inventoryItem?: PriceAndInventoryColumn | null;
  onUpdateBackOrder: (
    payload: Pick<PriceAndInventoryColumn, 'back_order' | 'warehouses' | 'id'>,
  ) => void;
}

interface BackorderColumn {
  id: string;
  name: string;
  city_name: string;
  country_name: string;
  in_stock: number;
  convert: number;
}

const Backorder = ({
  isShowBackorder,
  onCancel,
  inventoryItem,
  onUpdateBackOrder,
}: BackorderProps) => {
  const [convert, setConvert] = useState<Record<string, number>>({});

  const totalBackOrder = useMemo(() => {
    const defaultBackOrder = inventoryItem?.back_order || 0;
    const newBackOrder = sum(Object.values(convert)) || 0;

    if (isEmpty(convert) || !inventoryItem?.warehouses?.some((el) => convert[el.id]))
      return defaultBackOrder;

    return newBackOrder === 0 ? defaultBackOrder : defaultBackOrder - newBackOrder;
  }, [JSON.stringify(convert), inventoryItem?.back_order, inventoryItem?.warehouses]);

  const isQuantityInValid =
    totalBackOrder === inventoryItem?.back_order ||
    totalBackOrder > (inventoryItem?.back_order || 0) ||
    totalBackOrder < 0 ||
    Object.values(convert).some((el) => el < 0);

  const handleOnChange =
    (record: BackorderColumn) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!inventoryItem?.id) return;

      const value = event.target.value as any;

      const newQuantity = convertToNegative(value === -0 ? '-0' : String(value === '' ? 0 : value));
      const quantity = isNaN(newQuantity) ? 0 : Object.is(newQuantity, -0) ? 0 : newQuantity;

      const newEditedConverts = cloneDeep(convert);
      newEditedConverts[record.id] = isNaN(quantity) ? 0 : quantity;

      let sumQuantity = 0;
      forEach(convert, (warehouseQuantity, wsId) => {
        if (record.id === wsId) {
          sumQuantity += quantity;
        } else {
          sumQuantity += warehouseQuantity;
        }
      });

      setConvert(newEditedConverts);
    };

  const handleCancel = () => {
    setConvert((prev) => {
      const newConvert = { ...prev };

      const warehouses = inventoryItem?.warehouses.map((el) => el.id) || [];

      /// delete inventory warehouse with negative value
      forEach(newConvert, (value, key) => {
        if (warehouses.includes(key) && (value < 0 || totalBackOrder < 0)) {
          delete newConvert[key];
        }
      });

      return newConvert;
    });

    onCancel();
  };

  const handleSave = () => {
    if (!inventoryItem?.id) return;

    handleCancel();
    onUpdateBackOrder({
      back_order: totalBackOrder,
      id: inventoryItem?.id,
      warehouses: inventoryItem.warehouses.map((el) => ({
        ...el,
        convert: el?.id ? convert[el.id] : 0,
      })),
    });
  };

  const columns: TableColumnsType<BackorderColumn> = [
    {
      title: '#',
      dataIndex: 'key',
      width: '5%',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Warehouse Name',
      dataIndex: 'name',
      width: '5%',
    },
    {
      title: 'City',
      dataIndex: 'city_name',
      width: '5%',
    },
    {
      title: 'Country',
      dataIndex: 'country_name',
      width: '75%',
    },
    {
      title: 'In Stock',
      dataIndex: 'in_stock',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Convert',
      dataIndex: 'convert',
      width: '5%',
      align: 'center',
      render: (_, item) => (
        <CustomInput
          style={{ padding: '0px 0px 0px 16px' }}
          value={convert?.[item.id] ?? 0}
          onChange={handleOnChange(item)}
          additionalInputClass="indigo-dark-variant"
        />
      ),
    },
  ];

  return (
    <Modal
      className={styles.backorder}
      confirmLoading={true}
      title={
        <article className={styles.backorder_heading}>
          <h2 className={styles.backorder_heading_title}>BACKORDER CONVERSION</h2>
          <div className="d-flex items-center gap-12">
            <CDownLeftIcon className={styles.backorder_heading_icon} />
            <p
              className={`${styles.backorder_heading_count} ${
                isQuantityInValid && totalBackOrder !== inventoryItem?.back_order
                  ? 'red-magenta'
                  : ''
              }`}
            >
              {totalBackOrder}
            </p>
          </div>
        </article>
      }
      visible={isShowBackorder}
      onCancel={handleCancel}
      closable={false}
      footer={
        <CustomSaveButton
          disabled={isQuantityInValid}
          style={{
            backgroundColor: isQuantityInValid ? '#bfbfbf' : undefined,
            cursor: isQuantityInValid ? 'default' : 'pointer',
          }}
          contentButton="Done"
          onClick={handleSave}
        />
      }
    >
      <Table pagination={false} columns={columns as any} dataSource={inventoryItem?.warehouses} />
    </Modal>
  );
};

export default Backorder;
