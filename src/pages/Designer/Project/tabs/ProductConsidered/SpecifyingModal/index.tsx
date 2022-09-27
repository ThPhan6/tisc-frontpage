import { FC, useEffect, useState } from 'react';

import {
  ProjectSpecifyTabKeys,
  ProjectSpecifyTabValue,
  ProjectSpecifyTabs,
} from '../../../constants/tab';
import { ORDER_METHOD } from '@/constants/util';
import { message } from 'antd';

import { getSpecificationRequest } from '@/features/product/components/ProductAttributes/hooks';
import { useAssignProductToSpaceForm } from '@/features/product/modals/hooks';
import { getProductById } from '@/features/product/services';
import { getProductSpecifying, updateProductSpecifying } from '@/features/project/services';
import { pick } from 'lodash';

import { OnChangeSpecifyingProductFnc, SpecifyingProductRequestBody } from './types';
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
  order_method: ORDER_METHOD['directPurchase'],
  requirement_type_ids: [],
  instruction_type_ids: [],
  finish_schedules: [],
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
  const referToDesignDocument = useAppSelector(
    (state) => state.product.details.referToDesignDocument,
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

  console.log('specifyingState', specifyingState);

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
              'finish_schedules',
            ]),
          );
        }
      });
    }
  }, [product.considered_id]);

  useEffect(() => {
    getProductById(product.id);
  }, []);

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

    updateProductSpecifying(
      {
        ...specifyingState,
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
        <SpecificationTab />
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
            finish_schedules: specifyingState.finish_schedules,
          }}
          onChangeSpecifyingState={onChangeSpecifyingState}
        />
      </CustomTabPane>
    </CustomModal>
  );
};
