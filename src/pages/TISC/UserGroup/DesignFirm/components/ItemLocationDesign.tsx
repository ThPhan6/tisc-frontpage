import { BodyText } from '@/components/Typography';
import { CollapsingProps } from '@/pages/HowTo/types';
import { Collapse } from 'antd';
import { FC } from 'react';
import styles from '../styles/LocationDesign.less';
import { ReactComponent as DownIcon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as UpIcon } from '@/assets/icons/action-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';

interface ItemLocationProps extends CollapsingProps {
  index: number;
  value: {
    business_name: string;
    info: {
      location: string;
      address: string;
      phone: string;
      gmail: string;
    };
  };
}
const RenderItemQuestion: FC<ItemLocationProps> = ({
  index,
  value,
  activeKey,
  handleActiveCollapse,
}) => {
  return (
    <div onClick={() => handleActiveCollapse(value ? index : -1)} className={styles.itemLocation}>
      <BodyText
        level={5}
        fontFamily="Roboto"
        customClass={String(index) !== activeKey ? styles.font_weight_300 : styles.font_weight_500}
      >
        {value.business_name}
      </BodyText>
      <div className={styles.addIcon}>
        {String(index) !== activeKey ? <DownIcon /> : <UpIcon />}
      </div>
    </div>
  );
};
const ItemLocationDesign: FC<ItemLocationProps> = ({
  index,
  activeKey,
  value,
  handleActiveCollapse,
}) => {
  return (
    <div className={styles.itemLocationCollapse}>
      <Collapse ghost activeKey={activeKey}>
        <Collapse.Panel
          key={index}
          showArrow={false}
          header={
            <RenderItemQuestion
              index={index}
              value={value}
              activeKey={activeKey}
              handleActiveCollapse={handleActiveCollapse}
            />
          }
        >
          <div className={styles.formLocation}>
            <InputGroup
              label="Location Function"
              hasHeight
              fontLevel={3}
              className={styles.label}
              value={value.info.location}
            />
            <InputGroup
              label="Address"
              hasHeight
              fontLevel={3}
              className={styles.label}
              value={value.info.address}
            />
            <InputGroup
              label="General Phone"
              hasHeight
              fontLevel={3}
              className={styles.label}
              value={value.info.phone}
            />
            <InputGroup
              label="General Email"
              hasHeight
              fontLevel={3}
              className={styles.label}
              value={value.info.gmail}
            />
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default ItemLocationDesign;
