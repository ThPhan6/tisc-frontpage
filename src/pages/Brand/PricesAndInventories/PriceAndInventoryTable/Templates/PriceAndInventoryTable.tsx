import { useEffect, useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';
import { useLocation } from 'umi';

import {
  exchangeCurrency,
  fetchUnitType,
  getBrandCurrencySummary,
  updateInventories,
  updateMultipleByBackorder,
} from '@/services';
import { forEach, isEmpty, pick } from 'lodash';

import { setOpenModal } from '@/features/Import/reducers';
import store from '@/reducers';
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

  const debouncedUpdateInventories = async () => {
    const inventoryPayload: any = {};
    const warehousePayload: any = [];

    forEach(selectedRows, (row, id) => {
      const newWarehouses = (row.warehouses || []).filter((ws) => Number(ws.convert) > 0);

      inventoryPayload[id] = {
        ...pick(row, ['on_order']),
        back_order:
          newWarehouses.length && row.originBackOrder ? row.originBackOrder : row.back_order,
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

  const handleSaveCurrency = async (currency: string) => {
    if (!currency) {
      message.error('Please select a currency');
      return;
    }

    const res = await exchangeCurrency(location.state.brandId, currency);
    if (res) tableRef.current.reload();
  };

  const handleSearch = (value: string) => {
    setFilter(value);
    tableRef.current.reloadWithFilter();
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

  const handleImportExport = (type: 'import' | 'export', isSaved?: boolean) => {
    if (type === 'export') {
      store.dispatch(setOpenModal(false));
      return;
    }

    if (type === 'import' && isSaved) {
      store.dispatch(setOpenModal(false));
      tableRef.current.reload();
      getBrandCurrencySummary(location.state.brandId);
      return;
    }
  };

  const pageHeaderRender = () => (
    <InventoryHeader onSearch={handleSearch} onSaveCurrency={handleSaveCurrency} />
  );

  return (
    <PageContainer pageHeaderRender={pageHeaderRender}>
      <section className={styles.category_table}>
        <PriceAndInventoryTableHeader
          isEditMode={isEditMode}
          onToggleSwitch={handleToggleSwitch}
          onSave={handleImportExport}
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
