import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { MainTitle } from '@/components/Typography';
import { FC, useEffect } from 'react';
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
import { ProductAttributeFormInput, ProductItem } from '@/features/product/types';
import styles from './styles/specifying-modal.less';
import { OnChangeSpecifyingProductFnc, SpecifyingProductRequestBody } from './types';
import { SpecificationAttributeGroup } from '@/features/project/types';
import {
  assignProductToProject,
  getProductSpecifying,
  updateProductSpecifying,
} from '@/features/project/services';
import { pick } from 'lodash';
import { getProductByIdAndReturn } from '@/features/product/services';
import { useBoolean } from '@/helper/hook';

const DEFAULT_STATE: SpecifyingProductRequestBody = {
  considered_product_id: '',
  specification: {
    is_refer_document: false,
    specification_attribute_groups: [],
  },
  brand_location_id: '',
  distributor_location_id: '',
  is_entire: true,
  project_zone_ids: [],
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
  const [specifyingState, setSpecifyingState] =
    useState<SpecifyingProductRequestBody>(DEFAULT_STATE);
  // console.log('specifyingState', specifyingState);
  const [specifyingGroups, setSpecifyingGroups] = useState<ProductAttributeFormInput[]>([]);
  const dataLoaded = useBoolean();

  const onChangeSpecifyingState: OnChangeSpecifyingProductFnc = (newStateParts) =>
    setSpecifyingState(
      (prevState) => ({ ...prevState, ...newStateParts } as SpecifyingProductRequestBody),
    );

  useEffect(() => {
    if (product.considered_id) {
      onChangeSpecifyingState({ considered_product_id: product.considered_id });
      getProductSpecifying(product.considered_id).then((res) => {
        if (res) {
          res.specification.specification_attribute_groups =
            res.specification.specification_attribute_groups.map((el) => ({
              ...el,
              isChecked: el.attributes.length > 0,
            }));
          onChangeSpecifyingState(
            pick(res, [
              'brand_location_id',
              'considered_product_id',
              'description',
              'distributor_location_id',
              'instruction_type_ids',
              'is_entire',
              'material_code_id',
              'order_method',
              'quantity',
              'requirement_type_ids',
              'special_instructions',
              'specification',
              'suffix_code',
              'unit_type_id',
            ]),
          );
        }
      });
    }
  }, [product.considered_id]);

  useEffect(() => {
    getProductByIdAndReturn(product.id).then((res) => {
      if (res) {
        const specGroups = res.specification_attribute_groups;
        console.log('specGroups', specGroups);
        setSpecifyingGroups(res.specification_attribute_groups);
        dataLoaded.setValue(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!dataLoaded.value) {
      return;
    }
    // Update checked status
    setSpecifyingGroups((prevState) => {
      if (prevState.length === 0) {
        return [];
      }

      if (specifyingState.specification.specification_attribute_groups.length === 0) {
        specifyingState.specification.specification_attribute_groups = prevState.map((el) => ({
          id: el.id || '',
          attributes: [],
          isChecked: false,
        }));
      }

      const newState = prevState.map((group, groupIndex) => ({
        ...group,
        isChecked:
          specifyingState.specification.specification_attribute_groups[groupIndex]?.attributes
            .length > 0,
        attributes: group?.attributes.map((attr, attrIndex) => ({
          ...attr,
          basis_options:
            attr.basis_options?.map((option) => ({
              ...option,
              isChecked:
                option.id ===
                specifyingState.specification.specification_attribute_groups[groupIndex]
                  ?.attributes[attrIndex]?.basis_option_id,
            })) || [],
        })),
      }));

      return newState;
    });
  }, [specifyingState.specification.specification_attribute_groups, dataLoaded.value]);

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
    updateProductSpecifying(specifyingState, () => {
      assignProductToProject({
        product_id: product.id,
        project_id: projectId,
        is_entire: specifyingState.is_entire,
        project_zone_ids: specifyingState.project_zone_ids,
      }).then((success) => {
        if (success) {
          reloadTable();
          setVisible(false);
          setSpecifyingState(DEFAULT_STATE);
        }
      });
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
          onChangeReferToDocument={onChangeReferToDocument}
          onChangeSpecification={onChangeSpecification}
          specifyingGroups={specifyingGroups}
          specification_attribute_groups={
            specifyingState.specification?.specification_attribute_groups
          }
          is_refer_document={specifyingState?.specification?.is_refer_document || false}
        />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.vendor}>
        <VendorTab
          productId={product.id}
          brandId={product.brand_id ?? ''}
          onChangeSpecifyingState={onChangeSpecifyingState}
          brandAddressId={specifyingState.brand_location_id}
          distributorAddressId={specifyingState.distributor_location_id}
        />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.allocation}>
        <AllocationTab
          projectId={projectId}
          productId={product.id}
          roomId={product.project_zone_id}
          isEntire={product.is_entire}
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
