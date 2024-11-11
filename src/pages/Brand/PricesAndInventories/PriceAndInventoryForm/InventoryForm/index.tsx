import { type CSSProperties, useEffect, useMemo } from 'react';

import { Table, type TableColumnsType, message } from 'antd';

import { ReactComponent as TrashIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import { confirmDelete, useScreen } from '@/helper/common';
import { convertToNegative } from '@/helper/utils';
import { cloneDeep, isNil, uniqueId } from 'lodash';

import store from '@/reducers';
import { ModalType, openModal } from '@/reducers/modal';
import { IPriceAndInventoryForm, InventoryAttribute, WarehouseItemMetric } from '@/types';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import InputGroup from '@/components/EntryForm/InputGroup';
import { CustomInput } from '@/components/Form/CustomInput';
import InfoModal from '@/components/Modal/InfoModal';
import { BodyText, CormorantBodyText, Title } from '@/components/Typography';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';

export interface InventoryFormProps {
  isShowModal: ModalType;
  onToggleModal: (type: ModalType) => () => void;
  formData: InventoryAttribute;
  setFormData: React.Dispatch<React.SetStateAction<IPriceAndInventoryForm>>;
}

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
          Consolidated total number of orders that are under manufacturing but have not shipped out
          yet to the warehouse. The number can be manually converted into each warehouse and the
          system will update the{' '}
          <CormorantBodyText customClass="common-cormorant-garamond-text">
            Total Stock
          </CormorantBodyText>{' '}
          accordingly.
        </>
      ),
    },
  ],
};

const customInputStyle = (value: number | undefined): CSSProperties => ({
  width: value === 0 ? 50 : 80,
  padding: 0,
  margin: 0,
});

const InventoryForm = ({
  formData,
  isShowModal,
  onToggleModal,
  setFormData,
}: InventoryFormProps) => {
  const randomId = uniqueId();

  const { isExtraLarge } = useScreen();
  const disabledAddInventory = !formData.name;

  const saveBtnStyle = {
    background: disabledAddInventory ? '#bfbfbf' : '',
    minWidth: 48,
  };

  useEffect(() => {
    const calculateStock = () => {
      const totalStock =
        formData.warehouses?.reduce((accumulator, item) => {
          const updatedAccumulator = accumulator + (Number(item.in_stock) || 0);
          return updatedAccumulator;
        }, 0) || 0;

      const onOrderValue = Number(formData.on_order) || 0;
      const outStock = onOrderValue - totalStock;

      setFormData((prev) => ({
        ...prev,
        total_stock: totalStock,
        out_of_stock: outStock <= 0 ? 0 : -outStock,
      }));
    };

    calculateStock();
  }, [formData.warehouses, formData.on_order]);

  const handleInventoryFormChange =
    (field: keyof InventoryAttribute) => (event?: React.ChangeEvent<HTMLInputElement>) => {
      const value = event?.target.value;
      setFormData((prev) => ({ ...prev, [field]: Number(value) }));
    };

  const handleRemoveRow = (id: string) => () => {
    confirmDelete(() => {
      setFormData((prev) => {
        const newWarehouses = prev.warehouses.filter((el: WarehouseItemMetric) => el.id !== id);

        return { ...prev, warehouses: newWarehouses };
      });
    });
  };

  const handleChangeWarehouse =
    (
      warehouse: WarehouseItemMetric,
      type: keyof Pick<WarehouseItemMetric, 'new_in_stock' | 'convert'>,
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value as unknown as number;

      let quantity = convertToNegative(String(value));

      if (type === 'new_in_stock') {
        quantity = Math.abs(quantity);
      }

      const newWarehouses = cloneDeep(formData.warehouses).map((el) => {
        if (el.id === warehouse.id) {
          return {
            ...el,
            [type]: quantity,
          };
        }

        return el;
      });

      setFormData((prev) => ({ ...prev, warehouses: newWarehouses }));
    };

  const warehouseColumns: TableColumnsType<WarehouseItemMetric> = useMemo(
    () => [
      {
        title: '#',
        dataIndex: '',
        align: 'center',
        width: '5%',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'WareHouse Name',
        dataIndex: 'name',
        width: '30%',
        ellipsis: true,
      },
      {
        title: 'City',
        dataIndex: 'city_name',
        width: '15%',
        ellipsis: true,
      },
      {
        title: 'Country',
        dataIndex: 'country_name',
        width: '30%',
        ellipsis: true,
      },
      {
        title: 'In stock',
        dataIndex: 'in_stock',
        align: 'center',
        width: '10%',
        render: (_, record: WarehouseItemMetric) => {
          const inStockValue = formData.warehouses?.find((ws) => ws.id === record.id)?.new_in_stock;

          return (
            <CustomInput
              pattern="^[0-9]+$"
              value={inStockValue ?? 0}
              additionalInputClass="indigo-dark-variant"
              onChange={handleChangeWarehouse(record, 'new_in_stock')}
              style={customInputStyle(inStockValue)}
            />
          );
        },
      },
      {
        title: 'Convert',
        dataIndex: 'convert',
        align: 'center',
        width: '10%',
        render: (_, record: WarehouseItemMetric) => {
          const convertValue =
            formData.warehouses?.find((ws) => ws.id === record.id)?.convert || undefined;

          return (
            <CustomInput
              pattern="^[0-9]+$"
              value={convertValue ?? 0}
              additionalInputClass="indigo-dark-variant"
              onChange={handleChangeWarehouse(record, 'convert')}
              style={customInputStyle(convertValue)}
            />
          );
        },
      },
      {
        align: 'center',
        width: '5%',
        render: (_, record) => (
          <TrashIcon
            className="cursor-pointer primary-color-dark"
            onClick={handleRemoveRow(record.id ?? '')}
          />
        ),
      },
    ],
    [JSON.stringify(formData.warehouses)],
  );

  const handleClearInputValue = (field: keyof InventoryAttribute) => () =>
    setFormData((prev) => ({ ...prev, [field]: '' }));

  const handleAddWarehouse = async () => {
    if (!formData?.location_id) {
      message.error('Please select a location');
      return;
    }

    const newRow: WarehouseItemMetric = {
      id: randomId,
      name: formData?.name ?? '',
      city_name: formData?.city_name ?? '',
      country_name: formData?.country_name ?? '',
      location_id: formData.location_id,
      new_in_stock: 0,
      in_stock: 0,
      convert: 0,
    };

    setFormData((prev) => ({
      ...prev,
      ...formData,
      name: '',
      location_id: '',
      warehouses: [...prev.warehouses, newRow],
    }));
  };

  const handleOpenLocationModal = () => {
    store.dispatch(
      openModal({
        type: 'Work Location',
        title: 'Work Location',
        props: {
          workLocation: {
            data: {
              label: '',
              value: '',
              phoneCode: '00',
            },
            onChange: (data) => {
              setFormData((prev) => ({
                ...prev,
                location_id: data.value,
                name: data?.business_name,
                city_name: data?.city_name ?? '',
                country_name: data?.country_name ?? '',
              }));
            },
          },
        },
      }),
    );
  };

  return (
    <>
      <div
        className={`${styles.category_form_content} ${
          isExtraLarge ? 'w-1-2' : 'w-full border-top-black-inset'
        }`}
      >
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
            value={formData.name}
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
            forceDisplayDeleteIcon
            value={!isNil(formData.out_of_stock) ? formData.out_of_stock : '-'}
            hasBoxShadow
            hasPadding
            hasHeight
            type="number"
            onChange={handleInventoryFormChange('out_of_stock')}
            readOnly
            inputClass={`${styles.category_form_input} ${
              formData.out_of_stock ? 'red-magenta' : 'pure-black'
            }`}
          />
          <div className={styles.category_form_on_order_input_wrapper}>
            <InputGroup
              label="On Order :"
              fontLevel={3}
              placeholder="type number"
              value={formData?.on_order ?? 0}
              hasBoxShadow
              hasPadding
              hasHeight
              deleteIcon
              type="number"
              forceDisplayDeleteIcon
              colorPrimaryDark
              colorRequired="tertiary"
              onChange={handleInventoryFormChange('on_order')}
              onDelete={handleClearInputValue('on_order')}
              message={
                formData.on_order && formData.on_order <= 0
                  ? 'Value must be greater than zero'
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
              value={formData?.back_order ?? 0}
              hasBoxShadow
              hasPadding
              hasHeight
              deleteIcon
              type="number"
              colorPrimaryDark
              forceDisplayDeleteIcon
              colorRequired="tertiary"
              onChange={handleInventoryFormChange('back_order')}
              onDelete={handleClearInputValue('back_order')}
              message={
                formData.back_order && formData.back_order <= 0
                  ? 'Value must be greater than zero'
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
            onClick={disabledAddInventory ? undefined : handleAddWarehouse}
            disabled={disabledAddInventory}
          />
        </div>

        <Table
          dataSource={formData.warehouses}
          columns={warehouseColumns}
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
    </>
  );
};

export default InventoryForm;
