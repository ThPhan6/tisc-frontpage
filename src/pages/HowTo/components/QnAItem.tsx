import { ReactComponent as ExtendIcon } from '@/assets/icons/action-extend.svg';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon-20px.svg';
import { BodyText } from '@/components/Typography';
import { Collapse } from 'antd';
import { FC } from 'react';
import styles from '../index.less';
import { CollapsingProps, QnA, QuestionProps } from '../types';

const RenderQuestion: FC<QuestionProps> = (props) => {
  const { index, question, activeKey, handleActiveCollapse } = props;
  return (
    <div onClick={() => handleActiveCollapse(index)} className={styles.itemQuestion}>
      <BodyText
        level={4}
        customClass={String(index) !== activeKey ? styles.font_weight_300 : styles.font_weight_600}
      >
        {question}
      </BodyText>
      <div className={styles.addIcon}>
        {String(index) !== activeKey ? <PlusIcon /> : <ExtendIcon />}
      </div>
    </div>
  );
};

export interface QnAItemProps extends CollapsingProps {
  index: number;
  item: QnA;
}

export const QnAItem: FC<QnAItemProps> = ({ index, item, activeKey, handleActiveCollapse }) => {
  return (
    <div>
      <Collapse ghost activeKey={activeKey}>
        <Collapse.Panel
          key={index}
          showArrow={false}
          header={
            <RenderQuestion
              index={index}
              question={item.question}
              activeKey={activeKey}
              handleActiveCollapse={handleActiveCollapse}
            />
          }
        >
          <div className={styles.textAnswer}>
            <BodyText level={5} fontFamily="Roboto">
              {item.answer}
            </BodyText>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
