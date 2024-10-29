import { useEffect, useMemo } from 'react';

import { Table, type TableColumnsType, message } from 'antd';

import { ReactComponent as TrashIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import { fetchUnitType } from '@/services';

import { useAppSelector } from '@/reducers';
import type { ModalType } from '@/reducers/modal';
import { PriceAndInventoryAttribute } from '@/types';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import InputGroup, { InputGroupProps } from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import InfoModal from '@/components/Modal/InfoModal';
import UnitType, { UnitItem } from '@/components/Modal/UnitType';
import { BodyText, CormorantBodyText, Title } from '@/components/Typography';
import type { VolumePrice } from '@/pages/Brand/PricesAndInventories/CategoryTable';
import EditableCell from '@/pages/Brand/PricesAndInventories/EditableCell';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';

import CollectionGallery from '@/features/gallery/CollectionGallery';

interface PriceFormProps {
  isShowModal: ModalType;
  onToggleModal: (type: ModalType) => () => void;
  formData: PriceAndInventoryAttribute;
  setFormData: React.Dispatch<React.SetStateAction<PriceAndInventoryAttribute>>;
  tableData: VolumePrice[];
  setTableData: React.Dispatch<React.SetStateAction<VolumePrice[]>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const PriceForm = ({
  isShowModal,
  onToggleModal,
  formData,
  setFormData,
  tableData,
  setTableData,
  setHasUnsavedChanges,
}: PriceFormProps) => {
  const { currencySelected, unitType } = useAppSelector((state) => state.summary);

  const disableAddPrice =
    !formData.unit_price ||
    !formData.unit_type ||
    !formData.discount_rate ||
    Number(formData.discount_rate) > 100 ||
    Number(formData.discount_rate) < 0;

  const unitTypeCode = useMemo(
    () => unitType.find((item) => item.id === formData.unit_type)?.code,
    [unitType, formData.unit_type],
  );

  useEffect(() => {
    const getUnitType = async () => await fetchUnitType();
    getUnitType();
  }, []);

  const ensureValidPricesAndQuantities = () => {
    const {
      unit_price,
      unit_type,
      min_quantity = 0,
      max_quantity = 1,
      discount_rate = 0,
    } = formData;
    const parsedUnitPrice = parseFloat(unit_price?.toString() ?? '0');
    const minQuantity = Number(min_quantity);
    const maxQuantity = Number(max_quantity);

    if (!unit_price || !unit_type || isNaN(parsedUnitPrice)) {
      message.warn('Unit price and type are required and must be valid.');
      return false;
    }

    if (discount_rate > 100) {
      message.warn('Discount rate must not exceed 100.');
      return false;
    }

    if (isNaN(minQuantity) || isNaN(maxQuantity) || minQuantity > maxQuantity) {
      message.warn('Quantities must be valid integers and min cannot exceed max.');
      return false;
    }

    return true;
  };

  const handleSaveCell = (id: string, columnKey: string, newValue: string) => {
    setTableData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [columnKey]: newValue } : item)),
    );
  };

  const renderUpdatableCell = (item: VolumePrice, columnKey: string, defaultValue: any) => {
    return (
      <EditableCell
        item={item}
        columnKey={columnKey}
        defaultValue={defaultValue}
        valueClass="indigo-dark-variant"
        onSave={handleSaveCell}
      />
    );
  };

  const handleRemoveRow = (id: string) => () =>
    setTableData((prev) => prev.filter((item) => item.id !== id));

  const priceColumn: TableColumnsType<VolumePrice> = useMemo(
    () => [
      {
        title: '#',
        dataIndex: 'key',
        width: '5%',
        align: 'center',
      },
      {
        title: 'Discount Price',
        dataIndex: 'discount_price',
        align: 'center',
        width: '20%',
      },
      {
        title: 'Discount Rate',
        dataIndex: 'discount_rate',
        align: 'center',
        width: '18%',
        render: (_, item) => renderUpdatableCell(item, 'discount_rate', item.discount_rate),
      },
      {
        title: 'Min. Quantity',
        dataIndex: 'min_quantity',
        align: 'center',
        width: '15%',
        render: (_, item) => renderUpdatableCell(item, 'min_quantity', item.min_quantity),
      },
      {
        title: 'Max. Quantity',
        dataIndex: 'max_quantity',
        align: 'center',
        width: '15%',
        render: (_, item) => renderUpdatableCell(item, 'max_quantity', item.max_quantity),
      },
      {
        title: 'Unit Type',
        dataIndex: 'unit_type',
        align: 'center',
        width: '18%',
        render: () => (
          <BodyText fontFamily="Roboto" level={5}>
            {unitTypeCode}
          </BodyText>
        ),
      },
      {
        width: '5%',
        render: (_, item) => (
          <TrashIcon
            className="cursor-pointer indigo-dark-variant"
            onClick={handleRemoveRow(item.id ?? '')}
          />
        ),
      },
    ],
    [handleRemoveRow, renderUpdatableCell],
  );

  const handleUnitPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? undefined : Number(event.target.value);

    setFormData((prev) => ({
      ...prev,
      unit_price: value,
      discount_price:
        value && prev.discount_rate ? (value * Number(prev.discount_rate)) / 100 : undefined,
    }));

    setTableData((prev) =>
      prev.map((item) => ({
        ...item,
        discount_price:
          value && item.discount_rate ? (value * Number(item.discount_rate)) / 100 : undefined,
      })),
    );

    setHasUnsavedChanges(value !== undefined);
  };

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const discountRate = Number(event.target.value);
    setFormData((prev) => ({
      ...prev,
      discount_rate: discountRate,
      discount_price: discountRate && (discountRate * Number(prev.unit_price)) / 100,
    }));
    setHasUnsavedChanges(!isNaN(discountRate) && discountRate !== 0);
  };

  const volumnDiscountInput: InputGroupProps[] = useMemo(
    () => [
      {
        prefix: 'Price',
        value: formData.discount_price ? formData.discount_price : '0.00',
        customClass: 'discount-price-area',
        readOnly: true,
        label: 'Volume Discount Price/Percentage :',
        fontLevel: 3,
        type: 'number',
      },
      {
        placeholder: '%',
        prefix: '% Rate',
        value: formData.discount_rate ? formData.discount_rate : undefined,
        onChange: handleRateChange,
        fontLevel: 3,
        type: 'number',
        max: 100,
        readOnly: !formData.unit_price,
      },
    ],
    [formData.discount_price, formData.discount_rate, formData.unit_price],
  );

  const handleFormChange =
    (field: keyof PriceAndInventoryAttribute) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      const parsedValue =
        field === 'min_quantity' || field === 'max_quantity' ? Number(value) || undefined : value;
      setFormData((prev) => ({ ...prev, [field]: parsedValue }));
      setHasUnsavedChanges(value.trim() !== '');
    };

  const handleImageChange = (updatedImages: []) =>
    setFormData((prev) => ({ ...prev, image: updatedImages }));

  const minMaxInput: InputGroupProps[] = useMemo(
    () => [
      {
        placeholder: 'min. #',
        value: formData.min_quantity,
        onChange: handleFormChange('min_quantity'),
        fontLevel: 3,
        label: 'Min./Max. Quantity :',
        type: 'number',
      },
      {
        placeholder: 'max. #',
        value: formData.max_quantity,
        onChange: handleFormChange('max_quantity'),
        fontLevel: 3,
        type: 'number',
        prefix: 'to',
      },
    ],
    [formData.min_quantity, formData.max_quantity],
  );

  const handleClearInputValue = (field: keyof PriceAndInventoryAttribute) => () =>
    setFormData((prev) => ({ ...prev, [field]: '' }));

  const handleAddRow = () => {
    if (!ensureValidPricesAndQuantities()) return;

    const newRow = {
      key: Number(tableData?.length + 1),
      id: `${tableData?.length + 1}`,
      discount_price: formData.discount_price,
      discount_rate: formData.discount_rate,
      min_quantity: formData.min_quantity,
      max_quantity: formData.max_quantity,
      unit_type: formData.unit_type,
    };

    setTableData((prev = []) => [...prev, newRow]);

    setFormData({
      ...formData,
      discount_price: 0.0,
      discount_rate: undefined,
      min_quantity: undefined,
      max_quantity: undefined,
    });
    setHasUnsavedChanges(false);
  };

  const handeSaveUnitType = (value: UnitItem | undefined) => {
    if (!value?.id) {
      message.error('Please select a unit type');
      return;
    }

    setFormData((prev) => ({ ...prev, unit_type: value.id, unit_type_code: value?.code }));
  };

  const baseAndVolumePriceInfo = {
    title: 'BASE & VOLUME PRICE',
    content: [
      {
        id: 1,
        description: (
          <>
            The{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Base Price{' '}
            </CormorantBodyText>{' '}
            and{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Volume Price
            </CormorantBodyText>{' '}
            setup the product price rates in your preferred currency. The rates are also integrated
            with your partner’s price rate, so any future price changes will update your partner’s
            price in real time.
          </>
        ),
      },
      {
        id: 2,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Product ID
          </BodyText>
        ),
        description: (
          <>
            Also referred as the{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              SKU Code
            </CormorantBodyText>{' '}
            or{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Part Article
            </CormorantBodyText>
            , it refers to the product unique production ID.
          </>
        ),
      },
      {
        id: 3,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Description
          </BodyText>
        ),
        description: <>Description the product in detail, make the text short.</>,
      },
      {
        id: 4,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Unit Price
          </BodyText>
        ),
        description: (
          <>
            Also referred as the{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Invoice Price
            </CormorantBodyText>
            .
          </>
        ),
      },
      {
        id: 4,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Volume Discount Price/Percentage
          </BodyText>
        ),
        description: (
          <>
            Sets the discount price rate and percentage for the product in bulk. The system will use
            the discount percentage to adjust the discount price automatically if the{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Unit Price
            </CormorantBodyText>{' '}
            is updated.
          </>
        ),
      },
      {
        id: 5,
        heading: (
          <BodyText fontFamily="Roboto" level={6} customClass="font-medium">
            Min./Max. Quantity
          </BodyText>
        ),
        description: (
          <>
            Sets the quantity range associated to the{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Volume Discount Price
            </CormorantBodyText>
            .
          </>
        ),
      },
    ],
  };

  return (
    <>
      <div className={`${styles.category_form_content}`}>
        <article className="d-flex items-center justify-between border-bottom-black-inset mb-8-px">
          <Title customClass={`${styles.category_form_content_title} d-flex items-center`}>
            BASE PRICE
            <WarningIcon
              className="ml-16 cursor-pointer"
              onClick={onToggleModal('Base & Volume')}
            />
          </Title>
        </article>

        <div className="d-flex items-center justify-between w-full">
          <div style={{ width: '85%' }}>
            <InputGroup
              label="Product ID (SKU Code)"
              required
              fontLevel={3}
              hasPadding
              hasHeight
              hasBoxShadow
              colorPrimaryDark
              colorRequired="tertiary"
              value={formData.sku}
              placeholder="eg. SKU code"
              deleteIcon
              onChange={handleFormChange('sku')}
              onDelete={handleClearInputValue('sku')}
            />
            <FormGroup label="Description" layout="vertical">
              <CustomTextArea
                maxLength={120}
                boxShadow
                value={formData.description}
                placeholder="type text"
                onChange={handleFormChange('description')}
              />
            </FormGroup>
          </div>

          <div className={styles.category_form_upload_image_wrapper}>
            <CollectionGallery
              onChangeImages={handleImageChange}
              data={formData.image}
              forceUpload
            />
          </div>
        </div>

        <form className="d-flex gap-16">
          <InputGroup
            label="Unit Price"
            placeholder="type price"
            required
            fontLevel={3}
            addonBefore={currencySelected}
            value={formData.unit_price}
            hasBoxShadow
            hasPadding
            type="number"
            hasHeight
            colorPrimaryDark
            colorRequired="tertiary"
            onChange={handleUnitPriceChange}
            onDelete={handleClearInputValue('unit_price')}
            deleteIcon
          />
          <InputGroup
            label="Unit Type"
            required
            fontLevel={3}
            placeholder="select from the list"
            value={unitTypeCode}
            hasBoxShadow
            hasPadding
            rightIcon
            hasHeight
            colorPrimaryDark
            colorRequired="tertiary"
            onRightIconClick={onToggleModal('Unit Type')}
            onDelete={handleClearInputValue('unit_type')}
          />
        </form>

        <article
          style={{ height: 28 }}
          className="d-flex items-center justify-between w-full border-bottom-black-inset mt-16 mb-8-px"
        >
          <Title
            customClass={`${styles.category_form_content_title} shadow-none d-flex items-center`}
          >
            VOLUME PRICE
            <WarningIcon
              className="ml-16 cursor-pointer"
              onClick={onToggleModal('Base & Volume')}
            />
          </Title>
        </article>

        <form className={`d-flex items-center gap-16 mb-8-px`}>
          <div className="d-flex items-center items-end border-bottom-light w-full">
            {volumnDiscountInput.map((input, index) => (
              <InputGroup
                key={index}
                customClass={`volume_price_area ${input.customClass ?? ''}`}
                {...input}
                message={
                  index == 1 && formData.discount_rate && formData.discount_rate > 100
                    ? 'Max discount rate is 100'
                    : undefined
                }
                messageType={
                  index == 1 && formData.discount_rate && formData.discount_rate > 100
                    ? 'error'
                    : undefined
                }
                labelProps={{
                  style: { whiteSpace: 'nowrap' },
                }}
                prefix={
                  <BodyText level={5} fontFamily="Roboto">
                    {input.prefix}
                  </BodyText>
                }
              />
            ))}
          </div>

          <div className="d-flex items-center items-end border-bottom-light w-full">
            {minMaxInput.map((input, index) => (
              <InputGroup
                key={index}
                {...input}
                prefix={
                  <BodyText level={5} fontFamily="Roboto">
                    {input.prefix}
                  </BodyText>
                }
              />
            ))}
          </div>
        </form>

        <div className="pb-16 border-bottom-black-inset" style={{ textAlign: 'right' }}>
          <CustomSaveButton
            contentButton="Add"
            style={{
              background: disableAddPrice ? '#bfbfbf' : '',
              minWidth: 48,
            }}
            onClick={disableAddPrice ? undefined : handleAddRow}
            disabled={disableAddPrice}
          />
        </div>

        <Table
          dataSource={tableData}
          columns={priceColumn}
          pagination={false}
          className={`${styles.category_form_table}`}
          scroll={{ y: 200 }}
        />
      </div>

      <UnitType
        title="SELECT UNIT TYPE"
        visible={isShowModal === 'Unit Type'}
        onCancel={onToggleModal('none')}
        onSave={handeSaveUnitType}
        defaultValue={formData.unit_type}
      />

      <InfoModal
        isOpen={isShowModal === 'Base & Volume'}
        onCancel={onToggleModal('none')}
        title={baseAndVolumePriceInfo.title}
        content={baseAndVolumePriceInfo.content}
        additionalContentClass={styles.category_form_info_modal}
      />
    </>
  );
};

export default PriceForm;
