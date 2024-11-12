import { FC, useEffect, useState } from 'react';

import {
  ProjectSpecifyTabKeys,
  ProjectSpecifyTabValue,
  ProjectSpecifyTabs,
} from '../../../constants/tab';
import { message } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';

import { getSpecificationRequest } from '@/features/product/components/ProductAttributes/hooks';
import { getSelectedRoomIds, useAssignProductToSpaceForm } from '@/features/product/modals/hooks';
import { getUsedMaterialCodes, updateProductSpecifying } from '@/features/project/services';
import { useCheckPermission } from '@/helper/hook';

import { FinishScheduleRequestBody } from './types';
import { productVariantsSelector, resetProductDetailState } from '@/features/product/reducers';
import { ProductItem } from '@/features/product/types';
import store, { useAppSelector } from '@/reducers';

import BrandProductBasicHeader from '@/components/BrandProductBasicHeader';
import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import popoverStyles from '@/components/Modal/styles/Popover.less';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { MainTitle } from '@/components/Typography';
import { resetCustomProductDetail } from '@/pages/Designer/Products/CustomLibrary/slice';

import CodeOrderTab from './CodeOrderTab';
import SpecificationTab from './SpecificationTab';
import VendorTab from './VendorTab';
import styles from './styles/specifying-modal.less';

interface SpecifyingModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  projectId: string;
  product: ProductItem;
  reloadTable: () => void;
  isSpecified?: boolean;
}
type UsedMaterialCode = {
  material_code_id: string;
  suffix_code: string;
};

export const SpecifyingModal: FC<SpecifyingModalProps> = ({
  visible,
  setVisible,
  product,
  projectId,
  reloadTable,
  isSpecified,
}) => {
  const isBrandUser = useCheckPermission(['Brand Admin', 'Brand Team']);

  const listTab = isBrandUser
    ? [...ProjectSpecifyTabs].splice(0, ProjectSpecifyTabs.length - 1)
    : ProjectSpecifyTabs;

  const [selectedTab, setSelectedTab] = useState<ProjectSpecifyTabValue>(
    ProjectSpecifyTabKeys.specification,
  );
  const [usedMaterialCodes, setUsedMaterialCodes] = useState<UsedMaterialCode[]>([]);
  const customProduct = product.specifiedDetail?.custom_product ? true : false;

  const productId = useAppSelector(productVariantsSelector);
  const isDisableDone = isBrandUser && productId.trim().split(' - ').includes('X');

  const productDetail = useAppSelector((state) => state.product.details);
  const customProductDetail = useAppSelector((state) => state.customProduct.details);
  const curProduct = customProduct ? customProductDetail : productDetail;

  const specifiedDetail = curProduct.specifiedDetail;
  const fetchMaterialCodes = async () => {
    const res = await getUsedMaterialCodes(specifiedDetail?.id || '');
    setUsedMaterialCodes(res.data);
  };
  useEffect(() => {
    fetchMaterialCodes();
  }, []);
  const referToDesignDocument: boolean = specifiedDetail?.specification.is_refer_document || false;

  // console.log('productDetail', productDetail);
  // console.log('referToDesignDocument', referToDesignDocument);

  const specification_attribute_groups = useAppSelector(
    (state) => state.product.details.specification_attribute_groups,
  );
  const brandLocationId: string = customProduct
    ? specifiedDetail?.brand_location_id
    : (curProduct as any).brand_location_id;
  const distributorLocationId: string = customProduct
    ? specifiedDetail?.distributor_location_id
    : (curProduct as any).distributor_location_id;

  const finishSchedulesData = specifiedDetail?.finish_schedules;

  const finishSchedulesRequestData = finishSchedulesData?.map((el) => ({
    floor: el.floor,
    base: {
      ceiling: el.base.ceiling,
      floor: el.base.floor,
    },
    front_wall: el.front_wall,
    left_wall: el.left_wall,
    back_wall: el.back_wall,
    right_wall: el.right_wall,
    ceiling: el.ceiling,
    door: {
      frame: el.door.frame,
      panel: el.door.panel,
    },
    cabinet: {
      carcass: el.cabinet.carcass,
      door: el.cabinet.door,
    },
  }));

  const { AssignProductToSpaceForm, isEntire, selectedRooms } = useAssignProductToSpaceForm(
    product.id,
    projectId,
    isBrandUser,
  );
  const selectedRoomIds = getSelectedRoomIds(selectedRooms);

  const resetProductData = () => {
    if (customProduct) {
      store.dispatch(resetCustomProductDetail());
    } else {
      store.dispatch(resetProductDetailState());
    }
  };

  const onSubmit = () => {
    if (!specifiedDetail) {
      return;
    }
    if (!specifiedDetail.material_code_id) {
      message.error('Material/Product Code is required');
      return;
    }
    if (!specifiedDetail.suffix_code) {
      message.error('Suffix Code is required');
      return;
    }

    const duplicatedMaterialCode = usedMaterialCodes.find(
      (item) =>
        item.material_code_id === specifiedDetail.material_code_id &&
        item.suffix_code === specifiedDetail.suffix_code,
    );
    if (duplicatedMaterialCode) {
      message.error('Duplicated Material Code and Suffix Code.');
      return;
    }
    if (!specifiedDetail.description) {
      message.error('Description is required');
      return;
    }
    if (!brandLocationId && !distributorLocationId) {
      message.error('Brand or Distributor is required');
      return;
    }
    if (product.specifiedDetail?.id) {
      updateProductSpecifying(
        {
          considered_product_id: product.specifiedDetail.id,
          specification: customProduct
            ? specifiedDetail.specification
            : {
                is_refer_document: referToDesignDocument ?? false,
                attribute_groups: getSpecificationRequest(specification_attribute_groups),
              },
          entire_allocation: isEntire,
          allocation: selectedRoomIds,
          brand_location_id: brandLocationId,
          distributor_location_id: distributorLocationId,
          description: specifiedDetail.description,
          instruction_type_ids: specifiedDetail.instruction_type_ids,
          finish_schedules: finishSchedulesRequestData as FinishScheduleRequestBody[],
          material_code_id: specifiedDetail.material_code_id,
          order_method: specifiedDetail.order_method,
          quantity: specifiedDetail.quantity,
          requirement_type_ids: specifiedDetail.requirement_type_ids,
          special_instructions: specifiedDetail.special_instructions,
          suffix_code: specifiedDetail.suffix_code,
          unit_type_id: specifiedDetail.unit_type_id,
          custom_product: customProduct,
          is_done_assistance_request: true,
        },
        () => {
          reloadTable();
          setVisible(false);
          resetProductData();
        },
      );
    }
  };
  return (
    <CustomModal
      className={`${popoverStyles.customPopover} ${styles.specifyingModal}`}
      visible={visible}
      secondaryModal
      noHeaderBorder={false}
      closeIcon={<CloseIcon style={{ width: 24, height: 24 }} />}
      onCancel={() => {
        setVisible(false);
        resetProductData();
      }}
      title={
        <MainTitle level={3} customClass="text-uppercase">
          Specifying
        </MainTitle>
      }
      centered
      width={1100}
      footer={
        <div className="done-btn">
          <CustomButton
            disabled={isDisableDone}
            size="small"
            variant="primary"
            properties="rounded"
            onClick={onSubmit}
          >
            Done
          </CustomButton>
        </div>
      }
    >
      <BrandProductBasicHeader
        image={product.images[0]}
        logo={product.brand?.logo}
        text_1={product.brand?.name}
        text_2={product.collections?.map((collection) => collection.name).join(', ')}
        text_3={product.name}
        text_4={productId === '' ? 'N/A' : productId}
        customClass={styles.customHeader}
      />

      <CustomTabs
        listTab={listTab}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        className={styles.projectTabInfo}
        onChange={(changedKey) => setSelectedTab(changedKey as ProjectSpecifyTabValue)}
        activeKey={selectedTab}
      />

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.specification}>
        <SpecificationTab
          productId={product.id}
          customProduct={customProduct}
          referToDesignDocument={referToDesignDocument}
          isSpecified={isSpecified}
        />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.vendor}>
        <VendorTab
          productId={product.id}
          brandId={product.brand?.id ?? ''}
          customProduct={customProduct}
          brand={product.brand}
          projectId={projectId}
        />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.allocation}>
        <div className={styles.allocationTab}>
          <AssignProductToSpaceForm specifyingModal noPaddingLeft />
        </div>
      </CustomTabPane>

      {isBrandUser ? null : (
        <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.codeAndOrder}>
          <CodeOrderTab
            projectProductId={product.specifiedDetail?.id ?? ''}
            roomIds={selectedRoomIds}
            customProduct={customProduct}
          />
        </CustomTabPane>
      )}
    </CustomModal>
  );
};
