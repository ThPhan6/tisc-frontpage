import { BodyText } from '@/components/Typography';
import { Collapse } from 'antd';
import { isEmpty } from 'lodash';
import { FC, useState } from 'react';
import styles from '../index.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon-20px.svg';
import { ReactComponent as ExtendIcon } from '@/assets/icons/action-extend.svg';
import { ItemQAProp } from '../types';

export const ItemQA: FC<ItemQAProp> = ({ value }) => {
  const [activeItemKey, setActiveItemKey] = useState<string[]>([]);
  const handleOnClickItemPlusIcon = () => {
    setActiveItemKey(['1']);
  };

  const handleOnClickItemPlusIconNext = () => {
    setActiveItemKey([]);
  };
  const renderQuestion = (item: string) => {
    return (
      <div
        onClick={() => {
          setActiveItemKey(isEmpty(activeItemKey) ? ['1'] : []);
        }}
        className={styles.itemQuestion}
      >
        <BodyText
          level={4}
          customClass={isEmpty(activeItemKey) ? styles.font_weight_300 : styles.font_weight_600}
        >
          {item}
        </BodyText>
        {isEmpty(activeItemKey) ? (
          <PlusIcon className={styles.addIcon} onClick={handleOnClickItemPlusIcon} />
        ) : (
          <ExtendIcon className={styles.addIcon} onClick={handleOnClickItemPlusIconNext} />
        )}
      </div>
    );
  };
  return (
    <div>
      <Collapse ghost activeKey={activeItemKey}>
        <Collapse.Panel key={'1'} showArrow={false} header={renderQuestion(value.question)}>
          <div style={{ padding: '0 32px 8px 16px' }}>
            <BodyText level={5}>{value.answer}</BodyText>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
