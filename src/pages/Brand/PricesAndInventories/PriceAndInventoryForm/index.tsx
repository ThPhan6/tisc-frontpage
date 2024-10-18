import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Switch, Table, TableColumnsType, UploadFile, message } from 'antd';
import { useHistory, useLocation } from 'umi';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';
import { ReactComponent as TrashIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg';

import { useGetParamId } from '@/helper/hook';
import { extractDataBase64 } from '@/helper/utils';
import { createInventory, getInventory } from '@/services';

import CustomButton from '@/components/Button';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import InputGroup from '@/components/EntryForm/InputGroup';
import UploadImageInput from '@/components/EntryForm/UploadImageInput';
import VolumeInput, { InputFieldProps } from '@/components/EntryForm/VolumeInput';
import LocationOffice from '@/components/Modal/LocationOffice';
import UnitType from '@/components/Modal/UnitType';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, Title } from '@/components/Typography';
import categoryTableStyle from '@/pages/Brand/PricesAndInventories/CategoryTable/CategoryTable.less';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';

type ModalType = '' | 'unit' | 'location';

export interface PriceAndInventoryAttribute {
  id?: string;
  sku: string;
  description: string;
  unit_price: string;
  discount_price: string;
  discount_rate: string;
  min_quantity: string;
  max_quantity: string;
  unit_type: string;
  inventory_category_id?: string;
  image?: UploadFile[];
}

const initialFormData = {
  sku: '',
  description: '',
  unit_price: '',
  discount_price: '',
  discount_rate: '',
  min_quantity: '',
  max_quantity: '',
  unit_type: 'ea.',
  inventory_category_id: '',
  image: [],
};

const PriceAndInventoryForm = () => {
  const [isShowModal, setIsShowModal] = useState<ModalType>('');
  const [isLoading, setIsLoading] = useState(false);
  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();
  const history = useHistory();
  const inventoryId = useGetParamId();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');

  const [formData, setFormData] = useState<PriceAndInventoryAttribute>(initialFormData);
  const [tableData, setTableData] = useState<PriceAndInventoryAttribute[]>([]);

  const getRequiredFields = (): {
    field: keyof PriceAndInventoryAttribute;
    messageField: string;
  }[] => [
    { field: 'sku', messageField: 'Product ID is required' },
    { field: 'unit_price', messageField: 'Unit price is required' },
    { field: 'unit_type', messageField: 'Unit type is required' },
  ];

  const fetchInventory = async () => {
    const res = await getInventory(inventoryId);
    if (res) setFormData(res);
  };

  useEffect(() => {
    if (inventoryId) fetchInventory();
  }, [inventoryId]);

  const calculateDiscountRate = (price: number) => {
    const unitPrice = parseFloat(formData.unit_price);
    if (!unitPrice || isNaN(unitPrice)) return '0';
    const rate = ((unitPrice - price) / unitPrice) * 100;
    return rate.toFixed(2);
  };

  const calculateDiscountPrice = (rate: number) => {
    const unitPrice = parseFloat(formData.unit_price);
    if (!unitPrice || isNaN(unitPrice)) return '0';
    const price = unitPrice * (1 - rate / 100);
    return price.toFixed(2);
  };

  const handleFormChange =
    (field: keyof PriceAndInventoryAttribute) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleImageChange = (fileList: UploadFile[]) => {
    setFormData((prev) => ({ ...prev, image: fileList }));
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(event.target.value);
    const rate = calculateDiscountRate(price);

    setFormData((prev) => ({
      ...prev,
      discount_price: event.target.value,
      discount_rate: rate,
    }));
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

  const handleAddRow = () => {
    if (!formData.unit_price) {
      message.warn('Unit price is required');
      return;
    }

    if (!formData.unit_type) {
      message.warn('Unit type is required');
      return;
    }

    if (formData.unit_price !== 'number') {
      message.warn('Unit price must be a number');
      return;
    }

    const newRow = {
      key: `${tableData.length + 1}`,
      id: `${tableData.length + 1}`,
      sku: formData.sku,
      description: formData.description,
      discount_price: formData.discount_price,
      discount_rate: formData.discount_rate + '%',
      min_quantity: formData.min_quantity,
      max_quantity: formData.max_quantity,
      unit_type: formData.unit_type,
      unit_price: formData.unit_price,
    };

    setTableData((prev) => [...prev, newRow]);

    setFormData({
      sku: '',
      description: '',
      discount_price: '',
      discount_rate: '',
      min_quantity: '',
      max_quantity: '',
      unit_price: '',
      unit_type: formData.unit_type,
    });
  };

  const handleToggleSwitch = (key: string) => () =>
    setEditModes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

  const handleToggleModal = (type: ModalType) => () => setIsShowModal(type);

  const volumnDiscountInput: InputFieldProps[] = [
    {
      placeholder: 'Type number',
      prefix: 'Price',
      value: formData.discount_price,
      onChange: handlePriceChange,
    },
    {
      placeholder: '%',
      prefix: 'Rate',
      value: formData.discount_rate,
      onChange: handleRateChange,
    },
  ];

  const minMaxInput: InputFieldProps[] = [
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
  ];

  const renderEditableCell = (item: any, columnKey: string, defaultValue: any) => {
    return (
      <></>
      // <EditableCell
      //   item={item}
      //   columnKey={columnKey}
      //   defaultValue={defaultValue}
      //   inputStyle={{ width: 60, height: 20 }}
      //   valueClass="indigo-dark-variant"
      // />
    );
  };

  const priceColumn: TableColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'key',
      align: 'center',
    },
    {
      title: 'Discount Price',
      dataIndex: 'discount_price',
      align: 'center',
      render: (_, item: any) => renderEditableCell(item, 'discount_price', item.discount_price),
    },
    {
      title: 'Discount Rate',
      dataIndex: 'discount_rate',
      align: 'center',
      render: (_, item: any) => renderEditableCell(item, 'discount_rate', item.discount_rate),
    },
    {
      title: 'Min. Quantity',
      dataIndex: 'min_quantity',
      align: 'center',
      render: (_, item: any) => renderEditableCell(item, 'min_quantity', item.min_quantity),
    },
    {
      title: 'Max. Quantity',
      dataIndex: 'max_quantity',
      align: 'center',
      render: (_, item: any) => renderEditableCell(item, 'max_quantity', item.max_quantity),
    },
    {
      title: 'Unit Type',
      dataIndex: 'unit_type',
      align: 'center',
    },
    {
      render: () => <TrashIcon className="cursor-pointer indigo-dark-variant" />,
    },
  ];

  const inventoryColumn: TableColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'key',
      align: 'center',
    },
    {
      title: 'WareHouse Name',
      dataIndex: 'warehouse_name',
    },
    {
      title: 'City',
      dataIndex: 'city',
    },
    {
      title: 'Country',
      dataIndex: 'country',
    },
    {
      title: 'In stock',
      dataIndex: 'in_stock',
      align: 'center',
      render: (_: any, item: any) => (
        <></>
        // <EditableCell
        //   item={item}
        //   columnKey="add_to"
        //   defaultValue="6"
        //   valueClass="indigo-dark-variant"
        //   inputStyle={{ width: 60, height: 20 }}
        // />
      ),
    },
    {
      render: () => <TrashIcon className="cursor-pointer" />,
    },
  ];

  const handleNavigate = (path: string, query?: string, state?: string) => () =>
    history.push({
      pathname: path,
      search: query,
      state: {
        categoryId: state,
      },
    });

  const handleSave = async () => {
    setIsLoading(true);
    let image: any = null;
    if (formData.image && formData.image.length > 0) {
      image = extractDataBase64(formData.image[0].thumbUrl as string);
    }

    const res = await createInventory({
      ...formData,
      image,
      inventory_category_id: (location.state as any).categoryId,
    });

    if (res) {
      handleNavigate(
        PATH.brandPricesInventoriesTable,
        `?categories=${category}`,
        (location.state as any)?.categoryId,
      )();
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.category_form}>
        <TableHeader
          title={
            <article className={`${categoryTableStyle.category_table_header} opacity-50`}>
              <div className="d-flex items-center">
                <BodyText
                  fontFamily="Roboto"
                  level={5}
                  customClass={categoryTableStyle.category_table_header_title}
                >
                  HOME
                </BodyText>
                <HomeIcon />
              </div>
              <BodyText
                fontFamily="Roboto"
                level={5}
                customClass={categoryTableStyle.category_table_header_category}
              >
                {category}
              </BodyText>
            </article>
          }
          rightAction={
            <div className={categoryTableStyle.category_table_header_action}>
              <CustomPlusButton size={24} disabled={true} />
              <CustomButton
                size="small"
                variant="primary"
                disabled={true}
                buttonClass={`${categoryTableStyle.category_table_header_action_btn_import} cursor-disabled `}
              >
                <BodyText
                  fontFamily="Roboto"
                  level={6}
                  style={{ color: '#808080' }}
                  customClass={`${categoryTableStyle.category_table_header_action_btn_import_text}`}
                >
                  IMPORT
                </BodyText>
              </CustomButton>
              <Switch
                disabled={true}
                size="default"
                checkedChildren="SAVE & CLOSE"
                unCheckedChildren="EDIT OFF"
                className={`${categoryTableStyle.category_table_header_btn_switch} ${categoryTableStyle.category_table_header_btn_switch_off}`}
              />
            </div>
          }
        />

        <div className={styles.category_form_wrapper}>
          <hgroup
            className={`d-flex items-center justify-between ${styles.category_form_heading_group}`}
          >
            <BodyText level={3} customClass={styles.category_form_heading_group_title}>
              {category}
            </BodyText>
            <CloseIcon
              onClick={handleNavigate(
                PATH.brandPricesInventoriesTable,
                `?categories=${category}`,
                (location.state as any)?.categoryId,
              )}
            />
          </hgroup>

          <section className="d-flex">
            <article className={styles.category_form_content}>
              <Title customClass={styles.category_form_content_title}>BASE PRICE</Title>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, unit_price: e.target.value }))
                  }
                />
                <InputGroup
                  label="Unit Type"
                  required
                  fontLevel={3}
                  placeholder="select from the list"
                  value={''}
                  hasBoxShadow
                  hasPadding
                  rightIcon
                  hasHeight
                  colorPrimaryDark
                  colorRequired="tertiary"
                  onRightIconClick={handleToggleModal('unit')}
                />
              </form>

              <article
                style={{ height: 28 }}
                className="d-flex items-center justify-between w-full border-bottom-black-inset mt-16 mb-8-px"
              >
                <Title customClass={`${styles.category_form_content_title} shadow-none`}>
                  VOLUMN PRICE
                </Title>
                <CustomPlusButton customClass="pb-16" onClick={handleAddRow} />
              </article>

              <form className="d-flex items-center gap-16">
                <VolumeInput
                  label="Volume Discount Price/Percentage :"
                  inputs={volumnDiscountInput}
                />
                <VolumeInput label="Min./Max. Quantity :" inputs={minMaxInput} />
              </form>

              <div
                className={`d-flex justify-between ${
                  editModes['switch1'] ? 'border-bottom-black-inset' : ''
                } pb-16`}
              >
                <div />
                {/* <Switch
                  checked={editModes['switch1']}
                  onChange={handleToggleSwitch('switch1')}
                  size="default"
                  checkedChildren="CLOSE EDIT"
                  unCheckedChildren="EDIT NOW"
                  className={`${styles.category_form_btn_switch} ${
                    editModes['switch1']
                      ? styles.category_form_btn_switch_on
                      : styles.category_form_btn_switch_off
                  }`}
                /> */}
              </div>

              <Table
                dataSource={tableData}
                columns={priceColumn}
                pagination={false}
                className={`${styles.category_form_table}`}
              />
            </article>

            <article className={styles.category_form_content}>
              <section
                className="d-flex items-center justify-between w-full border-bottom-black-inset"
                style={{ height: 28 }}
              >
                <Title customClass={`${styles.category_form_content_title}  shadow-none`}>
                  INVENTORY MANAGEMENT
                </Title>
                <CustomPlusButton customClass="pb-16" />
              </section>
              <div className="mt-8">
                <InputGroup
                  label="Location"
                  required
                  fontLevel={3}
                  placeholder="select from the list"
                  value={''}
                  hasBoxShadow
                  hasPadding
                  rightIcon
                  hasHeight
                  colorPrimaryDark
                  colorRequired="tertiary"
                  onRightIconClick={handleToggleModal('location')}
                />
              </div>

              <form className="d-flex items-center gap-16">
                <InputGroup
                  label="In Stock"
                  required
                  fontLevel={3}
                  placeholder="type number"
                  value={''}
                  hasBoxShadow
                  hasPadding
                  hasHeight
                  colorPrimaryDark
                  colorRequired="tertiary"
                />
                <InputGroup
                  label="On Order"
                  required
                  fontLevel={3}
                  placeholder="type number"
                  value={''}
                  hasBoxShadow
                  hasPadding
                  hasHeight
                  colorPrimaryDark
                  colorRequired="tertiary"
                />
                <InputGroup
                  label="Back Order"
                  required
                  fontLevel={3}
                  placeholder="type number"
                  value={''}
                  hasBoxShadow
                  hasPadding
                  hasHeight
                  colorPrimaryDark
                  colorRequired="tertiary"
                />
              </form>

              <div className="d-flex justify-between border-bottom-black-inset pb-16">
                <div />
                <Switch
                  checked={editModes['switch2']}
                  onChange={handleToggleSwitch('switch2')}
                  size="default"
                  checkedChildren="CLOSE EDIT"
                  unCheckedChildren="EDIT NOW"
                  className={`${styles.category_form_btn_switch} ${
                    editModes['switch2']
                      ? styles.category_form_btn_switch_on
                      : styles.category_form_btn_switch_off
                  }`}
                />
              </div>

              <Table
                dataSource={[
                  {
                    key: '1',
                    id: '1',
                    warehouse_name: 'XXXX-Name-A',
                    city: 'Singapore',
                    country: 'Singapore',
                    in_stock: '18',
                  },
                  {
                    key: '2',
                    id: '2',
                    warehouse_name: 'XXXX-Name-B',
                    city: 'Da nang',
                    country: 'Vietname',
                    in_stock: '12',
                  },
                ]}
                columns={inventoryColumn}
                pagination={false}
                className={`${styles.category_form_table}`}
              />
            </article>
          </section>
        </div>

        <footer className={styles.category_form_footer}>
          <CustomSaveButton contentButton="Save" onClick={handleSave} isLoading={isLoading} />
        </footer>
      </div>

      <UnitType
        title="SELECT UNIT TYPE"
        unitData={[]}
        visible={isShowModal === 'unit'}
        onCancel={handleToggleModal('')}
        onConfirm={() => {}}
      />

      <LocationOffice
        title="SELECT LOCATION"
        isOpen={isShowModal === 'location'}
        onClose={handleToggleModal('')}
        countries={[]}
        onSave={() => {}}
      />
    </>
  );
};

export default PriceAndInventoryForm;
