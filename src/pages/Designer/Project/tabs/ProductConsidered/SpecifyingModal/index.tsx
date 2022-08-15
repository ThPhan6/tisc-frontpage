import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { MainTitle } from '@/components/Typography';
import type { FC } from 'react';
import { useState } from 'react';
import {
  ProjectSpecifyTabKeys,
  ProjectSpecifyTabs,
  ProjectSpecifyTabValue,
} from '../../../constants/tab';
import AllocationTab from './AllocationTab';
import CodeOrderTab from './CodeOrderTab';
import SpecificationTab from './SpecificationTab';
import VendorTab from './VendorTab';

import BrandProductBasicHeader from '@/components/BrandProductBasicHeader';
import popoverStyles from '@/components/Modal/styles/Popover.less';
import { ProductItem } from '@/features/product/types';
import styles from './styles/specifying-modal.less';
import { OnChangeSpecifyingProductFnc, SpecifyingProductRequestBody } from './types';
import { SpecificationAttributeGroup } from '@/features/project/types';
import { updateProductSpecifying } from '@/features/project/services';

const DEFAULT_STATE: SpecifyingProductRequestBody = {
  considered_product_id: '',
  specification: {
    is_refer_document: true,
    specification_attribute_groups: [],
  },
  brand_location_id: '',
  distributor_location_id: '',
  is_entire: true,
  project_zone_ids: [''],
  material_code_id: '',
  suffix_code: '',
  description: '',
  quantity: 0,
  unit_type_id: '',
  order_method: 0,
  requirement_type_ids: [],
  instruction_type_ids: [],
  special_instructions: '',
};

interface SpecifyingModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  projectId: string;
  product: ProductItem;
}

export const SpecifyingModal: FC<SpecifyingModalProps> = ({
  visible,
  setVisible,
  product,
  projectId,
}) => {
  const [selectedTab, setSelectedTab] = useState<ProjectSpecifyTabValue>(
    ProjectSpecifyTabKeys.specification,
  );
  // console.log('product', product);
  const [specifyingState, setSpecifyingState] =
    useState<SpecifyingProductRequestBody>(DEFAULT_STATE);

  const onChangeSpecifyingState: OnChangeSpecifyingProductFnc = (newStateParts) =>
    setSpecifyingState(
      (prevState) => ({ ...prevState, ...newStateParts } as SpecifyingProductRequestBody),
    );

  const onChangeReferToDocument = (isRefer: boolean) =>
    setSpecifyingState(
      (prevState) =>
        ({
          ...prevState,
          specification: {
            ...prevState?.specification,
            is_refer_document: isRefer,
          },
        } as SpecifyingProductRequestBody),
    );

  const onChangeSpecification = (specification_attribute_groups: SpecificationAttributeGroup[]) =>
    setSpecifyingState(
      (prevState) =>
        ({
          ...prevState,
          specification: {
            ...prevState?.specification,
            specification_attribute_groups,
          },
        } as SpecifyingProductRequestBody),
    );

  const onSubmit = () => {
    console.log('specifyingState', specifyingState);
    updateProductSpecifying(specifyingState, () => {
      setVisible(false);
      setSpecifyingState(DEFAULT_STATE);
    });
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
          onClick={onSubmit}
        >
          Done
        </CustomButton>
      }
    >
      <BrandProductBasicHeader
        image={product.image}
        logo={product.brand_logo}
        text_1={product.brand_name}
        text_2={product.collection_name}
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
        <SpecificationTab
          productId={product.id}
          onChangeSpecifyingState={onChangeSpecifyingState}
          onChangeReferToDocument={onChangeReferToDocument}
          onChangeSpecification={onChangeSpecification}
          // specification_attribute_groups={specifyingState.specification_attribute_groups}
          is_refer_document={specifyingState?.specification?.is_refer_document || false}
        />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.vendor}>
        <VendorTab productId={product.id} brandId={product.brand?.id ?? ''} />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.allocation}>
        <AllocationTab
          projectId={projectId}
          productId={product.id}
          onChangeSpecifyingState={onChangeSpecifyingState}
        />
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
          }}
          onChangeSpecifyingState={onChangeSpecifyingState}
        />
      </CustomTabPane>
    </CustomModal>
  );
};
