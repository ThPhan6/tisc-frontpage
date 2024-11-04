import { useCallback, useMemo, useState } from 'react';

import { Popover, TableColumnProps, TableProps } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as CDownLeftIcon } from '@/assets/icons/c-down-left.svg';
import { ReactComponent as FileSearchIcon } from '@/assets/icons/file-search-icon.svg';
import { ReactComponent as PhotoIcon } from '@/assets/icons/photo.svg';

import { showImageUrl } from '@/helper/utils';
import { getListInventories } from '@/services';
import { isEmpty, reduce, set } from 'lodash';

import { useAppSelector } from '@/reducers';
import { ModalType } from '@/reducers/modal';

import CustomTable from '@/components/Table';
import EditableCell from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/EditableCell';
import InventoryTableActionMenu from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/InventoryTableActionMenu';
import WareHouse from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/WareHouse';
import {
  PriceAndInventoryColumn,
  VolumePrice,
} from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable.less';

interface InventoryTableProps {
  filter: string;
  isEditMode: boolean;
  editedRows: Record<string, any>;
  tableRef: React.MutableRefObject<any>;
  onToggleModal: (type: ModalType) => () => void;
}

const InventoryTable = ({
  filter,
  isEditMode,
  editedRows,
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
        onSave={(id, colKey, newValue) =>
          handleSaveOnCell(id, colKey, newValue, item.price.unit_type, item.price.volume_prices)
        }
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
          <div className="red-magenta">
            {rowSelectedValue(item, item.total_stock - item.on_order)}
          </div>
        ),
      },
      {
        title: 'On Order',
        dataIndex: 'on_order',
        align: 'center',
        render: (_, item) => renderEditableCell(item, 'on_order', item.on_order),
      },
      {
        title: 'Backorder',
        dataIndex: 'back_order',
        align: 'center',
        render: (_, item) => {
          return (
            <div className={`${styles.category_table_additional_action_wrapper} cursor-pointer`}>
              <p className={`${isEditMode ? 'w-1-2 mr-16' : 'w-full'} my-0`}>
                {renderEditableCell(item, 'back_order', item.back_order)}
              </p>
              {isEditMode && <CDownLeftIcon onClick={onToggleModal('BackOrder')} />}
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
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
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
        category_id: location.state.categoryId,
        ...(!isEmpty(filter) && { search: filter }),
      }}
      onFilterLoad
    />
  );
};

export default InventoryTable;
