import { useCallback, useEffect, useMemo, useState } from 'react';

import { Popover, TableColumnProps, TableProps } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as FileSearchIcon } from '@/assets/icons/file-search-icon.svg';
import { ReactComponent as PhotoIcon } from '@/assets/icons/photo-18.svg';

import { formatCurrencyNumber, showImageUrl } from '@/helper/utils';
import { getGroupCategories, getListInventories } from '@/services';
import { isEmpty, omit, orderBy, reduce } from 'lodash';

import { useAppSelector } from '@/reducers';
import { ModalType } from '@/reducers/modal';
import type { PriceAndInventoryColumn } from '@/types';

import { AccordionItem } from '@/components/AccordionMenu';
import CustomTable from '@/components/Table';
import EditableCell from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/EditableCell';
import InventoryTableActionMenu from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/InventoryTableActionMenu';
import WareHouse from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/WareHouse';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable.less';

interface InventoryTableProps {
  filter: string;
  isEditMode: boolean;
  selectedRows?: Record<string, PriceAndInventoryColumn | null>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Record<string, PriceAndInventoryColumn>>>;
  tableRef: React.MutableRefObject<any>;
  onToggleModal: (type: ModalType, rowId?: PriceAndInventoryColumn) => () => void;
  callbackFinishApi: () => void;
}

const InventoryTable = ({
  filter,
  isEditMode,
  selectedRows,
  setSelectedRows,
  tableRef,
  onToggleModal,
  callbackFinishApi,
}: InventoryTableProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const location = useLocation<{
    categoryId: string;
  }>();
  const [groupItems, setGroupItems] = useState<AccordionItem[]>([]);

  const { unitType: unitTypeData, summaryFinancialRecords } = useAppSelector(
    (state) => state.summary,
  );

  useEffect(() => {
    const fetchGroupCategories = async () => {
      const res = await getGroupCategories();
      if (res) setGroupItems(res);
    };
    fetchGroupCategories();
  }, []);

  const rowSelectedValue = (record: PriceAndInventoryColumn, value: string | number) => (
    <span className={` ${selectedRowKeys.includes(record.id) ? 'font-medium' : ''} w-1-2`}>
      {value}
    </span>
  );

  const getUnitTypeCode = useCallback(
    (unit_type: string) => {
      return unitTypeData.find((item) => item.id === unit_type)?.code || '';
    },
    [unitTypeData],
  );

  const handleSaveOnCell = (id: string, colKey: string, value: string, record: any) => {
    setSelectedRows((prev) => {
      const payload = {
        ...prev,
        [id]: {
          ...omit(record, 'id'),
          ...prev[id],
          price: {
            ...record[id]?.price,
            ...prev[id]?.price,
            volume_prices: record.price.volume_prices,
          },
          originBackOrder: record.back_order,
        },
      };

      payload[id].price.unit_price =
        colKey === 'unit_price' ? Number(value) : record.price.unit_price;

      if (colKey === 'on_order') {
        payload[id].on_order = Number(value);
      }

      if (colKey === 'back_order') {
        payload[id].back_order = Number(value);
      }

      return payload;
    });
  };

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
        style={{ padding: 0, margin: 0 }}
        valueClass={`${isEditMode ? 'indigo-dark-variant' : ''}`}
        labelStyle={{ display: 'inline-block', minWidth: 20 }}
        onSave={(id, colKey, newValue) => handleSaveOnCell(id, colKey, newValue, item)}
      />
    ) : (
      rowSelectedValue(item, value)
    );

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

  const createRowHandler = (record: PriceAndInventoryColumn) => ({
    onClick: () => handleRowClick(record),
  });

  const columns: TableColumnProps<PriceAndInventoryColumn>[] = useMemo(
    () => [
      {
        title: 'Image',
        dataIndex: 'image',
        align: 'center',
        render: (image) => {
          return image ? (
            <img src={showImageUrl(`/${image}`)} width={24} height={24} alt="Image" />
          ) : (
            <PhotoIcon style={{ marginTop: 6 }} />
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
        title: 'Base Price',
        dataIndex: 'unit_price',
        align: 'center',
        render: (_, record) => {
          const rate = reduce(
            record.price.exchange_histories?.map((unit) => unit.rate),
            (acc, el) => acc * el,
            1,
          );

          const unitPrice = Number(record?.price?.unit_price ?? 0) * rate;

          const currency =
            orderBy(record?.price?.exchange_histories || [], 'created_at', 'desc')[0]
              ?.to_currency ??
            record?.price?.currency ??
            '';

          const currencySymbol =
            summaryFinancialRecords.currencies.find(
              (cur) => cur.code.toLowerCase() === currency.toLowerCase(),
            )?.symbol ?? '';
          return renderEditableCell(
            {
              ...record,
              price: {
                ...record.price,
                unit_price: unitPrice,
              },
            },
            'unit_price',
            isEditMode
              ? Number(unitPrice.toFixed(2))
              : `${currencySymbol} ${formatCurrencyNumber(unitPrice, 'en-us', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}`,
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
            <div className="relative">
              <Popover
                content={<WareHouse inventoryItem={item} />}
                trigger="hover"
                // trigger="click"
                placement="bottom"
                showArrow={false}
                overlayStyle={{ width: 'fit-content' }}
              >
                <FileSearchIcon className="d-flex" />
              </Popover>
            </div>
          </div>
        ),
      },
      {
        title: 'Out stock',
        dataIndex: 'out_stock',
        align: 'center',
        render: (_, item) => {
          const totalStock = selectedRows?.[item.id]?.total_stock ?? item?.total_stock ?? 0;
          const onOrder = selectedRows?.[item.id]?.on_order ?? item?.on_order ?? 0;
          const quantity = onOrder - totalStock;

          return <div className="red-magenta">{quantity <= 0 ? 0 : -quantity}</div>;
        },
      },
      {
        title: 'On Order',
        dataIndex: 'on_order',
        align: 'center',
        width: '5%',
        render: (_, item) => renderEditableCell(item, 'on_order', item?.on_order || 0),
      },
      // {
      //   title: 'Backorder',
      //   dataIndex: 'back_order',
      //   width: '8%',
      //   align: 'center',
      //   render: (_, item) => {
      //     const backOrder = selectedRows?.[item.id]?.back_order ?? item?.back_order ?? 0;

      //     return (
      //       <div
      //         className={`${styles.category_table_additional_action_wrapper}  ${styles.back_order_card} cursor-pointer`}
      //       >
      //         <p className={`w-full my-0`}>{renderEditableCell(item, 'back_order', backOrder)}</p>
      //         {isEditMode && (
      //           <div style={{ height: 18 }}>
      //             <CDownLeftIcon onClick={onToggleModal('BackOrder', item)} />
      //           </div>
      //         )}
      //       </div>
      //     );
      //   },
      // },
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
          const currency =
            orderBy(item?.price?.exchange_histories || [], 'created_at', 'desc')[0]?.to_currency ??
            item?.price?.currency ??
            '';

          const currencySymbol =
            summaryFinancialRecords.currencies.find(
              (cur) => cur.code.toLowerCase() === currency.toLowerCase(),
            )?.symbol ?? '';

          return rowSelectedValue(
            item,
            `${currencySymbol} ${formatCurrencyNumber(Number(item.stock_value), 'en-us', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}`,
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
        render: (_, record) => {
          return (
            <InventoryTableActionMenu groupItems={groupItems} record={record} tableRef={tableRef} />
          );
        },
      },
    ],
    [
      isEditMode,
      JSON.stringify(selectedRows),
      selectedRowKeys,
      unitTypeData,
      groupItems,
      JSON.stringify(summaryFinancialRecords),
    ],
  );

  const rowSelection: TableProps<any>['rowSelection'] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <CustomTable
      rowSelection={rowSelection}
      columns={columns}
      fetchDataFunc={getListInventories}
      hasPagination
      ref={tableRef}
      onRow={createRowHandler}
      hoverOnRow={false}
      extraParams={{
        sort: 'sku',
        order: 'ASC',
        category_id: location.state?.categoryId,
        ...(!isEmpty(filter) && { search: filter }),
      }}
      onFilterLoad
      callbackFinishApi={callbackFinishApi}
      dynamicPageSize
    />
  );
};

export default InventoryTable;
