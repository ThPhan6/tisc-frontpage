import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { useCheckPermission } from '@/helper/hook';

import { setPartialProductDetail } from '../../reducers';
import { ProductAttributeFormInput, ProductAttributeProps } from '../../types';
import { ProductInfoTab } from './types';
import { useAppSelector } from '@/reducers';
import { ProductAttributes } from '@/types';

import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { MainTitle } from '@/components/Typography';

import styles from '../detail.less';
import {
  AttributeCollapse,
  AttributeOption,
  ConversionText,
  GeneralText,
  ProductAttributeLine,
} from './AttributeComponent';
import ProductAttributeItem from './ProductAttributeItem';

interface CollapseProductAttributeProps {
  group: ProductAttributeFormInput;
  index: number;
}
const CollapseProductAttribute: React.FC<CollapseProductAttributeProps> = ({ group, index }) => {
  const renderAttributeOption = (attribute: ProductAttributeProps) => {
    if (attribute.conversion) {
      return (
        <ConversionText
          conversion={attribute.conversion}
          firstValue={attribute.conversion_value_1}
          secondValue={attribute.conversion_value_2}
        />
      );
    }

    return attribute.type === 'Options' ? (
      <AttributeOption
        title={group.name}
        attributeName={attribute.name}
        options={attribute.basis_options ?? []}
      />
    ) : (
      <GeneralText text={attribute.text} />
    );
  };

  return (
    <AttributeCollapse name={group.name} index={index}>
      <table className={styles.table}>
        <tbody>
          {group.attributes.map((attribute, key) => (
            <tr key={key}>
              <td className={styles.attributeName}>
                <ProductAttributeLine name={attribute.name} />
              </td>
              <td className={styles.attributeDescription}>{renderAttributeOption(attribute)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AttributeCollapse>
  );
};

const getCompared = (value_1: [boolean, any], value_2: [boolean, any], value_3: any) => {
  if (value_1[0]) return value_1[1];

  return value_2[0] ? value_2[1] : value_3;
};

interface ProductAttributeContainerProps {
  attributes?: ProductAttributes[];
  activeKey: ProductInfoTab;
}
export const ProductAttributeContainer: FC<ProductAttributeContainerProps> = ({
  activeKey,
  attributes,
}) => {
  const dispatch = useDispatch();
  const isTiscAdmin = useCheckPermission('TISC Admin');
  const { feature_attribute_groups, general_attribute_groups, specification_attribute_groups } =
    useAppSelector((state) => state.product.details);

  const attributeGroup = getCompared(
    [activeKey === 'general', general_attribute_groups],
    [activeKey === 'feature', feature_attribute_groups],
    specification_attribute_groups,
  ) as ProductAttributeFormInput[];

  const attributeGroupKey = getCompared(
    [activeKey === 'general', 'general_attribute_groups'],
    [activeKey === 'feature', 'feature_attribute_groups'],
    'specification_attribute_groups',
  );

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

  return (
    <>
      {isTiscAdmin ? (
        <div className={styles.addAttributeBtn} onClick={addNewProductAttribute}>
          <MainTitle level={4} customClass="add-attribute-text">
            Add Attribute
          </MainTitle>
          <CustomPlusButton size={18} />
        </div>
      ) : null}

      {attributeGroup.map((group, index) => {
        if (isTiscAdmin === false) {
          return <CollapseProductAttribute key={group.id || index} group={group} index={index} />;
        }
        if (attributes) {
          return (
            <ProductAttributeItem
              attributes={attributes}
              attributeGroup={attributeGroup}
              attributeGroupKey={attributeGroupKey}
              key={group.id || index}
              index={index}
              activeKey={activeKey}
              onDelete={onDeleteProductAttribute(index)}
              onItemChange={onChangeAttributeItem(index)}
            />
          );
        }
        return null;
      })}
    </>
  );
};
