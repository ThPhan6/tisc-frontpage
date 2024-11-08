import { useCallback, useMemo, useState } from 'react';

import { Popover, TableColumnProps, TableProps } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as CDownLeftIcon } from '@/assets/icons/c-down-left.svg';
import { ReactComponent as FileSearchIcon } from '@/assets/icons/file-search-icon.svg';
import { ReactComponent as PhotoIcon } from '@/assets/icons/photo.svg';

import { showImageUrl } from '@/helper/utils';
import { getListInventories } from '@/services';
import { get, isEmpty, omit, reduce } from 'lodash';

import { useAppSelector } from '@/reducers';
import { ModalType } from '@/reducers/modal';

import CustomTable from '@/components/Table';
import EditableCell from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/EditableCell';
import InventoryTableActionMenu from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/InventoryTableActionMenu';
import WareHouse from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/WareHouse';
import { PriceAndInventoryColumn } from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable.less';

interface InventoryTableProps {
  filter: string;
  isEditMode: boolean;
  selectedRows?: Record<string, PriceAndInventoryColumn | null>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Record<string, PriceAndInventoryColumn>>>;
  tableRef: React.MutableRefObject<any>;
  onToggleModal: (type: ModalType, rowId?: PriceAndInventoryColumn) => () => void;
}

const InventoryTable = ({
  filter,
  isEditMode,
  selectedRows,
  setSelectedRows,
  tableRef,
  onToggleModal,
}: InventoryTableProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const location = useLocation<{
    categoryId: string;
  }>();

  const { unitType: unitTypeData } = useAppSelector((state) => state.summary);

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
          },
        },
      };

      if (colKey === 'unit_price') {
        payload[id].price.unit_price = Number(value);
      }

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
        valueClass={`${isEditMode ? 'indigo-dark-variant' : ''}`}
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
        render: (_, record) => {
          const rate = reduce(
            record.price.exchange_histories?.map((unit) => unit.rate),
            (acc, el) => acc * el,
            1,
          );
          const unitPrice = Number(record.price.unit_price) * rate;

          return renderEditableCell(
            {
              ...record,
              price: {
                ...record.price,
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
            <div className="relative">
              <Popover
                content={<WareHouse inventoryItem={item} />}
                trigger="click"
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
          <div className="red-magenta">{rowSelectedValue(item, item.out_stock || 0)}</div>
        ),
      },
      {
        title: 'On Order',
        dataIndex: 'on_order',
        align: 'center',
        render: (_, item) => renderEditableCell(item, 'on_order', item?.on_order || 0),
      },
      {
        title: 'Backorder',
        dataIndex: 'back_order',
        align: 'center',
        render: (_, item) => {
          const backOrder = selectedRows?.[item.id]?.back_order ?? item?.back_order ?? 0;

          return (
            <div className={`${styles.category_table_additional_action_wrapper} cursor-pointer`}>
              <p className={`${isEditMode ? 'w-1-2 mr-16' : 'w-full'}  my-0`}>
                {renderEditableCell(item, 'back_order', backOrder)}
              </p>
              {isEditMode && <CDownLeftIcon onClick={onToggleModal('BackOrder', item)} />}
            </div>
          );
        },
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
        render: (_, record) => {
          return <InventoryTableActionMenu record={record} tableRef={tableRef} />;
        },
      },
    ],
    [renderEditableCell, rowSelectedValue],
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
        category_id: location.state?.categoryId,
        ...(!isEmpty(filter) && { search: filter }),
      }}
      onFilterLoad
    />
  );
};

export default InventoryTable;
