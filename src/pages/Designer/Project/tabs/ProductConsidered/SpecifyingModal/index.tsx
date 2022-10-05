import { FC, useEffect, useState } from 'react';

import {
  ProjectSpecifyTabKeys,
  ProjectSpecifyTabValue,
  ProjectSpecifyTabs,
} from '../../../constants/tab';
import { message } from 'antd';

import { getSpecificationRequest } from '@/features/product/components/ProductAttributes/hooks';
import { useAssignProductToSpaceForm } from '@/features/product/modals/hooks';
import { updateProductSpecifying } from '@/features/project/services';

import { DEFAULT_STATE, OnChangeSpecifyingProductFnc, SpecifyingProductRequestBody } from './types';
import { ProductItem } from '@/features/product/types';
import { useAppSelector } from '@/reducers';

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
  isProductSpecified?: boolean;
}

export const SpecifyingModal: FC<SpecifyingModalProps> = ({
  visible,
  setVisible,
  product,
  projectId,
  reloadTable,
  isProductSpecified,
}) => {
  const referToDesignDocument = useAppSelector(
    (state) => state.product.details.specifiedDetail?.specification.is_refer_document,
  );
  const specification_attribute_groups = useAppSelector(
    (state) => state.product.details.specification_attribute_groups,
  );

  const [selectedTab, setSelectedTab] = useState<ProjectSpecifyTabValue>(
    ProjectSpecifyTabKeys.specification,
  );
  const [specifyingState, setSpecifyingState] =
    useState<SpecifyingProductRequestBody>(DEFAULT_STATE);

  const onChangeSpecifyingState: OnChangeSpecifyingProductFnc = (newStateParts) =>
    setSpecifyingState(
      (prevState) => ({ ...prevState, ...newStateParts } as SpecifyingProductRequestBody),
    );

  console.log('product', product);
  console.log('specifyingState', specifyingState);

  const { AssignProductToSpaceForm } = useAssignProductToSpaceForm(product.id, projectId, {
    onChangeEntireProjectCallback: (entire_allocation) =>
      onChangeSpecifyingState({ entire_allocation }),
    onChangeSelectedRoomsCallback: (selectedRooms) =>
      onChangeSpecifyingState({ allocation: selectedRooms }),
  });

  useEffect(() => {
    if (product.specifiedDetail?.id) {
      onChangeSpecifyingState({
        considered_product_id: product.specifiedDetail?.id,
      });

      if (isProductSpecified) {
        onChangeSpecifyingState({
          ...specifyingState,
          brand_location_id: product.specifiedDetail?.brand_location_id,
          distributor_location_id: product.specifiedDetail?.distributor_location_id,
          suffix_code: product.specifiedDetail?.suffix_code,
          description: product.specifiedDetail?.description,
          instruction_type_ids: product.specifiedDetail?.instruction_type_ids,
          material_code_id: product.specifiedDetail?.material_code_id,
          order_method: product.specifiedDetail?.order_method,
          quantity: product.specifiedDetail?.quantity,
          requirement_type_ids: product.specifiedDetail?.requirement_type_ids,
          special_instructions: product.specifiedDetail?.special_instruction,
          unit_type_id: product.specifiedDetail?.unit_type_id,
          finish_schedules: product.specifiedDetail?.finish_schedules,
          allocation: product.specifiedDetail?.allocation,
        });
      }
    }
  }, [product.specifiedDetail?.id]);

  const onSubmit = () => {
    if (!specifyingState.material_code_id) {
      message.error('Material/Product Code is required');
      return;
    }
    if (!specifyingState.suffix_code) {
      message.error('Suffix Code is required');
      return;
    }
    if (!specifyingState.description) {
      message.error('Description is required');
      return;
    }
    // if (!Number(specifyingState.quantity)) {
    //   message.error('Quantity must be greater than 0');
    //   return;
    // }

    if (product.specifiedDetail?.id) {
      updateProductSpecifying(
        {
          ...specifyingState,
          considered_product_id: product.specifiedDetail.id,
          specification: {
            is_refer_document: referToDesignDocument ?? false,
            specification_attribute_groups: getSpecificationRequest(specification_attribute_groups),
          },
        },
        () => {
          reloadTable();
          setVisible(false);
          setSpecifyingState(DEFAULT_STATE);
        },
      );
    }
  };

  return (
    <CustomModal
      className={`${popoverStyles.customPopover} ${styles.specifyingModal}`}
      visible={visible}
      onCancel={() => setVisible(false)}
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
        <VendorTab
          productId={product.id}
          brandId={product.brand?.id ?? ''}
          onChangeSpecifyingState={onChangeSpecifyingState}
          brandAddressId={specifyingState.brand_location_id}
          distributorAddressId={specifyingState.distributor_location_id}
        />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.allocation}>
        <div className={styles.allocationTab}>
          <AssignProductToSpaceForm specifyingModal noPaddingLeft />
        </div>
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.codeAndOrder}>
        <CodeOrderTab
          codeOrderState={{
            description: specifyingState.description,
            instruction_type_ids: specifyingState.instruction_type_ids,
            material_code_id: specifyingState.material_code_id,
            order_method: specifyingState.order_method,
            quantity: specifyingState.quantity,
            requirement_type_ids: specifyingState.requirement_type_ids,
            suffix_code: specifyingState.suffix_code,
            unit_type_id: specifyingState.unit_type_id,
            special_instructions: specifyingState.special_instructions,
            finish_schedules: specifyingState.finish_schedules,
          }}
          onChangeSpecifyingState={onChangeSpecifyingState}
        />
      </CustomTabPane>
    </CustomModal>
  );
};
