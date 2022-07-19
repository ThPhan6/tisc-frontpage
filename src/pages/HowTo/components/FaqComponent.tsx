import { BodyText } from '@/components/Typography';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon-20px.svg';
import { ReactComponent as ExtendIcon } from '@/assets/icons/action-extend.svg';
import styles from '../index.less';
import { FC, useState } from 'react';
import { Collapse } from 'antd';
import { QnAItem } from './QnAItem';
import { FaqItem, CollapsingProps } from '../types';
import { showImageUrl } from '@/helper/utils';

export interface FaqItemProps extends CollapsingProps {
  value: FaqItem;
}

const RenderHeader: FC<FaqItemProps> = (props) => {
  const { value, activeKey, handleActiveCollapse } = props;

  return (
    <div className={styles.panel_header}>
      <div className={styles.panel_header__field} onClick={() => handleActiveCollapse(value.id)}>
        <div className={styles.titleIcon}>
          {/* {value?.icon && <span className={styles.icon}>{value.icon}</span>} */}
          {value?.icon && <img src={showImageUrl(value.icon)} className={styles.icon} />}
          <div>
            <BodyText
              level={4}
              fontFamily="Roboto"
              customClass={value.id !== activeKey ? styles.font_weight_300 : styles.font_weight_500}
            >
              {value.title}
            </BodyText>
          </div>
        </div>
        <div className={styles.addIcon}>
          {value.id !== activeKey ? <PlusIcon /> : <ExtendIcon />}
        </div>
      </div>
    </div>
  );
};

export const FaqComponent: FC<FaqItemProps> = ({ value, activeKey, handleActiveCollapse }) => {
  const [activeKeyItem, setActiveKeyItem] = useState<string>('');

  const handleActiveCollapseItem = (id: string) => () => {
    setActiveKeyItem(activeKeyItem === id ? '' : id);
  };

  return (
    <div className={styles.listItem}>
      <Collapse ghost activeKey={activeKey}>
        <Collapse.Panel
          header={
            <RenderHeader
              value={value}
              activeKey={activeKey}
              handleActiveCollapse={handleActiveCollapse}
            />
          }
          key={value.id}
          showArrow={false}
          className={value.id !== activeKey ? styles['bottomMedium'] : styles['bottomBlack']}
        >
          <div className={styles.text}>
            <BodyText level={5} fontFamily="Roboto">
              {value.document}
            </BodyText>
          </div>
          <div className={styles.qa}>
            {value.question_and_answer?.map((item, index) => (
              <div key={index}>
                <QnAItem
                  item={item}
                  activeKey={activeKeyItem}
                  handleActiveCollapse={handleActiveCollapseItem(String(index))}
                />
              </div>
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
