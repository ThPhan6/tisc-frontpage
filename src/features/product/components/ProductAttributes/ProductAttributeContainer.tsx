import { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { ReactComponent as DragIcon } from '@/assets/icons/scroll-icon.svg';

import { useProductAttributeForm } from './hooks';
import { useScreen } from '@/helper/common';
import { useCheckPermission, useGetParamId } from '@/helper/hook';

import { setPartialProductDetail } from '../../reducers';
import { ProductInfoTab } from './types';
import store from '@/reducers';
import { ProductAttributes } from '@/types';

import { DragDropContainer } from '@/components/Drag';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { AutoStep } from '../AutoStep/AutoStep';
import { ProductAttributeGroup } from './ProductAttributeGroup';
import styles from './index.less';
import { DimensionWeight } from '@/features/dimension-weight';

export interface ProductAttributeContainerProps {
  attributes?: ProductAttributes[];
  activeKey: ProductInfoTab;
  specifying?: boolean;
  noBorder?: boolean;
  isSpecifiedModal?: boolean;
  productId?: string;
}

export const ProductAttributeContainer: FC<ProductAttributeContainerProps> = ({
  activeKey,
  attributes,
  specifying,
  noBorder,
  productId,
  isSpecifiedModal,
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
    autoStepPopup,
    setAutoStepPopup,
    onDragEnd,
  } = useProductAttributeForm(activeKey, curProductId, {
    isSpecifiedModal,
    isGetProductSpecification: true, // except specifying modal
    isGetDimensionWeight: isTiscAdmin && activeKey === 'specification' && !curProductId, // get only dimension weight list when create new product
  });

  return (
    <>
      {isEditable ? (
        <div className="flex-end">
          <CustomPlusButton
            size={18}
            label="Add Attribute"
            onClick={() => {
              addNewProductAttribute();
            }}
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
                    specifying={specifying}
                    noBorder={noBorder}
                    curProductId={curProductId}
                    isSpecifiedModal={isSpecifiedModal}
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
          step="pre"
        />
      ) : null}
    </>
  );
};
