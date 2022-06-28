import { BodyText } from '@/components/Typography';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon-20px.svg';
import { ReactComponent as ExtendIcon } from '@/assets/icons/action-extend.svg';
import styles from '../index.less';
import { ItemHowToProp } from '../types';
import { FC, useState } from 'react';
import { Collapse } from 'antd';
import { isEmpty } from 'lodash';
import { ItemQA } from './ItemQA';

export const ItemHowTo: FC<ItemHowToProp> = ({ value }) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);
  //   const [activeItemKey, setActiveItemKey] = useState<string[]>([]);

  const handleOnClickPlusIcon = () => {
    setActiveKey(['1']);
  };

  const handleOnClickPlusIconNext = () => {
    setActiveKey([]);
  };

  //   const handleOnClickItemPlusIcon = () => {
  //     setActiveItemKey(['1']);
  //   };

  //   const handleOnClickItemPlusIconNext = () => {
  //     setActiveItemKey([]);
  //   };

  const renderHeader = () => {
    return (
      <div className={styles.panel_header}>
        <div className={styles.panel_header__field}>
          <div
            className={styles.titleIcon}
            onClick={() => {
              setActiveKey(isEmpty(activeKey) ? ['1'] : []);
            }}
          >
            {value.icon && <span className={styles.icon}>{value.icon}</span>}
            <div>
              <BodyText
                level={4}
                fontFamily="Roboto"
                customClass={isEmpty(activeKey) ? styles.font_weight_300 : styles.font_weight_500}
              >
                {value.title}
              </BodyText>
            </div>
          </div>
          {isEmpty(activeKey) ? (
            <PlusIcon className={styles.addIcon} onClick={handleOnClickPlusIcon} />
          ) : (
            <ExtendIcon className={styles.addIcon} onClick={handleOnClickPlusIconNext} />
          )}
        </div>
      </div>
    );
  };
  //   const renderQuestion = (item: string) => {
  //     return (
  //       <div
  //         onClick={() => {
  //           setActiveItemKey(isEmpty(activeItemKey) ? ['1'] : []);
  //         }}
  //         className={styles.itemQuestion}
  //       >
  //         <BodyText
  //           level={4}
  //           customClass={isEmpty(activeItemKey) ? styles.font_weight_300 : styles.font_weight_600}
  //         >
  //           {item}
  //         </BodyText>
  //         {isEmpty(activeItemKey) ? (
  //           <PlusIcon className={styles.addIcon} onClick={handleOnClickItemPlusIcon} />
  //         ) : (
  //           <ExtendIcon className={styles.addIcon} onClick={handleOnClickItemPlusIconNext} />
  //         )}
  //       </div>
  //     );
  //   };

  return (
    <div>
      <Collapse ghost activeKey={activeKey} accordion>
        <Collapse.Panel
          header={renderHeader()}
          key={'1'}
          showArrow={false}
          className={isEmpty(activeKey) ? styles['bottomMedium'] : styles['bottomBlack']}
        >
          <div className={styles.text}>
            <BodyText level={5} fontFamily="Roboto">
              {value.document}
            </BodyText>
          </div>
          <div className={styles.qa}>
            {value.question_and_answer?.map((item, index) => (
              <div key={index}>
                <ItemQA value={item} />
                {/* <Collapse ghost activeKey={activeItemKey}>
                  <Collapse.Panel
                    key={'1'}
                    showArrow={false}
                    header={renderQuestion(item.question)}
                  >
                    <div style={{ padding: '0 32px 8px 16px' }}>
                      <BodyText level={5}>{item.answer}</BodyText>
                    </div>
                  </Collapse.Panel>
                </Collapse> */}
              </div>
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
