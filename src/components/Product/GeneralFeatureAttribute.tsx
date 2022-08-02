import { useAppSelector } from '@/reducers';
import { FC } from 'react';
import AttributeCollapse from './components/AttributeCollapse';
import ProductAttributeLine from './components/ProductAttributeLine';
import GeneralText from './components/GeneralText';
import ConversionText from './components/ConversionText';
import type { GeneralFeatureFormInput } from '@/types';

import styles from './styles/attributes.less';

interface GeneralFeatureAttributeProps {
  activeKey: 'general' | 'feature';
}
interface CollapseProductAttributeProps {
  group: GeneralFeatureFormInput;
  index: number;
}

export const CollapseProductAttribute: React.FC<CollapseProductAttributeProps> = ({
  group,
  index,
}) => {
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

const GeneralFeatureAttribute: FC<GeneralFeatureAttributeProps> = ({ activeKey }) => {
  const { feature_attribute_groups, general_attribute_groups } = useAppSelector(
    (state) => state.product.details,
  );

  return (
    <div className={styles.attributes}>
      <div className={styles.generalFeature}>
        {activeKey === 'general'
          ? general_attribute_groups.map((group, index) => {
              return <CollapseProductAttribute group={group} key={index} index={index} />;
            })
          : feature_attribute_groups.map((group, index) => {
              return <CollapseProductAttribute group={group} key={index} index={index} />;
            })}
      </div>
    </div>
  );
};

export default GeneralFeatureAttribute;
