import { FC } from 'react';

import { useProductAttributeForm } from './hooks';
import { useCheckPermission, useGetParamId } from '@/helper/hook';

import { setPartialProductDetail } from '../../reducers';
import { ProductInfoTab } from './types';
import store from '@/reducers';
import { ProductAttributes } from '@/types';

import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

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
  const isTiscAdmin = useCheckPermission('TISC Admin');
  const curProductId = productId ?? productIdParam;

  const { addNewProductAttribute, attributeGroup, dimensionWeightData } = useProductAttributeForm(
    activeKey,
    curProductId,
    {
      isSpecifiedModal,
      isGetProductSpecification: true, // except specifying modal
      isGetDimensionWeight: isTiscAdmin && activeKey === 'specification' && !curProductId, // get only dimension weight list when create new product
    },
  );

  return (
    <>
      {isTiscAdmin ? (
        <CustomPlusButton
          size={18}
          label="Add Attribute"
          onClick={addNewProductAttribute}
          customClass={styles.paddingSpace}
        />
      ) : null}

      <DimensionWeight
        collapseStyles={!isSpecifiedModal}
        customClass={!isTiscAdmin ? styles.marginTopSpace : styles.colorInput}
        editable={isTiscAdmin}
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

      {attributeGroup.map((attrGroupItem, groupIndex) => {
        return (
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
          />
        );
      })}
    </>
  );
};
