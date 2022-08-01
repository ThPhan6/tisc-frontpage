import { useAppSelector } from '@/reducers';
import { FC } from 'react';
import CustomCollapse from '../Collapse';
import { GeneralFeatureContent, GeneralFeatureHeader } from './components/GeneralFeature';
import styles from './styles/attributes.less';

interface GeneralFeatureAttributeProps {
  activeKey: 'general' | 'feature';
}

const GeneralFeatureAttribute: FC<GeneralFeatureAttributeProps> = ({ activeKey }) => {
  const { feature_attribute_groups, general_attribute_groups } = useAppSelector(
    (state) => state.product.details,
  );

  return (
    <div className={styles.attributes}>
      <div className={styles.generalFeature}>
        {activeKey === 'general'
          ? general_attribute_groups.map((group, index) => {
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
            })
          : feature_attribute_groups.map((group, index) => {
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
      </div>
    </div>
  );
};

export default GeneralFeatureAttribute;
