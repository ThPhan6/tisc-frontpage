import { useEffect, useMemo, useState } from 'react';

import { Table, type TableColumnsType } from 'antd';

import { ReactComponent as TrashIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import store from '@/reducers';
import { type ModalType, openModal } from '@/reducers/modal';
import { InventoryAttribute } from '@/types';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import InputGroup from '@/components/EntryForm/InputGroup';
import InfoModal from '@/components/Modal/InfoModal';
import { BodyText, CormorantBodyText, Title } from '@/components/Typography';
import EditableCell from '@/pages/Brand/PricesAndInventories/EditableCell';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';

export interface WarehouseItemMetrics {
  id: string;
  warehouse_name: string;
  city: string;
  country: string;
  in_stock: string;
  convert: string;
}

interface InventoryFromProps {
  isShowModal: ModalType;
  onToggleModal: (type: ModalType) => () => void;
}

const initialData = {
  work_location: '',
  location_id: '',
  total_stock: null,
  out_of_stock: null,
  on_order: null,
  back_order: null,
};

const InventoryForm = ({ isShowModal, onToggleModal }: InventoryFromProps) => {
  const [inventoryFormData, setInventoryFormData] = useState<InventoryAttribute>(initialData);
  const [workLocation, setWorkLocation] = useState({
    label: '',
    value: inventoryFormData.location_id,
    phoneCode: '00',
  });
  const [inventoryTableData, setInventoryTableData] = useState<WarehouseItemMetrics[]>([]);

  useEffect(() => {
    setWorkLocation((prev) => ({
      value: inventoryFormData.location_id || prev.value,
      label: inventoryFormData.work_location || prev.label,
      phoneCode: '00',
    }));
  }, [inventoryFormData.location_id]);

  const handleInventoryFormChange =
    (field: keyof InventoryAttribute, fieldValue?: string) =>
    (event?: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'location_id' ? fieldValue : event?.target.value;
      setInventoryFormData((prev) => ({ ...prev, [field]: value }));
    };

  useEffect(() => {
    handleInventoryFormChange('location_id', workLocation.value)();
  }, [workLocation]);

  const handleRemoveRow = (id: string) => () =>
    setInventoryTableData((prev) => prev.filter((el) => el.id !== id));

  const inventoryColumn: TableColumnsType<any> = useMemo(
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
        width: '5%',
      },
      {
        title: 'City',
        dataIndex: 'city',
        width: '10%',
      },
      {
        title: 'Country',
        dataIndex: 'country',
        width: '65%',
      },
      {
        title: 'In stock',
        dataIndex: 'in_stock',
        align: 'center',
        width: '5%',
        render: (_: any, item) => (
          <EditableCell
            item={item}
            columnKey="add_to"
            defaultValue="6"
            valueClass="indigo-dark-variant"
            onSave={() => {}}
          />
        ),
      },
      {
        title: 'Convert',
        dataIndex: 'convert',
        align: 'center',
        width: '5%',
        render: (_: any, item) => (
          <EditableCell
            item={item}
            columnKey="convert"
            defaultValue="0"
            valueClass="indigo-dark-variant"
            onSave={() => {}}
          />
        ),
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

  const handleOpenLocationModal = () => {
    store.dispatch(
      openModal({
        type: 'Work Location',
        title: 'Work Location',
        props: { workLocation: { data: workLocation, onChange: setWorkLocation } },
      }),
    );
  };

  const handleClearInputValue = (field: keyof InventoryAttribute) => () =>
    setInventoryFormData((prev) => ({ ...prev, [field]: '' }));

  const inventoryInfo = {
    title: 'BASE & VOLUME PRICE',
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

  return (
    <>
      <div className={styles.category_form_content}>
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
            value={workLocation.label}
            hasBoxShadow
            hasPadding
            rightIcon
            hasHeight
            colorPrimaryDark
            colorRequired="tertiary"
            onRightIconClick={handleOpenLocationModal}
          />
        </div>
        <form className="d-flex items-center gap-16 " style={{ height: 56 }}>
          <InputGroup
            label="Total Stock :"
            fontLevel={3}
            value={inventoryFormData.total_stock ? inventoryFormData.total_stock : '0'}
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
            value={inventoryFormData.out_of_stock!}
            hasBoxShadow
            hasPadding
            hasHeight
            deleteIcon
            type="number"
            onDelete={handleClearInputValue('out_of_stock')}
            onChange={handleInventoryFormChange('out_of_stock')}
            readOnly
            inputClass={styles.category_form_input}
          />
          <InputGroup
            label="On Order :"
            fontLevel={3}
            placeholder="type number"
            value={inventoryFormData.on_order!}
            hasBoxShadow
            hasPadding
            hasHeight
            deleteIcon
            type="number"
            colorPrimaryDark
            colorRequired="tertiary"
            onChange={handleInventoryFormChange('on_order')}
            onDelete={handleClearInputValue('on_order')}
          />
          <InputGroup
            label="Back Order :"
            fontLevel={3}
            placeholder="type number"
            value={inventoryFormData.back_order!}
            hasBoxShadow
            hasPadding
            hasHeight
            deleteIcon
            type="number"
            colorPrimaryDark
            colorRequired="tertiary"
            onChange={handleInventoryFormChange('back_order')}
            onDelete={handleClearInputValue('back_order')}
          />
        </form>

        <div className="pb-16 border-bottom-black-inset" style={{ textAlign: 'right' }}>
          <CustomSaveButton
            contentButton="Add"
            style={{
              background: true ? '#bfbfbf' : '',
              minWidth: 48,
            }}
            onClick={() => {}}
            disabled={false}
          />
        </div>

        <Table
          dataSource={inventoryTableData}
          columns={inventoryColumn}
          pagination={false}
          className={`${styles.category_form_table}`}
        />
      </div>

      <InfoModal
        isOpen={isShowModal === 'Inventory'}
        onCancel={onToggleModal('none')}
        title={inventoryInfo.title}
        content={inventoryInfo.content}
        additionalContentClass={styles.category_form_info_modal}
      />
    </>
  );
};

export default InventoryForm;
