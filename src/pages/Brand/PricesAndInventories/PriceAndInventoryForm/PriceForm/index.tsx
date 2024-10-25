import { useEffect, useMemo, useState } from 'react';

import { Table, type TableColumnsType, type UploadFile, message } from 'antd';

import { ReactComponent as TrashIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as UploadIcon } from '@/assets/icons/action-upload-icon.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import { fetchUnitType } from '@/services';

import { useAppSelector } from '@/reducers';
import type { ModalType } from '@/reducers/modal';

import InputGroup, { InputGroupProps } from '@/components/EntryForm/InputGroup';
import UploadImageInput from '@/components/EntryForm/UploadImageInput';
import volumeInputStyles from '@/components/EntryForm/styles/VolumeInput.less';
import InfoModal from '@/components/Modal/InfoModal';
import UnitType, { UnitItem } from '@/components/Modal/UnitType';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, CormorantBodyText, Title } from '@/components/Typography';
import type { VolumePrice } from '@/pages/Brand/PricesAndInventories/CategoryTable';
import EditableCell from '@/pages/Brand/PricesAndInventories/EditableCell';
import type { PriceAndInventoryAttribute } from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';

interface PriceFormProps {
  isShowModal: ModalType;
  onToggleModal: (type: ModalType) => () => void;
  formData: PriceAndInventoryAttribute;
  setFormData: React.Dispatch<React.SetStateAction<PriceAndInventoryAttribute>>;
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
  const [isLgScreen, setIsLgScreen] = useState(window.innerWidth > 1500);
  const { currencySelected, unitType } = useAppSelector((state) => state.summary);

  const unitTypeCode = useMemo(
    () => unitType.find((item) => item.id === formData.unit_type)?.code,
    [unitType, formData.unit_type],
  );

  useEffect(() => {
    const handleResize = () => setIsLgScreen(window.innerWidth >= 1500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getUnitType = async () => {
      await fetchUnitType();
    };

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
    const minQuantity = min_quantity;
    const maxQuantity = max_quantity;

    if (!unit_price || !unit_type || isNaN(parsedUnitPrice)) {
      message.warn('Unit price and type are required and must be valid.');
      return false;
    }

    if (discount_rate > 100) {
      message.warn('Discount rate must not exceed 100.');
      return false;
    }

    if (isNaN(Number(minQuantity)) || isNaN(Number(maxQuantity)) || minQuantity > maxQuantity) {
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

  const renderUpdatableCell = (item: any, columnKey: string, defaultValue: any) => {
    return (
      <EditableCell
        item={item}
        columnKey={columnKey}
        defaultValue={defaultValue}
        autoWidth
        valueClass="indigo-dark-variant"
        onSave={handleSaveCell}
      />
    );
  };

  const handleRemoveRow = (id: string) => () =>
    setTableData((prev) => prev.filter((item) => item.id !== id));

  const priceColumn: TableColumnsType<VolumePrice> = [
    {
      title: '#',
      dataIndex: 'key',
      width: '28px',
      align: 'center',
    },
    {
      title: 'Discount Price',
      dataIndex: 'discount_price',
      align: 'center',
      width: '132px',
    },
    {
      title: 'Discount Rate',
      dataIndex: 'discount_rate',
      align: 'center',
      width: '78px',
      render: (_, item) => renderUpdatableCell(item, 'discount_rate', `${item.discount_rate}`),
    },
    {
      title: 'Min. Quantity',
      dataIndex: 'min_quantity',
      align: 'center',
      width: '78px',
      render: (_, item) => renderUpdatableCell(item, 'min_quantity', item.min_quantity),
    },
    {
      title: 'Max. Quantity',
      dataIndex: 'max_quantity',
      align: 'center',
      width: '78px',
      render: (_, item) => renderUpdatableCell(item, 'max_quantity', item.max_quantity),
    },
    {
      title: 'Unit Type',
      dataIndex: 'unit_type',
      align: 'center',
      width: '69px',
      render: () => (
        <BodyText fontFamily="Roboto" level={5}>
          {unitTypeCode}
        </BodyText>
      ),
    },
    {
      width: '28px',
      render: (_, item) => (
        <TrashIcon
          className="cursor-pointer indigo-dark-variant"
          onClick={handleRemoveRow(item.id ?? '')}
        />
      ),
    },
  ];

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      discount_rate: Number(event.target.value),
      discount_price: (Number(event.target.value) * Number(prev.unit_price)) / 100,
    }));
  };

  const volumnDiscountInput: InputGroupProps[] = useMemo(
    () => [
      {
        prefix: 'Price',
        value: formData.discount_price ?? '0.00',
        customClass: 'discount-price-area',
        readOnly: true,
        label: 'Volume Discount Price/Percentage :',
        fontLevel: 3,
        type: 'number',
      },
      {
        placeholder: '%',
        prefix: '% Rate',
        value: formData.discount_rate,
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
    (field: keyof PriceAndInventoryAttribute) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));

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
      },
    ],
    [formData.min_quantity, formData.max_quantity],
  );

  const handleImageChange = (fileList: UploadFile[]) =>
    setFormData((prev) => ({ ...prev, image: fileList }));

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
      <div
        className={`${styles.category_form_content} ${
          isLgScreen ? 'border-right-black-inset' : 'border-bottom-black-inset'
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
          <UploadIcon width={18} height={18} className="mb-6" />
        </article>

        <form className="d-flex gap-16">
          <div className="d-flex items-center justify-between w-full">
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
              placeholder="type text"
              deleteIcon
              onChange={handleFormChange('sku')}
              onDelete={handleClearInputValue('sku')}
            />
            <UploadImageInput
              listType="picture-card"
              fileList={formData.image}
              onChange={handleImageChange}
              additonalContainerStyle={{ width: '20%' }}
            />
          </div>
        </form>
        <InputGroup
          label="Description :"
          fontLevel={3}
          hasPadding
          hasHeight
          hasBoxShadow
          colorPrimaryDark
          colorRequired="tertiary"
          value={formData.description}
          placeholder="type text"
          deleteIcon
          onChange={handleFormChange('description')}
          onDelete={handleClearInputValue('description')}
        />
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
          <CustomPlusButton
            customClass="pb-16"
            onClick={
              !formData.unit_price || !formData.discount_rate || !formData.unit_type
                ? undefined
                : handleAddRow
            }
            disabled={!formData.unit_price || !formData.discount_rate || !formData.unit_type}
          />
        </article>

        <form
          className={`d-flex items-center gap-16 mb-16 ${volumeInputStyles.volume_discount_input}`}
        >
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
        </form>

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
