import { useAppSelector } from '@/reducers';
import styles from './GeneralFeatureAttribute.less';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import {
  AttributeCollapse,
  AttributeOption,
  ConversionText,
  GeneralText,
  ProductAttributeLine,
} from './AttributeComponent';
import { useCheckPermission } from '@/helper/hook';
import CustomCollapse from '@/components/Collapse';
import { GeneralFeatureHeader } from './GeneralFeature';
import { BodyText } from '@/components/Typography';

export const SpecificationAttribute = () => {
  const specification_attribute_groups = useAppSelector(
    (state) => state.product.details.specification_attribute_groups,
  );
  const isTiscAdmin = useCheckPermission('TISC Admin');

  return (
    <div className={styles.attributes}>
      <div className={styles.specification}>
        {specification_attribute_groups.map((group, index) => {
          if (isTiscAdmin) {
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
          }

          return (
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
          );
        })}
      </div>
    </div>
  );
};
