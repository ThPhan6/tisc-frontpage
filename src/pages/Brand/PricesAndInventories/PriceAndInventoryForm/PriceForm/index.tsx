import { useEffect, useMemo, useState } from 'react';

import { Table, type TableColumnsType, type UploadFile, message } from 'antd';

import { ReactComponent as TrashIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import { fetchUnitType } from '@/services';

import type { ModalType } from '@/reducers/modal';

import InputGroup from '@/components/EntryForm/InputGroup';
import UploadImageInput from '@/components/EntryForm/UploadImageInput';
import VolumeInput, { type InputFieldProps } from '@/components/EntryForm/VolumeInput';
import InfoModal from '@/components/Modal/InfoModal';
import UnitType, { UnitItem } from '@/components/Modal/UnitType';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, CormorantBodyText, Title } from '@/components/Typography';
import type { VolumePrice } from '@/pages/Brand/PricesAndInventories/CategoryTable';
import UpdatableCell from '@/pages/Brand/PricesAndInventories/EditableCell';
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
  const [unitData, setUnitData] = useState<UnitItem[]>([]);

  useEffect(() => {
    const getUnitType = async () => {
      const res = await fetchUnitType();
      setUnitData(res);
    };

    getUnitType();
  }, []);

  const ensureValidPricesAndQuantities = () => {
    const { unit_price, unit_type, min_quantity, max_quantity } = formData;
    const parsedUnitPrice = parseFloat(unit_price?.toString() ?? '0');
    const minQuantity = min_quantity ? parseFloat(min_quantity) : null;
    const maxQuantity = max_quantity ? parseFloat(max_quantity) : null;

    if (!unit_price || !unit_type || isNaN(parsedUnitPrice)) {
      message.warn('Unit price and type are required and must be valid.');
      return false;
    }

    if (
      (minQuantity !== null && (!Number.isInteger(minQuantity) || isNaN(minQuantity))) ||
      (maxQuantity !== null && (!Number.isInteger(maxQuantity) || isNaN(maxQuantity))) ||
      (minQuantity !== null && maxQuantity !== null && minQuantity > maxQuantity)
    ) {
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
      <UpdatableCell
        item={item}
        columnKey={columnKey}
        defaultValue={defaultValue}
        inputStyle={{ width: 60, height: 20 }}
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
      align: 'center',
    },
    {
      title: 'Discount Price',
      dataIndex: 'discount_price',
      align: 'center',
      render: (_, item) => renderUpdatableCell(item, 'discount_price', item.discount_price),
    },
    {
      title: 'Discount Rate',
      dataIndex: 'discount_rate',
      align: 'center',
      render: (_, item) =>
        renderUpdatableCell(
          item,
          'discount_rate',
          `${item.discount_rate}${item.discount_rate ? '%' : ''}`,
        ),
    },
    {
      title: 'Min. Quantity',
      dataIndex: 'min_quantity',
      align: 'center',
      render: (_, item) => renderUpdatableCell(item, 'min_quantity', item.min_quantity),
    },
    {
      title: 'Max. Quantity',
      dataIndex: 'max_quantity',
      align: 'center',
      render: (_, item) => renderUpdatableCell(item, 'max_quantity', item.max_quantity),
    },
    {
      title: 'Unit Type',
      dataIndex: 'unit_type',
      align: 'center',
    },
    {
      render: (_, item) => (
        <TrashIcon
          className="cursor-pointer indigo-dark-variant"
          onClick={handleRemoveRow(item.id ?? '')}
        />
      ),
    },
  ];

  const calculateDiscountRate = (price: number) => {
    const unitPrice = parseFloat(formData.unit_price?.toString() ?? '0');
    if (!unitPrice || isNaN(unitPrice)) return '0';
    return (((unitPrice - price) / unitPrice) * 100).toString();
  };

  const calculateDiscountPrice = (rate: number) => {
    const unitPrice = parseFloat(formData.unit_price?.toString() ?? '0');
    if (!unitPrice || isNaN(unitPrice)) return '0';
    return (unitPrice * (1 - rate / 100)).toString();
  };

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(event.target.value);
    const price = calculateDiscountPrice(rate);

    setFormData((prev) => ({
      ...prev,
      discount_rate: event.target.value,
      discount_price: price,
    }));
  };

  const volumnDiscountInput: InputFieldProps[] = useMemo(
    () => [
      {
        placeholder: 'Type number',
        prefix: 'Price',
        value: formData.discount_price,
        readOnly: true,
        className: styles.category_form_input,
      },
      {
        placeholder: '%',
        prefix: '% Rate',
        value: formData.discount_rate,
        onChange: handleRateChange,
      },
    ],
    [formData.discount_price, formData.discount_rate, formData.unit_price],
  );

  const handleFormChange =
    (field: keyof PriceAndInventoryAttribute) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));

  const minMaxInput: InputFieldProps[] = useMemo(
    () => [
      {
        placeholder: 'min. #',
        value: formData.min_quantity,
        onChange: handleFormChange('min_quantity'),
      },
      {
        placeholder: 'max. #',
        value: formData.max_quantity,
        onChange: handleFormChange('max_quantity'),
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
      key: `${tableData?.length + 1}`,
      id: `${tableData?.length + 1}`,
      discount_price: formData.discount_price || '',
      discount_rate: formData.discount_rate || '',
      min_quantity: formData.min_quantity || '',
      max_quantity: formData.max_quantity || '',
      unit_type: formData.unit_type,
    };

    setTableData((prev) => [...prev, newRow]);

    setFormData({
      ...formData,
      discount_price: '',
      discount_rate: '',
      min_quantity: '',
      max_quantity: '',
    });
  };

  const handeSaveUnitType = (value: UnitItem | null) =>
    setFormData((prev) => ({ ...prev, unit_type: value?.code ?? '' }));

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
      <article className={styles.category_form_content}>
        <Title customClass={`${styles.category_form_content_title} d-flex items-center`}>
          BASE PRICE
          <WarningIcon className="ml-16 cursor-pointer" onClick={onToggleModal('Base & Volume')} />
        </Title>
        <form className="d-flex gap-16">
          <UploadImageInput
            fieldName="Upload Image :"
            listType="picture-card"
            fileList={formData.image}
            onChange={handleImageChange}
          />
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
        </form>
        <InputGroup
          label="Description"
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
            required
            fontLevel={3}
            hasPadding
            hasHeight
            hasBoxShadow
            colorPrimaryDark
            colorRequired="tertiary"
            value={formData.unit_price}
            placeholder="type price"
            deleteIcon
            onChange={handleFormChange('unit_price')}
            onDelete={handleClearInputValue('unit_price')}
          />
          <InputGroup
            label="Unit Type"
            required
            fontLevel={3}
            placeholder="select from the list"
            value={formData.unit_type}
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
            VOLUMN PRICE
            <WarningIcon
              className="ml-16 cursor-pointer"
              onClick={onToggleModal('Base & Volume')}
            />
          </Title>
          <CustomPlusButton customClass="pb-16" onClick={handleAddRow} />
        </article>

        <form className="d-flex items-center gap-16 mb-16">
          <VolumeInput label="Volume Discount Price/Percentage :" inputs={volumnDiscountInput} />
          <VolumeInput label="Min./Max. Quantity :" inputs={minMaxInput} />
        </form>

        <Table
          dataSource={tableData}
          columns={priceColumn}
          pagination={false}
          className={`${styles.category_form_table}`}
        />
      </article>

      <UnitType
        title="SELECT UNIT TYPE"
        unitData={unitData}
        visible={isShowModal === 'Unit Type'}
        onCancel={onToggleModal('none')}
        onSave={handeSaveUnitType}
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
