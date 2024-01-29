import { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { ReactComponent as DragIcon } from '@/assets/icons/scroll-icon.svg';

import { useProductAttributeForm } from './hooks';
import { useScreen } from '@/helper/common';
import { useCheckPermission, useGetParamId } from '@/helper/hook';

import { closeActiveSpecAttributeGroup, setPartialProductDetail } from '../../reducers';
import { ProductInfoTab } from './types';
import store, { useAppSelector } from '@/reducers';
import {
  activeDimensionWeightCollapse,
  activeProductInformationCollapse,
  closeDimensionWeightGroup,
  closeProductInformationGroup,
} from '@/reducers/active';
import { ProductAttributes } from '@/types';

import { DragDropContainer } from '@/components/Drag';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { AutoStep } from '../AutoStep/AutoStep';
import { ProductAttributeGroup } from './ProductAttributeGroup';
import styles from './index.less';
import { DimensionWeight } from '@/features/dimension-weight';
import { ProductInformation } from '@/features/product-information';

export interface ProductAttributeContainerProps {
  attributes?: ProductAttributes[];
  activeKey: ProductInfoTab;
  // specifying?: boolean;
  noBorder?: boolean;
  isSpecifiedModal?: boolean;
  productId?: string;
  isSpecified?: boolean;
}

export const ProductAttributeContainer: FC<ProductAttributeContainerProps> = ({
  activeKey,
  attributes,
  // specifying,
  noBorder,
  productId,
  isSpecifiedModal,
  isSpecified,
}) => {
  const productIdParam = useGetParamId();
  const isTablet = useScreen().isTablet;
  const isTiscAdmin = useCheckPermission(['TISC Admin', 'Consultant Team']);
  const isEditable = isTiscAdmin && !isTablet;
  const curProductId = productId ?? productIdParam;

  const {
    addNewProductAttribute,
    addNewAutoStep,
    attributeGroup,
    attributeGroupKey,
    dimensionWeightData,
    productInformationData,
    autoStepPopup,
    setAutoStepPopup,
    onDragEnd,
  } = useProductAttributeForm(activeKey, curProductId, {
    isSpecifiedModal,
    isGetProductSpecification: true, // except specifying modal
    isGetDimensionWeight: isTiscAdmin && activeKey === 'specification' && !curProductId, // get only dimension weight list when create new product
  });

  const dimensionWightActiveCollapseKey = useAppSelector((state) => state.active.dimensionWeight);
  const productInformationActiveCollapseKey = useAppSelector(
    (state) => state.active.productInformation,
  );
  return (
    <>
      {isEditable ? (
        <div className="flex-end">
          <CustomPlusButton
            size={18}
            label="Add Attribute"
            onClick={addNewProductAttribute}
            customClass={styles.paddingSpace}
          />

          {attributeGroupKey === 'specification_attribute_groups' ? (
            <CustomPlusButton
              size={18}
              label="Create Auto-Steps"
              onClick={addNewAutoStep}
              customClass={styles.paddingSpace}
            />
          ) : null}
        </div>
      ) : null}

      <DimensionWeight
        activeCollapse={dimensionWightActiveCollapseKey}
        onChangeCollapse={(key) => {
          store.dispatch(activeDimensionWeightCollapse(key));
          store.dispatch(closeActiveSpecAttributeGroup());
          store.dispatch(closeProductInformationGroup());
        }}
        collapseStyles={!isSpecifiedModal}
        customClass={!isEditable ? styles.marginTopSpace : styles.colorInput}
        editable={isEditable}
        isConversionText={isSpecifiedModal}
        arrowAlignRight={isSpecifiedModal}
        isShow={activeKey === 'specification'}
        data={dimensionWeightData}
        onChange={(data) => {
          store.dispatch(
            setPartialProductDetail({
              dimension_and_weight: data,
            }),
          );
        }}
      />
      <ProductInformation
        activeCollapse={productInformationActiveCollapseKey}
        onChangeCollapse={(key) => {
          store.dispatch(activeProductInformationCollapse(key));
          store.dispatch(closeActiveSpecAttributeGroup());
          store.dispatch(closeDimensionWeightGroup());
        }}
        collapseStyles={!isSpecifiedModal}
        noPadding={isSpecifiedModal}
        isShow={activeKey === 'specification'}
        editable={isEditable}
        data={productInformationData}
        onChange={(data) => {
          store.dispatch(
            setPartialProductDetail({
              product_information: data,
            }),
          );
        }}
      />

      {!attributeGroup?.length ? null : (
        <DragDropContainer onDragEnd={onDragEnd}>
          {attributeGroup.map((attrGroupItem, groupIndex) => (
            <Draggable
              key={attrGroupItem.id}
              draggableId={attrGroupItem.id || String(groupIndex)}
              index={groupIndex}
            >
              {(dragProvided: any) => (
                <div ref={dragProvided.innerRef} {...dragProvided.draggableProps}>
                  <ProductAttributeGroup
                    key={attrGroupItem.id}
                    activeKey={activeKey}
                    attributeGroup={attributeGroup}
                    attrGroupItem={attrGroupItem}
                    groupIndex={groupIndex}
                    attributes={attributes}
                    // specifying={specifying}
                    isSpecified={isSpecified} /// on project product specified tab
                    noBorder={noBorder}
                    curProductId={curProductId}
                    isSpecifiedModal={isSpecifiedModal} /// using for both specifing modal on product considered and product specified
                    icon={
                      <div
                        {...dragProvided.dragHandleProps}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <DragIcon />
                      </div>
                    }
                  />
                </div>
              )}
            </Draggable>
          ))}
        </DragDropContainer>
      )}

      {isEditable && attributeGroupKey === 'specification_attribute_groups' ? (
        <AutoStep
          attributeGroup={attributeGroup}
          attributes={attributes ?? []}
          visible={autoStepPopup}
          setVisible={setAutoStepPopup}
        />
      ) : null}
    </>
  );
};
