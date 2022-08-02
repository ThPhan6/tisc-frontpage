import { FC } from 'react';
import styles from '../detail.less';
import { useAppSelector } from '@/reducers';
import { useDispatch } from 'react-redux';
import { AttributebyType } from '@/types';
import { GeneralFeatureFormInput } from '../../types';
import {
  AttributeCollapse,
  ConversionText,
  GeneralText,
  ProductAttributeLine,
} from './AttributeComponent';
import { useCheckPermission } from '@/helper/hook';
import { MainTitle } from '@/components/Typography';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import GeneralFeatureAttributeItem from './GeneralFeatureAttributeItem';
import { setPartialProductDetail } from '../../reducers';

interface CollapseProductAttributeProps {
  group: GeneralFeatureFormInput;
  index: number;
}
const CollapseProductAttribute: React.FC<CollapseProductAttributeProps> = ({ group, index }) => {
  return (
    <AttributeCollapse name={group.name} index={index}>
      {group.attributes.map((attribute, key) => (
        <ProductAttributeLine name={attribute.name} key={key}>
          {attribute.conversion ? (
            <ConversionText
              conversion={attribute.conversion}
              firstValue={attribute.conversion_value_1}
              secondValue={attribute.conversion_value_2}
            />
          ) : (
            <GeneralText text={attribute.text} />
          )}
        </ProductAttributeLine>
      ))}
    </AttributeCollapse>
  );
};

interface GeneralFeatureAttributeProps {
  attributes?: AttributebyType['general'] | AttributebyType['feature'];
  activeKey: 'general' | 'feature';
}
export const GeneralFeatureAttribute: FC<GeneralFeatureAttributeProps> = ({
  activeKey,
  attributes,
}) => {
  const dispatch = useDispatch();
  const isTiscAdmin = useCheckPermission('TISC Admin');
  const { feature_attribute_groups, general_attribute_groups } = useAppSelector(
    (state) => state.product.details,
  );

  const attributeGroup =
    activeKey === 'general' ? general_attribute_groups : feature_attribute_groups;

  const addNewGeneralFeatureAttribute = () => {
    if (activeKey === 'general') {
      return dispatch(
        setPartialProductDetail({
          general_attribute_groups: [
            ...general_attribute_groups,
            {
              name: '',
              attributes: [],
            },
          ],
        }),
      );
    }
    return dispatch(
      setPartialProductDetail({
        feature_attribute_groups: [
          ...feature_attribute_groups,
          {
            name: '',
            attributes: [],
          },
        ],
      }),
    );
  };

  const onDeleteGeneralFeatureAttribute = (index: number) => {
    if (activeKey === 'general') {
      const newGeneralFeatureAttributes = general_attribute_groups.filter(
        (_item, key) => index !== key,
      );
      return dispatch(
        setPartialProductDetail({
          general_attribute_groups: newGeneralFeatureAttributes,
        }),
      );
    }
    const newGeneralFeatureAttributes = feature_attribute_groups.filter(
      (_item, key) => index !== key,
    );
    return dispatch(
      setPartialProductDetail({
        feature_attribute_groups: newGeneralFeatureAttributes,
      }),
    );
  };

  return (
    <>
      {isTiscAdmin && (
        <div className={styles.addAttributeBtn} onClick={addNewGeneralFeatureAttribute}>
          <MainTitle level={4} customClass="add-attribute-text">
            Add Attribute
          </MainTitle>
          <CustomPlusButton size={18} />
        </div>
      )}

      {attributeGroup.map((group, index) => {
        if (isTiscAdmin === false) {
          return <CollapseProductAttribute key={group.id || index} group={group} index={index} />;
        }
        if (attributes) {
          return (
            <GeneralFeatureAttributeItem
              attributes={attributes}
              attributeItem={group}
              key={group.id || index}
              index={index}
              activeKey={activeKey}
              onDelete={() => onDeleteGeneralFeatureAttribute(index)}
              onItemChange={(data) => {
                const newGeneralFeatureAttributes = [...general_attribute_groups];
                newGeneralFeatureAttributes[index] = {
                  ...newGeneralFeatureAttributes[index],
                  attributes: data,
                };
                dispatch(
                  setPartialProductDetail({
                    general_attribute_groups: newGeneralFeatureAttributes,
                  }),
                );
              }}
            />
          );
        }
        return null;
      })}
    </>
  );
};
