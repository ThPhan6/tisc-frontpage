import { useMemo, useRef, useState } from 'react';

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
  getListInventories,
  updateInventories,
} from '@/services';
import { debounce, forEach, get, isEmpty, last, pick, reduce, set } from 'lodash';

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

export interface InventoryColumn {
  id: string;
  image: {
    large: string;
    small: string;
  };
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

const CategoryTable: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isShowModal, setIsShowModal] = useState<ModalType>('none');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editedRows, setEditedRows] = useState<Record<string, any>>({});

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
    unitType: string,
    volumePrices: VolumePrice[],
  ) => {
    set(editedRows, [id, columnKey], Number(newValue));
    set(editedRows, [id, 'unit_type'], unitType);
    set(editedRows, [id, 'volume_prices'], volumePrices);
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

    console.log(pickPayload);

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
        onSave={(id, colKey, newValue) =>
          handleSaveOnCell(id, colKey, newValue, item.price.unit_type, item.price.volume_prices)
        }
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
        render: (_, item) => {
          const currencyUnitType = !isEmpty(get(item, 'price.exchange_histories'))
            ? last(item?.price?.exchange_histories)?.to_currency
            : item?.price?.currency;

          return rowSelectedValue(item, currencyUnitType ?? 0);
        },
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
        render: (_, item) => renderEditableCell(item, 'on_order', 37),
      },
      {
        title: 'Backorder',
        dataIndex: 'back_order',
        align: isEditMode ? 'left' : 'center',
        render: (_, item) => (
          <div className={`${styles.category_table_additional_action_wrapper} cursor-pointer`}>
            <span className={`${isEditMode ? 'w-1-2' : 'w-full'}`}>
              {renderEditableCell(item, 'unit_price', 12)}
            </span>
            {isEditMode && <CDownLeftIcon onClick={handleToggleModal('BackOrder')} />}
          </div>
        ),
      },
      {
        title: 'Volumn Price',
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

  const pageHeaderRender = () => (
    <InventoryHeader onSearch={() => {}} onSaveCurrency={handleSaveCurrecy} />
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
