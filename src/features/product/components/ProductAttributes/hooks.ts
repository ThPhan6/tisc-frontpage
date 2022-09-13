import { useDispatch } from 'react-redux';

import { cloneDeep } from 'lodash';

import { setPartialProductDetail } from '../../reducers';
import { ProductAttributeProps } from '../../types';
import { ProductInfoTab } from '../ProductAttributeComponent/types';
import { useAppSelector } from '@/reducers';

import { AttributeGroupKey } from '../ProductAttributeComponent/ProductAttributeItem';

export const useProductAttributeForm = (attributeType: ProductInfoTab) => {
  const dispatch = useDispatch();
  const { feature_attribute_groups, general_attribute_groups, specification_attribute_groups } =
    useAppSelector((state) => state.product.details);

  const attributeGroup =
    attributeType === 'general'
      ? general_attribute_groups
      : attributeType === 'feature'
      ? feature_attribute_groups
      : specification_attribute_groups;

  const attributeGroupKey: AttributeGroupKey =
    attributeType === 'general'
      ? 'general_attribute_groups'
      : attributeType === 'feature'
      ? 'feature_attribute_groups'
      : 'specification_attribute_groups';

  const onDeleteProductAttribute = (index: number) => () => {
    const newProductAttribute = attributeGroup.filter((_item, key) => index !== key);
    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newProductAttribute,
      }),
    );
  };

  const onChangeAttributeItem = (index: number) => (data: ProductAttributeProps[]) => {
    const newProductAttribute = [...attributeGroup];
    newProductAttribute[index] = {
      ...newProductAttribute[index],
      attributes: data,
    };
    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: newProductAttribute,
      }),
    );
  };

  const addNewProductAttribute = () => {
    dispatch(
      setPartialProductDetail({
        [attributeGroupKey]: [
          ...attributeGroup,
          {
            name: '',
            attributes: [],
          },
        ],
      }),
    );
  };

  const onChangeAttributeName =
    (groupIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAttributes = [...attributeGroup];
      const newItemAttributes = { ...attributeGroup[groupIndex] };

      newItemAttributes.name = e.target.value;
      newAttributes[groupIndex] = newItemAttributes;

      dispatch(
        setPartialProductDetail({
          [attributeGroupKey]: newAttributes,
        }),
      );
    };

  const deleteAttributeItem =
    (groupIndex: number, attrIndex: number, callback?: () => void) => () => {
      const newAttributes = [...attributeGroup];
      const newItemAttributes = attributeGroup[groupIndex].attributes.filter(
        (_attr, idx) => idx !== attrIndex,
      );

      newAttributes[groupIndex] = {
        ...newAttributes[groupIndex],
        attributes: newItemAttributes,
      };

      /// reset selected
      callback?.();

      dispatch(
        setPartialProductDetail({
          [attributeGroupKey]: newAttributes,
        }),
      );
    };

  const onSelectSpecificationOption = (
    groupIndex: number,
    attributeId: string,
    optionId?: string,
  ) => {
    const newState = cloneDeep(specification_attribute_groups);
    const attributeIndex = newState[groupIndex].attributes.findIndex((el) => el.id === attributeId);
    console.log('newState', newState);
    console.log('attributeIndex', attributeIndex);

    if (attributeIndex !== -1) {
      newState[groupIndex].attributes[attributeIndex].basis_options = newState[
        groupIndex
      ].attributes[attributeIndex].basis_options?.map((el) => ({
        ...el,
        isChecked: el.id === optionId ? true : false,
      }));
    }
    console.log('newState', newState);
    dispatch(setPartialProductDetail({ specification_attribute_groups: newState }));
  };

  const onCheckedSpecification = (groupIndex: number, checked?: boolean) => {
    const newState = cloneDeep(specification_attribute_groups);
    newState[groupIndex].isChecked =
      checked === undefined ? !newState[groupIndex].isChecked : checked;
    dispatch(setPartialProductDetail({ specification_attribute_groups: newState }));
  };

  return {
    onDeleteProductAttribute,
    onChangeAttributeItem,
    addNewProductAttribute,
    onChangeAttributeName,
    deleteAttributeItem,
    attributeGroupKey,
    attributeGroup,
    onCheckedSpecification,
    onSelectSpecificationOption,
  };
};
