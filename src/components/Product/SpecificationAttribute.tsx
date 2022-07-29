import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import { useAppSelector } from '@/reducers';
import { upperCase } from 'lodash';
import { useState } from 'react';
import CustomCollapse from '../Collapse';
import Popover from '../Modal/Popover';
import { BodyText } from '../Typography';
import { GeneralFeatureHeader } from './components/GeneralFeature';
import styles from './styles/attributes.less';

const SpecificationAttribute = () => {
  const specification_attribute_groups = useAppSelector(
    (state) => state.product.details.specification_attribute_groups,
  );

  const [visible, setVisible] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>('');

  const handleShowPopUp = (title: string) => {
    /// get group name to show inside popup
    setGroupName(title);
    /// show popup
    setVisible(true);
  };

  console.log(specification_attribute_groups);

  // const renderCheckBoxLabel = (item: any) => {
  //   const { basis } = item;
  //   ///
  //   let description = '';
  //   /// must found basis
  //   if (basis && basis.id) {
  //     description = basis.name;
  //     if (!description) {
  //       /// only conversion don't have name
  //       description = `${basis.name_1} - ${basis.name_2}`;
  //     }
  //     if (basis && basis.type !== 'Conversions' && basis.type !== 'Text') {
  //       /// count subs
  //       description += ` (${basis.subs?.length ?? 0})`;
  //     }
  //   }

  //   return (
  //     <div className={styles.attributeItemCheckBox}>
  //       <BodyText level={3} customClass="attribute-name">
  //         {item.name}
  //       </BodyText>
  //       <BodyText level={5} fontFamily="Roboto" customClass="attribute-description">
  //         {description}
  //       </BodyText>
  //     </div>
  //   );
  // };

  return (
    <div className={styles.attributes}>
      <div className={styles.specification}>
        {specification_attribute_groups.map((group, index) => {
          return (
            <CustomCollapse
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
                    <div className={styles.content} onClick={() => handleShowPopUp(group.name)}>
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
        {visible && (
          <Popover
            title={upperCase(groupName)}
            visible={visible}
            setVisible={setVisible}
            // dropdownRadioList={specification_attribute_groups.map((group) => {
            //   group.attributes.map((attribute) => {
            //     attribute.basis_options.map((basis) => {
            //       return {
            //         name: basis.name,
            //         options: basis.,
            //       };
            //     });
            //   });
            // })}
            dropDownRadioTitle={(data) => data.name}
          />
        )}
      </div>
    </div>
  );
};

export default SpecificationAttribute;
