import { useAppSelector } from '@/reducers';
import styles from './styles/attributes.less';
import AttributeCollapse from './components/AttributeCollapse';
import ProductAttributeLine from './components/ProductAttributeLine';
import AttributeOption from './components/AttributeOption';
import GeneralText from './components/GeneralText';
import ConversionText from './components/ConversionText';

const SpecificationAttribute = () => {
  const { specification_attribute_groups } = useAppSelector((state) => state.product.details);

  return (
    <div className={styles.attributes}>
      <div className={styles.specification}>
        {specification_attribute_groups.map((group, index) => (
          <AttributeCollapse name={group.name} index={index} key={index}>
            {group.attributes.map((attribute, key) => (
              <ProductAttributeLine name={attribute.name} key={key}>
                {attribute.conversion ? (
                  <ConversionText
                    conversion={attribute.conversion}
                    firstValue={attribute.conversion_value_1}
                    secondValue={attribute.conversion_value_2}
                  />
                ) : attribute.type === 'Options' ? (
                  <AttributeOption
                    title={group.name}
                    attributeName={attribute.name}
                    options={attribute.basis_options}
                  />
                ) : (
                  <GeneralText text={attribute.text} />
                )}
              </ProductAttributeLine>
            ))}
          </AttributeCollapse>
        ))}
      </div>
    </div>
  );
};

export default SpecificationAttribute;

// {group.attributes.map((attribute) => {
//   return (
//     <div className={styles.attribute} key={attribute.id}>
//       <BodyText level={4} customClass={styles.content_text}>
//         {attribute.text}
//       </BodyText>
//
//       <div className={styles.content} onClick={() => handleShowPopUp(group.name)}>
//         <BodyText level={6} fontFamily="Roboto" customClass={styles.content_select}>
//           select
//         </BodyText>
//         <ActionRightIcon className={styles.singlerRighIcon} />
//       </div>
//     </div>
//   )
// })}
