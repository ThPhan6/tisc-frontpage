import { FC } from 'react';
import { useAppSelector } from '@/reducers';
import { useDispatch } from 'react-redux';
import styles from '../detail.less';
import CustomCollapse from '@/components/Collapse';
import { GeneralFeatureContent, GeneralFeatureHeader } from './GeneralFeature';
import { useCheckPermission } from '@/helper/hook';
import { AttributebyType } from '@/types';
import { setPartialProductDetail } from '../../reducers';
import { MainTitle } from '@/components/Typography';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import GeneralFeatureAttributeItem from './GeneralFeatureAttributeItem';

interface GeneralFeatureAttributeProps {
  attributes: AttributebyType['general'] | AttributebyType['feature'];
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
        if (isTiscAdmin) {
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
        return (
          <CustomCollapse
            showActiveBoxShadow
            key={`${group.name}_${index}`}
            className={styles.vendorSection}
            customHeaderClass={styles.vendorCustomPanelBox}
            header={<GeneralFeatureHeader name={group.name} />}
          >
            {group.attributes.map((attribute) => (
              <GeneralFeatureContent
                key={attribute.id}
                type={attribute.type}
                text={attribute.text}
              />
            ))}
          </CustomCollapse>
        );
      })}
    </>
  );
};
