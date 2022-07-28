import { useAppSelector } from '@/reducers';
import CustomCollapse from '../Collapse';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import { BodyText } from '../Typography';
import styles from './styles/attributes.less';
import Popover from '../Modal/Popover';
import { useState } from 'react';
import { GeneralFeatureHeader } from './components/GeneralFeature';

const SpecificationAttribute = () => {
  const { specification_attribute_groups } = useAppSelector((state) => state.product.details);
  const [visible, setVisible] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>('');

  const handleShowPopUp = (title: string) => {
    /// get group name to show inside popup
    setGroupName(title);
    /// show popup
    setVisible(true);
  };

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
      </div>

      {/* popup */}
      {visible && <Popover title={groupName} visible={visible} setVisible={setVisible}></Popover>}
    </div>
  );
};

export default SpecificationAttribute;
