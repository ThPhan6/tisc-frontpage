import { FC } from 'react';

import { Collapse } from 'antd';

import { CollapsingProps, QnA, QuestionProps } from '../../types';

import { BodyText } from '@/components/Typography';

import { renderIcon } from './FaqComponent';
import styles from './index.less';

const RenderQuestion: FC<QuestionProps> = (props) => {
  const { index, question, activeKey, handleActiveCollapse } = props;
  return (
    <div
      onClick={() => handleActiveCollapse(question ? index : -1)}
      className={styles.itemQuestion}>
      <BodyText
        level={3}
        customClass={String(index) !== activeKey ? styles.font_weight_300 : styles.font_weight_600}>
        {question}
      </BodyText>
      <div className={styles.addIcon}>{question ? renderIcon(index, activeKey) : ''}</div>
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
          }>
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
