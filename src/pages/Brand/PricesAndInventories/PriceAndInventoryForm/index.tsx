import { useCallback, useEffect, useMemo, useState } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';
import { Switch, message } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg';

import { useScreen } from '@/helper/common';
import { useGetParamId, useNavigationHandler } from '@/helper/hook';
import { extractDataBase64, validateRequiredFields } from '@/helper/utils';
import {
  createInventory,
  exchangeCurrency,
  getInventory,
  updateInventory,
  updateMultiple,
} from '@/services';
import { isEmpty, omit, pick, reduce } from 'lodash';

import type { ModalType } from '@/reducers/modal';
import type { PriceAttribute } from '@/types';

import CustomButton from '@/components/Button';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { EntryFormWrapper } from '@/components/EntryForm';
import InventoryHeader from '@/components/InventoryHeader';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText } from '@/components/Typography';
import InventoryForm, {
  WarehouseItemMetrics,
} from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/InventoryForm';
import PriceForm from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PriceForm';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';
import { VolumePrice } from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable';
import PriceAndInventoryTableStyle from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable.less';

const initialFormData = {
  sku: '',
  description: '',
  unit_type: '',
  inventory_category_id: '',
  image: [],
  work_location: '',
  location_id: '',
  total_stock: null,
  out_of_stock: null,
  on_order: null,
  back_order: null,
};

const PriceAndInventoryForm = () => {
  const [formData, setFormData] = useState<any>(initialFormData);
  const [priceTableData, setPriceTableData] = useState<VolumePrice[]>([]);
  const [inventoryTableData, setInventoryTableData] = useState<WarehouseItemMetrics[]>([]);
  const [isShowModal, setIsShowModal] = useState<ModalType>('none');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const location = useLocation<{ categoryId: string; brandId: string }>();
  const navigate = useNavigationHandler();
  const inventoryId = useGetParamId();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');
  const { isExtraLarge } = useScreen();

  useEffect(() => {
    setFormData(initialFormData);
    setPriceTableData([]);
  }, []);

  const getRequiredFields = (): {
    field: keyof PriceAttribute;
    messageField: string;
  }[] => [
    { field: 'sku', messageField: 'Product ID is required' },
    { field: 'unit_price', messageField: 'Unit price is required' },
    { field: 'unit_type', messageField: 'Unit type is required' },
  ];

  const fetchInventory = async () => {
    const res = await getInventory(inventoryId);

    if (res) {
      const rate = reduce(
        res.price?.exchange_histories?.map((item: any) => item.rate),
        (acc, el) => acc * el,
        1,
      );

      setFormData({
        ...res,
        image: !isEmpty(res.image) ? [`/${res.image}`] : [],
        unit_price: inventoryId ? Number(res.price.unit_price) * rate : res.price?.unit_price,
        unit_type: res.price?.unit_type,
      });

      const volumePrices = res.price.volume_prices?.map((price: any, index: number) => ({
        key: `${index + 1}`,
        id: price.id,
        discount_price: price.discount_price,
        discount_rate: price.discount_rate,
        min_quantity: price.min_quantity,
        max_quantity: price.max_quantity,
        unit_type: res.price.unit_type,
      }));
      setPriceTableData(volumePrices);
    }
  };

  useEffect(() => {
    if (inventoryId) fetchInventory();
  }, [inventoryId]);

  const transformTableDataToVolumePrices = useMemo(() => {
    if (!priceTableData) {
      setPriceTableData([]);
      return;
    }

    return () =>
      priceTableData.map((item) => ({
        unit_type: item.unit_type,
        discount_rate: parseFloat(String(item.discount_rate)),
        discount_price: parseFloat(String(item.discount_price)),
        min_quantity: item.min_quantity ? parseInt(String(item.min_quantity)) : undefined,
        max_quantity: item.max_quantity ? parseInt(String(item.max_quantity)) : undefined,
      }));
  }, [priceTableData]);

  const mergeVolumePrices = () => {
    const newVolumePrices = transformTableDataToVolumePrices?.() || [];
    const existingVolumePrices = (formData as any).volume_prices || [];

    return [
      ...existingVolumePrices,
      ...newVolumePrices.filter(
        (newItem: any) =>
          !existingVolumePrices.some(
            (existingItem: { id: string }) => existingItem.id === newItem.id,
          ),
      ),
    ];
  };

  const formatVolumePrices = (volumePrices: VolumePrice[]) =>
    volumePrices.map((el) => pick(el, ['discount_rate', 'max_quantity', 'min_quantity']));

  const preparePayload = () => {
    const image = !isEmpty(formData.image) ? extractDataBase64(formData.image[0]) : null;
    const volumePrices = mergeVolumePrices();

    return {
      ...pick(formData, ['sku', 'description', 'unit_price', 'unit_type', 'inventory_category_id']),
      image,
      unit_price: parseFloat(formData.unit_price?.toString() || '0'),
      inventory_category_id: location.state?.categoryId,
      volume_prices: isEmpty(volumePrices) ? null : formatVolumePrices(volumePrices),
    };
  };

  const calculateQuantity = () => {
    const updatedPayload: { [key: string]: { changeQuantity: number } } = {};

    inventoryTableData.forEach((item) => {
      const initialInStock = item.initial_in_stock || 0;
      const currentInStock = item.in_stock || 0;
      const convertValue = item.convert || 0;
      let quantityChange = convertValue;

      if (currentInStock > Number(initialInStock))
        quantityChange = currentInStock - Number(initialInStock);

      if (currentInStock < Number(initialInStock))
        quantityChange = Number(initialInStock) - (currentInStock + convertValue);

      updatedPayload[item.id ?? ''] = { changeQuantity: quantityChange };
    });

    return updatedPayload;
  };

  const redirectToInventoryTable = () => {
    navigate({
      path: PATH.brandPricesInventoriesTable,
      query: { categories: category },
      state: { categoryId: location.state?.categoryId, brandId: location.state?.brandId },
    })();
  };

  const handleSave = useCallback(async () => {
    if (!validateRequiredFields(formData, getRequiredFields())) return;

    if (hasUnsavedChanges) {
      message.warn('There is a draft volume that has not been added yet. Please check it.');
      return;
    }

    const payload = preparePayload();
    const updatedPayload = calculateQuantity();

    const res = inventoryId
      ? await Promise.all([
          updateInventory(inventoryId, omit(payload, 'inventory_category_id')),
          updateMultiple(updatedPayload),
        ])
      : await createInventory(payload);

    if (!res) return;

    if (inventoryId) {
      fetchInventory();
      return;
    }

    redirectToInventoryTable();
  }, [hasUnsavedChanges, formData, inventoryId, location.state?.categoryId, category, navigate]);

  const handleToggleModal = (type: ModalType) => () => setIsShowModal(type);

  const handleSaveCurrecy = useCallback(
    async (currency: string) => {
      if (!currency) {
        message.error('Please select a currency');
        return;
      }

      const res = await exchangeCurrency(location.state.brandId, currency);
      if (res) fetchInventory();
    },
    [location.state?.brandId],
  );

  const pageHeaderRender = () => <InventoryHeader onSaveCurrency={handleSaveCurrecy} />;

  const entryFormWrapperStyle = {
    height: 'calc(var(--vh) * 100 - 312px)',
    padding: 0,
    overflow: isExtraLarge ? 'unset' : 'auto',
  };

  return (
    <PageContainer pageHeaderRender={pageHeaderRender}>
      <div className={styles.category_form}>
        <TableHeader
          title={
            <article className={`${PriceAndInventoryTableStyle.category_table_header} opacity-50`}>
              <div className="d-flex items-center">
                <BodyText
                  fontFamily="Roboto"
                  level={5}
                  customClass={PriceAndInventoryTableStyle.category_table_header_title}
                >
                  HOME
                </BodyText>
                <HomeIcon />
              </div>
              <BodyText
                fontFamily="Roboto"
                level={5}
                customClass={PriceAndInventoryTableStyle.category_table_header_category}
              >
                {category}
              </BodyText>
            </article>
          }
          rightAction={
            <div className={PriceAndInventoryTableStyle.category_table_header_action}>
              <Switch
                disabled={true}
                size="default"
                checkedChildren="SAVE & CLOSE"
                unCheckedChildren="EDIT OFF"
                className={`${PriceAndInventoryTableStyle.category_table_header_btn_switch} ${PriceAndInventoryTableStyle.category_table_header_btn_switch_off}`}
              />
              <CustomButton
                size="small"
                variant="primary"
                disabled={true}
                buttonClass={`${PriceAndInventoryTableStyle.category_table_header_action_btn_import} cursor-disabled`}
              >
                <BodyText
                  fontFamily="Roboto"
                  level={6}
                  customClass={`${PriceAndInventoryTableStyle.category_table_header_action_btn_import_text} mono-color-dark`}
                >
                  IMPORT/EXPORT
                </BodyText>
              </CustomButton>
              <CustomPlusButton size={24} disabled={true} />
            </div>
          }
        />

        <EntryFormWrapper
          customClass={`${styles.category_form_entry_wrapper} ${inventoryId ? 'w-full' : 'w-1-2'}`}
          title={category ?? ''}
          titleClassName={styles.category_form_heading_group_title}
          handleCancel={navigate({
            path: PATH.brandPricesInventoriesTable,
            query: { categories: category },
            state: {
              categoryId: location.state?.categoryId,
              brandId: location.state?.brandId,
            },
          })}
          contentStyles={entryFormWrapperStyle}
          extraFooterButton={<CustomSaveButton contentButton="Save" onClick={handleSave} />}
        >
          <div className={`${styles.category_form_wrapper} ${isExtraLarge ? 'd-flex' : ''}`}>
            <PriceForm
              isShowModal={isShowModal}
              onToggleModal={handleToggleModal}
              formData={formData}
              setFormData={setFormData}
              tableData={priceTableData}
              setTableData={setPriceTableData}
              setHasUnsavedChanges={setHasUnsavedChanges}
            />

            {inventoryId && (
              <InventoryForm
                formData={formData}
                isShowModal={isShowModal}
                onToggleModal={handleToggleModal}
                setFormData={setFormData}
                setTableData={setInventoryTableData}
                tableData={inventoryTableData}
                setHasUnsavedChanges={setHasUnsavedChanges}
              />
            )}
          </div>
        </EntryFormWrapper>
      </div>
    </PageContainer>
  );
};

export default PriceAndInventoryForm;
