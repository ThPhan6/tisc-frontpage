import { FC, useState } from 'react';

import { Collapse } from 'antd';

import { ReactComponent as ExtendIcon } from '@/assets/icons/action-extend.svg';
import { ReactComponent as PlusIcon } from '@/assets/icons/action-plus-icon.svg';

import { showImageUrl } from '@/helper/utils';

import { CollapsingProps, Faq } from '../../types';

import { BodyText } from '@/components/Typography';

import { QnAItem } from './QnAItem';
import styles from './index.less';

export interface FaqItemProps extends CollapsingProps {
  value: Faq;
  index: number;
  customClass?: string;
}

export const renderExtendIcon = (index: number, activeKey?: string) =>
  String(index) !== activeKey ? <PlusIcon /> : <ExtendIcon />;

const RenderHeader: FC<FaqItemProps> = (props) => {
  const { value, activeKey, handleActiveCollapse, index, customClass } = props;
  return (
    <div className={styles.panel_header}>
      <div
        className={`${styles.panel_header__field} ${customClass}`}
        onClick={() => handleActiveCollapse(value.document ? index : -1)}>
        <div className={styles.titleIcon}>
          {value?.icon && <img src={showImageUrl(value.icon)} className={styles.icon} />}
          <div>
            <BodyText
              level={4}
              fontFamily="Roboto"
              customClass={
                String(index) !== activeKey ? styles.font_weight_300 : styles.font_weight_500
              }>
              {value.title}
            </BodyText>
          </div>
        </div>
        <div className={styles.addIcon}>
          {value.document ? (
            renderExtendIcon(index, activeKey)
          ) : (
            <PlusIcon className={styles.disablePlusIcon} />
          )}
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
  customClass,
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
              customClass={customClass}
            />
          }
          key={index}
          showArrow={false}
          className={value.id !== activeKey ? styles['bottomMedium'] : styles['bottomBlack']}>
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
