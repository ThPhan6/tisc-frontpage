import { FC } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { useProductAttributeForm } from './hooks';
import { useScreen } from '@/helper/common';
import { useBoolean, useCheckPermission, useGetParamId } from '@/helper/hook';

import { setPartialProductDetail } from '../../reducers';
import { ProductAttributeFormInput } from '../../types';
import { ProductInfoTab } from './types';
import store from '@/reducers';
import { ProductAttributes } from '@/types';

import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { ProductAttributeGroup } from './ProductAttributeGroup';
import styles from './index.less';
import { DimensionWeight } from '@/features/dimension-weight';

const reorder = (data: any, startIndex: number, endIndex: number) => {
  const result = Array.from(data);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

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
  const isDragDisabled = useBoolean(true);

  const { addNewProductAttribute, attributeGroup, dimensionWeightData } = useProductAttributeForm(
    activeKey,
    curProductId,
    {
      isSpecifiedModal,
      isGetProductSpecification: true, // except specifying modal
      isGetDimensionWeight: isTiscAdmin && activeKey === 'specification' && !curProductId, // get only dimension weight list when create new product
    },
  );

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newAttributesGroups = reorder(
      attributeGroup,
      result.source.index,
      result.destination.index,
    ) as ProductAttributeFormInput[];

    if (activeKey === 'general') {
      store.dispatch(
        setPartialProductDetail({
          general_attribute_groups: newAttributesGroups,
        }),
      );
      return;
    }

    if (activeKey === 'feature') {
      store.dispatch(
        setPartialProductDetail({
          feature_attribute_groups: newAttributesGroups,
        }),
      );
      return;
    }

    if (activeKey === 'specification') {
      store.dispatch(
        setPartialProductDetail({
          specification_attribute_groups: newAttributesGroups,
        }),
      );
    }
  };

  return (
    <>
      {isEditable ? (
        <CustomPlusButton
          size={18}
          label="Add Attribute"
          onClick={addNewProductAttribute}
          customClass={styles.paddingSpace}
        />
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={'droppable'}>
            {(provided: any) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {attributeGroup.map((attrGroupItem, groupIndex) => (
                  <Draggable
                    key={attrGroupItem.id}
                    draggableId={attrGroupItem.id}
                    index={groupIndex}
                    isDragDisabled={isDragDisabled.value}
                  >
                    {(dragProvided: any) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                      >
                        <ProductAttributeGroup
                          activeKey={activeKey}
                          attributeGroup={attributeGroup}
                          attrGroupItem={attrGroupItem}
                          groupIndex={groupIndex}
                          attributes={attributes}
                          specifying={specifying}
                          noBorder={noBorder}
                          curProductId={curProductId}
                          isSpecifiedModal={isSpecifiedModal}
                          onDrag={(isDrag) => isDragDisabled.setValue(isDrag)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
};
