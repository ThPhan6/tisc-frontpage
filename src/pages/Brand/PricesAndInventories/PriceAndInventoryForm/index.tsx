import { useCallback, useEffect, useMemo, useState } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';
import { Switch, message } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';
import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg';

import { useGetParamId, useNavigationHandler } from '@/helper/hook';
import { extractDataBase64, showImageUrl, validateRequiredFields } from '@/helper/utils';
import { createInventory, exchangeCurrency, getInventory, updateInventory } from '@/services';
import { reduce } from 'lodash';

import type { ModalType } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import InventoryHeader from '@/components/InventoryHeader';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText } from '@/components/Typography';
import type {
  InventoryColumn,
  VolumePrice,
} from '@/pages/Brand/PricesAndInventories/CategoryTable';
import categoryTableStyle from '@/pages/Brand/PricesAndInventories/CategoryTable/CategoryTable.less';
import PriceForm from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PriceForm';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryForm/PricesAndInentoryForm.less';

export interface PriceAndInventoryAttribute {
  id?: string;
  sku?: string;
  description?: string;
  unit_price?: number;
  discount_price?: number;
  discount_rate?: number;
  min_quantity?: number;
  max_quantity?: number;
  unit_type: string;
  unit_type_code?: string;
  inventory_category_id?: string;
  image?: any;
}

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

  const location = useLocation<{ categoryId: string; brandId: string }>();
  const navigate = useNavigationHandler();
  const inventoryId = useGetParamId();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');

  const getRequiredFields = (): {
    field: keyof PriceAndInventoryAttribute;
    messageField: string;
  }[] => [
    { field: 'sku', messageField: 'Product ID is required' },
    { field: 'unit_price', messageField: 'Unit price is required' },
    { field: 'unit_type', messageField: 'Unit type is required' },
  ];

  const setFormDataAfterAction = (data: InventoryColumn) => {
    setFormData({
      ...data,
      unit_price: data.price.unit_price,
      unit_type: data.price.unit_type,
      image: data.image
        ? [
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: showImageUrl(data.image),
            },
          ]
        : [],
    });
  };

  const fetchInventory = async () => {
    const res = await getInventory(inventoryId);

    if (res) {
      const rate = reduce(
        res.price.exchange_histories?.map((item) => item.rate),
        (acc, el) => acc * el,
        1,
      );
      const unitPrice = Number(res.price.unit_price) * rate;

      setFormData({
        ...res,
        unit_price: unitPrice,
        unit_type: res.price.unit_type,
        image: res.image
          ? [
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: showImageUrl(res.image),
              },
            ]
          : [],
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
    if (tableData.length === 0) {
      message.warn('Please add volume prices and click plus button after entering the unit price.');
      return;
    }

    const image =
      formData.image && formData.image.length > 0
        ? extractDataBase64(formData.image[0].thumbUrl as string)
        : null;

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

    const res: any = inventoryId
      ? await updateInventory(inventoryId, payload)
      : await createInventory(payload);

    if (!res) return;

    if (inventoryId) {
      setFormDataAfterAction(res);
      fetchInventory();
      return;
    }

    navigate({
      path: PATH.brandPricesInventoriesTable,
      query: { categories: category },
      state: { categoryId: location.state?.categoryId, brandId: location.state?.brandId },
    })();
  }, [
    formData,
    inventoryId,
    location.state?.categoryId,
    category,
    navigate,
    setFormDataAfterAction,
  ]);

  const handleToggleModal = (type: ModalType) => () => setIsShowModal(type);

  const handleSaveCurrecy = async (currency: string) => {
    if (!currency) {
      message.error('Please select a currency');
      return;
    }

    const res = await exchangeCurrency(location.state.brandId, currency);
    if (res) fetchInventory();
  };

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

        <hgroup
          className={`d-flex items-center justify-between ${styles.category_form_heading_group}`}
        >
          <BodyText level={3} customClass={styles.category_form_heading_group_title}>
            {category}
          </BodyText>
          <CloseIcon
            onClick={navigate({
              path: PATH.brandPricesInventoriesTable,
              query: { categories: category },
              state: {
                categoryId: location.state?.categoryId,
                brandId: location.state?.brandId,
              },
            })}
          />
        </hgroup>

        <div className={styles.category_form_wrapper}>
          <PriceForm
            isShowModal={isShowModal}
            onToggleModal={handleToggleModal}
            formData={formData}
            setFormData={setFormData}
            tableData={tableData}
            setTableData={setTableData}
          />
          <span className="p-16" style={{ whiteSpace: 'nowrap' }}>
            Comming soon
          </span>
          {/* <InventoryForm isShowModal={isShowModal} onToggleModal={handleToggleModal} /> */}
        </div>

        <footer className={styles.category_form_footer}>
          <CustomSaveButton contentButton="Save" onClick={handleSave} />
        </footer>
      </div>
    </PageContainer>
  );
};

export default PriceAndInventoryForm;
