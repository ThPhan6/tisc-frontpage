import { useEffect, useMemo, useRef, useState } from 'react';

import { Modal, Table, TableColumnsType } from 'antd';

import { ReactComponent as CDownLeftIcon } from '@/assets/icons/c-down-left.svg';

import { getListWarehouseByInventoryId } from '@/services';
import { set } from 'lodash';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { CustomInput } from '@/components/Form/CustomInput';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/Backorder.less';
import { PriceAndInventoryColumn } from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

interface BackorderProps {
  onCancel: () => void;
  isShowBackorder: boolean;
  inventoryItem: PriceAndInventoryColumn | null;
  onUpdateBackOrder: (newBackOrderValue: number) => void;
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
  const [editedConverts, setEditedConverts] = useState<Record<string, Record<string, number>>>({});
  const [dataSource, setDataSource] = useState<BackorderColumn[]>([]);

  const inventoryCache = useRef<Record<string, BackorderColumn[]>>({});

  useEffect(() => {
    if (!inventoryItem?.id) return;

    if (inventoryCache.current[inventoryItem.id]) {
      setDataSource(inventoryCache.current[inventoryItem.id]);
      return;
    }

    const fetchListWithInventory = async () => {
      showPageLoading();

      const res: any = await getListWarehouseByInventoryId(inventoryItem.id);

      if (res) {
        inventoryCache.current[inventoryItem.id] = res.warehouses;
        setDataSource(res.warehouses);
      }

      hidePageLoading();
    };

    fetchListWithInventory();
  }, [inventoryItem?.id]);

  const handleOnChange =
    (record: BackorderColumn) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const parsedValue = parseFloat(value);

      setEditedConverts((prev) => {
        const updatedConverts = { ...prev };
        set(
          updatedConverts,
          [inventoryItem?.id ?? '', record.id],
          !isNaN(parsedValue) ? parsedValue : 0,
        );
        return updatedConverts;
      });
    };

  const handleSave = () => {
    const totalBackOrder = Object.values(editedConverts[inventoryItem?.id || ''] || {}).reduce(
      (sum, convert) => {
        return sum + convert;
      },
      0,
    );

    onUpdateBackOrder(totalBackOrder);
    onCancel();
  };

  const columns: TableColumnsType<BackorderColumn> = useMemo(
    () => [
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
            value={editedConverts[inventoryItem?.id || '']?.[item.id] ?? 0}
            onChange={handleOnChange(item)}
            additionalInputClass="indigo-dark-variant"
          />
        ),
      },
    ],
    [editedConverts],
  );

  return (
    <Modal
      width={572}
      className={styles.backorder}
      confirmLoading={true}
      title={
        <article className={styles.backorder_heading}>
          <h2 className={styles.backorder_heading_title}>BACKORDER COUNT</h2>
          <div className="d-flex items-center gap-12">
            <CDownLeftIcon className={styles.backorder_heading_icon} />
            <p className={styles.backorder_heading_count}>{inventoryItem?.back_order}</p>
          </div>
        </article>
      }
      open={isShowBackorder}
      onCancel={onCancel}
      closable={false}
      footer={<CustomSaveButton contentButton="Done" onClick={handleSave} />}
    >
      <Table pagination={false} columns={columns} dataSource={dataSource} scroll={{ x: 400 }} />
    </Modal>
  );
};

export default Backorder;
