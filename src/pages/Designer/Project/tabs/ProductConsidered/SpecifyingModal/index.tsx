import { FC, useState } from 'react';

import {
  ProjectSpecifyTabKeys,
  ProjectSpecifyTabValue,
  ProjectSpecifyTabs,
} from '../../../constants/tab';
import { message } from 'antd';

import { getSpecificationRequest } from '@/features/product/components/ProductAttributes/hooks';
import { getSelectedRoomIds, useAssignProductToSpaceForm } from '@/features/product/modals/hooks';
import { updateProductSpecifying } from '@/features/project/services';

import { FinishScheduleRequestBody } from './types';
import { resetProductDetailState } from '@/features/product/reducers';
import { ProductItem } from '@/features/product/types';
import store, { useAppSelector } from '@/reducers';

import BrandProductBasicHeader from '@/components/BrandProductBasicHeader';
import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import popoverStyles from '@/components/Modal/styles/Popover.less';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { MainTitle } from '@/components/Typography';

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
}

export const SpecifyingModal: FC<SpecifyingModalProps> = ({
  visible,
  setVisible,
  product,
  projectId,
  reloadTable,
}) => {
  const [selectedTab, setSelectedTab] = useState<ProjectSpecifyTabValue>(
    ProjectSpecifyTabKeys.specification,
  );

  const specifiedDetail = useAppSelector((state) => state.product.details.specifiedDetail);
  const referToDesignDocument = useAppSelector(
    (state) => state.product.details.referToDesignDocument,
  );
  const specification_attribute_groups = useAppSelector(
    (state) => state.product.details.specification_attribute_groups,
  );
  const brandLocationId = useAppSelector((state) => state.product.details.brand_location_id);
  const distributorLocationId = useAppSelector(
    (state) => state.product.details.distributor_location_id,
  );

  const finishSchedulesData = useAppSelector(
    (state) => state.product.details.specifiedDetail?.finish_schedules,
  );
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
  );
  const selectedRoomIds = getSelectedRoomIds(selectedRooms);

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
    if (!specifiedDetail.description) {
      message.error('Description is required');
      return;
    }
    if (!brandLocationId) {
      message.error('Brand location is required');
      return;
    }
    if (!distributorLocationId) {
      message.error('Distributor location is required');
      return;
    }
    if (product.specifiedDetail?.id) {
      updateProductSpecifying(
        {
          considered_product_id: product.specifiedDetail.id,
          specification: {
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
        },
        () => {
          reloadTable();
          setVisible(false);
        },
      );
    }
  };

  return (
    <CustomModal
      className={`${popoverStyles.customPopover} ${styles.specifyingModal}`}
      visible={visible}
      onCancel={() => {
        console.log('onCancel');
        setVisible(false);
        store.dispatch(resetProductDetailState());
      }}
      title={
        <MainTitle level={3} customClass="text-uppercase">
          Specifying
        </MainTitle>
      }
      centered
      width={576}
      footer={
        <CustomButton
          size="small"
          variant="primary"
          properties="rounded"
          buttonClass="done-btn"
          onClick={onSubmit}>
          Done
        </CustomButton>
      }>
      <BrandProductBasicHeader
        image={product.images[0]}
        logo={product.brand?.logo}
        text_1={product.brand?.name}
        text_2={product.collection?.name}
        text_3={product.description}
      />

      <CustomTabs
        listTab={ProjectSpecifyTabs}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        className={styles.projectTabInfo}
        onChange={(changedKey) => setSelectedTab(changedKey as ProjectSpecifyTabValue)}
        activeKey={selectedTab}
      />

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.specification}>
        <SpecificationTab productId={product.id} />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.vendor}>
        <VendorTab productId={product.id} brandId={product.brand?.id ?? ''} />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.allocation}>
        <div className={styles.allocationTab}>
          <AssignProductToSpaceForm specifyingModal noPaddingLeft />
        </div>
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.codeAndOrder}>
        <CodeOrderTab
          projectProductId={product.specifiedDetail?.id ?? ''}
          roomIds={selectedRoomIds}
        />
      </CustomTabPane>
    </CustomModal>
  );
};
