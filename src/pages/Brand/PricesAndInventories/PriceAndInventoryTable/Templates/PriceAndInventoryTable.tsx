import { useCallback, useEffect, useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';
import { useLocation } from 'umi';

import { exchangeCurrency, fetchUnitType, updateInventories } from '@/services';
import { debounce, forEach, isEmpty, pick, set } from 'lodash';

import { ModalType } from '@/reducers/modal';

import InventoryHeader from '@/components/InventoryHeader';
import Backorder from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/Backorder';
import InventoryTable from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Organism/InventoryTable';
import PriceAndInventoryTableHeader from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Organism/TableHeader';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable.less';

export interface VolumePrice {
  id?: string;
  discount_price?: number;
  discount_rate?: number;
  min_quantity?: number;
  max_quantity?: number;
  unit_type?: string;
}

export interface PriceAndInventoryColumn {
  id: string;
  image: string;
  back_order: number;
  out_stock: number;
  total_stock: number;
  on_order: number;
  sku: string;
  description: string;
  price: {
    created_at: string;
    currency?: string;
    unit_price: number;
    unit_type: string;
    volume_prices: VolumePrice[];
    exchange_histories: {
      created_at: string;
      from_currency: string;
      rate: number;
      relation_id: string;
      to_currency: string;
      updated_at: string;
    }[];
  };
}

export type TInventoryColumn = 'unit_price' | 'on_order' | 'backorder';

const PriceAndInventoryTable: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isShowModal, setIsShowModal] = useState<ModalType>('none');
  const [filter, setFilter] = useState('');
  const [editedRows, setEditedRows] = useState<Record<string, any>>({});
  const [selectedRow, setSelectedRow] = useState<PriceAndInventoryColumn | null>(null);

  const tableRef = useRef<any>();
  const location = useLocation<{
    brandId: string;
  }>();

  useEffect(() => {
    const getUnitType = async () => await fetchUnitType();
    getUnitType();
  }, []);

  const handleToggleModal = useCallback(
    (type: ModalType, row?: PriceAndInventoryColumn) => () => {
      setIsShowModal(type);
      if (row?.id) setSelectedRow(row);
    },
    [isShowModal, selectedRow],
  );

  const debouncedUpdateInventories = debounce(async () => {
    const pickPayload: Record<
      string,
      Pick<PriceAndInventoryColumn['price'], 'unit_price' | 'volume_prices'>
    > = {};

    forEach(editedRows, (value, key) => {
      pickPayload[key] = {
        ...value,
        volume_prices: isEmpty(value.volume_prices)
          ? null
          : value.volume_prices.map((el: VolumePrice) =>
              pick(el, ['discount_rate', 'max_quantity', 'min_quantity']),
            ),
      };
    });

    const res = await updateInventories(pickPayload);
    if (res) {
      setTimeout(() => {
        tableRef.current.reload();
        setEditedRows({});
      }, 100);
    }
  }, 500);

  const handleToggleSwitch = () => {
    if (isEditMode && !isEmpty(editedRows)) {
      debouncedUpdateInventories();
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

  const handleUpdateBackOrder = (newBackOrderValue: number) => {
    if (selectedRow) set(editedRows, [selectedRow.id, 'back_order'], newBackOrderValue);
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
          editedRows={editedRows}
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
        inventoryItem={selectedRow}
        isShowBackorder={isShowModal === 'BackOrder'}
        onCancel={handleToggleModal('none')}
        onUpdateBackOrder={handleUpdateBackOrder}
      />
    </PageContainer>
  );
};

export default PriceAndInventoryTable;
