import { useEffect, useMemo } from 'react';

import { Table, type TableColumnsType, message } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as TrashIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import { useScreen } from '@/helper/common';
import { isNil } from 'lodash';

import { LocationDetail } from '@/features/locations/type';
import { ModalType } from '@/reducers/modal';
import { InventoryAttribute } from '@/types';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import InputGroup from '@/components/EntryForm/InputGroup';
import InfoModal from '@/components/Modal/InfoModal';
import { BodyText, CormorantBodyText, Title } from '@/components/Typography';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';
import EditableCell from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/EditableCell';
import LocationOffice from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/LocationOffice';

export interface WarehouseItemMetrics {
  id: string;
  warehouse_name: string;
  city: string;
  country: string;
  in_stock?: number;
  convert?: number;
}

export interface InventoryFormProps {
  isShowModal: ModalType;
  onToggleModal: (type: ModalType) => () => void;
  formData: InventoryAttribute;
  setFormData: React.Dispatch<React.SetStateAction<InventoryAttribute>>;
  tableData: WarehouseItemMetrics[];
  setTableData: React.Dispatch<React.SetStateAction<WarehouseItemMetrics[]>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const InventoryForm = ({
  formData,
  isShowModal,
  onToggleModal,
  setFormData,
  setTableData,
  tableData,
  setHasUnsavedChanges,
}: InventoryFormProps) => {
  const { isExtraLarge } = useScreen();
  const location = useLocation<{ brandId: string }>();
  const disabledAddInventory =
    !formData.warehouse_name || !formData.on_order || !formData.back_order;

  const ensureValidInventory = () => {
    const { on_order, back_order } = formData;

    if (isNil(on_order) || isNil(back_order) || (+on_order < 1 && +back_order < 1)) {
      message.warn('The value cannot be equal or smaller than zero');
      return false;
    }

    return true;
  };

  useEffect(() => {
    const caculateStock = () => {
      const { totalStock, backOrder } = tableData.reduce(
        (acc, item) => {
          acc.totalStock += Number(item.in_stock) || 0;
          acc.backOrder += Number(item.convert) || 0;
          return acc;
        },
        { totalStock: 0, backOrder: 0 },
      );

      const onOrderValue = Number(formData.on_order) || 0;
      const finalTotalStock = Number(totalStock) || 0;

      const outStock = finalTotalStock - onOrderValue;

      setFormData((prev) => ({
        ...prev,
        total_stock: finalTotalStock,
        back_order: backOrder,
        out_of_stock: outStock,
      }));
    };

    caculateStock();
  }, [tableData, formData.on_order]);

  const handleInventoryFormChange =
    (field: keyof InventoryAttribute) => (event?: React.ChangeEvent<HTMLInputElement>) => {
      const value = event?.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(value !== null);
    };

  const handleRemoveRow = (id: string) => () =>
    setTableData((prev) => prev.filter((el) => el.id !== id));

  const handleSaveCell = (id: string, columnKey: string, newValue: string) => {
    setTableData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [columnKey]: newValue } : item)),
    );
  };

  const handleSaveLocationOffice = (selectedLocation: LocationDetail) => {
    setFormData((prev) => ({
      ...prev,
      location_id: selectedLocation.id,
      warehouse_name: selectedLocation.business_name,
      city: selectedLocation.city_name,
      country: selectedLocation.country_name,
    }));
    setHasUnsavedChanges(false);
  };

  const renderUpdatableCell = (
    record: WarehouseItemMetrics,
    columnKey: string,
    defaultValue: string | number,
  ) => {
    return (
      <EditableCell
        item={record}
        columnKey={columnKey}
        defaultValue={defaultValue}
        valueClass="indigo-dark-variant"
        onSave={handleSaveCell}
      />
    );
  };

  const inventoryColumn: TableColumnsType<WarehouseItemMetrics> = useMemo(
    () => [
      {
        title: '#',
        dataIndex: 'key',
        align: 'center',
        width: '5%',
      },
      {
        title: 'WareHouse Name',
        dataIndex: 'warehouse_name',
        width: '20%',
      },
      {
        title: 'City',
        dataIndex: 'city',
        width: '15%',
      },
      {
        title: 'Country',
        dataIndex: 'country',
        width: '35%',
      },
      {
        title: 'In stock',
        dataIndex: 'in_stock',
        align: 'center',
        width: '10%',
        render: (_, record) => renderUpdatableCell(record, 'in_stock', record.in_stock ?? ''),
      },
      {
        title: 'Convert',
        dataIndex: 'convert',
        align: 'center',
        width: '10%',
        render: (_, record) => renderUpdatableCell(record, 'convert', record.convert ?? ''),
      },
      {
        align: 'center',
        width: '5%',
        render: (_, record) => (
          <TrashIcon
            className="cursor-pointer primary-color-dark"
            onClick={handleRemoveRow(record.id)}
          />
        ),
      },
    ],
    [handleRemoveRow],
  );

  const handleClearInputValue = (field: keyof InventoryAttribute) => () =>
    setFormData((prev) => ({ ...prev, [field]: '' }));

  const handleAddRow = () => {
    if (!ensureValidInventory()) return;

    const newRow = {
      key: Number(tableData?.length + 1),
      id: (tableData?.length + 1).toString(),
      warehouse_name: formData.warehouse_name ?? '',
      city: formData.city ?? '',
      country: formData.country ?? '',
      in_stock: 0,
      convert: 0,
    };

    setTableData((prev = []) => [...prev, newRow]);
    setFormData({
      ...formData,
      on_order: null,
      back_order: null,
      total_stock: null,
      out_of_stock: null,
    });
    setHasUnsavedChanges(false);
  };

  const inventoryInfo = {
    title: 'INVENTORY MANAGEMENT',
    content: [
      {
        id: 1,
        description: (
          <>
            The Inventory Management allows all stakeholders accurately and quickly monitoring the
            stock and order movement.
          </>
        ),
      },
      {
        id: 2,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Location
          </BodyText>
        ),
        description: (
          <>
            Require pre-entry of the warehouse location under the{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Administration/Locations
            </CormorantBodyText>{' '}
            section.
          </>
        ),
      },
      {
        id: 3,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Total Stock
          </BodyText>
        ),
        description: <>Consolidated total number of products in the warehouse.</>,
      },
      {
        id: 4,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Out of Stock
          </BodyText>
        ),
        description: (
          <>Also referred as the stock shortage. The shortage number highlights in red colour.</>
        ),
      },
      {
        id: 4,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            On Order
          </BodyText>
        ),
        description: <>Consolidated total number of orders from the project.</>,
      },
      {
        id: 5,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Backorder
          </BodyText>
        ),
        description: (
          <>
            Consolidated total number of orders that are under manufacturing but have not shipped
            out yet to the warehouse. The number can be manually converted into each warehouse and
            the system will update the{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Total Stock
            </CormorantBodyText>{' '}
            accordingly.
          </>
        ),
      },
    ],
  };

  const saveBtnStyle = {
    background: disabledAddInventory ? '#bfbfbf' : '',
    minWidth: 48,
  };

  return (
    <>
      <div className={`${styles.category_form_content} ${isExtraLarge ? 'w-1-2' : 'w-full'}`}>
        <section className="d-flex items-center justify-between w-full">
          <Title
            style={{ paddingBottom: '32px' }}
            customClass={`${styles.category_form_content_title} shadow-none d-flex items-center`}
          >
            INVENTORY MANAGEMENT
            <WarningIcon className="ml-16 cursor-pointer" onClick={onToggleModal('Inventory')} />
          </Title>
        </section>
        <div style={{ marginTop: '-15px' }} className="pb-4">
          <InputGroup
            label="Location :"
            fontLevel={3}
            placeholder="select from the list"
            value={formData.warehouse_name}
            hasBoxShadow
            hasPadding
            rightIcon
            hasHeight
            colorPrimaryDark
            colorRequired="tertiary"
            onRightIconClick={onToggleModal('Location')}
          />
        </div>
        <form className="d-flex items-center gap-16 " style={{ height: 56 }}>
          <InputGroup
            label="Total Stock :"
            fontLevel={3}
            value={formData.total_stock ? formData.total_stock : '0'}
            hasBoxShadow
            hasPadding
            hasHeight
            type="number"
            onChange={handleInventoryFormChange('total_stock')}
            readOnly
            inputClass="pure-black"
          />
          <InputGroup
            label="Out of Stock :"
            fontLevel={3}
            placeholder="-"
            value={formData.out_of_stock ? formData.out_of_stock : ''}
            hasBoxShadow
            hasPadding
            hasHeight
            type="number"
            onChange={handleInventoryFormChange('out_of_stock')}
            readOnly
            inputClass={`${styles.category_form_input} ${
              formData.out_of_stock ? 'red-magenta' : ''
            }`}
          />
          <div className={styles.category_form_on_order_input_wrapper}>
            <InputGroup
              label="On Order :"
              fontLevel={3}
              placeholder="type number"
              value={formData.on_order!}
              hasBoxShadow
              hasPadding
              hasHeight
              deleteIcon
              type="number"
              colorPrimaryDark
              colorRequired="tertiary"
              onChange={handleInventoryFormChange('on_order')}
              onDelete={handleClearInputValue('on_order')}
              message={
                formData.on_order && formData.on_order <= 0
                  ? 'On order cannot equal or smaller than zero'
                  : undefined
              }
              messageType={formData.on_order && formData.on_order <= 0 ? 'error' : undefined}
            />
          </div>

          <div className={styles.category_form_back_order_input_wrapper}>
            <InputGroup
              label="Back Order :"
              fontLevel={3}
              placeholder="type number"
              value={formData.back_order ? formData.back_order : ''}
              hasBoxShadow
              hasPadding
              hasHeight
              deleteIcon
              type="number"
              colorPrimaryDark
              colorRequired="tertiary"
              onChange={handleInventoryFormChange('back_order')}
              onDelete={handleClearInputValue('back_order')}
              message={
                formData.back_order && formData.back_order <= 0
                  ? 'Back order cannot equal or smaller than zero'
                  : undefined
              }
              messageType={formData.back_order && formData.back_order <= 0 ? 'error' : undefined}
            />
          </div>
        </form>

        <div className="pb-16 border-bottom-black-inset text-right">
          <CustomSaveButton
            contentButton="Add"
            style={saveBtnStyle}
            onClick={disabledAddInventory ? undefined : handleAddRow}
            disabled={disabledAddInventory}
          />
        </div>

        <Table
          dataSource={tableData}
          columns={inventoryColumn}
          pagination={false}
          className={`${styles.category_form_table}`}
          scroll={{ x: 600, y: 380 }}
        />
      </div>

      <InfoModal
        isOpen={isShowModal === 'Inventory'}
        onCancel={onToggleModal('none')}
        title={inventoryInfo.title}
        content={inventoryInfo.content}
        additionalContentClass={styles.category_form_info_modal}
        additionalContainerClasses={styles.category_form_info_modal_wrapper}
      />

      <LocationOffice
        brandId={location.state.brandId}
        isOpen={isShowModal === 'Location'}
        onClose={onToggleModal('none')}
        onSave={handleSaveLocationOffice}
      />
    </>
  );
};

export default InventoryForm;
