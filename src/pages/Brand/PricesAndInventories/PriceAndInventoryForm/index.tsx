import { useCallback, useEffect, useState } from 'react';

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
  getListWarehouseByInventoryId,
  updateInventory,
} from '@/services';
import { isEmpty, isEqual, isNil, omit, pick, reduce } from 'lodash';

import type { ModalType } from '@/reducers/modal';
import {
  IPriceAndInventoryForm,
  type PriceAttribute,
  type VolumePrice,
  type WarehouseItemMetric,
  initialInventoryFormData,
} from '@/types';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { EntryFormWrapper } from '@/components/EntryForm';
import InventoryHeader from '@/components/InventoryHeader';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText } from '@/components/Typography';
import InventoryForm from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/InventoryForm';
import PriceForm from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PriceForm';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';
import PriceAndInventoryTableStyle from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable.less';

const getRequiredFields = (): {
  field: keyof PriceAttribute;
  messageField: string;
}[] => [
  { field: 'sku', messageField: 'Product ID is required' },
  { field: 'unit_price', messageField: 'Unit price is required' },
  { field: 'unit_type', messageField: 'Unit type is required' },
];

const PriceAndInventoryForm = () => {
  const location = useLocation<{ categoryId: string; brandId: string }>();
  const navigate = useNavigationHandler();
  const inventoryId = useGetParamId();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');
  const { isExtraLarge } = useScreen();
  const entryFormWrapperStyle = {
    height: 'calc(var(--vh) * 100 - 312px)',
    padding: 0,
    overflow: isExtraLarge ? 'unset' : 'auto',
  };

  const [originalData, setOriginalData] =
    useState<IPriceAndInventoryForm>(initialInventoryFormData);
  const [formData, setFormData] = useState<IPriceAndInventoryForm>(initialInventoryFormData);

  const [priceTableData, setPriceTableData] = useState<VolumePrice[]>([]);

  const [isShowModal, setIsShowModal] = useState<ModalType>('none');

  useEffect(() => {
    setFormData(initialInventoryFormData);
    setPriceTableData([]);
  }, []);

  const fetchListwarehouseTable = async () => {
    const res = await getListWarehouseByInventoryId(inventoryId);

    if (isEmpty(res)) return;

    const warehouseRes: WarehouseItemMetric[] = res.warehouses?.map((el) => ({
      ...el,
      convert: 0,
      new_in_stock: el.in_stock,
    }));

    setOriginalData((prev) => ({
      ...prev,
      total_stock: res.total_stock,
      warehouses: warehouseRes,
    }));

    setFormData((prev) => ({
      ...prev,
      total_stock: res.total_stock,
      warehouses: warehouseRes,
    }));
  };

  const fetchInventory = async () => {
    const res = await getInventory(inventoryId);

    if (res) {
      const rate = reduce(
        res.price?.exchange_histories?.map((item: any) => item.rate),
        (acc, el) => acc * el,
        1,
      );

      const volume_prices = (res.price?.volume_prices || []).map((vp) =>
        omit(vp, ['created_at', 'updated_at']),
      );

      const newData = {
        ...initialInventoryFormData,
        ...res,
        image: !isEmpty(res.image) ? [`/${res.image}`] : [],
        unit_price: inventoryId ? Number(res.price.unit_price) * rate : res.price?.unit_price,
        unit_type: res.price?.unit_type,
        price: {
          ...res.price,
          volume_prices: volume_prices,
        },
      };

      setFormData(newData as IPriceAndInventoryForm);
      setOriginalData(newData as IPriceAndInventoryForm);
      setPriceTableData(volume_prices as VolumePrice[]);
    }
  };

  const fetchData = async () => {
    if (inventoryId) {
      await Promise.all([fetchInventory(), fetchListwarehouseTable()]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [inventoryId]);

  const handleToggleModal = (type: ModalType) => () => setIsShowModal(type);

  const preparePayload = () => {
    const fields: (keyof IPriceAndInventoryForm)[] = [
      'sku',
      'description',
      'unit_type',
      'image',
      'unit_price',
      'unit_type',
      'price',
      'on_order',
      'back_order',
      'warehouses',
    ];

    let payload: Partial<IPriceAndInventoryForm> = {};

    const volumePricesChanged = !isEqual(
      formData.price.volume_prices,
      originalData.price.volume_prices,
    );

    const warehousesChanged = !isEqual(formData.warehouses, originalData.warehouses);

    const isUnitPriceChanged = !isEqual(formData.unit_price, originalData.unit_price);

    if (volumePricesChanged) {
      payload.price = {
        ...payload.price,
        volume_prices: formData.price.volume_prices,
      };
    }

    fields.forEach((field) => {
      if (!isEqual(formData[field], originalData[field])) {
        payload[field] =
          field === 'image' ? extractDataBase64(formData.image?.[0] ?? '') : formData[field];
      }
    });

    payload = {
      ...pick(
        {
          ...payload,
          ...((volumePricesChanged || isUnitPriceChanged) && { unit_price: formData.unit_price }),
          ...((volumePricesChanged || isUnitPriceChanged) && {
            volume_prices: !payload?.price?.volume_prices?.length
              ? []
              : payload.price.volume_prices.map((el) =>
                  pick(el, ['max_quantity', 'min_quantity', 'discount_rate']),
                ),
          }),
          ...(warehousesChanged &&
            ({
              warehouses: formData.warehouses.map((warehouse) => {
                const quantity =
                  warehouse.in_stock === 0
                    ? warehouse.new_in_stock + warehouse.convert
                    : warehouse.new_in_stock - warehouse.in_stock + warehouse.convert;

                return {
                  location_id: warehouse?.location_id,
                  quantity: quantity,
                };
              }),
            } as any)),
          inventory_category_id: location.state?.categoryId,
        },
        [
          'sku',
          'description',
          'image',
          'unit_price',
          'unit_type',
          'inventory_category_id',
          'on_order',
          'back_order',
          'volume_prices',
          'warehouses',
        ],
      ),
    };

    return payload;
  };

  const redirectToInventoryTable = () => {
    navigate({
      path: PATH.brandPricesInventoriesTable,
      query: { categories: category },
      state: { categoryId: location.state?.categoryId, brandId: location.state?.brandId },
    })();
  };

  const validateVolumePrice = () => {
    const isDiscountPriceChanged =
      !isNil(formData.min_quantity) ||
      !isEmpty(formData.max_quantity) ||
      !isNil(formData.discount_rate);

    if (isDiscountPriceChanged) {
      message.warn('There is a draft volume that has not been added yet. Please check it.');
      return false;
    }

    return true;
  };

  const handleSave = useCallback(async () => {
    if (!validateRequiredFields(formData, getRequiredFields()) || !validateVolumePrice()) return;

    const payload = preparePayload();

    const res = inventoryId
      ? await updateInventory(inventoryId, omit(payload, 'inventory_category_id'))
      : await createInventory(payload);

    if (!res) return;

    if (inventoryId) {
      fetchData();
      return;
    }

    redirectToInventoryTable();
  }, [formData, inventoryId, location.state?.categoryId, category, navigate]);

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
              {/* <CustomButton
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
              </CustomButton> */}
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
            />

            {inventoryId && (
              <InventoryForm
                formData={formData}
                isShowModal={isShowModal}
                onToggleModal={handleToggleModal}
                setFormData={setFormData}
              />
            )}
          </div>
        </EntryFormWrapper>
      </div>
    </PageContainer>
  );
};

export default PriceAndInventoryForm;
