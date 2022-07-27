import { useAppSelector } from '@/reducers';
import { FC } from 'react';
import CustomCollapse from '../Collapse';
// import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';
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
      {activeKey === 'general'
        ? general_attribute_groups.map((group) => {
            return (
              <div className={styles.group}>
                <CustomCollapse header={group.name}>ddd</CustomCollapse>
              </div>
            );
          })
        : feature_attribute_groups.map((group) => {
            return (
              <div className={styles.group}>
                <CustomCollapse header={group.name}>feature</CustomCollapse>
              </div>
            );
          })}
    </div>
  );
};

export default GeneralFeatureAttribute;
