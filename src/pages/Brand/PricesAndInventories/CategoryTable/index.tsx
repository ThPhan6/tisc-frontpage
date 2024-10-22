import { useRef, useState } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';
import { Popover, Switch, TableColumnProps, TableProps } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as CDownLeftIcon } from '@/assets/icons/c-down-left.svg';
import { ReactComponent as FileSearchIcon } from '@/assets/icons/file-search-blue-color.svg';
import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg';
import { ReactComponent as PhotoIcon } from '@/assets/icons/photo.svg';
import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';

import { confirmDelete } from '@/helper/common';
import { useNavigationHandler } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { deleteInventory, getListInventories } from '@/services';

import { ModalType } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import InventoryHeader, { DataItem } from '@/components/InventoryHeader';
import CurrencyModal from '@/components/Modal/CurrencyModal';
import CustomTable from '@/components/Table';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { BodyText } from '@/components/Typography';
import Backorder from '@/pages/Brand/PricesAndInventories/Backorder';
import styles from '@/pages/Brand/PricesAndInventories/CategoryTable/CategoryTable.less';
import EditableCell from '@/pages/Brand/PricesAndInventories/EditableCell';
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
  const [isShowModal, setIsShowModal] = useState<ModalType>('none');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const tableRef = useRef<any>();
  const location = useLocation<{ categoryId: string }>();
  const navigate = useNavigationHandler();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');

  const handleToggleSwitch = () => setIsEditMode(!isEditMode);

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
      },
    })();

  const handleRowClick = (record: InventoryColumn) => {
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

  const isRowSelected = (record: InventoryColumn) => selectedRowKeys.includes(record.id);

  const renderEditableCell = (item: InventoryColumn, columnKey: string, value: string | number) =>
    isEditMode ? (
      <EditableCell
        item={item}
        columnKey={columnKey}
        defaultValue={value}
        inputStyle={{ width: 60 }}
        valueClass={`${isEditMode ? 'indigo-dark-variant' : ''}`}
        onSave={() => {}}
      />
    ) : (
      <span className={`${isRowSelected(item) ? 'font-medium' : ''}`}>{value}</span>
    );

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
      render: (_, item) => (
        <span className={`${isRowSelected(item) ? 'font-medium' : ''}`}>{item.sku}</span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '7%',
      render: (_, item) => (
        <span className={`${isRowSelected(item) ? 'font-medium' : ''}`}>{item.description}</span>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      width: '7%',
      align: 'center',
      render: (_, item) => renderEditableCell(item, 'unit_price', item?.price?.unit_price),
    },
    {
      title: 'Unit Type',
      dataIndex: 'unit_type',
      width: '7%',
      align: 'center',
      render: (_, item) => (
        <span className={`${isRowSelected(item) ? 'font-medium' : ''}`}>
          {item?.price?.unit_type}
        </span>
      ),
    },
    {
      title: 'Total Stock',
      dataIndex: 'total_stock',
      width: '7%',
      render: (_, item) => (
        <div className={`${styles.category_table_additional_action_wrapper} cursor-pointer`}>
          <span className={`${isRowSelected(item) ? 'font-medium' : ''} flex-1`}>30</span>
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
      title: 'Out stock',
      dataIndex: 'out_stock',
      align: 'center',
      width: '7%',
      render: (_, item) => (
        <span className={`${isRowSelected(item) ? 'font-medium' : ''} red-magenta`}>-7</span>
      ),
    },

    {
      title: 'On Order',
      dataIndex: 'on_order',
      width: '7%',
      align: 'center',
      render: (_, item) => renderEditableCell(item, 'on_order', 37),
    },
    {
      title: 'Backorder',
      dataIndex: 'back_order',
      width: '7%',
      render: (_, item) => (
        <div className={`${styles.category_table_additional_action_wrapper} cursor-pointer`}>
          <span className="flex-1">{renderEditableCell(item, 'unit_price', 12)}</span>
          {isEditMode && <CDownLeftIcon onClick={handleToggleModal('BackOrder')} />}
        </div>
      ),
    },
    {
      title: 'Volumn Price',
      dataIndex: 'volumn_price',
      width: '7%',
      align: 'center',
      render: (_, item) => (
        <span className={`${isRowSelected(item) ? 'font-medium' : ''}`}>
          {item?.price?.volume_prices?.length}
        </span>
      ),
    },
    {
      title: 'Stock Value',
      dataIndex: 'stock_value',
      width: '7%',
      render: (_, item) => (
        <span className={`${isRowSelected(item) ? 'font-medium' : ''}`}>US$ 105.00</span>
      ),
    },
    {
      title: 'Revision',
      dataIndex: 'revision',
      width: '7%',
      render: (_, item) => (
        <span className={`${isRowSelected(item) ? 'font-medium' : ''}`}>
          {item.price?.created_at?.split(' ')[0]}
        </span>
      ),
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
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const createRowHandler = (record: InventoryColumn) => ({
    onClick: () => handleRowClick(record),
  });

  const inventoryHeaderData: DataItem[] = [
    {
      id: '1',
      value: 'USD',
      label: 'BASE CURRENTCY',
      rightAction: (
        <SingleRightFormIcon
          className="cursor-pointer"
          width={16}
          height={16}
          onClick={handleToggleModal('Inventory Header')}
        />
      ),
    },
    {
      id: '2',
      value: '1043',
      label: 'TOTAL PRODUCT RECORDS',
    },
    {
      id: '3',
      value: 'US$ 00,000',
      label: 'TOTAL STOCK VALUE',
    },
  ];

  const pageHeaderRender = () => <InventoryHeader data={inventoryHeaderData} onSearch={() => {}} />;

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
          onRow={createRowHandler}
          hoverOnRow={false}
        />
      </section>

      <Backorder
        isShowBackorder={isShowModal === 'BackOrder'}
        onCancel={handleToggleModal('none')}
      />
      <CurrencyModal
        annouceContent="Beware that changing this currency will impact ALL of your price settings for the existing product cards and partner price rates. Proceed with caution."
        isShowAnnouncement={true}
        onCancel={handleToggleModal('none')}
        onOk={() => {}}
        open={isShowModal === 'Inventory Header'}
        title="SELECT CURRENTCY"
        data={[]}
      />
    </PageContainer>
  );
};

export default CategoryTable;
