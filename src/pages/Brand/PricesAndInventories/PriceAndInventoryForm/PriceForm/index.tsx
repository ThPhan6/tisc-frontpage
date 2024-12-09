import { useEffect, useMemo } from 'react';

import { Table, type TableColumnsType, message } from 'antd';

import { ReactComponent as TrashIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import { useScreen } from '@/helper/common';
import { formatCurrencyNumber } from '@/helper/utils';
import { fetchUnitType } from '@/services';
import { filter, map, sortBy } from 'lodash';

import { useAppSelector } from '@/reducers';
import type { ModalType } from '@/reducers/modal';
import { IPriceAndInventoryForm, PriceAttribute, type VolumePrice } from '@/types';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import InputGroup, { InputGroupProps } from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import InfoModal from '@/components/Modal/InfoModal';
import UnitType, { UnitItem } from '@/components/Modal/UnitType';
import { BodyText, CormorantBodyText, Title } from '@/components/Typography';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';
import EditableCell from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/EditableCell';

import CollectionGallery from '@/features/gallery/CollectionGallery';

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

interface PriceFormProps {
  isShowModal: ModalType;
  onToggleModal: (type: ModalType) => () => void;
  formData: PriceAttribute;
  setFormData: React.Dispatch<React.SetStateAction<IPriceAndInventoryForm>>;
  tableData: VolumePrice[];
  setTableData: React.Dispatch<React.SetStateAction<VolumePrice[]>>;
}

const PriceForm = ({
  isShowModal,
  onToggleModal,
  formData,
  setFormData,
  tableData,
  setTableData,
}: PriceFormProps) => {
  const { isExtraLarge, isMobile } = useScreen();

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

    if (discount_rate && discount_rate > 100) {
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
    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        volume_prices: map(prev.price.volume_prices, (item: VolumePrice) =>
          item.id === id ? { ...item, [columnKey]: Number(newValue) } : item,
        ),
      },
    }));
  };

  const renderUpdatableCell = (item: VolumePrice, columnKey: string, defaultValue: any) => {
    return (
      <EditableCell
        item={item}
        columnKey={columnKey}
        defaultValue={defaultValue}
        valueClass="indigo-dark-variant"
        onSave={handleSaveCell}
        includePercentage={columnKey === 'discount_rate'}
      />
    );
  };

  const handleRemoveRow = (id: string) => () => {
    setTableData((prev) => prev.filter((item) => item.id !== id));
    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        volume_prices: filter(prev.price.volume_prices, (item: VolumePrice) => item.id !== id),
      },
    }));
  };

  const priceColumn: TableColumnsType<VolumePrice> = useMemo(
    () => [
      {
        title: '#',
        dataIndex: '',
        width: '5%',
        align: 'center',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'Discount Price',
        dataIndex: 'discount_price',
        align: 'center',
        width: '20%',
        render: (value: number) => (
          <BodyText fontFamily="Roboto" level={5}>
            {formatCurrencyNumber(value)}
          </BodyText>
        ),
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

  const handleFormChange =
    (field: keyof PriceAttribute) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value as any;

      setFormData((prev) => ({
        ...prev,
        [field]: ['sku', 'description'].includes(field)
          ? value
          : value === ''
          ? null
          : Number(value),
        discount_price:
          field === 'discount_rate' ? (value * Number(prev.unit_price)) / 100 : prev.discount_price,
      }));
    };

  const handleImageChange = (updatedImages: []) =>
    setFormData((prev) => ({ ...prev, image: updatedImages }));

  const handleClearInputValue = (field: keyof PriceAttribute) => () =>
    setFormData((prev) => ({ ...prev, [field]: '' }));

  const handleAddRow = () => {
    if (!ensureValidPricesAndQuantities()) return;

    const newRow = {
      id: `${tableData?.length + 1}`,
      discount_price: formData?.discount_price ?? null,
      discount_rate: formData?.discount_rate ?? null,
      min_quantity: formData?.min_quantity ?? null,
      max_quantity: formData?.max_quantity ?? null,
      unit_type: formData.unit_type,
    };

    setTableData((prev = []) => [...prev, newRow]);

    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        volume_prices: prev.price?.volume_prices ? [...prev.price.volume_prices, newRow] : [newRow],
      },
      discount_price: 0.0,
      discount_rate: null,
      min_quantity: null,
      max_quantity: null,
    }));
  };

  const handeSaveUnitType = (value: UnitItem | undefined) => {
    if (!value?.id) {
      message.error('Please select a unit type');
      return;
    }

    setFormData((prev) => ({ ...prev, unit_type: value.id, unit_type_code: value?.code }));
  };

  const saveBtnStyle = {
    background: disableAddPrice ? '#bfbfbf' : '',
    minWidth: 48,
  };

  const volumnDiscountInput: InputGroupProps[] = useMemo(
    () => [
      {
        prefix: currencySelected,
        value: formData.discount_price ? formData.discount_price : '0.00',
        customClass: 'discount-price-area',
        readOnly: true,
        label: 'Volume Discount Price/Percentage :',
        fontLevel: 3,
        type: 'number',
      },
      {
        placeholder: '%',
        prefix: 'Discount %',
        value: formData.discount_rate ? formData.discount_rate : undefined,
        onChange: handleFormChange('discount_rate'),
        fontLevel: 3,
        type: 'number',
        max: 100,
        readOnly: !formData.unit_price,
      },
    ],
    [formData.discount_price, formData.discount_rate, formData.unit_price, currencySelected],
  );

  const minMaxInput: InputGroupProps[] = useMemo(
    () => [
      {
        placeholder: 'min. #',
        value: formData?.min_quantity ?? undefined,
        onChange: handleFormChange('min_quantity'),
        fontLevel: 3,
        label: <span className="w-max block">Min./Max. Quantity :</span>,
        type: 'number',
      },
      {
        placeholder: 'max. #',
        value: formData?.max_quantity ?? undefined,
        onChange: handleFormChange('max_quantity'),
        fontLevel: 3,
        type: 'number',
        prefix: 'to',
      },
    ],
    [formData?.min_quantity, formData?.max_quantity],
  );

  return (
    <>
      <div
        className={`${styles.category_form_content} ${
          isExtraLarge ? ' w-1-2 border-right-black-inset' : 'w-full'
        }`}
      >
        <article className="d-flex items-center justify-between border-bottom-black-inset mb-8-px">
          <Title customClass={`${styles.category_form_content_title} d-flex items-center`}>
            BASE PRICE
            <WarningIcon
              className="ml-16 cursor-pointer"
              onClick={onToggleModal('Base & Volume')}
            />
          </Title>
        </article>

        <div className="d-flex items-center justify-between w-full gap-16">
          <div className={styles.category_form_sku_description_wrapper}>
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
              containerStyles={{ marginLeft: 20, padding: '8px 0 0 16px' }}
            />
          </div>
        </div>

        <form className="d-flex gap-16 h-56">
          <InputGroup
            label="Unit Price"
            placeholder="type price"
            required
            fontLevel={3}
            addonBefore={currencySelected}
            value={formData?.unit_price ?? undefined}
            hasBoxShadow
            hasPadding
            type="number"
            hasHeight
            colorPrimaryDark
            colorRequired="tertiary"
            onChange={handleFormChange('unit_price')}
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
          className="d-flex items-center justify-between w-full mt-16 mb-8-px"
        >
          <Title
            customClass={`${styles.category_form_content_title} border-bottom-black-inset w-full d-flex items-center`}
          >
            VOLUME PRICE
            <WarningIcon
              className="ml-16 cursor-pointer"
              onClick={onToggleModal('Base & Volume')}
            />
          </Title>
        </article>

        <form className={`${isMobile ? 'block' : 'd-flex'} gap-16 mb-8-px w-full`}>
          <div
            className={`d-flex items-center items-end border-bottom-light ${
              isMobile ? 'w-full mb-16' : 'w-1-2'
            }`}
          >
            {volumnDiscountInput.map((input, index) => (
              <InputGroup
                key={index}
                forceDisplayDeleteIcon
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

          <div
            className={`d-flex items-center items-end border-bottom-light ${
              isMobile ? 'w-full mb-16' : 'w-1-2'
            }`}
          >
            {minMaxInput.map((input, index) => (
              <InputGroup
                forceDisplayDeleteIcon
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

        <div className="pb-16 border-bottom-black-inset text-right">
          <CustomSaveButton
            contentButton="Add"
            style={saveBtnStyle}
            onClick={disableAddPrice ? undefined : handleAddRow}
            disabled={disableAddPrice}
          />
        </div>

        <Table
          dataSource={sortBy(tableData, 'min_quantity')}
          columns={priceColumn}
          pagination={false}
          className={`${styles.category_form_table}`}
          scroll={{
            x: 500,
            y: 185,
          }}
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
        additionalContainerClasses={styles.category_form_info_modal_wrapper}
      />
    </>
  );
};

export default PriceForm;
