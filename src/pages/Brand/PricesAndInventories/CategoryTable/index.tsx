import {
  CSSProperties,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';
import { Popover, Switch, TableColumnProps, TableProps, message } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as CDownLeftIcon } from '@/assets/icons/c-down-left.svg';
import { ReactComponent as FileSearchIcon } from '@/assets/icons/file-search-icon.svg';
import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg';
import { ReactComponent as PhotoIcon } from '@/assets/icons/photo.svg';
import { ReactComponent as SquareCDownLeft } from '@/assets/icons/square-c-down-left.svg';

import { confirmDelete } from '@/helper/common';
import { useNavigationHandler } from '@/helper/hook';
import { formatCurrencyNumber, showImageUrl } from '@/helper/utils';
import {
  deleteInventory,
  exchangeCurrency,
  fetchUnitType,
  getListInventories,
  moveInventoryToCategory,
  updateInventories,
} from '@/services';
import { debounce, forEach, isEmpty, orderBy, pick, reduce, set } from 'lodash';

import { useAppSelector } from '@/reducers';
import { ModalType } from '@/reducers/modal';

import { AccordionItem } from '@/components/AccordionMenu';
import CustomButton from '@/components/Button';
import InventoryHeader from '@/components/InventoryHeader';
import CustomTable from '@/components/Table';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import TreeSelect, { TreeItem } from '@/components/TreeSelect';
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
export interface PriceAndInventoryColumn {
  id: string;
  image: string;
  sku: string;
  description: string;
  price: InventoryPriceItem;
  on_order?: number;
  back_order?: number;
  total_stock: number;
  stockValue: number;
}

const CategoryTable: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isShowModal, setIsShowModal] = useState<ModalType>('none');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editedRows, setEditedRows] = useState<Record<string, any>>({});
  const [filter, setFilter] = useState('');
  const { unitType: unitTypeData } = useAppSelector((state) => state.summary);
  const [currentInventory, setCurrentInventory] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

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
  const treeSelectRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<any>();
  const location = useLocation<{
    categoryId: string;
    brandId: string;
    groupItems: AccordionItem[];
  }>();

  const navigate = useNavigationHandler();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');

  const treeSelectStyle = {
    padding: '6px 16px',
    width: '420px',
  };

  const wrapperTreeSelectStyle: CSSProperties = {
    position: 'absolute',
    right: '29.3rem',
    bottom: '4.5rem',
  };

  const handleToggleExpand = () => (newKeys: string[]) => setExpandedKeys(newKeys);

  const handleToggleModal = (type: ModalType) => () => setIsShowModal(type);

  const handleItemMoveToSelect = async (record: PriceAndInventoryColumn, item: TreeItem) => {
    if (item.id === location.state.categoryId) {
      message.warn('Cannot move to the category itself');
      return;
    }
    const res = await moveInventoryToCategory(record.id, item.id);
    if (res) {
      setCurrentInventory('');
      tableRef.current.reload();
    }
  };

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

  const handleRowClick = (record: PriceAndInventoryColumn) => {
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

  const handleToggleTreeSelect =
    (el: PriceAndInventoryColumn) => (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setCurrentInventory(el.id === currentInventory ? '' : el.id);
    };

  const handleClickOutside = (event: any) => {
    if (treeSelectRef.current && !treeSelectRef.current.contains(event.target as Node)) {
      setCurrentInventory('');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
      tableRef.current.reload();
    }
  }, 500);

  const handleToggleSwitch = () => {
    if (isEditMode && !isEmpty(editedRows)) {
      debouncedUpdateInventories();
      return;
    }

    setIsEditMode(!isEditMode);
  };

  const rowSelectedValue = (record: PriceAndInventoryColumn, value: string | number) => (
    <span className={` ${selectedRowKeys.includes(record.id) ? 'font-medium' : ''} w-1-2`}>
      {value}
    </span>
  );

  const renderEditableCell = (
    item: PriceAndInventoryColumn,
    columnKey: string,
    value: string | number,
  ) =>
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

  const columns: TableColumnProps<PriceAndInventoryColumn>[] = useMemo(
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
            {rowSelectedValue(item, item.total_stock)}
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
        render: (_, item) => (
          <div className={item.on_order ? 'red-magenta' : 'pure-black'}>
            {rowSelectedValue(item, item.on_order ? item.total_stock - item.on_order : '-')}
          </div>
        ),
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
        render: (_, item) => {
          const currency = orderBy(item.price.exchange_histories || [], 'created_at', 'desc')[0]
            ?.to_currency;
          return rowSelectedValue(
            item,
            `${currency} ${formatCurrencyNumber(Number(item.stockValue))}`,
          );
        },
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
                type: '',
                label: (
                  <div onClick={handleToggleTreeSelect(record)} className="relative">
                    <div className="d-flex items-center gap-12">
                      <SquareCDownLeft />
                      Move to
                    </div>

                    {currentInventory === record.id && (
                      <div ref={treeSelectRef} style={wrapperTreeSelectStyle}>
                        <TreeSelect
                          additonalStyle={treeSelectStyle}
                          showAllLevels={true}
                          isSingleExpand={false}
                          onItemSelect={(categoryItem: TreeItem) =>
                            handleItemMoveToSelect(record, categoryItem)
                          }
                          data={location.state.groupItems}
                          defaultExpandedKeys={expandedKeys}
                          onExpandedKeys={handleToggleExpand()}
                        />
                      </div>
                    )}
                  </div>
                ),
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

  const createRowHandler = (record: PriceAndInventoryColumn) => ({
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
          callbackFinishApi={() => {
            setEditedRows({});
            setIsEditMode(false);
          }}
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
