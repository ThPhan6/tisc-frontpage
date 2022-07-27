import { useAppSelector } from '@/reducers';
import { FC } from 'react';
import CustomCollapse from '../Collapse';
import { BodyText } from '../Typography';
import styles from './styles/attributes.less';

interface GeneralFeatureAttributeProps {
  activeKey: 'general' | 'feature';
}

const GeneralFeatureAttribute: FC<GeneralFeatureAttributeProps> = ({ activeKey }) => {
  const { feature_attribute_groups, general_attribute_groups } = useAppSelector(
    (state) => state.product.details,
  );

  // console.log('feature_attribute_groups', feature_attribute_groups);
  console.log('activekey', activeKey);

  return (
    <div className={styles.attributes}>
      <div className={styles.generalFeature}>
        {activeKey === 'general'
          ? general_attribute_groups.map((group) => {
              return (
                <div className={styles.group}>
                  <CustomCollapse header={group.name}>
                    {group.attributes.map((attribute) => (
                      <div className={styles.content}>
                        <BodyText level={4} customClass={styles.content_text}>
                          {attribute.text}
                        </BodyText>
                        <BodyText level={6} customClass={styles.content_type} fontFamily="Roboto">
                          {attribute.type}
                        </BodyText>
                      </div>
                    ))}
                  </CustomCollapse>
                </div>
              );
            })
          : feature_attribute_groups.map((group) => {
              return (
                <div className={styles.group}>
                  <CustomCollapse header={group.name}>
                    {group.attributes.map((attribute) => (
                      <div className={styles.content}>
                        <BodyText level={4} customClass={styles.content_text}>
                          {attribute.text}
                        </BodyText>
                        <BodyText level={6} customClass={styles.content_type} fontFamily="Roboto">
                          {attribute.type}
                        </BodyText>
                      </div>
                    ))}
                  </CustomCollapse>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default GeneralFeatureAttribute;
