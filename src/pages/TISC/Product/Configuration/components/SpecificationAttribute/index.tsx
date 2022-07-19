import { MainTitle } from '@/components/Typography';
import SpecificationAttributeItem from './SpecificationAttributeItem';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { AttributebyType } from '@/types';
import styles from '../../styles/details.less';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setPartialProductDetail } from '@/reducers/product';

interface SpecificationAttributeProps {
  attributes: AttributebyType['specification'];
}
const SpecificationAttribute = (props: SpecificationAttributeProps) => {
  const { attributes } = props;
  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();
  const { specification_attribute_groups } = product.details;

  const addNewSpecificationAttribute = () => {
    dispatch(
      setPartialProductDetail({
        specification_attribute_groups: [
          ...specification_attribute_groups,
          {
            name: '',
            attributes: [],
          },
        ],
      }),
    );
  };

  const onDeleteSpecificationAttribute = (index: number) => {
    const newSpecificationAttributes = specification_attribute_groups.filter(
      (_item, key) => index !== key,
    );
    return dispatch(
      setPartialProductDetail({
        specification_attribute_groups: newSpecificationAttributes,
      }),
    );
  };

  return (
    <>
      <div className={styles.addAttributeBtn} onClick={addNewSpecificationAttribute}>
        <MainTitle level={4} customClass="add-attribute-text">
          Add Attribute
        </MainTitle>
        <CustomPlusButton size={18} />
      </div>
      {specification_attribute_groups.map((item, key) => (
        <SpecificationAttributeItem
          attributes={attributes}
          attributeItem={item}
          key={key}
          index={key}
          onDelete={() => onDeleteSpecificationAttribute(key)}
          onItemChange={(data) => {
            const newSpecificationAttributes = [...specification_attribute_groups];
            newSpecificationAttributes[key] = {
              ...newSpecificationAttributes[key],
              attributes: data,
            };
            dispatch(
              setPartialProductDetail({
                specification_attribute_groups: newSpecificationAttributes,
              }),
            );
          }}
        />
      ))}
    </>
  );
};

export default SpecificationAttribute;
