import { useRef, useState } from 'react';

import { PATH } from '@/constants/path';
import { Popover, Switch, TableColumnProps, TableProps } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as CDownLeftIcon } from '@/assets/icons/c-down-left.svg';
import { ReactComponent as FileSearchIcon } from '@/assets/icons/file-search-blue-color.svg';
import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg';
import { ReactComponent as PhotoIcon } from '@/assets/icons/photo.svg';

import { confirmDelete } from '@/helper/common';
import { useNavigationHandler } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { deleteInventory, getListInventories } from '@/services';

import CustomButton from '@/components/Button';
import CustomTable from '@/components/Table';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { BodyText } from '@/components/Typography';
import Backorder from '@/pages/Brand/PricesAndInventories/Backorder';
import styles from '@/pages/Brand/PricesAndInventories/CategoryTable/CategoryTable.less';
import UpdatableCell from '@/pages/Brand/PricesAndInventories/EditableCell';
import WareHouse from '@/pages/Brand/PricesAndInventories/WareHouse';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

export interface VolumePrice {
  id?: string;
  discount_price: string | number;
  discount_rate: string | number;
  min_quantity: string | number;
  max_quantity: string | number;
  unit_type: string;
}

export interface InventoryColumn {
  id: string;
  image: string;
  sku: string;
  description: string;
  price: {
    created_at: string;
    unit_price: string | number;
    unit_type: string;
    volume_prices: VolumePrice[];
  };
}

const CategoryTable: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isShowBackOrder, setIsShowBackOrder] = useState(false);

  const tableRef = useRef<any>();
  const location = useLocation<{ categoryId: string }>();
  const navigate = useNavigationHandler();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');

  const handleToggleSwitch = () => setIsEditMode(!isEditMode);

  const handleShowHideBackorder = (status: boolean) => () => setIsShowBackOrder(status);

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
      },
    })();

  const columns: TableColumnProps<InventoryColumn>[] = [
    {
      title: 'Image',
      dataIndex: 'image',
      width: '7%',
      render: (src: string) => {
        return src ? (
          <figure className={styles.category_table_figure}>
            <img src={showImageUrl(src)} alt="Image" />
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
      width: '7%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '7%',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      width: '7%',
      align: 'center',
      render: (_, item) => (
        <UpdatableCell
          item={item}
          columnKey="unit_price"
          defaultValue={item?.price?.unit_price}
          inputStyle={{ width: 60 }}
          valueClass={`${isEditMode ? 'indigo-dark-variant' : ''}`}
          onSave={() => {}}
        />
      ),
    },
    {
      title: 'Unit Type',
      dataIndex: 'unit_type',
      width: '7%',
      align: 'center',
      render: (_, item) => <span>{item?.price?.unit_type}</span>,
    },
    {
      title: 'Item In Stock',
      dataIndex: 'item_in_stock',
      width: '7%',
      render: (_, item) => (
        <div className={`${styles.category_table_additional_action_wrapper} cursor-pointer`}>
          <span className="flex-1">30</span>
          {isEditMode && (
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
          )}
        </div>
      ),
    },
    {
      title: 'On Order',
      dataIndex: 'on_order',
      width: '7%',
      align: 'center',
      render: () => <span>37</span>,
    },
    {
      title: 'Out stock',
      dataIndex: 'out_stock',
      width: '7%',
      render: () => <span>-7</span>,
    },
    {
      title: 'Backorder',
      dataIndex: 'back_order',
      width: '7%',
      render: (_, item) => (
        <div className={`${styles.category_table_additional_action_wrapper} cursor-pointer`}>
          <span className="flex-1">12</span>
          {isEditMode && <CDownLeftIcon onClick={handleShowHideBackorder(!isShowBackOrder)} />}
        </div>
      ),
    },
    {
      title: 'Volumn Price',
      dataIndex: 'volumn_price',
      width: '7%',
      align: 'center',
      render: (_, item) => <span>{item?.price?.volume_prices?.length}</span>,
    },
    {
      title: 'Stock Value',
      dataIndex: 'stock_value',
      width: '7%',
      render: () => <span>US$ 105.00</span>,
    },
    {
      title: 'Revision',
      dataIndex: 'revision',
      width: '7%',
      render: (_, item) => <span>{item.price?.created_at?.split(' ')[0]}</span>,
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
  ];

  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  return (
    <>
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
        />
      </section>

      <Backorder isShowBackorder={isShowBackOrder} onCancel={handleShowHideBackorder(false)} />
    </>
  );
};

export default CategoryTable;
