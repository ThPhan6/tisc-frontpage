import { useEffect, useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';
import { useLocation } from 'umi';

import {
  exchangeCurrency,
  fetchUnitType,
  updateInventories,
  updateMultipleByBackorder,
} from '@/services';
import { forEach, isEmpty, pick } from 'lodash';

import { ModalType } from '@/reducers/modal';
import { type PriceAndInventoryColumn } from '@/types';

import InventoryHeader from '@/components/InventoryHeader';
import Backorder from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/Backorder';
import InventoryTable from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Organism/InventoryTable';
import PriceAndInventoryTableHeader from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Organism/TableHeader';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable.less';

const PriceAndInventoryTable: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isShowModal, setIsShowModal] = useState<ModalType>('none');
  const [filter, setFilter] = useState('');
  // const [editedRows, setEditedRows] = useState<PriceAndInventoryColumn | null>(null);

  const [inventoryId, setInventoryId] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Record<string, PriceAndInventoryColumn>>({});

  const tableRef = useRef<any>();
  const location = useLocation<{
    brandId: string;
  }>();

  useEffect(() => {
    const getUnitType = async () => await fetchUnitType();
    getUnitType();
  }, []);

  const handleToggleModal = (type: ModalType, row?: PriceAndInventoryColumn) => () => {
    setIsShowModal(type);

    if (type === 'none') {
      setInventoryId('');
      return;
    }

    if (row?.id) {
      setInventoryId(row.id);
      setSelectedRows((prev) => ({
        ...prev,
        [row.id]: prev?.[row.id]
          ? prev[row.id]
          : {
              ...row,
              originBackOrder: row.back_order,
            },
      }));
    }
  };

  // console.log('selectedRows', selectedRows);

  const debouncedUpdateInventories = async () => {
    const inventoryPayload: any = {};
    const warehousePayload: any = [];
    console.log('selectedRows', selectedRows);
    forEach(selectedRows, (row, id) => {
      const newWarehouses = (row.warehouses || []).filter((ws) => Number(ws.convert) > 0);

      inventoryPayload[id] = {
        ...pick(row, ['on_order']),
        back_order:
          newWarehouses.length && row.originBackOrder
            ? row.originBackOrder
            : row.back_order > 0
            ? row.back_order
            : undefined,
        unit_price: row.price.unit_price,
        volume_prices: row.price.volume_prices?.map((el) => ({
          discount_rate: el?.discount_rate ?? 0,
          min_quantity: el?.min_quantity ?? 0,
          max_quantity: el?.max_quantity ?? 0,
        })),
      };

      const warehouse: any = {};
      newWarehouses.forEach((ws) => {
        if (ws.id) {
          warehouse[ws.id] = {
            changeQuantity: ws?.convert ?? 0,
          };
        }
      });

      if (!isEmpty(warehouse)) {
        warehousePayload.push({
          inventoryId: id,
          warehouses: warehouse,
        });
      }
    });
    await updateInventories(inventoryPayload);

    if (warehousePayload.length) {
      await updateMultipleByBackorder(warehousePayload);
    }

    tableRef.current.reload();
  };

  const handleToggleSwitch = () => {
    if (isEditMode && !isEmpty(selectedRows)) {
      debouncedUpdateInventories();
      return;
    }

    setIsEditMode(!isEditMode);
  };

  // const handleImport = (data: any) => {
  //   console.log('Imported data:', data);
  // };
  // const handleExport = () => {
  //   console.log('Exporting data...');
  // };

  // const dbHeaders = [
  //   'Product ID',
  //   'Description',
  //   'Unit Price',
  //   'Unit Type',
  //   'In Stock',
  //   'Out of Stock',
  //   'On Order',
  //   'Backorder',
  // ];

  const handleSaveCurrecy = async (currency: string) => {
    if (!currency) {
      message.error('Please select a currency');
      return;
    }

    const res = await exchangeCurrency(location.state.brandId, currency);
    if (res) tableRef.current.reload();
  };

  const handleSearch = (value: string) => {
    setFilter(value);
    tableRef.current.reload({ search: value });
  };

  const handleUpdateBackOrder = (
    payload: Pick<PriceAndInventoryColumn, 'back_order' | 'warehouses' | 'id'>,
  ) => {
    const { back_order: backOrder, id, warehouses } = payload;

    setSelectedRows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        back_order: backOrder,
        warehouses,
      },
    }));
  };

  const callbackFinishApi = () => {
    setIsEditMode(false);
    setSelectedRows({});
  };

  const pageHeaderRender = () => (
    <InventoryHeader onSearch={handleSearch} onSaveCurrency={handleSaveCurrecy} />
  );

  return (
    <PageContainer pageHeaderRender={pageHeaderRender}>
      <section className={styles.category_table}>
        <PriceAndInventoryTableHeader
          isEditMode={isEditMode}
          onToggleModal={handleToggleModal}
          onToggleSwitch={handleToggleSwitch}
        />
        <InventoryTable
          isEditMode={isEditMode}
          onToggleModal={handleToggleModal}
          tableRef={tableRef}
          filter={filter}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          callbackFinishApi={callbackFinishApi}
        />
      </section>

      {/* <ImportExportCSV
        open={isShowModal === 'Import/Export'}
        onCancel={handleToggleModal('none')}
        onImport={handleImport}
        onExport={handleExport}
        dbHeaders={dbHeaders}
      /> */}

      <Backorder
        inventoryItem={selectedRows?.[inventoryId]}
        isShowBackorder={isShowModal === 'BackOrder'}
        onCancel={handleToggleModal('none')}
        onUpdateBackOrder={handleUpdateBackOrder}
      />
    </PageContainer>
  );
};

export default PriceAndInventoryTable;
