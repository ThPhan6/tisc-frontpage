import { useAppSelector } from '@/reducers';
import styles from './GeneralFeatureAttribute.less';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import CustomCollapse from '@/components/Collapse';
import { GeneralFeatureHeader } from './GeneralFeature';
import { BodyText } from '@/components/Typography';

export const SpecificationAttribute = () => {
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
