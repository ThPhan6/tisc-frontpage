import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import { useAppSelector } from '@/reducers';
import CustomCollapse from '../Collapse';
import { BodyText } from '../Typography';
import { GeneralFeatureHeader } from './components/GeneralFeature';
import styles from './styles/attributes.less';

const SpecificationAttribute = () => {
  const specification_attribute_groups = useAppSelector(
    (state) => state.product.details.specification_attribute_groups,
  );

  return (
    <div className={styles.attributes}>
      <div className={styles.specification}>
        {specification_attribute_groups.map((group, index) => {
          return (
            <CustomCollapse
              showActiveBoxShadow
              key={`${group.name}_${index}`}
              className={styles.vendorSection}
              customHeaderClass={styles.vendorCustomPanelBox}
              header={<GeneralFeatureHeader name={group.name} />}
            >
              {group.attributes.map((attribute) => {
                return (
                  <div className={styles.attribute} key={attribute.id}>
                    <BodyText level={4} customClass={styles.content_text}>
                      {attribute.text}
                    </BodyText>
                    <div
                      className={styles.content} /* onClick={() => handleShowPopUp(group.name)} */
                    >
                      <BodyText level={6} fontFamily="Roboto" customClass={styles.content_select}>
                        select
                      </BodyText>
                      <ActionRightIcon className={styles.singlerRighIcon} />
                    </div>
                  </div>
                );
              })}
            </CustomCollapse>
          );
        })}

        {/* popup */}
      </div>
    </div>
  );
};

export default SpecificationAttribute;
