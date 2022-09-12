import { FC, useEffect, useState } from 'react';

import {
  ProjectSpecifyTabKeys,
  ProjectSpecifyTabValue,
  ProjectSpecifyTabs,
} from '../../../constants/tab';
import { message } from 'antd';

import { useAssignProductToSpaceForm } from '@/features/product/modals/hooks';
import { getProductById } from '@/features/product/services';
import { getProductSpecifying, updateProductSpecifying } from '@/features/project/services';
import { useBoolean } from '@/helper/hook';
import { pick } from 'lodash';

import { OnChangeSpecifyingProductFnc, SpecifyingProductRequestBody } from './types';
import { ProductAttributeFormInput, ProductItem } from '@/features/product/types';
import { SpecificationAttributeGroup } from '@/features/project/types';

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

const DEFAULT_STATE: SpecifyingProductRequestBody = {
  considered_product_id: '',
  specification: {
    is_refer_document: true,
    specification_attribute_groups: [],
  },
  brand_location_id: '',
  distributor_location_id: '',
  is_entire: true,
  project_zone_ids: [],
  material_code_id: '',
  suffix_code: '',
  description: '',
  quantity: '0',
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
  const [specifyingGroups, setSpecifyingGroups] = useState<ProductAttributeFormInput[]>([]);
  const dataLoaded = useBoolean();

  const onChangeSpecifyingState: OnChangeSpecifyingProductFnc = (newStateParts) =>
    setSpecifyingState(
      (prevState) => ({ ...prevState, ...newStateParts } as SpecifyingProductRequestBody),
    );

  const { AssignProductToSpaceForm } = useAssignProductToSpaceForm(product.id, projectId, {
    onChangeEntireProjectCallback: (is_entire) => onChangeSpecifyingState({ is_entire }),
    onChangeSelectedRoomsCallback: (selectedRooms) =>
      onChangeSpecifyingState({ project_zone_ids: selectedRooms }),
    roomId: product.project_zone_id,
    isEntire: product.is_entire,
  });

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
    getProductById(product.id).then(() => {
      dataLoaded.setValue(true);
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

      const specGroups = specifyingState.specification.specification_attribute_groups;

      // Initial
      if (specGroups.length === 0) {
        specifyingState.specification.specification_attribute_groups = prevState.map((el) => ({
          id: el.id || '',
          attributes: [],
          isChecked: false,
        }));
      }

      // Update checked status
      const newState = prevState.map((group, groupIndex) => ({
        ...group,
        isChecked: specGroups[groupIndex]?.attributes.length > 0,
        attributes: group?.attributes.map((attr, attrIndex) => ({
          ...attr,
          basis_options:
            attr.basis_options?.map((option) => ({
              ...option,
              isChecked:
                option.id === specGroups[groupIndex]?.attributes[attrIndex]?.basis_option_id,
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
    if (!Number(specifyingState.quantity)) {
      message.error('Quantity must be greater than 0');
      return;
    }

    let variant = '';
    if (specifyingState.specification.is_refer_document) {
      variant = 'Refer to Document';
    } else {
      specifyingState.specification.specification_attribute_groups.forEach((group, groupIndex) => {
        if (!group.isChecked) {
          return;
        }
        group.attributes.forEach((attr) => {
          const attribute = specifyingGroups[groupIndex]?.attributes?.find(
            (stateAttr) => stateAttr.id === attr.id,
          );
          const basisOption = attribute?.basis_options?.find(
            (el) => el.id === attr.basis_option_id,
          );
          // console.log('basisOption', basisOption);
          if (basisOption) {
            variant += `${attribute?.name}: ${basisOption.value_1} ${basisOption.unit_1} - ${basisOption.value_2} ${basisOption.unit_2}; `;
          }
        });
      });
      variant = variant.slice(0, -2);
    }

    updateProductSpecifying(
      {
        ...specifyingState,
        variant,
        specification: {
          ...specifyingState.specification,
          specification_attribute_groups:
            specifyingState.specification.specification_attribute_groups.map((el) => ({
              ...el,
              attributes: el.isChecked ? el.attributes : [],
            })),
        },
      },
      () => {
        reloadTable();
        setVisible(false);
        setSpecifyingState(DEFAULT_STATE);
      },
    );
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
          }}
          onChangeSpecifyingState={onChangeSpecifyingState}
        />
      </CustomTabPane>
    </CustomModal>
  );
};
