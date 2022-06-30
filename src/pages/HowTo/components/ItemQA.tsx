import { BodyText } from '@/components/Typography';
import { Collapse } from 'antd';
import { FC } from 'react';
import styles from '../index.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon-20px.svg';
import { ReactComponent as ExtendIcon } from '@/assets/icons/action-extend.svg';
import { ItemQAProp, QuestionProp } from '../types';

const RenderQuestion: FC<QuestionProp> = (props) => {
  const { id, question, activeKey, handleActiveCollapse } = props;

  return (
    <div onClick={() => handleActiveCollapse(id)} className={styles.itemQuestion}>
      <BodyText
        level={4}
        customClass={id !== activeKey ? styles.font_weight_300 : styles.font_weight_600}
      >
        {question}
      </BodyText>
      <div className={styles.addIcon}>{id !== activeKey ? <PlusIcon /> : <ExtendIcon />}</div>
    </div>
  );
};

export const ItemQA: FC<ItemQAProp> = ({ item, activeKey, handleActiveCollapse }) => {
  return (
    <div>
      <Collapse ghost activeKey={activeKey}>
        <Collapse.Panel
          key={item.id}
          showArrow={false}
          header={
            <RenderQuestion
              id={item.id}
              question={item.question}
              activeKey={activeKey}
              handleActiveCollapse={handleActiveCollapse}
            />
          }
        >
          <div className={styles.textAnswer}>
            <BodyText level={5}>{item.answer}</BodyText>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
