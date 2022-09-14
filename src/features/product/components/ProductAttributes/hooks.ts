import { useDispatch } from 'react-redux';

import { cloneDeep } from 'lodash';

import { setPartialProductDetail } from '../../reducers';
import { ProductAttributeProps } from '../../types';
import { ProductInfoTab } from '../ProductAttributeComponent/types';
import { useAppSelector } from '@/reducers';

import { AttributeGroupKey } from '../ProductAttributeComponent/ProductAttributeItem';

export const useProductAttributeForm = (attributeType: ProductInfoTab) => {
  const dispatch = useDispatch();
  const {
    feature_attribute_groups,
    general_attribute_groups,
    specification_attribute_groups,
    referToDesignDocument,
  } = useAppSelector((state) => state.product.details);

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

    if (attributeIndex === -1) {
      return;
    }

    newState[groupIndex].attributes[attributeIndex].basis_options = newState[groupIndex].attributes[
      attributeIndex
    ].basis_options?.map((el) => ({
      ...el,
      isChecked: el.id === optionId ? true : false,
    }));

    const haveUncheckOptionAttribute = newState[groupIndex].attributes.some((attr) => {
      if (attr.type !== 'Options') {
        return false;
      }

      const haveCheckOption = attr.basis_options?.some((opt) => opt.isChecked);
      return !haveCheckOption;
    });

    if (!haveUncheckOptionAttribute) {
      // All option attribute have selected then auto check their spec group
      newState[groupIndex].isChecked = true;
    }

    dispatch(setPartialProductDetail({ specification_attribute_groups: newState }));
  };

  const onCheckedSpecification = (groupIndex: number) => {
    const newState = cloneDeep(specification_attribute_groups);
    const haveOptionAttr = newState[groupIndex].attributes.some((el) => el.type === 'Options');

    console.log('specification_attribute_groups', specification_attribute_groups);
    console.log('haveOptionAttr', haveOptionAttr);

    if (newState[groupIndex].isChecked && haveOptionAttr) {
      // UNCHECK group and clear all selected option
      newState[groupIndex].attributes = newState[groupIndex].attributes.map((attr) => ({
        ...attr,
        basis_options: attr?.basis_options?.map((otp) => ({ ...otp, isChecked: false })),
      }));
    }

    if (newState[groupIndex].isChecked || !haveOptionAttr) {
      // CHECK group but only allow change for group don't have any option attribute
      // If have option attribute user have to chose option
      newState[groupIndex].isChecked = !newState[groupIndex].isChecked;
    }

    dispatch(
      setPartialProductDetail({
        specification_attribute_groups: newState,
        referToDesignDocument: newState[groupIndex].isChecked ? false : referToDesignDocument,
      }),
    );
  };

  const checkReferToDesignDocument = () => {
    dispatch(
      setPartialProductDetail({
        referToDesignDocument: true,
        specification_attribute_groups: specification_attribute_groups.map((group) => ({
          ...group,
          isChecked: false,
          attributes: group.attributes.map((attr) => ({
            ...attr,
            basis_options: attr?.basis_options?.map((otp) => ({ ...otp, isChecked: false })),
          })),
        })),
      }),
    );
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
    checkReferToDesignDocument,
    referToDesignDocument,
  };
};
