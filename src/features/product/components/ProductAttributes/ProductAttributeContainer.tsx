import { FC, useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { ReactComponent as DragIcon } from '@/assets/icons/scroll-icon.svg';

import { useProductAttributeForm } from './hooks';
import { useScreen } from '@/helper/common';
import { useCheckPermission, useGetParamId } from '@/helper/hook';
import { sortObjectArray } from '@/helper/utils';

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
  //sort attribute items
  // const allSubAttributes = attributes?.reduce((pre, cur: any) => {
  //   return pre.concat(cur.subs);
  // }, []);
  // console.log('allSubAttributes: ', allSubAttributes);
  // console.log('attributes: ', attributes);
  const sortedAttributeGroup = attributeGroup.map((group) => {
    const mappedNameData = [...group.attributes].map((attribute) => {
      // const foundAttributeData: any = allSubAttributes?.find(
      //   (item: any) => item.id === attribute.id,
      // );
      // console.log('foundAttributeData: ', foundAttributeData);
      // return {
      //   ...attribute,
      //   name: foundAttributeData?.name || '',
      // };
      return attribute;
    });
    return {
      ...group,
      attributes: sortObjectArray([...mappedNameData], 'name', 'asc'),
    };
  });
  const brandSpecifiedDetails = useAppSelector((state) => state.product.brandSpecifiedDetails);
  const { specification } = brandSpecifiedDetails;

  /// save group selected for brand user can re-select after modifying
  const prevAttributeGroupSelectedIds = useMemo(() => {
    const prevGroupAttrSelected: string[] = [];

    specification.attribute_groups.forEach((el) => {
      prevGroupAttrSelected.push(el.id);
    });

    return prevGroupAttrSelected;
  }, [JSON.stringify(specification)]);

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
              label="Create Steps"
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

      {!sortedAttributeGroup?.length ? null : (
        <DragDropContainer onDragEnd={onDragEnd}>
          {sortedAttributeGroup.map((attrGroupItem, groupIndex) => (
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
                    attributeGroup={sortedAttributeGroup}
                    attrGroupItem={attrGroupItem}
                    prevAttributeGroupSelectedIds={prevAttributeGroupSelectedIds}
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
          attributeGroup={sortedAttributeGroup}
          attributes={attributes ?? []}
          visible={autoStepPopup}
          setVisible={setAutoStepPopup}
        />
      ) : null}
    </>
  );
};
