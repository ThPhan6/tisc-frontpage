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
import { SpecificationAttributeGroup } from '@/types';

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
  const [specifyingState, setSpecifyingState] = useState<SpecifyingProductRequestBody>();
  console.log('specifyingState', specifyingState);

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
      // onCancel={onCancel}
      width={576}
      footer={
        <CustomButton
          size="small"
          variant="primary"
          properties="rounded"
          buttonClass="done-btn"
          // onClick={handleDone}
        >
          Done
        </CustomButton>
      }
    >
      <BrandProductBasicHeader
        image={product.image}
        logo={'https://via.placeholder.com/24'}
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
          is_refer_document={specifyingState?.specification.is_refer_document || false}
        />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.vendor}>
        <VendorTab />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.allocation}>
        <AllocationTab
          projectId={projectId}
          productId={product.id}
          onChangeSpecifyingState={onChangeSpecifyingState}
        />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.codeAndOrder}>
        <CodeOrderTab />
      </CustomTabPane>
    </CustomModal>
  );
};
