import { useAppSelector } from '@/reducers';
import CustomCollapse from '../Collapse';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import { BodyText } from '../Typography';
import styles from './styles/attributes.less';
import Popover from '../Modal/Popover';
import { useState } from 'react';

const SpecificationAttribute = ({}) => {
  const { specification_attribute_groups } = useAppSelector((state) => state.product.details);
  const [visible, setVisible] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>('');

  console.log('feature_attribute_groups', specification_attribute_groups);

  const handleShowPopUp = (title: string) => {
    /// get group name to show inside popup
    setGroupName(title);
    /// show popup
    setVisible(true);
  };

  return (
    <div className={styles.attributes}>
      <div className={styles.specification}>
        {specification_attribute_groups.map((group) => {
          return (
            <CustomCollapse
              className={styles.vendorSection}
              customHeaderClass={styles.vendorCustomPanelBox}
              header={
                <div className={styles.brandProfileHeader}>
                  <span className={styles.name}>{group.name}</span>
                </div>
              }
            >
              {group.attributes.map((attribute) => {
                return (
                  <div className={styles.attribute}>
                    <BodyText level={4} customClass={styles.content_type}>
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
