import { MainTitle } from '@/components/Typography';
import GeneralFeatureAttributeItem from './GeneralFeatureAttributeItem';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { AttributebyType } from '@/types';
import styles from '../../styles/details.less';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setPartialProductDetail } from '@/reducers/product';

interface GeneralFeatureAttributeProps {
  attributes: AttributebyType['general'] | AttributebyType['feature'];
  activeKey: 'general' | 'feature';
}

const GeneralFeatureAttribute = (props: GeneralFeatureAttributeProps) => {
  const { attributes, activeKey } = props;
  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();
  const { general_attribute_groups, feature_attribute_groups } = product.details;

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
      <div className={styles.addAttributeBtn} onClick={addNewGeneralFeatureAttribute}>
        <MainTitle level={4} customClass="add-attribute-text">
          Add Attribute
        </MainTitle>
        <CustomPlusButton size={18} />
      </div>
      {activeKey === 'general'
        ? general_attribute_groups.map((item, key) => (
            <GeneralFeatureAttributeItem
              attributes={attributes}
              attributeItem={item}
              key={key}
              index={key}
              activeKey={activeKey}
              onDelete={() => onDeleteGeneralFeatureAttribute(key)}
              onItemChange={(data) => {
                const newGeneralFeatureAttributes = [...general_attribute_groups];
                newGeneralFeatureAttributes[key] = {
                  ...newGeneralFeatureAttributes[key],
                  attributes: data,
                };
                dispatch(
                  setPartialProductDetail({
                    general_attribute_groups: newGeneralFeatureAttributes,
                  }),
                );
              }}
            />
          ))
        : feature_attribute_groups.map((item, key) => (
            <GeneralFeatureAttributeItem
              attributes={attributes}
              attributeItem={item}
              key={key}
              index={key}
              activeKey={activeKey}
              onDelete={() => onDeleteGeneralFeatureAttribute(key)}
              onItemChange={(data) => {
                const newGeneralFeatureAttributes = [...feature_attribute_groups];
                newGeneralFeatureAttributes[key] = {
                  ...newGeneralFeatureAttributes[key],
                  attributes: data,
                };
                dispatch(
                  setPartialProductDetail({
                    feature_attribute_groups: newGeneralFeatureAttributes,
                  }),
                );
              }}
            />
          ))}
    </>
  );
};

export default GeneralFeatureAttribute;
