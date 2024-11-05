import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';
import { Popover, Switch, TableColumnProps, TableProps, message } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as CDownLeftIcon } from '@/assets/icons/c-down-left.svg';
import { ReactComponent as FileSearchIcon } from '@/assets/icons/file-search-icon.svg';
import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg';
import { ReactComponent as PhotoIcon } from '@/assets/icons/photo.svg';

import { confirmDelete } from '@/helper/common';
import { useNavigationHandler } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import {
  deleteInventory,
  exchangeCurrency,
  fetchUnitType,
  getListInventories,
  updateInventories,
} from '@/services';
import { debounce, forEach, isEmpty, pick, reduce, set } from 'lodash';

import { useAppSelector } from '@/reducers';
import { ModalType } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import InventoryHeader from '@/components/InventoryHeader';
import CustomTable from '@/components/Table';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { BodyText } from '@/components/Typography';
import Backorder from '@/pages/Brand/PricesAndInventories/Backorder';
import styles from '@/pages/Brand/PricesAndInventories/CategoryTable/CategoryTable.less';
import EditableCell from '@/pages/Brand/PricesAndInventories/EditableCell';
import WareHouse from '@/pages/Brand/PricesAndInventories/WareHouse';

export interface VolumePrice {
  id?: string;
  discount_price?: number;
  discount_rate?: number;
  min_quantity?: number;
  max_quantity?: number;
  unit_type?: string;
}

export interface InventoryExchangeHistory {
  created_at: string;
  from_currency: string;
  rate: number;
  relation_id: string;
  to_currency: string;
  updated_at: string;
}

export interface InventoryPriceItem {
  created_at: string;
  currency?: string;
  unit_price: number;
  unit_type: string;
  volume_prices: VolumePrice[];
  exchange_histories: InventoryExchangeHistory[];
}
export interface InventoryColumn {
  id: string;
  image: string;
  sku: string;
  description: string;
  price: InventoryPriceItem;
  on_order?: number;
  back_order?: number;
}

export type TInventoryColumn = 'unit_price' | 'on_order' | 'backorder';

const CategoryTable: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isShowModal, setIsShowModal] = useState<ModalType>('none');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editedRows, setEditedRows] = useState<Record<string, any>>({});
  const [filter, setFilter] = useState('');
  const { unitType: unitTypeData } = useAppSelector((state) => state.summary);

  useEffect(() => {
    const getUnitType = async () => await fetchUnitType();
    getUnitType();
  }, []);

  const getUnitTypeCode = useCallback(
    (unit_type: string) => {
      return unitTypeData.find((item) => item.id === unit_type)?.code || '';
    },
    [unitTypeData],
  );

  const tableRef = useRef<any>();
  const location = useLocation<{ categoryId: string; brandId: string }>();

  const navigate = useNavigationHandler();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');

  const handleToggleModal = (type: ModalType) => () => setIsShowModal(type);

  const handleDelete = (id: string) => () => {
    confirmDelete(async () => {
      const res = await deleteInventory(id);
      if (res) tableRef.current.reload();
    });
  };

  const handlePushToUpdate = (id: string) => () =>
    navigate({
      path: PATH.brandPricesInventoriesFormUpdate.replace(':id', id),
      query: { categories: category },
      state: {
        categoryId: location.state?.categoryId,
        brandId: location.state?.brandId,
      },
    })();

  const handleRowClick = (record: InventoryColumn) => {
    if (isEditMode) return;

    const newSelectedRowKeys = [...selectedRowKeys];
    const index = newSelectedRowKeys.indexOf(record.id);
    if (index >= 0) {
      newSelectedRowKeys.splice(index, 1);
      setSelectedRowKeys(newSelectedRowKeys);
      return;
    }

    newSelectedRowKeys.push(record.id);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSaveOnCell = (
    id: string,
    columnKey: string,
    newValue: string,
    price: InventoryPriceItem,
  ) => {
    const { unit_type, volume_prices, unit_price } = price;
    set(editedRows, [id, columnKey], Number(newValue));
    set(editedRows, [id, 'unit_type'], unit_type);
    set(editedRows, [id, 'volume_prices'], volume_prices);
    if (columnKey !== 'unit_price') {
      set(editedRows, [id, 'unit_price'], unit_price);
    }
  };

  const debouncedUpdateInventories = debounce(async () => {
    const pickPayload: Record<
      string,
      Pick<InventoryColumn['price'], 'unit_price' | 'volume_prices'>
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

  const rowSelectedValue = (record: InventoryColumn, value: string | number) => (
    <span className={` ${selectedRowKeys.includes(record.id) ? 'font-medium' : ''} w-1-2`}>
      {value}
    </span>
  );

  const renderEditableCell = (item: InventoryColumn, columnKey: string, value: string | number) =>
    isEditMode ? (
      <EditableCell
        item={item}
        columnKey={columnKey}
        defaultValue={value}
        valueClass={`${isEditMode ? 'indigo-dark-variant' : ''}`}
        onSave={(id, colKey, newValue) => handleSaveOnCell(id, colKey, newValue, item.price)}
      />
    ) : (
      rowSelectedValue(item, value)
    );

  const columns: TableColumnProps<InventoryColumn>[] = useMemo(
    () => [
      {
        title: 'Image',
        dataIndex: 'image',
        render: (image) => {
          return image ? (
            <figure className={styles.category_table_figure}>
              <img src={showImageUrl(`/${image}`)} alt="Image" />
            </figure>
          ) : (
            <PhotoIcon width={35} height={32} />
          );
        },
      },
      {
        title: 'Product ID',
        sorter: true,
        dataIndex: 'sku',
        render: (_, item) => rowSelectedValue(item, item.sku),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        render: (_, item) => rowSelectedValue(item, item.description),
      },
      {
        title: 'Unit Price',
        dataIndex: 'unit_price',
        align: 'center',
        render: (_, item) => {
          const rate = reduce(
            item.price.exchange_histories?.map((unit) => unit.rate),
            (acc, el) => acc * el,
            1,
          );
          const unitPrice = Number(item.price.unit_price) * rate;

          return renderEditableCell(
            {
              ...item,
              price: {
                ...item.price,
                unit_price: unitPrice,
              },
            },
            'unit_price',
            unitPrice,
          );
        },
      },
      {
        title: 'Unit Type',
        dataIndex: 'unit_type',
        align: 'center',
        render: (_, item) => rowSelectedValue(item, getUnitTypeCode(item.price.unit_type)),
      },
      {
        title: 'Total Stock',
        dataIndex: 'total_stock',
        render: (_, item) => (
          <div className={`${styles.category_table_additional_action_wrapper} cursor-pointer`}>
            {rowSelectedValue(item, 1)}
            <div style={{ position: 'relative' }}>
              <Popover
                content={<WareHouse />}
                trigger="hover"
                placement="bottom"
                showArrow={false}
                overlayStyle={{ width: 'fit-content' }}
              >
                <FileSearchIcon />
              </Popover>
            </div>
          </div>
        ),
      },
      {
        title: 'Out stock',
        dataIndex: 'out_stock',
        align: 'center',
        render: (_, item) => <div className="red-magenta">{rowSelectedValue(item, -7)}</div>,
      },

      {
        title: 'On Order',
        dataIndex: 'on_order',
        align: 'center',
        render: (_, item) => renderEditableCell(item, 'on_order', item.on_order ?? '-'),
      },
      {
        title: 'Backorder',
        dataIndex: 'back_order',
        align: 'center',
        render: (_, item) => (
          <div
            className={`${styles.category_table_additional_action_wrapper} ${styles.back_order_card} cursor-pointer`}
          >
            <p className={`w-full my-0`}>
              {renderEditableCell(item, 'back_order', item.back_order ?? '-')}
            </p>
            {isEditMode && (
              <CDownLeftIcon
                className={styles.down_left_icon}
                onClick={handleToggleModal('BackOrder')}
              />
            )}
          </div>
        ),
      },
      {
        title: 'Volume Price',
        dataIndex: 'volumn_price',
        width: '7%',
        align: 'center',
        render: (_, item) => rowSelectedValue(item, item?.price?.volume_prices?.length),
      },
      {
        title: 'Stock Value',
        dataIndex: 'stock_value',
        render: (_, item) => rowSelectedValue(item, 'US$ 105.00'),
      },
      {
        title: 'Revision',
        dataIndex: 'revision',
        render: (_, item) => rowSelectedValue(item, item.price?.created_at?.split(' ')[0]),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        align: 'center',
        width: '5%',
        render: (_, record) => (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                label: 'Edit Row',
                onClick: handlePushToUpdate(record.id ?? ''),
              },
              {
                type: 'deleted',
                onClick: handleDelete(record.id ?? ''),
              },
            ]}
          />
        ),
      },
    ],
    [handlePushToUpdate, handleDelete, renderEditableCell, rowSelectedValue],
  );

  const rowSelection: TableProps<any>['rowSelection'] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const createRowHandler = (record: InventoryColumn) => ({
    onClick: () => handleRowClick(record),
  });

  const handleImport = (data: any) => {
    console.log('Imported data:', data);
  };
  const handleExport = () => {
    console.log('Exporting data...');
  };

  const dbHeaders = [
    'Product ID',
    'Description',
    'Unit Price',
    'Unit Type',
    'In Stock',
    'Out of Stock',
    'On Order',
    'Backorder',
  ];

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

  const pageHeaderRender = () => (
    <InventoryHeader onSearch={handleSearch} onSaveCurrency={handleSaveCurrecy} />
  );

  return (
    <PageContainer pageHeaderRender={pageHeaderRender}>
      <section className={styles.category_table}>
        <TableHeader
          title={
            <article className={styles.category_table_header}>
              <div
                className="d-flex items-center cursor-pointer"
                onClick={navigate({
                  path: PATH.brandPricesInventories,
                })}
              >
                <BodyText
                  fontFamily="Roboto"
                  level={5}
                  customClass={styles.category_table_header_title}
                >
                  HOME
                </BodyText>
                <HomeIcon />
              </div>
              <BodyText
                fontFamily="Roboto"
                level={5}
                customClass={styles.category_table_header_category}
              >
                {category}
              </BodyText>
            </article>
          }
          rightAction={
            <div className={styles.category_table_header_action}>
              <CustomPlusButton
                size={24}
                disabled={isEditMode}
                onClick={navigate({
                  path: PATH.brandPricesInventoriesForm,
                  query: { categories: category },
                  state: {
                    categoryId: location.state?.categoryId,
                    brandId: location.state?.brandId,
                  },
                })}
              />
              <CustomButton
                size="small"
                variant="primary"
                buttonClass={`${styles.category_table_header_action_btn_import} ${
                  isEditMode ? 'disabled' : ''
                }`}
                disabled={isEditMode}
              >
                <BodyText
                  fontFamily="Roboto"
                  level={6}
                  style={{ color: `${isEditMode ? '#808080' : '#000'}` }}
                  customClass={`${styles.category_table_header_action_btn_import_text}`}
                  onClick={handleToggleModal('Import/Export')}
                >
                  IMPORT
                </BodyText>
              </CustomButton>
              <Switch
                checked={isEditMode}
                onChange={handleToggleSwitch}
                size="default"
                checkedChildren="SAVE & CLOSE"
                unCheckedChildren="EDIT NOW"
                className={`${styles.category_table_header_btn_switch} ${
                  isEditMode
                    ? styles.category_table_header_btn_switch_on
                    : styles.category_table_header_btn_switch_off
                }`}
              />
            </div>
          }
        />
        <CustomTable
          rowSelection={rowSelection}
          columns={columns}
          fetchDataFunc={getListInventories}
          hasPagination
          ref={tableRef}
          onRow={createRowHandler}
          hoverOnRow={false}
          extraParams={{
            category_id: location.state.categoryId,
            ...(!isEmpty(filter) && { search: filter }),
          }}
          onFilterLoad
        />
      </section>

      <Backorder
        isShowBackorder={isShowModal === 'BackOrder'}
        onCancel={handleToggleModal('none')}
      />
      {/* <ImportExportCSV
        open={isShowModal === 'Import/Export'}
        onCancel={handleToggleModal('none')}
        onImport={handleImport}
        onExport={handleExport}
        dbHeaders={dbHeaders}
      /> */}
    </PageContainer>
  );
};

export default CategoryTable;
