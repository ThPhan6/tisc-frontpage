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
  index: number;
}

const RenderHeader: FC<FaqItemProps> = (props) => {
  const { value, activeKey, handleActiveCollapse, index } = props;
  return (
    <div className={styles.panel_header}>
      <div
        className={styles.panel_header__field}
        onClick={() => handleActiveCollapse(value.document ? index : -1)}
      >
        <div className={styles.titleIcon}>
          {value?.icon && <img src={showImageUrl(value.icon)} className={styles.icon} />}
          <div>
            <BodyText
              level={4}
              fontFamily="Roboto"
              customClass={
                String(index) !== activeKey ? styles.font_weight_300 : styles.font_weight_500
              }
            >
              {value.title}
            </BodyText>
          </div>
        </div>
        <div className={styles.addIcon}>
          {value.document ? String(index) !== activeKey ? <PlusIcon /> : <ExtendIcon /> : ''}
        </div>
      </div>
    </div>
  );
};

export const FaqComponent: FC<FaqItemProps> = ({
  index,
  value,
  activeKey,
  handleActiveCollapse,
}) => {
  const [activeKeyItem, setActiveKeyItem] = useState<string>('');

  const handleActiveCollapseItem = (indexItem: number) => {
    setActiveKeyItem(activeKeyItem === String(indexItem) ? '' : String(indexItem));
  };

  return (
    <div className={styles.listItem}>
      <Collapse ghost activeKey={activeKey}>
        <Collapse.Panel
          header={
            <RenderHeader
              index={index}
              value={value}
              activeKey={activeKey}
              handleActiveCollapse={handleActiveCollapse}
            />
          }
          key={index}
          showArrow={false}
          className={value.id !== activeKey ? styles['bottomMedium'] : styles['bottomBlack']}
        >
          <div className={styles.text}>
            <BodyText level={5} fontFamily="Roboto">
              {value.document}
            </BodyText>
          </div>
          <div className={styles.qa}>
            {value.question_and_answer?.map((item, idx) => {
              return (
                item.question &&
                item.answer && (
                  <div key={idx}>
                    <QnAItem
                      index={idx}
                      item={item}
                      activeKey={activeKeyItem}
                      handleActiveCollapse={handleActiveCollapseItem}
                    />
                  </div>
                )
              );
            })}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
