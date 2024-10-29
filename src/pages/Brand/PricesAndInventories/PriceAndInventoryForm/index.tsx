import { useCallback, useEffect, useMemo, useState } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';
import { Switch, message } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg';

import { useGetParamId, useNavigationHandler } from '@/helper/hook';
import { extractDataBase64, validateRequiredFields } from '@/helper/utils';
import { createInventory, exchangeCurrency, getInventory, updateInventory } from '@/services';
import { isEmpty, omit, pick, reduce } from 'lodash';

import type { ModalType } from '@/reducers/modal';
import type { PriceAndInventoryAttribute } from '@/types';

import CustomButton from '@/components/Button';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { EntryFormWrapper } from '@/components/EntryForm';
import InventoryHeader from '@/components/InventoryHeader';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText } from '@/components/Typography';
import type { VolumePrice } from '@/pages/Brand/PricesAndInventories/CategoryTable';
import categoryTableStyle from '@/pages/Brand/PricesAndInventories/CategoryTable/CategoryTable.less';
import PriceForm from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PriceForm';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';

const initialFormData = {
  sku: '',
  description: '',
  unit_type: '',
  inventory_category_id: '',
  image: [],
};

const PriceAndInventoryForm = () => {
  const [formData, setFormData] = useState<PriceAndInventoryAttribute>(initialFormData);
  const [tableData, setTableData] = useState<VolumePrice[]>([]);
  const [isShowModal, setIsShowModal] = useState<ModalType>('none');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const location = useLocation<{ categoryId: string; brandId: string }>();
  const navigate = useNavigationHandler();
  const inventoryId = useGetParamId();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');

  useEffect(() => {
    setFormData(initialFormData);
    setTableData([]);
  }, []);

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

    if (res) {
      const rate = reduce(
        res.price?.exchange_histories?.map((item) => item.rate),
        (acc, el) => acc * el,
        1,
      );

      setFormData({
        ...res,
        image: !isEmpty(res.image) ? [`/${res.image}`] : [],
        unit_price: inventoryId ? Number(res.price.unit_price) * rate : res.price?.unit_price,
        unit_type: res.price?.unit_type,
      });

      const volumePrices = res.price.volume_prices?.map((price, index: number) => ({
        key: `${index + 1}`,
        id: price.id,
        discount_price: price.discount_price,
        discount_rate: price.discount_rate,
        min_quantity: price.min_quantity,
        max_quantity: price.max_quantity,
        unit_type: res.price.unit_type,
      }));
      setTableData(volumePrices);
    }
  };

  useEffect(() => {
    if (inventoryId) fetchInventory();
  }, [inventoryId]);

  const transformTableDataToVolumePrices = useMemo(() => {
    if (!tableData) {
      setTableData([]);
      return;
    }

    return () =>
      tableData.map((item) => ({
        unit_type: item.unit_type,
        discount_rate: parseFloat(String(item.discount_rate)),
        discount_price: parseFloat(String(item.discount_price)),
        min_quantity: item.min_quantity ? parseInt(String(item.min_quantity)) : undefined,
        max_quantity: item.max_quantity ? parseInt(String(item.max_quantity)) : undefined,
      }));
  }, [tableData]);

  const handleSave = useCallback(async () => {
    if (!validateRequiredFields(formData, getRequiredFields())) return;

    if (hasUnsavedChanges) {
      message.warn('Please add volume prices and click plus button after entering the unit price.');
      return;
    }

    const image = !isEmpty(formData.image) ? extractDataBase64(formData.image[0]) : null;

    const newVolumePrices = transformTableDataToVolumePrices?.() || [];
    const existingVolumePrices = (formData as any).volume_prices || [];

    const mergedVolumePrices = [
      ...existingVolumePrices,
      ...newVolumePrices.filter(
        (newItem: any) =>
          !existingVolumePrices.some(
            (existingItem: { id: string }) => existingItem.id === newItem.id,
          ),
      ),
    ];

    const payload = {
      ...formData,
      image,
      unit_price: parseFloat(formData.unit_price?.toString() || '0'),
      inventory_category_id: location.state?.categoryId,
      volume_prices: mergedVolumePrices,
    };

    const pickPayload = pick(
      {
        ...payload,
        volume_prices: isEmpty(payload.volume_prices)
          ? null
          : payload.volume_prices.map((el) =>
              pick(el, ['discount_rate', 'max_quantity', 'min_quantity']),
            ),
      },
      [
        'sku',
        'description',
        'unit_price',
        'unit_type',
        'image',
        'volume_prices',
        'inventory_category_id',
      ],
    );

    const res: any = inventoryId
      ? await updateInventory(inventoryId, omit(pickPayload, 'inventory_category_id'))
      : await createInventory(pickPayload);

    if (!res) return;

    if (inventoryId) {
      fetchInventory();
      return;
    }

    navigate({
      path: PATH.brandPricesInventoriesTable,
      query: { categories: category },
      state: { categoryId: location.state?.categoryId, brandId: location.state?.brandId },
    })();
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

  return (
    <PageContainer pageHeaderRender={pageHeaderRender}>
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

        <EntryFormWrapper
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
          contentStyles={{
            height: 'calc(var(--vh) * 100 - 312px)',
          }}
          extraFooterButton={<CustomSaveButton contentButton="Save" onClick={handleSave} />}
        >
          <div className={styles.category_form_wrapper}>
            <PriceForm
              isShowModal={isShowModal}
              onToggleModal={handleToggleModal}
              formData={formData}
              setFormData={setFormData}
              tableData={tableData}
              setTableData={setTableData}
              setHasUnsavedChanges={setHasUnsavedChanges}
            />

            {/* <InventoryForm isShowModal={isShowModal} onToggleModal={handleToggleModal} /> */}
          </div>
        </EntryFormWrapper>
      </div>
    </PageContainer>
  );
};

export default PriceAndInventoryForm;
